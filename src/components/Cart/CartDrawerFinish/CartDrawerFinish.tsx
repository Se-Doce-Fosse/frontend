import CartDrawer from '../CartDrawer';
import { AddressCard, type AddressData } from '../../AddressCard/AddressCard';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CartItem } from '../CartItem';
import { Button } from '@components';
import styles from '../CartDrawer.module.scss';
import { useMemo, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import type { Order } from '../../../types/order';
import { useCliente } from '../../../context/ClienteContext';
import { createOrder } from '../../../services/order/order';

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
  const { cliente } = useCliente();
  const {
    items,
    incrementItem,
    decrementItem,
    removeItem,
    quantitiesByProductId,
  } = useCart();

  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total: number, item: { unitPrice: number; quantity: number }) =>
          total + item.unitPrice * item.quantity,
        0
      ),
    [items]
  );

  const formatAddress = (address: AddressData) => {
    const parts = [
      address.street,
      address.number,
      address.complement && `(${address.complement})`,
      address.neighborhood,
      `CEP: ${address.cep}`,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const buildOrder = (): Order => {
    console.log('Cliente no buildOrder:', cliente);
    return {
      clientId: cliente?.id || '',
      orderDate: new Date().toISOString(),
      totalPrice: totalAmount,
      orderStatus: 'PREPARANDO',
      products: items.map((item) => item.id),
      cupomId: 0,
      outOfStock: [],
    };
  };

  const whatslines = items.map(
    (item) =>
      ` ${item.quantity} ${item.name} Unidade: ${formatCurrency(item.unitPrice)}`
  );

  const addressText = addressData
    ? `\n\nEndereço de entrega:\n${formatAddress(addressData)}`
    : '';
  const whatsMessage = `Pedidos: ${whatslines} Total: ${formatCurrency(totalAmount)}${addressText}`;
  const number = `5551994527855`;

  const handleAddressSubmit = (data: AddressData) => {
    setAddressData(data);
  };

  const handleWhatsAppOrder = async () => {
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

    try {
      const order = buildOrder();
      const response = await createOrder(order);
      console.log('Resposta do servidor:', response);
      console.log('Pedido criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  return (
    <CartDrawer open={open} onClose={onClose} withHeader={false}>
      <div className={styles.finishOrderContent}>
        <AddressCard onSubmit={handleAddressSubmit} />

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
