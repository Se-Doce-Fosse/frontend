import { api } from '../../services/index';

const BASE_URL = 'admin/order/{status}';

export const getOrders = async (token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

export const getOrdersByDate = async (token: string, date: Date) => {
  return api(
    `${BASE_URL}/${date}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

export const getOrdersByProduct = async (token: string, product: string) => {
  return api(
    `${BASE_URL}/${product}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};
