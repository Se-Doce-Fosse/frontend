import type { Product } from '../../types/product';
import { api } from '..';

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

export const createProduct = async (product: Product, token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'POST',
      body: JSON.stringify(product),
    }
  );
};

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
