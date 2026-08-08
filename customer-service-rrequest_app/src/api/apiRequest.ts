import type {
  CreateServiceRequest,
  ListServiceRequestsParams,
  ProblemDetails,
  ServiceRequest,
  ServiceRequestPage,
  UpdateRequestStatus,
} from '../types'
import { apiRequest } from './client'

export class ApiError extends Error {
  status: number
  problemDetails?: ProblemDetails

  constructor(message: string, status = 500, problemDetails?: ProblemDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problemDetails = problemDetails
  }
}

function buildApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500)
  }

  return new ApiError('An unexpected error', 500)
}

async function request<T>(config: {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  url: string
  data?: unknown
  params?: Record<string, string | number | undefined>
  signal?: AbortSignal
}): Promise<T> {
  try {
    return await apiRequest<T>(config.url, {
      method: config.method?.toUpperCase() as 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
      body: config.data,
      query: config.params,
      signal: config.signal,
    })
  } catch (error) {
    throw buildApiError(error)
  }
}

//get list of service requests
export async function listServiceRequests(params?: ListServiceRequestsParams, signal?: AbortSignal): Promise<ServiceRequestPage<ServiceRequest>> {
  return apiRequest<ServiceRequestPage<ServiceRequest>>('/requests', {
    method: 'GET',
    query: {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      status: params?.status,
      priority: params?.priority,
      sortBy: params?.sortBy,
      sortDir: params?.sortDir,
    },
    signal,
  });
}

export async function createServiceRequest(payload: CreateServiceRequest): Promise<ServiceRequest> {
  return request<ServiceRequest>({
    method: 'POST',
    url: '/requests',
    data: payload,
  })
}

export async function getServiceRequest(requestId: string, signal?: AbortSignal): Promise<ServiceRequest> {
  return request<ServiceRequest>({
    method: 'GET',
    url: `/requests/${encodeURIComponent(requestId)}`,
    signal,
  })
}

export async function updateServiceRequestStatus(
  requestId: string,
  payload: UpdateRequestStatus,
): Promise<ServiceRequest> {
  return request<ServiceRequest>({
    method: 'PATCH',
    url: `/requests/${encodeURIComponent(requestId)}/status`,
    data: payload,
  })
}
