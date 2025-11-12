export type Order = {
  clientId: string;
  orderDate: string; // ISO date string, ex: "2025-10-30T19:10:07.975Z"
  totalPrice: number;
  orderStatus: 'PREPARANDO' | 'FINALIZADO' | 'CANCELADO' | string; // pode ajustar os status permitidos
  products: string[];
  cupomId: number | null;
  outOfStock: string[];
};
