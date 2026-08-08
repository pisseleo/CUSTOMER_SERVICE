import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRequestQueryDetail, useUpdateRequestStatus } from '../../../hooks/useRequestQueries';
import type { RequestStatus } from '../../../types';
import { format, formatRelative } from 'date-fns';
import {ApiError } from '../../../api/errors'
import { InlineError } from '../../../components/common/InlineStates';
import { Spinner } from '../../../components/common/LoadingScreen';
import { StatusUpdateControl } from '../../../components/requests/StatusUpdateControl';
import { PriorityBadge, StatusBadge } from '../../../components/ui/Badge/Badges';

export function RequestDetailPage() {
  const { requestId = '' } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { data: request, isLoading, isError, error, refetch } = useRequestQueryDetail(requestId);
  const updateStatus = useUpdateRequestStatus(requestId);

  function handleUpdate(next: RequestStatus) {
    if (!request) return;
    updateStatus.mutate(
      { status: next, version: request?.version },
      {
        onError: () => {
          // Conflict / stale data: refresh so the UI reflects the latest
          // server state before the user retries.
          void refetch();
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-paper-200 bg-white py-24">
        <Spinner />
      </div>
    );
  }

  if (isError || !request) {
    const notFound = error instanceof ApiError && error.kind === 'not_found';
    return (
      <InlineError
        message={
          notFound
            ? 'This request could not be found. It may have been removed.'
            : error instanceof ApiError
              ? error.message
              : 'Failed to load this request.'
        }
        onRetry={notFound ? undefined : () => void refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to requests
      </button>

      <div className="rounded-lg border border-paper-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-paper-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="ticket-id text-xs text-ink-300">{request.id}</p>
            <h1 className="mt-0.5 text-lg font-semibold text-ink-900">{request.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 border-b border-paper-100 py-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-300">Category</dt>
            <dd className="mt-1 text-sm text-ink-900">{request.category}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-300">Requester</dt>
            <dd className="mt-1 text-sm text-ink-900">
              {request.requesterName}{' '}
              <a href={`mailto:${request.requesterEmail}`} className="text-desk-600 hover:underline">
                &lt;{request.requesterEmail}&gt;
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-300">Created</dt>
            <dd className="mt-1 text-sm text-ink-900" title={format(new Date(request.createdAt), 'PPpp')}>
              {formatRelative(request.createdAt, new Date())}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-300">Last updated</dt>
            <dd className="mt-1 text-sm text-ink-900" title={format(new Date(request.updatedAt), 'PPpp')}>
              {formatRelative(request.updatedAt, new Date())}
            </dd>
          </div>
        </dl>

        <div className="border-b border-paper-100 py-5">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-300">Description</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{request.description}</p>
        </div>

        <div className="pt-5">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-300">Update status</h2>
          {updateStatus.isError && (
            <div className="mb-3">
              <InlineError
                message={
                  updateStatus.error instanceof ApiError
                    ? updateStatus.error.message
                    : 'Failed to update the status.'
                }
              />
            </div>
          )}
          <StatusUpdateControl currentStatus={request.status} onUpdate={handleUpdate} submitting={updateStatus.isPending} />
        </div>
      </div>

      <Link to="/" className="mt-4 inline-block text-sm font-medium text-desk-600 hover:underline">
        ← Back to all requests
      </Link>
    </div>
  );
}
