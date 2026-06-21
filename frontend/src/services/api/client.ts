const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function createApiError(response: Response): Promise<ApiError> {
  let message = `API Error: ${response.status} ${response.statusText}`;

  try {
    const text = await response.text();
    if (text) {
      try {
        const parsed = JSON.parse(text) as { message?: string; error?: string };
        message = parsed.message ?? parsed.error ?? text;
      } catch {
        message = text;
      }
    }
  } catch {
    // Fall back to the status text.
  }

  return new ApiError(response.status, message);
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  return handleResponse<T>(response);
}
