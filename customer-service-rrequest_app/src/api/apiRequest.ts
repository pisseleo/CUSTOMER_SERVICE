import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import type {
  CreateServiceRequest,
  ListServiceRequestsParams,
  ProblemDetails,
  ServiceRequest,
  ServiceRequestPage,
  UpdateRequestStatus,
} from '../types'
import { mockListRequests } from './mockApi';
import { apiRequest } from './client';


const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';


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

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

function buildProblemDetails(data: unknown): ProblemDetails | undefined {
  if (data && typeof data === 'object' && 'title' in data) {
    return data as ProblemDetails
  }

  return undefined
}

function buildApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 500
    const problemDetails = buildProblemDetails(error.response?.data)
    const message = problemDetails?.detail ?? error.message ?? 'An unexpected error'

    return new ApiError(message, status, problemDetails)
  }

  return new ApiError('An unexpected error', 500)
}

// function delay(ms: number) {
//   return new Promise<void>((resolve) => {
//     window.setTimeout(resolve, ms)
//   })
// }

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      ...config,
      validateStatus: () => true,
    })

    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    const problemDetails = buildProblemDetails(response.data)
    throw new ApiError(problemDetails?.detail ?? 'Request failed', response.status, problemDetails)
  } catch (error) {
    const apiError = buildApiError(error)
    if (USE_MOCK) {
      // provide mock for listing requests endpoint
      if (config.method?.toUpperCase() === 'GET' && config.url === '/requests') {
        // config.params may be undefined or match ListServiceRequestsParams
        return (await mockListRequests(config.params as ListServiceRequestsParams)) as unknown as T
      }
    }
    throw apiError
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
