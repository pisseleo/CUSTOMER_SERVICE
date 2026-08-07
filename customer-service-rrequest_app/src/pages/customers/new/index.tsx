import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../../../hooks/useRequestQueries';
import type { CreateServiceRequest } from '../../../types';
import type { FormErrors } from '../../../utils/validation';
// import { ApiError } from '../../../api/apiRequest';
import {ApiError } from '../../../api/errors'
import { InlineError } from '../../../components/common/InlineStates';
import { RequestForm } from '../../../components/requests/RequestForm';

export function NewRequestPage() {
  const navigate = useNavigate();
  const mutation = useCreateRequest();

  function handleSubmit(input: CreateServiceRequest) {
    mutation.mutate(input, {
      onSuccess: (created) => navigate(`/requests/${created.id}`, { replace: true }),
    });
  }

  const serverFieldErrors: FormErrors | undefined =
    mutation.error instanceof ApiError && mutation.error?.fieldErrors
      ? Object.fromEntries(mutation.error.fieldErrors.map((fe) => [fe.field, fe.message]))
      : undefined;

  // Field-level validation errors are shown inline on the form; anything
  // else (network, server, auth, or a validation error with no field
  // mapping) surfaces as a general banner above the form.
  const generalError = mutation.isError
    ? mutation.error instanceof ApiError
      ? serverFieldErrors
        ? undefined
        : mutation.error.message
      : 'Failed to submit the request.'
    : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-ink-900">New service request</h1>
        <p className="text-sm text-ink-500">Submit a request on behalf of a customer.</p>
      </div>

      {generalError && (
        <div className="mb-5">
          <InlineError message={generalError} />
        </div>
      )}

      <div className="rounded-lg border border-paper-200 bg-white p-5 sm:p-6">
        <RequestForm onSubmit={handleSubmit} submitting={mutation.isPending} serverFieldErrors={serverFieldErrors} />
      </div>
    </div>
  );
}
