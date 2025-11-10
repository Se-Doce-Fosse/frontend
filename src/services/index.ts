const URL = 'http://localhost:8081';

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
    const contentType = res.headers.get('content-type') ?? '';
    let errorMessage = 'Erro';

    if (contentType.includes('application/json')) {
      try {
        const data = await res.json();
        errorMessage = data.message ?? errorMessage;
      } catch {
        errorMessage = await res.text();
      }
    } else {
      errorMessage = await res.text();
    }
    throw new Error(errorMessage.trim() || 'Erro inesperado');
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return res.text();
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
};
