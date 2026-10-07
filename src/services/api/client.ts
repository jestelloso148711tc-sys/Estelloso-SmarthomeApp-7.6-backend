import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/services/api/config';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  // Placeholder for auth, e.g. { Authorization: `Bearer ${token}` }.
  headers?: Record<string, string>;
};

/**
 * Minimal JSON fetch wrapper used by the real (non-mock) API functions.
 * Turns network failures, timeouts and non-2xx responses into ApiError so the
 * context/UI only ever deals with `Error.message`.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(`Request failed (${response.status}).`, response.status);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out.');
    }
    throw new ApiError('Unable to reach the server.');
  } finally {
    clearTimeout(timer);
  }
}
