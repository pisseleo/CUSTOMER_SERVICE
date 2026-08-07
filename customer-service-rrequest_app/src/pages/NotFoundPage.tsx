import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-paper-200 bg-white px-6 py-20 text-center">
      <h1 className="text-lg font-semibold text-ink-900">Page not found</h1>
      <p className="text-sm text-ink-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-3 rounded-md bg-desk-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-desk-600">
        Back to requests
      </Link>
    </div>
  );
}
