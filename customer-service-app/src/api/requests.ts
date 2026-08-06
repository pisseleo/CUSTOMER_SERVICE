import { apiRequest } from './client';
import { mockCreateRequest, mockGetRequest, mockListRequests, mockUpdateStatus } from './mockApi';
import type {
  CreateServiceRequestInput,
  PagedResult,
  RequestListParams,
  ServiceRequest,
  UpdateStatusInput,
} from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';



export function listRequests(params: RequestListParams, signal?: AbortSignal): Promise<PagedResult<ServiceRequest>> {
  if (USE_MOCK) return mockListRequests(params);
  return apiRequest<PagedResult<ServiceRequest>>('/requests', {
    method: 'GET',
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      status: params.status,
      priority: params.priority,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
    signal,
  });
}

export function getRequest(id: string, signal?: AbortSignal): Promise<ServiceRequest> {
  if (USE_MOCK) return mockGetRequest(id);
  return apiRequest<ServiceRequest>(`/requests/${encodeURIComponent(id)}`, { method: 'GET', signal });
}

export function createRequest(input: CreateServiceRequestInput): Promise<ServiceRequest> {
  if (USE_MOCK) return mockCreateRequest(input);
  return apiRequest<ServiceRequest>('/requests', { method: 'POST', body: input });
}

export function updateRequestStatus(id: string, input: UpdateStatusInput): Promise<ServiceRequest> {
  if (USE_MOCK) return mockUpdateStatus(id, input);
  return apiRequest<ServiceRequest>(`/requests/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: input,
  });
}
