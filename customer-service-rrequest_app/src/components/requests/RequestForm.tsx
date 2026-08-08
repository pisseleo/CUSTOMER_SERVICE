


import { useState, type FormEvent, type ReactNode } from 'react';
import type { CreateServiceRequest } from '../../types';
import { hasErrors, validateCreateRequest, type FormErrors } from '../../utils/validation';
import { PRIORITY_LABELS, PRIORITY_OPTIONS } from '../../types/uiTypes';


const CATEGORY_OPTIONS = ['Billing', 'Technical', 'Account', 'Shipping', 'General'];

const EMPTY: CreateServiceRequest = {
  title: '',
  description: '',
  category: '',
  priority: 'MEDIUM',
  requesterName: '',
  requesterEmail: '',
};

interface RequestFormProps {
  onSubmit: (input: CreateServiceRequest) => void;
  submitting: boolean;
  serverFieldErrors?: FormErrors;
}

export function RequestForm({ onSubmit, submitting, serverFieldErrors }: RequestFormProps) {
  const [values, setValues] = useState<CreateServiceRequest>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateServiceRequest, boolean>>>({});

  function set<K extends keyof CreateServiceRequest>(key: K, value: CreateServiceRequest[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleBlur(field: keyof CreateServiceRequest) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateCreateRequest(values));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateCreateRequest(values);
    setErrors(validation);
    setTouched({
      title: true,
      description: true,
      category: true,
      priority: true,
      requesterName: true,
      requesterEmail: true,
    });
    if (!hasErrors(validation)) onSubmit(values);
  }

  const fieldError = (field: keyof CreateServiceRequest): string | undefined =>
    (touched[field] && errors[field]) || serverFieldErrors?.[field];

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Title" error={fieldError('title')} htmlFor="title">
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="Short summary of the issue"
          className={inputClass(fieldError('title'))}
        />
      </Field>

      <Field label="Description" error={fieldError('description')} htmlFor="description">
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe the issue, including any steps already taken"
          rows={5}
          className={inputClass(fieldError('description'))}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Category" error={fieldError('category')} htmlFor="category">
          <select
            id="category"
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            className={inputClass(fieldError('category'))}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" error={fieldError('priority')} htmlFor="priority">
          <select
            id="priority"
            value={values.priority}
            onChange={(e) => set('priority', e.target.value as CreateServiceRequest['priority'])}
            onBlur={() => handleBlur('priority')}
            className={inputClass(fieldError('priority'))}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Requester name" error={fieldError('requesterName')} htmlFor="requesterName">
          <input
            id="requesterName"
            type="text"
            value={values.requesterName}
            onChange={(e) => set('requesterName', e.target.value)}
            onBlur={() => handleBlur('requesterName')}
            placeholder="Jane Doe"
            className={inputClass(fieldError('requesterName'))}
          />
        </Field>

        <Field label="Requester email" error={fieldError('requesterEmail')} htmlFor="requesterEmail">
          <input
            id="requesterEmail"
            type="email"
            value={values.requesterEmail}
            onChange={(e) => set('requesterEmail', e.target.value)}
            onBlur={() => handleBlur('requesterEmail')}
            placeholder="jane@example.com"
            className={inputClass(fieldError('requesterEmail'))}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-desk-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
            </svg>
          )}
          {submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(error?: string): string {
  return [
    'w-full rounded-md border bg-paper-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300',
    'focus:bg-white focus:outline-none focus:ring-2',
    error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : 'border-paper-200 focus:border-desk-400 focus:ring-desk-500/20',
  ].join(' ');
}
