import type { Product } from '../product-admin/ProductAdminInterface';

export interface Order {
  clientId: number;
  orderDate: Date;
  totalPrice: number;
  orderStatus: string;
  products: Product[];
  cupomId: number;
  outOfStock: string;
}
