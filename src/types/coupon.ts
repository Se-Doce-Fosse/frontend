export type Coupon = {
  id: number;
  codigo: string;
  valorDesc: number | string;
  validade: string;
  ativo: boolean;
  unico: boolean;
};
