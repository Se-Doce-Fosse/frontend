import { api } from '..';
import type { Order } from '../../types/order';

const BASE_URL = '/order';

export const createOrder = async (order: Order) => {
  const response = await api(
    `${BASE_URL}`,
    {},
    {
      method: 'POST',
      body: JSON.stringify(order),
    }
  );
  return response;
};
