export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-6 w-6 text-desk-500" />
        <p className="text-sm text-ink-500">{label}</p>
      </div>
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5 text-desk-500' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}
