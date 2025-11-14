import React from 'react';
import { Button } from '../Button';
import styles from './OrderSummaryCard.module.scss';

export interface OrderSummaryCardProps {
  orderCode: string;
  clientName: string;
  items: string[];
  onMoveStage?: () => void;
  onDetails?: () => void;
  isNew?: boolean;
  status?: string;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  orderCode,
  clientName,
  items,
  onMoveStage,
  onDetails,
  isNew,
  status,
}) => {
  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <span className={styles.orderCode}>{orderCode}</span>
        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
          {isNew && (
            <div className={styles.newStatus}>
              <div className={styles.statusDot}></div>
              <div>Novo</div>
            </div>
          )}

          {status === 'em_preparacao' && (
            <div className={styles.preparingStatus}>
              <div className={styles.statusDot}></div>
              <div>Em preparo</div>
            </div>
          )}

          {status === 'pronto' && (
            <div className={styles.readyStatus}>
              <div className={styles.statusDot}></div>
              <div>Pronto</div>
            </div>
          )}

          {status === 'finalizado' && (
            <div className={styles.finalizedStatus}>
              <div className={styles.statusDot}></div>
              <div>Finalizado</div>
            </div>
          )}

          {status === 'cancelado' && (
            <div className={styles.cancelledStatus}>
              <div className={styles.statusDot}></div>
              <div>Cancelado</div>
            </div>
          )}
        </div>
      </header>

      <div className={styles.clientSection}>
        <label className={styles.label}>Cliente</label>
        <div className={styles.clientName}>{clientName}</div>
      </div>

      <div className={styles.itemsSection}>
        <label className={styles.label}>Itens</label>
        <ul className={styles.itemList}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <Button
          className={styles.moveStageButton}
          label="Mover Estágio"
          onClick={onMoveStage}
        />
        <Button label="Detalhes" onClick={onDetails} />
      </div>
    </div>
  );
};

export default OrderSummaryCard;
