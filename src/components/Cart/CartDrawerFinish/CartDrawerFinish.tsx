import styles from '../CartDrawer.module.scss';
import CartDrawer from '../CartDrawer';

interface CartDrawerFinishProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawerFinish({
  open,
  onClose,
}: CartDrawerFinishProps) {
  return (
    <CartDrawer open={open} onClose={onClose}>
      <h2 className={styles.title}>carrinho vazio</h2>
    </CartDrawer>
  );
}
