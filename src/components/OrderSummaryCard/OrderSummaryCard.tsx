import React from 'react';
import { Button } from '../Button';
import styles from './OrderSummaryCard.module.scss';

export interface OrderSummaryCardProps {
  orderCode: string;
  clientName: string;
  items: string[];
  handleClick?: () => void;
  isNew: boolean;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  orderCode,
  clientName,
  items,
  handleClick,
  isNew,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderCode}>{orderCode}</div>
        {isNew && (
          <div className={styles.newStatus}>
            <div className={styles.statusDot}></div>
            <div>Novo</div>
          </div>
        )}
      </div>

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
          onClick={handleClick}
        />
        <Button label="Detalhes" onClick={handleClick} />
      </div>
    </div>
  );
};

export default OrderSummaryCard;
