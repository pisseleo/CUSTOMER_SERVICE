


import { Link } from 'react-router-dom';
import type { ServiceRequest } from '../../types';
import { PriorityBadge, StatusBadge } from '../ui/Badge/Badges';
import { formatDate } from '../../utils/format';

export function RequestList({ items }: { items: ServiceRequest[] }) {
  return (
    <>
      {/* Desktop / tablet: table */}
      <div className="hidden overflow-hidden rounded-lg border border-paper-200 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-paper-200 bg-paper-50 text-xs uppercase tracking-wide text-ink-500">
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Requester</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100">
            {items.map((item) => (
              <tr key={item.id} className="group transition-colors hover:bg-paper-50">
                <td className="max-w-xs px-4 py-3">
                  <Link to={`/customers/${item.id}`} className="block">
                    <p className="truncate font-medium text-ink-900 group-hover:text-desk-700">{item.title}</p>
                    <p className="ticket-id mt-0.5 text-xs text-ink-300">{item.id}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">
                  <p className="truncate">{item.requesterName}</p>
                  <p className="truncate text-xs text-ink-300">{item.category}</p>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-500">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="flex flex-col gap-2.5 sm:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/requests/${item.id}`}
              className="perforated-l block rounded-lg border border-paper-200 bg-white p-4 pl-4 active:bg-paper-50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-ink-900">{item.title}</p>
                <span className="ticket-id shrink-0 text-xs text-ink-300">{item.id}</span>
              </div>
              <p className="mt-1 text-sm text-ink-500">
                {item.requesterName} · {item.category}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} />
                </div>
                <span className="text-xs text-ink-300">{formatDate(item.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
