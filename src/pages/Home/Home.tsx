import styles from './Home.module.scss';
import { NavBar, Footer } from '../../components';
import { useState, useEffect } from 'react';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
//import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import ProductList from '../../components/ProductList';
import { fetchProducts } from '../../services/product/productService';
import type { Category } from '../../types/api';

const Home = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(true);
  const [data, setData] = useState<Category[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setData(data.categories);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar produtos');
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <NavBar onCartClick={() => setIsDrawerOpened(true)} />
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

      {loading ? (
        <div>Carregando produtos...</div>
      ) : error ? (
        <div>error</div>
      ) : (
        data &&
        data.map((category) => (
          <ProductList
            key={category.id}
            title={category.name}
            products={category.products}
            showMore={true}
            onShowMoreClick={() => {
              console.log('Mostrar mais produtos');
            }}
          />
        ))
      )}
      <CartDrawerOrder
        open={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      />
      {/*  <CartDrawerFinish
                open={isDrawerOpened}
                onClose={() => setIsDrawerOpened(false)}
              /> */}
      <Footer />
    </div>
  );
};

export default Home;
