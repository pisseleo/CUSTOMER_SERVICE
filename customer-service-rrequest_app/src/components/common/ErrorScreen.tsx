interface ErrorScreenProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function ErrorScreen({ title, message, action }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-danger-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-danger-100 text-danger-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.87-1.5L13.71 3.86a1 1 0 00-1.72 0z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-base font-semibold text-ink-900">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-500">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-6 rounded-md bg-desk-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-desk-600"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
