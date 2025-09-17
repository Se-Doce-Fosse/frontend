import React from 'react';
import styles from './CartItem.module.scss';

export type CartItemProps = {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
};

export type CartItemListProps = {
  items: Omit<CartItemProps, 'onIncrement' | 'onDecrement' | 'onRemove'>[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
};

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  description = 'Lorem ipsum dolor sit amet. Eum amet culpa aut commodi accusamus vel culpa suscipit!',
  price,
  imageSrc,
  imageAlt,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const handleDecrement = () => {
    if (quantity <= 1) {
      onRemove(id);
    } else {
      onDecrement(id);
    }
  };
  return (
    <div className={styles.cartItem}>
      <img src={imageSrc} alt={imageAlt} className={styles.image} />

      <div className={styles.details}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.priceRow}>
          <p className={styles.price}>{price}</p>
          <div className={styles.quantityControls}>
            <button onClick={() => onIncrement(id)}>+</button>
            <span>{quantity}</span>
            <button onClick={handleDecrement}>-</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  return (
    <main className={styles.appContainer}>
      <div className={styles.cartContainer}>
        {items.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
          />
        ))}
      </div>
    </main>
  );
};

export const CartItemContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <main className={styles.appContainer}>{children}</main>;
};
