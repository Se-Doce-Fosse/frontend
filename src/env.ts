export const API_URL = (() => {
  const fallbackForTests =
    process.env.NODE_ENV === 'test' ? 'http://localhost:3000' : undefined;

  const url = process.env.VITE_API_URL ?? fallbackForTests;
  if (!url) throw new Error('VITE_API_URL não definida');
  return url.replace(/\/+$/, '');
})();
