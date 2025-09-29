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
    let errorMessage = 'Erro';

    try {
      const data = await res.json();
      errorMessage = data.message;
    } catch {
      errorMessage = await res.text();
    }
    throw new Error(errorMessage);
  }

  console.log(await res.json());
  return res.json();
};
