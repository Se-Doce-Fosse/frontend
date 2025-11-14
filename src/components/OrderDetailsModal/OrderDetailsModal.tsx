import React from 'react';
import styles from './OrderDetailsModal.module.scss';

export interface OrderDetailsItem {
  produtoSku?: string | null;
  produtoNome?: string | null;
  quantidade: number;
  valorUnitario: number;
}

export interface OrderDetailsData {
  orderCode: string;
  clientName: string;
  address?: string | null;
  statusLabel: string;
  totalPrice?: number;
  orderDate?: string;
  couponCode?: string | null;
  items: OrderDetailsItem[];
}

interface OrderDetailsModalProps {
  order: OrderDetailsData;
  onClose: () => void;
}

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    : '-';

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Detalhes do pedido {order.orderCode}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Cliente</div>
            <div className={styles.infoValue}>{order.clientName}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Status</div>
            <div className={styles.infoValue}>{order.statusLabel}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Total</div>
            <div className={styles.infoValue}>
              {formatCurrency(order.totalPrice)}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Data</div>
            <div className={styles.infoValue}>
              {formatDate(order.orderDate)}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Endereço</div>
            <div className={styles.infoValue}>
              {order.address ?? 'Endereço não informado'}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Cupom utilizado</div>
            <div className={styles.infoValue}>
              {order.couponCode ?? 'Não utilizado'}
            </div>
          </div>
        </div>

        <section>
          <h3>Itens</h3>
          <ul className={styles.itemsList}>
            {order.items.map((item, index) => (
              <li
                key={`${item.produtoSku}-${index}`}
                className={styles.itemCard}
              >
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>
                    {item.produtoNome ?? 'Produto sem nome'}
                  </span>
                  <span className={styles.itemMeta}>
                    {item.quantidade}x {formatCurrency(item.valorUnitario)}{' '}
                    {item.produtoSku
                      ? `• ${item.produtoSku.toUpperCase()}`
                      : ''}
                  </span>
                </div>
                <span className={styles.itemTotal}>
                  {formatCurrency(item.valorUnitario * item.quantidade)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
