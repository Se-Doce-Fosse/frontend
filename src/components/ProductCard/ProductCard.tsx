import React from 'react';
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
};

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  imageAlt = '',
  title,
  description,
  priceCents,
  onQuantityChange,
  className,
}) => {
  const priceBRL = (priceCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return (
    <article className={`${styles.card} ${className || ''}`} aria-label={title}>
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

          <AddToCartButton onQuantityChange={onQuantityChange} />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
