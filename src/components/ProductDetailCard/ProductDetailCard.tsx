import styles from './ProductDetailCard.module.scss';
import { AddToCartButton, type AddToCartButtonProps } from '../AddToCartButton';
import React, { useState } from 'react';

export type ProductDetailCardProps = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  allergens?: string[];
  priceCents: number;
  onQuantityChange?: AddToCartButtonProps['onQuantityChange'];
  onAddToCart: () => void;
  className?: string;
  quantity?: number;
};
export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  id,
  name,
  description,
  imageSrc,
  imageAlt = '',
  allergens,
  priceCents,
  className,
  onQuantityChange,
  onAddToCart,
  quantity: externalQuantity,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [internalQuantity, setInternalQuantity] = useState(0);
  const isControlled = typeof externalQuantity === 'number';
  const quantity = isControlled ? externalQuantity : internalQuantity;

  const priceBRL = (priceCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return (
    <article
      className={`${styles.card} ${className || ''}`}
      aria-label={name}
      id={id}
    >
      <h3 className={styles.title} title={name} aria-label={name}>
        {name}
      </h3>

      <div className={styles.media}>
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
      </div>

      <div className={styles.allergens}>
        {(allergens ?? []).length > 0 &&
          allergens?.map((allergen) => (
            <span key={allergen} className={styles.tag}>
              {allergen}
            </span>
          ))}
      </div>

      {description && (
        <p
          className={`${styles.description} ${expanded ? styles.expanded : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          {description}
        </p>
      )}

      <div
        className={`${styles.footer} ${quantity > 0 ? styles.alignCounter : ''}`}
      >
        <strong className={styles.price}>{priceBRL}</strong>

        <div className={styles.addToCartWrapper}>
          <AddToCartButton
            className={styles.shoppingCart}
            quantity={quantity}
            onQuantityChange={(qty) => {
              if (!isControlled) {
                setInternalQuantity(qty);
              }
              if (typeof onQuantityChange === 'function') onQuantityChange(qty);
              if (qty === 1 && typeof onAddToCart === 'function') onAddToCart();
            }}
          />
        </div>
      </div>
    </article>
  );
};
