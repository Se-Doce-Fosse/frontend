import { api } from '..';
import type { Coupon } from '../../types/coupon';

const BASE_URL = '/admin/coupons';

export type CreateCouponPayload = {
  codigo: string;
  valorDesc: number;
  validade: string;
  ativo: boolean;
  unico: boolean;
};

export const getAdminCoupons = async (token: string): Promise<Coupon[]> => {
  return api(
    BASE_URL,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      method: 'GET',
    }
  );
};

export const createAdminCoupon = async (
  payload: CreateCouponPayload,
  token: string
) => {
  return api(
    BASE_URL,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
};

export const updateAdminCoupon = async (
  id: number,
  payload: CreateCouponPayload,
  token: string
) => {
  return api(
    `${BASE_URL}/${id}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
};

export const deleteAdminCoupon = async (id: number, token: string) => {
  return api(
    `${BASE_URL}/${id}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      method: 'DELETE',
    }
  );
};
