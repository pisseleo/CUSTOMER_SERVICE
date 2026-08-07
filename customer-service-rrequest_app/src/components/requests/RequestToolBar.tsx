/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import type { RequestStatus, RequestPriority, SortDirection } from '../../types';
import { PRIORITY_LABELS, PRIORITY_OPTIONS, STATUS_LABELS, STATUS_OPTIONS } from '../../types/uiTypes';


interface RequestsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: RequestStatus | '';
  onStatusChange: (value: RequestStatus | '') => void;
  priority: RequestPriority | '';
  onPriorityChange: (value: RequestPriority | '') => void;
  sortDir: SortDirection;
  onSortDirChange: (value: SortDirection) => void;
}

export function RequestsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortDir,
  onSortDirChange,
}: RequestsToolbarProps) {
  // Debounce the free-text search so we don't refetch on every keystroke.
  const [draft, setDraft] = useState(search);
  useEffect(() => setDraft(search), [search]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (draft !== search) onSearchChange(draft);
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-paper-200 bg-white p-3 sm:flex-row sm:items-center sm:p-3.5">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search by title or requester…"
          aria-label="Search requests by title or requester"
          className="w-full rounded-md border border-paper-200 bg-paper-50 py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-desk-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-desk-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as RequestStatus | '')}
          aria-label="Filter by status"
          className="rounded-md border border-paper-200 bg-paper-50 px-2.5 py-2 text-sm text-ink-900 focus:border-desk-400 focus:outline-none focus:ring-2 focus:ring-desk-500/20"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as RequestPriority | '')}
          aria-label="Filter by priority"
          className="rounded-md border border-paper-200 bg-paper-50 px-2.5 py-2 text-sm text-ink-900 focus:border-desk-400 focus:outline-none focus:ring-2 focus:ring-desk-500/20"
        >
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onSortDirChange(sortDir === 'desc' ? 'asc' : 'desc')}
          className="col-span-2 flex items-center justify-center gap-1.5 rounded-md border border-paper-200 bg-paper-50 px-2.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-100 sm:col-span-1"
          title="Toggle sort order by creation date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l3 3m-3-3l-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Created {sortDir === 'desc' ? '(newest)' : '(oldest)'}
        </button>
      </div>
    </div>
  );
}
