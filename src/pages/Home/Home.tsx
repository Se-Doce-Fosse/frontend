import styles from './Home.module.scss';
import { NavBar, Footer } from '../../components';
import { useState } from 'react';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
//import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import ProductList from '../../components/ProductList';

const Home = () => {
  const [drawerClose, setDrawerClose] = useState(true);
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <NavBar />
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
        products={[
          {
            id: '3',
            name: 'Cookie Oreo com Nutella',
            price: 'R$20,00',
            imageSrc: '/images/cookie.png',
            imageAlt: 'Cookie Oreo com Nutella',
            description: 'Delicioso cookie recheado com Nutella cremosa.',
          },
          {
            id: '4',
            name: 'Cookie Oreo com Nutella',
            price: 'R$20,00',
            imageSrc: '/images/cookie.png',
            imageAlt: 'Cookie Oreo com Nutella',
            description: 'Delicioso cookie recheado com Nutella cremosa.',
          },
          {
            id: '5',
            name: 'Cookie Oreo com Nutella',
            price: 'R$20,00',
            imageSrc: '/images/cookie.png',
            imageAlt: 'Cookie Oreo com Nutella',
            description: 'Delicioso cookie recheado com Nutella cremosa.',
          },
          {
            id: '6',
            name: 'Cookie Oreo com Nutella',
            price: 'R$20,00',
            imageSrc: '/images/cookie.png',
            imageAlt: 'Cookie Oreo com Nutella',
            description: 'Delicioso cookie recheado com Nutella cremosa.',
          },
        ]}
        showMore={true}
        onShowMoreClick={() => {
          console.log('Mostrar mais produtos');
        }}
      />
      <CartDrawerOrder
        open={drawerClose}
        onClose={() => setDrawerClose(false)}
      />
      {/*  <CartDrawerFinish
                open={drawerClose}
                onClose={() => setDrawerClose(false)}
              /> */}
      <Footer />
    </div>
  );
};

export default Home;
