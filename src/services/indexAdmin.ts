const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const ADMIN_PREFIX = '/admin';

export async function apiAdmin(path: string, init: RequestInit = {}) {
  const raw = (localStorage.getItem('token') ?? '').trim();

  const headers = new Headers(init.headers || {});
  if (raw && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${raw}`);
  }

  const isForm =
    typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const fullPath = path.startsWith(ADMIN_PREFIX)
    ? path
    : `${ADMIN_PREFIX}${path}`;
  const url = `${BASE_URL}${fullPath}`;

  const resp = await fetch(url, { ...init, headers });

  const ctype = resp.headers.get('content-type') || '';
  const data = ctype.includes('application/json')
    ? await resp.json()
    : await resp.text();

  if (!resp.ok) {
    console.error('[apiAdmin] ERRO', resp.status, data);
    throw { status: resp.status, data };
  }
  return data;
}

export type AdminProductBody = {
  sku?: string;
  nome: string;
  descricao: string;
  valor: number;
  imagemUrl: string;
  ativo: boolean;
  categoria: { id: number };
};
