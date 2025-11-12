import { api } from '..';
import type { Coupon } from '../../types/coupon';

const BASE_URL = '/coupons';

export const validateCoupon = async (code: string): Promise<Coupon> => {
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    throw new Error('Informe um cupom para continuar.');
  }

  return api(
    `${BASE_URL}/validate?code=${encodeURIComponent(normalizedCode)}`,
    {},
    {
      method: 'GET',
    }
  );
};
