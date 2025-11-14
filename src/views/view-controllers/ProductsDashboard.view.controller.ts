import { api } from '../../services/index';
import type { Product } from '../../types/product';

const BASE_URL = '/admin/products';
export const getCategories = async () => {
  return api(
    '/products',
    {},
    {
      method: 'GET',
    }
  );
};

export const getAllProducts = async (token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

export const getProductBySku = async (sku: string, token: string) => {
  return api(
    `${BASE_URL}/${sku}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

// Convenience helpers for debugging: fetch data and print JSON to the console.
export const fetchAndLogPublicProducts = async () => {
  try {
    const data = await getCategories();
    // Log full JSON to the console for inspection
    console.log('Public products JSON:', data);
    return data;
  } catch (err) {
    console.error('Error fetching public products:', err);
    throw err;
  }
};

export const fetchAndLogAdminProducts = async (token?: string) => {
  try {
    const data = await getAllProducts(token ?? '');
    console.log('Admin products JSON:', data);
    return data;
  } catch (err) {
    console.error('Error fetching admin products:', err);
    throw err;
  }
};

// Returns only selected headers for each product: sku, name and quantity.
export const getProductsHeaders = async (options?: {
  /** If true, uses admin endpoint and requires a token. Defaults to false. */
  admin?: boolean;
  /** Admin JWT token when admin=true */
  token?: string;
}) => {
  try {
    const { admin = false, token } = options ?? {};
    const raw = admin
      ? await getAllProducts(token ?? '')
      : await getCategories();

    if (!Array.isArray(raw)) {
      // e.g. { products: [...] }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const asAny = raw as any;
      if (Array.isArray(asAny?.products)) {
        // normalize
        return asAny.products.map((p: Product) => ({
          sku: p.sku,
          name: p.name,
          quantity: Number(p.quantity ?? 0),
        }));
      }
      return [] as Array<{ sku: string; name: string; quantity: number }>;
    }

    return raw.map((p: Product) => ({
      sku: p.sku,
      name: p.name,
      quantity: Number(p.quantity ?? 0),
    }));
  } catch (err) {
    console.error('Error getting product headers:', err);
    throw err;
  }
};
