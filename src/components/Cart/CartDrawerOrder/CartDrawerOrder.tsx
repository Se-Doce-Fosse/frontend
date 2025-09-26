import styles from './CartDrawerOrder.module.scss';
import CartDrawer from '../CartDrawer';
import { FaShoppingCart } from 'react-icons/fa';
import { Button } from '../../Button';
import { CartItem } from '../CartItem';

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
      <div className={styles.cartHeader}>
        <CartItem
          id={'1'}
          name={'Cookie Oreo com Nutella'}
          price={'R$20,00'}
          imageSrc={'/images/cookie.png'}
          imageAlt={'Cookie Oreo com Nutella'}
          description="Delicioso cookie recheado com Nutella cremosa."
          quantity={3}
          onIncrement={(id) => console.log('Incrementando item:', id)}
          onDecrement={(id) => console.log('Decrementando item:', id)}
          onRemove={(id) => console.log('Removendo item:', id)}
        />
      </div>

      <div className={styles.cartFooter}>
        <Button
          className={styles.checkoutButton}
          label={'Continuar'}
          variant="secondary"
        ></Button>
      </div>
    </CartDrawer>
  );
}
