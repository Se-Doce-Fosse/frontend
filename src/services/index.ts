const URL = import.meta.env.VITE_BACKEND_URL;

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

    try {
      const data = await res.json();
      errorMessage = data.message;
    } catch {
      errorMessage = await res.text();
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
