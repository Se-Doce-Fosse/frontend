import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import { NavBar, Footer } from '../../components';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import ProductList from '../../components/ProductList';
import { FEATURED_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';

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

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <NavBar onCartClick={() => setActiveDrawer('order')} />
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

      <ProductList
        title="Produtos em Destaque"
        products={FEATURED_PRODUCTS}
        showMore
        onShowMoreClick={() => navigate('/produtos')}
        onProductQuantityChange={updateProductQuantity}
        productQuantities={quantitiesByProductId}
      />
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
