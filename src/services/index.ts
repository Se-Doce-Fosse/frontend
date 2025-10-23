const URL = 'http://localhost:8081';

export interface ApiError extends Error {
  status?: number;
}

export const api = async (
  path: string,
  headers: HeadersInit,
  options?: RequestInit
) => {
  const res = await fetch(`${URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    let errorMessage = 'Erro';
    const clonedResponse = res.clone();

    try {
      const data = await clonedResponse.json();
      errorMessage = data?.message ?? errorMessage;
    } catch {
      try {
        errorMessage = await res.text();
      } catch {
        errorMessage = res.statusText || errorMessage;
      }
    }
    const error: ApiError = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
};
