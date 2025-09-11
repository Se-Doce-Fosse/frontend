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
  onAddToCart: (id: string) => void;
  className?: string;
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
}) => {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(0);

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
        {allergens?.map((allergen) => (
          <span>{allergen}</span>
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
            onQuantityChange={setQuantity}
          />
        </div>
      </div>
    </article>
  );
};
