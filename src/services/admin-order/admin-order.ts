import { api } from '../index';

export type AdminOrderStatus =
  | 'ACEITO'
  | 'PREPARANDO'
  | 'ROTA'
  | 'ENTREGUE'
  | 'CANCELADO';

export interface AdminOrderItemResponse {
  produtoSku: string;
  produtoNome?: string | null;
  quantidade: number;
  valorUnitario: number;
}

export interface AdminOrderResponse {
  orderId: number;
  clientId: string;
  clientName?: string | null;
  address?: string | null;
  couponCode?: string | null;
  orderDate: string;
  totalPrice: number;
  orderStatus: AdminOrderStatus;
  cupomId?: number | null;
  items: AdminOrderItemResponse[];
}

export async function fetchAdminOrdersByStatus(
  status: AdminOrderStatus,
  token: string
): Promise<AdminOrderResponse[]> {
  return api(
    `/admin/order/${status}`,
    { Authorization: `Bearer ${token}` },
    { method: 'GET' }
  );
}
