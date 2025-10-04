import type {
  CategoriesWithProducts,
  ApiProductDetail,
  ProductDetail,
} from '../../types/api';
import { api } from '../index';

export async function fetchProducts(): Promise<CategoriesWithProducts> {
  return api('/products', {}, { method: 'GET' });
}

export async function fetchProductById(id: string): Promise<ProductDetail> {
  const apiResponse: ApiProductDetail = await api(
    `/products/${id}`,
    {},
    { method: 'GET' }
  );

  // Mapear a resposta da API para a estrutura esperada pelos componentes
  return {
    id: apiResponse.sku,
    name: apiResponse.nome,
    description: apiResponse.descricao,
    price: `R$ ${apiResponse.valor.toFixed(2).replace('.', ',')}`,
    imageSrc: apiResponse.imagemUrl,
    imageAlt: apiResponse.nome,
    allergens: null,
    relatedProducts: null, // Por enquanto null, backend vai implementar depois
  };
}
