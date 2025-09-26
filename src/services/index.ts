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
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};
