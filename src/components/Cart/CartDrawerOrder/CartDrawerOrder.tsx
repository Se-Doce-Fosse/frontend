import styles from '../CartDrawer.module.scss';
import CartDrawer from '../CartDrawer';
import { FaShoppingCart } from 'react-icons/fa';

interface CartDrawerOrderProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawerOrder({
  open,
  onClose,
}: CartDrawerOrderProps) {
  return (
    <CartDrawer
      open={open}
      onClose={onClose}
      title="Meu carrinho"
      icon={<FaShoppingCart className={styles.cartIcon} />}
    >
      <h2 className={styles.title}>carrinho vazio</h2>
    </CartDrawer>
  );
}
