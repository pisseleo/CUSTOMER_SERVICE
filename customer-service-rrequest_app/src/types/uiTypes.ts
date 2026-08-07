import type { RequestStatus, ServiceRequestPriority } from ".";

export const STATUS_OPTIONS: RequestStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
export const PRIORITY_OPTIONS: ServiceRequestPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const PRIORITY_LABELS: Record<ServiceRequestPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
  URGENT: 'Urgent',
};

/**
 * Valid forward transitions for a request's status. Used to constrain the
 * status-update control so users can't set an illegal transition client-side
 * (the API is still the source of truth and re-validates on write).
 */
export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
};
