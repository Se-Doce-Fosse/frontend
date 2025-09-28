import { useMemo } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import CartDrawer from '../CartDrawer';
import styles from '../CartDrawer.module.scss';
import { CartItem } from '../CartItem';
import { Button } from '../../Button';

export type CartDrawerOrderItem = {
  id: string;
  name: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  unitPrice: number;
  quantity: number;
};

interface CartDrawerOrderProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  items: CartDrawerOrderItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace(/\u00a0/g, '');

export default function CartDrawerOrder({
  open,
  onClose,
  onContinue,
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: CartDrawerOrderProps) {
  const totalAmount = useMemo(
    () =>
      items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items]
  );

  const cartIsEmpty = items.length === 0;

  return (
    <CartDrawer
      open={open}
      onClose={onClose}
      title="Meu carrinho"
      icon={<FaShoppingCart className={styles.cartIcon} />}
    >
      <div className={styles.orderContent}>
        {cartIsEmpty ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Seu carrinho está vazio</h2>
            <p className={styles.emptyStateDescription}>
              Adicione produtos deliciosos e volte para finalizar a sua compra.
            </p>
            <Button
              label="Ver produtos"
              variant="outlined"
              onClick={onClose}
              className={styles.continueButton}
            />
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={formatCurrency(item.unitPrice)}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  quantity={item.quantity}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                />
              ))}
            </div>

            <footer className={styles.orderFooter}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <Button
                label="Continuar"
                variant="secondary"
                className={styles.continueButton}
                onClick={onContinue}
              />
            </footer>
          </>
        )}
      </div>
    </CartDrawer>
  );
}
