
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type ServiceRequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'URGENT'
export type RequestPriority = ServiceRequestPriority;

export interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  priority: ServiceRequestPriority
  status: RequestStatus
  requesterName: string
  requesterEmail: string
  createdAt: string
  updatedAt: string
  version: number
}

export interface CreateServiceRequest {
  title: string
  description: string
  category: string
  priority: ServiceRequestPriority
  requesterName: string
  requesterEmail: string
}

export interface UpdateRequestStatus {
  status: RequestStatus
  version: number
  note?: string
}

export interface ListServiceRequestsParams {
  search?: string
  status?: RequestStatus
  priority?: RequestPriority
  sortBy: 'createdAt';
  sortDir: SortDirection
  page?: number
  pageSize?: number
}

export interface ServiceRequestPage<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ProblemDetails {
  type?: string
  title: string
  status: number
  detail?: string
  instance?: string
  traceId?: string
  [key: string]: unknown
}

export type SortDirection = 'asc' | 'desc';

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>
}