import { api } from '..';
import type { CreateEstoque, UpdateEstoque } from '../../types/estoque';

const BASE_URL = '/admin/estoque';

export const getEstoque = async (token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

export const createEstoque = async (estoque: CreateEstoque, token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'POST',
      body: JSON.stringify(estoque),
    }
  );
};

export const updateEstoque = async (
  id: string,
  estoque: UpdateEstoque,
  token: string
) => {
  return api(
    `${BASE_URL}/${id}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'PUT',
      body: JSON.stringify(estoque),
    }
  );
};

export const deleteEstoque = async (id: string, token: string) => {
  return api(
    `${BASE_URL}/${id}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'DELETE',
    }
  );
};
