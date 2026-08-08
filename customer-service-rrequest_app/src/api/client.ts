import { ApiError } from './errors';
import { mockCreateRequest, mockGetRequest, mockListRequests, mockUpdateStatus } from './mockApi';
import type {
  CreateServiceRequest,
  ListServiceRequestsParams,
  RequestPriority,
  RequestStatus,
  UpdateRequestStatus,
} from '../types';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

function buildMockListParams(query?: Record<string, string | number | undefined>): ListServiceRequestsParams {
  return {
    search: typeof query?.search === 'string' ? query.search : undefined,
    status: typeof query?.status === 'string' ? (query.status as RequestStatus) : undefined,
    priority: typeof query?.priority === 'string' ? (query.priority as RequestPriority) : undefined,
    sortBy: 'createdAt',
    sortDir: query?.sortDir === 'asc' ? 'asc' : 'desc',
    page: typeof query?.page === 'number' ? query.page : query?.page ? Number(query.page) : undefined,
    pageSize: typeof query?.pageSize === 'number' ? query.pageSize : query?.pageSize ? Number(query.pageSize) : undefined,
  };
}

/**
 * Supplies the current OIDC access token for outgoing requests. Wired up
 * once, near the app root, from the react-oidc-context user object so that
 * the plain API layer doesn't need to depend on React or the auth library.
 */
let getAccessToken: () => string | undefined = () => undefined;

export function registerAccessTokenProvider(provider: () => string | undefined): void {
  getAccessToken = provider;
}

/**
 * Called whenever the API responds 401, so the app can force a fresh sign-in
 * instead of leaving the user stuck on a broken screen.
 */
let onUnauthorized: () => void = () => undefined;

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return `${base}/${cleanPath}${queryString ? `?${queryString}` : ''}`;
}

function isMockableRequest(path: string, method: string): boolean {
  if (!USE_MOCK) return false;

  const cleanPath = path.replace(/^\//, '');
  if (cleanPath === 'requests' && (method === 'GET' || method === 'POST')) return true;
  if (/^requests\/[^/]+$/.test(cleanPath) && method === 'GET') return true;
  if (/^requests\/[^/]+\/status$/.test(cleanPath) && method === 'PATCH') return true;

  return false;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    if (isMockableRequest(path, method)) {
      return handleMockRequest<T>(path, method, body, query);
    }
    throw ApiError.network();
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  const jsonResponse = contentType.includes('application/json');
  const payload = jsonResponse ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    if (isMockableRequest(path, method)) {
      return handleMockRequest<T>(path, method, body, query);
    }
    const error = ApiError.fromStatus(response.status, payload);
    if (error.kind === 'auth' && response.status === 401) onUnauthorized();
    throw error;
  }

  if (payload === undefined && isMockableRequest(path, method)) {
    return handleMockRequest<T>(path, method, body, query);
  }

  return payload as T;
}

function handleMockRequest<T>(path: string, method: string, body: unknown, query?: Record<string, string | number | undefined>): T {
  const cleanPath = path.replace(/^\//, '');

  if (method === 'GET' && cleanPath === 'requests') {
    return mockListRequests(buildMockListParams(query)) as unknown as T;
  }

  if (method === 'GET' && /^requests\/.+/.test(cleanPath)) {
    const id = cleanPath.split('/')[1];
    return mockGetRequest(id) as unknown as T;
  }

  if (method === 'POST' && cleanPath === 'requests') {
    return mockCreateRequest(body as CreateServiceRequest) as unknown as T;
  }

  if (method === 'PATCH' && /^requests\/.+\/status$/.test(cleanPath)) {
    const [, id] = cleanPath.split('/');
    return mockUpdateStatus(id, body as UpdateRequestStatus) as unknown as T;
  }

  throw ApiError.network();
}
