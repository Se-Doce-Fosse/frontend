import { apiAdmin } from '../indexAdmin';
import type { AdminProductBody } from '../indexAdmin';

export const adminCreateProduct = (body: AdminProductBody) =>
  apiAdmin('/products', { method: 'POST', body: JSON.stringify(body) });

export const adminUpdateProduct = (sku: string, body: AdminProductBody) =>
  apiAdmin(`/products/${sku}`, { method: 'PUT', body: JSON.stringify(body) });

export const adminToggleProductStatus = (sku: string) =>
  apiAdmin(`/products/${sku}/status`, { method: 'PATCH' });

export const adminDeleteProduct = (sku: string) =>
  apiAdmin(`/products/${sku}`, { method: 'DELETE' });
