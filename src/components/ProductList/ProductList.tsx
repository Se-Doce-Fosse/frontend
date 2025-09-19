import React from 'react';
import styles from './ProductList.module.scss';
import { ProductCard } from '../ProductCard';
import { ShowMoreButton } from '../ShowMoreButton/ShowMoreButton';

export type Product = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
};

export type ProductListProps = {
  title: string;
  products: Product[];
  showMore?: boolean;
  onShowMoreClick?: () => void;
};

export const ProductList: React.FC<ProductListProps> = ({
  title,
  products,
  showMore = false,
  onShowMoreClick,
}) => {
  return (
    <section className={styles.productListContainer}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {showMore && <ShowMoreButton onClick={onShowMoreClick} />}
      </div>
      <div className={styles.productsRow}>
        {products.map((product) => {
          // Extrai centavos do preço (ex: 'R$ 15,00' -> 1500)
          const priceCents = Number(product.price.replace(/[^\d]/g, ''));
          return (
            <ProductCard
              key={product.id}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              title={product.name}
              description={product.description || ''}
              priceCents={priceCents}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
