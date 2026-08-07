import type { ReactNode } from 'react';

export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-danger-100 bg-danger-100/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-danger-600">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.87-1.5L13.71 3.86a1 1 0 00-1.72 0z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-danger-600">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 self-start rounded-md border border-danger-600/30 px-3 py-1.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-100 sm:self-auto"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-paper-200 bg-white px-6 py-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="mb-1 h-9 w-9 text-ink-300">
        <path
          d="M9 13h6m-6 4h6M7 3.5h7.5L19 8v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.5 3.5V8H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
      {action}
    </div>
  );
}
