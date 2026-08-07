import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError } from '../../../api/apiRequest';
import { EmptyState, InlineError } from '../../../components/common/InlineStates';
import { Spinner } from '../../../components/common/LoadingScreen';
import { RequestList } from '../../../components/requests/RequestList';
import { RequestsToolbar } from '../../../components/requests/RequestToolBar';
import { Pagination } from '../../../components/ui/Pagination';
import type { ListServiceRequestsParams, RequestStatus, RequestPriority, SortDirection } from '../../../types';
import { useRequestQueryLists } from '../../../hooks/useRequestQueries';

const PAGE_SIZE = 10;

export function RequestsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [priority, setPriority] = useState<RequestPriority | ''>('');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const params: ListServiceRequestsParams = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sortBy: 'createdAt',
    sortDir,
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useRequestQueryLists(params);

  const hasFilters = Boolean(search || status || priority);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Service requests</h1>
          <p className="text-sm text-ink-500">Review, search, and triage incoming customer requests.</p>
        </div>
        <Link
          to="/new"
          className="hidden shrink-0 items-center gap-1.5 rounded-md bg-desk-500 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-desk-600 sm:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New request
        </Link>
      </div>

      <RequestsToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(v) => {
          setPriority(v);
          setPage(1);
        }}
        sortDir={sortDir}
        onSortDirChange={(v) => {
          setSortDir(v);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border border-paper-200 bg-white py-20">
          <Spinner />
        </div>
      ) : isError ? (
        <InlineError
          message={error instanceof ApiError ? error.message : 'Failed to load service requests.'}
          onRetry={() => void refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No requests match your filters' : 'No service requests yet'}
          message={
            hasFilters
              ? 'Try broadening your search or clearing a filter.'
              : 'Requests submitted by customers will appear here once created.'
          }
          action={
            !hasFilters ? (
              <Link to="/new" className="mt-2 rounded-md bg-desk-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-desk-600">
                Create the first request
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <RequestList items={data.items} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalItems={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </div>
      )}

      <Link
        to="/new"
        className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-desk-500 text-white shadow-lg sm:hidden"
        aria-label="New request"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}
