import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import { NavBar, Footer, CupomBanner } from '../../components';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import ProductList from '../../components/ProductList';
import { FEATURED_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../services/product/productService';
import type { Category } from '../../types/api';

const Home = () => {
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

  const handleProductClick = (product: { id: string }) => {
    navigate(`/produtos/${product.id}`);
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
          onProductClick={handleProductClick}
        />
      );
    }

    // Mostrar apenas uma categoria na home
    const firstCategory = categories[0];
    if (!firstCategory) {
      return (
        <ProductList
          title="Produtos em Destaque"
          products={FEATURED_PRODUCTS}
          showMore
          onShowMoreClick={handleShowMoreClick}
          onProductQuantityChange={updateProductQuantity}
          productQuantities={quantitiesByProductId}
          onProductClick={handleProductClick}
        />
      );
    }

    return (
      <ProductList
        key={firstCategory.id}
        title={firstCategory.name}
        products={firstCategory.products}
        showMore
        onShowMoreClick={handleShowMoreClick}
        onProductQuantityChange={updateProductQuantity}
        productQuantities={quantitiesByProductId}
        onProductClick={handleProductClick}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <NavBar onCartClick={() => setActiveDrawer('order')} />
        <CupomBanner />
        <img
          src={bannerDesktop}
          alt="Banner promocional da loja Se Doce Fosse"
          className={styles.bannerDesktop || ''}
        />

        <img
          src={bannerMobile}
          alt="Banner promocional da loja Se Doce Fosse"
          className={styles.bannerMobile || ''}
        />
      </div>

      <div className={styles.contentContainer}>{renderProductSections()}</div>

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

export default Home;
