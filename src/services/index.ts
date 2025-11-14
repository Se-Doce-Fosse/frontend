const URL = 'http://localhost:8081';

export const api = async (
  path: string,
  headers: HeadersInit,
  options?: RequestInit
) => {
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  const getContentType = () =>
    typeof res.headers?.get === 'function'
      ? (res.headers.get('content-type') ?? '')
      : '';

  const readText = async () =>
    typeof res.text === 'function' ? res.text() : '';

  const readJson = async () =>
    typeof res.json === 'function' ? res.json() : null;

  if (!res.ok) {
    const contentType = getContentType();
    let errorMessage = 'Erro';

    if (contentType.includes('application/json')) {
      try {
        const data = (await readJson()) ?? {};
        errorMessage = (data as { message?: string }).message ?? errorMessage;
      } catch {
        errorMessage = await readText();
      }
    } else {
      errorMessage = await readText();
    }
    throw new Error(errorMessage.trim() || 'Erro inesperado');
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = getContentType();
  const isJsonResponse =
    contentType.includes('application/json') || contentType.length === 0;

  if (!isJsonResponse) {
    return readText();
  }

  try {
    return await readJson();
  } catch {
    return null;
  }
};
