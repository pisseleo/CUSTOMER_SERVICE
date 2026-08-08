


import { useState } from 'react';
import type { RequestStatus } from '../../types';
import { STATUS_LABELS, STATUS_TRANSITIONS } from '../../types/uiTypes';
import { Spinner } from '../common/LoadingScreen';
interface StatusUpdateControlProps {
  currentStatus: RequestStatus;
  onUpdate: (next: RequestStatus) => void;
  submitting: boolean;
}

export function StatusUpdateControl({ currentStatus, onUpdate, submitting }: StatusUpdateControlProps) {
  const options = STATUS_TRANSITIONS[currentStatus];
  const [selected, setSelected] = useState<RequestStatus | ''>('');

  if (options.length === 0) {
    return <p className="text-sm text-ink-500">This request is closed and cannot be updated further.</p>;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as RequestStatus | '')}
        disabled={submitting}
        aria-label="Change status to"
        className="rounded-md border border-paper-200 bg-paper-50 px-3 py-2 text-sm text-ink-900 focus:border-desk-400 focus:outline-none focus:ring-2 focus:ring-desk-500/20 disabled:opacity-60"
      >
        <option value="">Change status to…</option>
        {options.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <button
        onClick={() => selected && onUpdate(selected)}
        disabled={!selected || submitting}
        className="flex items-center justify-center gap-2 rounded-md bg-green-500 shadow-sm px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Spinner className="h-4 w-4 text-white" />}
        {submitting ? 'Updating…' : 'Update status'}
      </button>
    </div>
  );
}
