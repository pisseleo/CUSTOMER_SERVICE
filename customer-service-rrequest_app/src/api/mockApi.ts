
import type { CreateServiceRequest, ListServiceRequestsParams, ServiceRequest, ServiceRequestPage, UpdateRequestStatus } from '../types';
import { ApiError } from './errors';



const STORAGE_KEY = 'csr_mock_requests_v1';
const LATENCY_MS = 350;

const CATEGORIES = ['Billing', 'Technical', 'Account', 'Shipping', 'General'];
const NAMES = ['Amara Diallo', 'Liang Wei', 'Sofia Almeida', 'Noah Fischer', 'Priya Nair', 'Tomás Silva', 'Yuki Tanaka'];

function seed(): ServiceRequest[] {
  const now = Date.now();
  const items: ServiceRequest[] = [];
  const statuses: ServiceRequest['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  // Priorities levels asigned in each request, cycling through the list to ensure a mix of priorities in the seeded data.
  const priorities: ServiceRequest['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  
  // Message types for the seeded requests. Each title is unique and represents a common customer service issue.
  const titles = [
    'Unable to reset account password',
    'Invoice shows incorrect tax amount',
    'Package marked delivered but not received',
    'App crashes when uploading a photo',
    'Request to update billing address',
    'Duplicate charge on last statement',
    'Cannot access shared workspace',
    'Export to CSV produces empty file',
    'Two-factor codes not arriving',
    'Refund not processed after 10 days',
    'Login page stuck on loading spinner',
    'Need clarification on plan pricing',
    'Attachment upload fails above 5MB',
    'Notification emails going to spam',
    'Account merge request',
    'Broken link in onboarding email',
    'Dashboard chart shows stale data',
    'Request to close inactive account',
  ];

  for (let i = 0; i < titles.length; i++) {
    const createdAt = new Date(now - (i + 1) * 1000 * 60 * 60 * (6 + i));
    items.push({
      id: `REQ-${String(1000 + i)}`,
      title: titles[i],
      description:
        'Customer reported this issue through the support portal. Additional context and reproduction steps were collected during intake and are available in the linked conversation history.',
      category: CATEGORIES[i % CATEGORIES.length],
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      requesterName: NAMES[i % NAMES.length],
      requesterEmail: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}@example.com`,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      version: 1,
    });
  }
  return items;
}

function load(): ServiceRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as ServiceRequest[];
  } catch {
    const initial = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function save(items: ServiceRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export async function mockListRequests(params: ListServiceRequestsParams): Promise<ServiceRequestPage<ServiceRequest>> {
  let items = load();

  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter((r) => r.title.toLowerCase().includes(q) || r.requesterName.toLowerCase().includes(q));
  }
  if (params.status) items = items.filter((r) => r.status === params.status);
  if (params.priority) items = items.filter((r) => r.priority === params.priority);

  items = [...items].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return params?.sortDir === 'asc' ? diff : -diff;
  });

  const pageSize = params.pageSize ?? 10;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = params.page ?? 1;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return delay({ items: pageItems, page, pageSize, totalItems, totalPages, total: totalItems });
}

export async function mockGetRequest(id: string): Promise<ServiceRequest> {
  const item = load().find((r) => r.id === id);
  if (!item) throw new ApiError('The requested resource could not be found.', 'not_found', 404);
  return delay(item);
}

export async function mockCreateRequest(input: CreateServiceRequest): Promise<ServiceRequest> {
  const items = load();
  const now = new Date().toISOString();
  const created: ServiceRequest = {
    id: `REQ-${1000 + items.length + Math.floor(Math.random() * 900)}`,
    ...input,
    status: 'OPEN',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  save([created, ...items]);
  return delay(created);
}

export async function mockUpdateStatus(id: string, input: UpdateRequestStatus): Promise<ServiceRequest> {
  const items = load();
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) throw new ApiError('The requested resource could not be found.', 'not_found', 404);

  const current = items[idx];
  if (current.version !== input.version) {
    throw new ApiError('This request was modified elsewhere. Reload and try again.', 'conflict', 409);
  }

  const updated: ServiceRequest = {
    ...current,
    status: input.status,
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
  };
  items[idx] = updated;
  save(items);
  return delay(updated);
}
