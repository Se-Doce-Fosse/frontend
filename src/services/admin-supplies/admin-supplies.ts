import { api } from '..';

const BASE_URL = '/admin/supplies';

export const getSupplies = async (token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};
