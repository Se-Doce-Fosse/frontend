import React, { useState } from 'react';
import styles from './ProductCard.module.scss';
import { AddToCartButton, type AddToCartButtonProps } from '../AddToCartButton';

export type ProductCardProps = {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  priceCents: number;
  onQuantityChange?: AddToCartButtonProps['onQuantityChange'];
  className?: string;
  quantity?: number;
  onClick?: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  imageAlt = '',
  title,
  description,
  priceCents,
  onQuantityChange,
  className,
  quantity,
  onClick,
}) => {
  const [internalQuantity, setInternalQuantity] = useState(0);
  const isControlled = typeof quantity === 'number';
  const currentQuantity = isControlled ? quantity : internalQuantity;
  const priceBRL = (priceCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  const handleQuantityChange = (qty: number) => {
    if (!isControlled) {
      setInternalQuantity(qty);
    }
    onQuantityChange?.(qty);
  };

  return (
    <article
      className={`${styles.card} ${className || ''}`}
      aria-label={title}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.media}>
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title} title={title} aria-label={title}>
          {title}
        </h3>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}

        <div className={styles.footer}>
          <strong className={styles.price}>{priceBRL}</strong>

          <div onClick={(e) => e.stopPropagation()}>
            <AddToCartButton
              quantity={currentQuantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
