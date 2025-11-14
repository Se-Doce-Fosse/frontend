import type { Product } from '../../types/product';
import { api, API_URL } from '..';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(product: any, token: string) {
  const formData = new FormData();

  formData.append('sku', product.sku ?? '');
  formData.append('name', product.name ?? '');
  formData.append('price', product.price ?? '');
  formData.append('description', product.description ?? '');
  formData.append('isActive', String(product.isActive ?? true));
  formData.append('quantity', String(product.quantity ?? 0));
  formData.append('categoryId', product.category?.id ?? '');

  if (product.file) {
    formData.append('imageSrc', product.file);
  }

  formData.append('productSupply', JSON.stringify(product.productSupply ?? []));

  const res = await fetch(`${API_URL}${BASE_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Erro ao criar produto: ${res.statusText}`);
  }

  return await res.json();
}

export const updateProduct = async (
  sku: string,
  productDetails: Product,
  token: string
) => {
  return api(
    `${BASE_URL}/${sku}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'PUT',
      body: JSON.stringify(productDetails),
    }
  );
};

export const toggleProductStatus = async (id: string, token: string) => {
  return api(
    `${BASE_URL}/${id}/status`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'PATCH',
    }
  );
};

export const deleteProduct = async (sku: string, token: string) => {
  return api(
    `${BASE_URL}/${sku}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'DELETE',
    }
  );
};
