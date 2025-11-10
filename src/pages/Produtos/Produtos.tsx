import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Produtos.module.scss';
import { NavBar, Footer } from '../../components';
import ProductList from '../../components/ProductList';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../services/product/productService';
import type { Category } from '../../types/api';

const Produtos = () => {
  const navigate = useNavigate();
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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

  const renderContent = () => {
    if (loading) {
      return <div>Carregando produtos...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (categories.length === 0) {
      return <div>Nenhum produto encontrado.</div>;
    }

    return categories.map((category) => (
      <ProductList
        key={category.id}
        title={category.name}
        products={category.products}
        onProductQuantityChange={updateProductQuantity}
        productQuantities={quantitiesByProductId}
        onProductClick={(product) => navigate(`/produtos/${product.id}`)}
      />
    ));
  };

  return (
    <div className={styles.page}>
      <NavBar onCartClick={() => setActiveDrawer('order')} />
      <main className={styles.content}>{renderContent()}</main>
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
