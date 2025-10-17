import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail.module.scss';
import { ProductDetailCard } from '../../components/ProductDetailCard';
import { ProductList } from '../../components/ProductList';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import {
  fetchProductById,
  fetchProducts,
} from '../../services/product/productService';
import type {
  ApiProduct,
  ProductDetail as ProductDetailType,
} from '../../types/api';

export const ProductDetail: React.FC = () => {
  const { produtoId } = useParams<{ produtoId: string }>();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setActiveDrawer, updateProductQuantity, quantitiesByProductId } =
    useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!produtoId) {
          setError('ID do produto não fornecido');
          return;
        }

        const productData = await fetchProductById(produtoId);
        setProduct(productData as ProductDetailType);

        if (
          productData.relatedProducts &&
          productData.relatedProducts.length > 0
        ) {
          const relatedProductsData = productData.relatedProducts;
          setRelatedProducts(relatedProductsData);
        } else {
          // Se não temos produtos relacionados, pegar a lista de produtos e usar os primeiros 4.
          const allProducts = await fetchProducts();
          const allProductsFlat = allProducts.categories.flatMap((category) =>
            category.products.map((product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              imageSrc: product.imageSrc,
              imageAlt: product.imageAlt,
            }))
          );

          console.log(allProductsFlat);
          const related = allProductsFlat.filter((p) => p.id !== produtoId);
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (err) {
        setError('Erro ao carregar produto');
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (produtoId) {
      fetchProductData();
    }
  }, [produtoId]);

  const handleAddToCart = () => {
    if (product) {
      const productForCart = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
      };
      updateProductQuantity(productForCart, 1);
    }
  };

  const handleQuantityChange = (quantity: number) => {
    if (product) {
      const productForCart = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
      };
      updateProductQuantity(productForCart, quantity);
    }
  };

  const handleShowMoreRelated = () => {
    console.log('Ver mais produtos relacionados');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.main}>
          <div className={styles.loading}>
            <p>Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Produto não encontrado</h2>
            <p>{error || 'O produto solicitado não existe.'}</p>
            <a href="/produtos" className={styles.backLink}>
              Voltar para produtos
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavBar onCartClick={() => setActiveDrawer('order')} />
      <main className={styles.main}>
        <section className={styles.productSection}>
          <ProductDetailCard
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            imageSrc={product.imageSrc}
            imageAlt={product.imageAlt}
            allergens={product.allergens || undefined}
            priceCents={Number(product.price.replace(/[^\d]/g, ''))}
            onAddToCart={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            quantity={quantitiesByProductId[product.id] || 0}
          />
        </section>

        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <ProductList
              title="Compre Também"
              products={relatedProducts}
              showMore={true}
              onShowMoreClick={handleShowMoreRelated}
              onProductQuantityChange={updateProductQuantity}
              productQuantities={quantitiesByProductId}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
