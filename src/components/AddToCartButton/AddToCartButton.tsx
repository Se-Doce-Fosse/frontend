import React, { useState, useEffect } from 'react';
import styles from './AddToCartButton.module.scss';
import { FiPlus as Plus, FiMinus as Minus } from 'react-icons/fi';

export type AddToCartButtonProps = {
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  quantity: initialQuantity = 0,
  onQuantityChange,
  className,
  ...props
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    onQuantityChange?.(quantity);
  }, [quantity, onQuantityChange]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  if (quantity === 0) {
    return (
      <button
        {...props}
        className={`${styles.addButton} ${className || ''}`}
        onClick={handleIncrement}
      >
        <Plus size={16} />
        <span className={styles.label}>Adicionar</span>
      </button>
    );
  }

  return (
    <div className={styles.counterWrapper}>
      <button
        {...props}
        className={styles.counterButton}
        onClick={handleDecrement}
        aria-label="Diminuir quantidade"
      >
        <Minus size={16} />
      </button>
      <span className={styles.counterValue}>{quantity}</span>
      <button
        {...props}
        className={styles.counterButton}
        onClick={handleIncrement}
        aria-label="Aumentar quantidade"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default AddToCartButton;
