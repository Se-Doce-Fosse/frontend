import { API_URL } from '../../env';

import type {
  DetailProductPT,
  ListProductEN,
  ProductsCategoriasPT,
  ProductsResponseEN,
  ProdutoPT,
  ViewProduct,
} from '../../types/products';

import { runWithPool } from '../../utils/concurrency';

const parseBRLToCents = (price: string | number): number => {
  if (typeof price === 'number') return Math.round(price * 100);
  const numberString = price.replace(/[R$\s.]/g, '').replace(',', '.');
  const n = Number.parseFloat(numberString);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

const hasProp = <K extends string>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> =>
  typeof obj === 'object' && obj !== null && prop in obj;

const isProductsResponseEN = (x: unknown): x is ProductsResponseEN =>
  typeof x === 'object' &&
  x !== null &&
  hasProp(x, 'categories') &&
  Array.isArray(x.categories);

const isProductsResponsePTArray = (x: unknown): x is ProdutoPT[] =>
  Array.isArray(x) &&
  (x.length === 0 ||
    (typeof x[0] === 'object' &&
      x[0] !== null &&
      'sku' in x[0] &&
      'nome' in x[0]));

const isProductsResponsePTCategorias = (
  x: unknown
): x is { categorias: ProductsCategoriasPT[] } =>
  typeof x === 'object' &&
  x !== null &&
  hasProp(x, 'categorias') &&
  Array.isArray(x.categorias);

const isDetailPT = (x: unknown): x is DetailProductPT =>
  typeof x === 'object' &&
  x !== null &&
  ('sku' in (x as object) ||
    'descricao' in (x as object) ||
    'nome' in (x as object));

function normalizeListToENShape(data: unknown): ListProductEN[] {
  if (isProductsResponseEN(data)) {
    return data.categories?.flatMap((c) => c.products ?? []) ?? [];
  }
  if (isProductsResponsePTArray(data)) {
    return data.map((p) => ({
      id: p.sku,
      name: p.nome,
      price: p.valor,
      imageAlt: p.nome,
      description: p.descricao,
    }));
  }
  if (isProductsResponsePTCategorias(data)) {
    return data.categorias.flatMap((cat) =>
      cat.produtos.map((p) => ({
        id: p.sku,
        name: p.nome,
        price: p.valor,
        imageAlt: p.nome,
        description: p.descricao,
      }))
    );
  }
  return [];
}

function mockImageFor(nameOrCategory?: string): string {
  const n = (nameOrCategory ?? '').toLowerCase();
  if (n.includes('brownie')) return '/images/brownie.png';
  if (n.includes('brigadeiro')) return '/images/brigadeiro.png';
  if (n.includes('oreo')) return '/images/cookie.png';
  return '/images/cookie.png';
}

export async function fetchProductsRaw(): Promise<unknown> {
  const res = await fetch(`${API_URL}/products`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchProductDetail(
  id: string
): Promise<DetailProductPT | null> {
  try {
    const r = await fetch(`${API_URL}/products/${id}`, {
      headers: { Accept: 'application/json' },
    });
    if (!r.ok) throw new Error(String(r.status));
    const d: unknown = await r.json();
    return isDetailPT(d) ? d : null;
  } catch {
    return null;
  }
}

export async function getProductsView(): Promise<ViewProduct[]> {
  const raw = await fetchProductsRaw();
  const list = normalizeListToENShape(raw);
  const ids = Array.from(new Set(list.map((p) => String(p.id))));

  const detailById = new Map<string, DetailProductPT | null>();
  await runWithPool(ids, async (id) => {
    const det = await fetchProductDetail(id);
    detailById.set(id, det);
  });

  const view: ViewProduct[] = list.map((p) => {
    const idStr = String(p.id);
    const det = detailById.get(idStr) ?? null;

    const title =
      det?.nome && det.nome.trim() ? det.nome : (p.name ?? `Produto ${idStr}`);
    const description = det?.descricao?.trim?.()
      ? det.descricao!.trim()
      : (p.description ?? '');
    const priceCents = parseBRLToCents(
      typeof p.price !== 'undefined' ? p.price : (det?.valor ?? 0)
    );

    const imageSrc = mockImageFor(title);
    const imageAlt = title;

    return {
      id: idStr,
      title,
      imageSrc,
      imageAlt,
      priceCents,
      description,
    };
  });

  return view;
}
