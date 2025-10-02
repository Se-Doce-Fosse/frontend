import type { CategoriesWithProducts } from '../../types/api';
import { api } from '../index';

export async function fetchProducts(): Promise<CategoriesWithProducts> {
  return api('/products', {}, { method: 'GET' });
}
