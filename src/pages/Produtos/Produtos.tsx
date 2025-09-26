import styles from './Produtos.module.scss';
import { NavBar, Footer } from '../../components';
import { useState } from 'react';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
//import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import ProductList from '../../components/ProductList';

const Produtos = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  return (
    <div>
      <div className={styles.top}>
        <NavBar onCartClick={() => setIsDrawerOpened(true)} />
      </div>
      <div className={styles.container}>
        <ProductList
          title="Cookies Tradicionais"
          products={[
            {
              id: '1',
              name: 'Cookie Oreo com Nutella',
              price: 'R$20,00',
              imageSrc: '/images/cookie.png',
              imageAlt: 'Cookie Oreo com Nutella',
              description: 'Delicioso cookie recheado com Nutella cremosa.',
            },
            {
              id: '2',
              name: 'Cookie Oreo com Nutella',
              price: 'R$20,00',
              imageSrc: '/images/cookie.png',
              imageAlt: 'Cookie Oreo com Nutella',
              description: 'Delicioso cookie recheado com Nutella cremosa.',
            },
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
        />
        <ProductList
          title="Cookies Recheados"
          products={[
            {
              id: '1',
              name: 'Cookie Oreo com Nutella',
              price: 'R$20,00',
              imageSrc: '/images/cookie.png',
              imageAlt: 'Cookie Oreo com Nutella',
              description: 'Delicioso cookie recheado com Nutella cremosa.',
            },
            {
              id: '2',
              name: 'Cookie Oreo com Nutella',
              price: 'R$20,00',
              imageSrc: '/images/cookie.png',
              imageAlt: 'Cookie Oreo com Nutella',
              description: 'Delicioso cookie recheado com Nutella cremosa.',
            },
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
        />
      </div>
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

export default Produtos;
