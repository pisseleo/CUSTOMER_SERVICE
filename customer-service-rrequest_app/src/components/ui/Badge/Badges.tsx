import type { RequestStatus, ServiceRequestPriority } from "../../../types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../../types/uiTypes";


const STATUS_STYLES: Record<RequestStatus, string> = {
  OPEN: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-600 ring-blue-400/30',
  RESOLVED: 'bg-success-100 text-green-600 ring-success-500/20',
  CLOSED: 'bg-gray-100 text-gray-500 ring-gray-200',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_STYLES: Record<ServiceRequestPriority, string> = {
  LOW: 'text-cyan-500',
  MEDIUM: 'text-orange-500',
  HIGH: 'text-red-600',
  CRITICAL: 'text-amber-6900',
  URGENT: 'text-red-800',
};

const PRIORITY_DOT: Record<ServiceRequestPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
  URGENT: 5,
};

export function PriorityBadge({ priority }: { priority: ServiceRequestPriority }) {
  const level = PRIORITY_DOT[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className="w-[3px] rounded-sm bg-current"
            style={{ height: `${4 + bar * 2}px`, opacity: bar <= level ? 1 : 0.22 }}
          />
        ))}
      </span>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
