import type { CategoriesWithProducts, ProductDetail } from '../../types/api';
import { api } from '../index';

export async function fetchProducts(): Promise<CategoriesWithProducts> {
  return api('/products', {}, { method: 'GET' });
}

export async function fetchProductById(id: string): Promise<ProductDetail> {
  const apiResponse: ProductDetail = await api(
    `/products/${id}`,
    {},
    { method: 'GET' }
  );
  return apiResponse;
}
