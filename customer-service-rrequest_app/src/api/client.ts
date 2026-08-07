import { ApiError } from './errors';
import { mockListRequests } from './mockApi';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Supplies the current OIDC access token for outgoing requests. Wired up
 * once, near the app root, from the react-oidc-context user object so that
 * the plain API layer doesn't need to depend on React or the auth library.
 */
let getAccessToken: () => string | undefined = () => undefined;

export function registerAccessTokenProvider(provider: () => string | undefined): void {
  getAccessToken = provider;
}

/**
 * Called whenever the API responds 401, so the app can force a fresh sign-in
 * instead of leaving the user stuck on a broken screen.
 */
let onUnauthorized: () => void = () => undefined;

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return `${base}/${cleanPath}${queryString ? `?${queryString}` : ''}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    if (USE_MOCK && method === 'GET' && path.replace(/^\//, '') === 'requests') {
      return (await mockListRequests(query as any)) as unknown as T;
    }
    throw ApiError.network();
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    const error = ApiError.fromStatus(response.status, payload);
    if (error.kind === 'auth' && response.status === 401) onUnauthorized();
    throw error;
  }

  return payload as T;
}
