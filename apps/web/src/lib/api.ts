const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string; meta?: any }> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.message || `Request failed with status ${res.status}`);
    }

    return json;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}
