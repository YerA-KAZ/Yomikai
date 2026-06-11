const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export class ApiError extends Error {
  status: number;
  constructor(response: Response) {
    super(`API Error: ${response.status} ${response.statusText}`);
    this.status = response.status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  if (USE_MOCK) {
    // Simulated delay for realistic behavior
    await new Promise(resolve => setTimeout(resolve, 300));
    const { getMockData } = await import('../mock/mockRouter');
    return getMockData<T>(endpoint);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  if (!res.ok) throw new ApiError(res);
  return res.json();
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const { postMockData } = await import('../mock/mockRouter');
    return postMockData<T>(endpoint, body);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ApiError(res);
  return res.json();
}
