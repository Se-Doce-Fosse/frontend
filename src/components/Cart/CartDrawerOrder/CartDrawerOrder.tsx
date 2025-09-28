import { useMemo, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import CartDrawer from '../CartDrawer';
import styles from '../CartDrawer.module.scss';
import { CartItem } from '../CartItem';
import { Button } from '../../Button';

interface CartDrawerOrderProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

type DrawerItem = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  unitPrice: number;
  quantity: number;
};

const INITIAL_ITEMS: DrawerItem[] = [
  {
    id: 'cookie-nutella',
    name: 'Cookie Oreo com Nutella',
    description:
      'Lorem ipsum dolor sit amet. Eum amet culpa aut commodi accusamus vel culpa suscipit!',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    unitPrice: 20,
    quantity: 2,
  },
  {
    id: 'cookie-oreo',
    name: 'Cookie Oreo',
    description:
      'Lorem ipsum dolor sit amet. Eum amet culpa aut commodi accusamus vel culpa suscipit!',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo',
    unitPrice: 20.6,
    quantity: 1,
  },
];

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
}: CartDrawerOrderProps) {
  const [items, setItems] = useState<DrawerItem[]>(INITIAL_ITEMS);

  const handleIncrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
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
