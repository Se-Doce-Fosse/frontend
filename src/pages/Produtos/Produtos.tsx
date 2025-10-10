import { useEffect, useState } from 'react';
import styles from './Produtos.module.scss';
import { NavBar, Footer } from '../../components';
import ProductList from '../../components/ProductList';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import { FEATURED_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../services/product/productService';
import type { Category } from 'src/types/api';
import { useNavigate } from 'react-router-dom';

const Produtos = () => {
  const {
    items,
    activeDrawer,
    setActiveDrawer,
    updateProductQuantity,
    incrementItem,
    decrementItem,
    removeItem,
    quantitiesByProductId,
  } = useCart();

  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    fetchProducts()
      .then((data) => {
        if (!isSubscribed) {
          return;
        }

        setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => {
        if (!isSubscribed) {
          return;
        }

        setError('Um erro ocorreu tente novamente mais tarde');
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleShowMoreClick = () => {
    navigate('/produtos');
  };

  const renderProductSections = () => {
    if (loading) {
      return <div>Carregando produtos...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (categories.length === 0) {
      return (
        <ProductList
          title="Produtos em Destaque"
          products={FEATURED_PRODUCTS}
          showMore
          onShowMoreClick={handleShowMoreClick}
          onProductQuantityChange={updateProductQuantity}
          productQuantities={quantitiesByProductId}
        />
      );
    }

    return categories.map((category) => (
      <ProductList
        key={category.id}
        title={category.name}
        products={category.products}
        showMore
        onShowMoreClick={handleShowMoreClick}
        onProductQuantityChange={updateProductQuantity}
        productQuantities={quantitiesByProductId}
      />
    ));
  };

  return (
    <div className={styles.page}>
      <NavBar onCartClick={() => setActiveDrawer('order')} />
      <main className={styles.content}>
        <div className={styles.contentContainer}>{renderProductSections()}</div>
      </main>
      <CartDrawerOrder
        open={activeDrawer === 'order'}
        onClose={() => setActiveDrawer(null)}
        onContinue={() => setActiveDrawer('finish')}
        items={items}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
      />
      <CartDrawerFinish
        open={activeDrawer === 'finish'}
        onClose={() => setActiveDrawer(null)}
      />
      <Footer />
    </div>
  );
};

export default Produtos;
