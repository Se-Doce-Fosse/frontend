import CartDrawer from '../CartDrawer';
import { AddressCard } from '../../AddressCard/AddressCard';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CartItem } from '../CartItem';
import { Button } from '@components';
import styles from '../CartDrawer.module.scss';
import { useMemo } from 'react';
import { useCart } from '../../../context/CartContext';
interface CartDrawerFinishProps {
  open: boolean;
  onClose: () => void;
}
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace(/\u00a0/g, '');

export default function CartDrawerFinish({
  open,
  onClose,
}: CartDrawerFinishProps) {
  const {
    items,
    incrementItem,
    decrementItem,
    removeItem,
    quantitiesByProductId,
  } = useCart();

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total: number, item: { unitPrice: number; quantity: number }) =>
          total + item.unitPrice * item.quantity,
        0
      ),
    [items]
  );

  const whatslines = items.map(
    (item) =>
      ` ${item.quantity} ${item.name} Unidade: ${formatCurrency(item.unitPrice)}`
  );
  const whatsMessage = `Pedidos: ${whatslines} Total: ${formatCurrency(totalAmount)}`;
  const number = `5551994527855`;

  const handleWhatsAppOrder = () => {
    // Detecta se é mobile ou desktop
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // No mobile, usa wa.me que abre diretamente o app
      const whatsLink = `https://wa.me/${number}?text=${encodeURIComponent(whatsMessage)}`;
      window.open(whatsLink, '_blank');
    } else {
      // No desktop, usa WhatsApp Web diretamente
      const whatsLink = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(whatsMessage)}`;
      window.open(whatsLink, '_blank');
    }
  };

  return (
    <CartDrawer open={open} onClose={onClose} withHeader={false}>
      <div className={styles.finishOrderContent}>
        <AddressCard />

        <div className={styles.headingRow}>
          <AiOutlineShoppingCart className={styles.icon} aria-hidden="true" />
          <h2 className={styles.heading}>Meu Carrinho</h2>
        </div>
        {items.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              quantity={quantitiesByProductId[item.id] || 0}
              onIncrement={() => incrementItem(item.id)}
              onDecrement={() => decrementItem(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))
        ) : (
          <h2 className={styles.title}>carrinho vazio</h2>
        )}
        <footer className={styles.orderFooter}>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <Button
            label="Finalizar Pedido"
            variant="secondary"
            className={styles.continueButton}
            onClick={handleWhatsAppOrder}
          />
        </footer>
      </div>
    </CartDrawer>
  );
}
