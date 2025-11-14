import CartDrawer from '../CartDrawer';
import { AddressCard, type AddressData } from '../../AddressCard/AddressCard';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { CartItem } from '../CartItem';
import { Button, Input } from '@components';
import styles from '../CartDrawer.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import type { Order } from '../../../types/order';
import { useCliente } from '../../../context/ClienteContext';
import { createOrder } from '../../../services/order/order';
import { validateCoupon } from '../../../services/coupon/coupon';
import type { Coupon } from '../../../types/coupon';

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
    clearCart,
  } = useCart();

  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total: number, item: { unitPrice: number; quantity: number }) =>
          total + item.unitPrice * item.quantity,
        0
      ),
    [items]
  );
  const discountPercentage = appliedCoupon
    ? Number(appliedCoupon.valorDesc) || 0
    : 0;
  const discountValue = useMemo(
    () => subtotal * (discountPercentage / 100),
    [subtotal, discountPercentage]
  );
  const finalTotal = useMemo(
    () => Math.max(subtotal - discountValue, 0),
    [subtotal, discountValue]
  );

  useEffect(() => {
    setCouponError('');
    if (
      appliedCoupon &&
      couponCode.trim().toLowerCase() !== appliedCoupon.codigo.toLowerCase()
    ) {
      setAppliedCoupon(null);
      setCouponMessage('');
    }
  }, [couponCode, appliedCoupon]);
  const isCouponApplied = Boolean(appliedCoupon);

  const formatAddress = (address: AddressData) => {
    const parts = [
      address.street && `RUA: ${address.street}`,
      address.number && `NÚMERO: ${address.number}`,
      address.complement && `COMPLEMENTO: ${address.complement}`,
      address.neighborhood && `BAIRRO: ${address.neighborhood}`,
      address.cep && `CEP: ${address.cep}`,
    ].filter(Boolean);

    return parts.join('\n');
  };

  const buildOrder = (): Order => {
    const formattedAddress =
      addressData !== null ? formatAddress(addressData) : null;

    const payloadItems = items.map((item) => ({
      produtoSku: item.id,
      quantidade: item.quantity,
      valorUnitario: item.unitPrice,
    }));

    return {
      clientId: cliente?.id || '',
      orderDate: new Date().toISOString(),
      totalPrice: finalTotal,
      orderStatus: 'PREPARANDO',
      items: payloadItems,
      cupomId: appliedCoupon?.id ?? null,
      couponCode: appliedCoupon?.codigo ?? (couponCode || null),
      address: formattedAddress,
      outOfStock: [],
    };
  };

  const whatslines = useMemo(
    () =>
      items
        .map(
          (item) =>
            `${item.quantity}x ${item.name} (Unidade: ${formatCurrency(item.unitPrice)})`
        )
        .join('\n'),
    [items]
  );

  const addressText = useMemo(
    () =>
      addressData
        ? `\n\nEndereço de entrega:\n${formatAddress(addressData)}`
        : '',
    [addressData]
  );

  const whatsMessage = useMemo(() => {
    const couponDetails = appliedCoupon
      ? `\n\nCUPOM: ${appliedCoupon.codigo}\nVALOR DO PEDIDO: ${formatCurrency(subtotal)}\nDESCONTO: ${formatCurrency(discountValue)}\nVALOR FINAL COM DESCONTO: ${formatCurrency(finalTotal)}`
      : '';
    const itemsSection = whatslines ? `\n${whatslines}` : ' carrinho vazio';
    const totalLine = appliedCoupon
      ? ''
      : `\n\nTotal: ${formatCurrency(finalTotal)}`;

    return `Pedidos:${itemsSection}${totalLine}${couponDetails}${addressText}`;
  }, [
    appliedCoupon,
    subtotal,
    discountValue,
    finalTotal,
    whatslines,
    addressText,
  ]);

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

      clearCart();
      setAddressData(null);
      setCouponCode('');
      setAppliedCoupon(null);
      setCouponMessage('');
      setCouponError('');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  const handleApplyCoupon = async () => {
    setIsValidatingCoupon(true);
    setCouponMessage('');
    setCouponError('');

    try {
      const coupon = await validateCoupon(couponCode);
      setAppliedCoupon(coupon);
      setCouponCode(coupon.codigo);
      const percentValue = Number(coupon.valorDesc) || 0;
      setCouponMessage(
        `Cupom ${coupon.codigo} aplicado! ${percentValue}% OFF.`
      );
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage('');
      setCouponError(
        error instanceof Error
          ? error.message
          : 'Não foi possível validar o cupom.'
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
    setCouponError('');
  };

  const couponButtonLabel = appliedCoupon ? 'Remover cupom' : 'Aplicar cupom';
  const couponButtonDisabled = appliedCoupon
    ? false
    : !couponCode.trim() || isValidatingCoupon;

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
              price={formatCurrency(item.unitPrice)}
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
          <div className={styles.couponSection}>
            <div className={styles.couponFieldWrapper}>
              <Input
                label="Cupom de desconto"
                placeholder="Ex: DOCE10"
                value={couponCode}
                onChange={(event) =>
                  setCouponCode(event.target.value.toUpperCase())
                }
                hasBorder
                aria-label="Cupom de desconto"
                maxLength={20}
                autoComplete="off"
                disabled={isValidatingCoupon}
              />
            </div>
            <Button
              type="button"
              label={isValidatingCoupon ? 'Validando...' : couponButtonLabel}
              variant={appliedCoupon ? 'outlined' : 'secondary'}
              className={styles.couponButton}
              onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
              disabled={couponButtonDisabled}
            />
          </div>
          <div className={styles.couponHelperRow}>
            <span className={styles.couponHelper}>
              {appliedCoupon
                ? 'Cupom aplicado! Você pode removê-lo para usar outro código.'
                : 'Tem cupom? Digite acima e clique em aplicar.'}
            </span>
          </div>
          <div
            className={styles.couponFeedback}
            aria-live="polite"
            role="status"
          >
            {couponMessage && !couponError && (
              <div
                className={`${styles.couponAlert} ${styles.couponAlertSuccess}`}
              >
                <AiOutlineCheckCircle aria-hidden="true" />
                <span>{couponMessage}</span>
              </div>
            )}
            {couponError && (
              <div
                className={`${styles.couponAlert} ${styles.couponAlertError}`}
              >
                <AiOutlineCloseCircle aria-hidden="true" />
                <span>{couponError}</span>
              </div>
            )}
          </div>

          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {isCouponApplied && (
            <div className={`${styles.totalRow} ${styles.discountRow}`}>
              <span>Desconto ({discountPercentage}%)</span>
              <span>-{formatCurrency(discountValue)}</span>
            </div>
          )}
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
          <Button
            label="Finalizar Pedido"
            variant="secondary"
            className={styles.continueButton}
            onClick={handleWhatsAppOrder}
            disabled={items.length === 0}
          />
        </footer>
      </div>
    </CartDrawer>
  );
}
