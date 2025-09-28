import { useMemo, useState } from 'react';
import styles from './Home.module.scss';
import { NavBar, Footer } from '../../components';
import CartDrawerOrder, {
  type CartDrawerOrderItem,
} from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import ProductList, { type Product } from '../../components/ProductList';

const FEATURED_PRODUCTS: Product[] = [
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
];

const parsePrice = (price: string) =>
  Number(price.replace(/[^\d,]/g, '').replace(',', '.'));

const Home = () => {
  const [activeDrawer, setActiveDrawer] = useState<'order' | 'finish' | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartDrawerOrderItem[]>([]);

  const cartQuantities = useMemo(
    () =>
      cartItems.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {}),
    [cartItems]
  );

  const handleProductQuantityChange = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== product.id);
      }

      const unitPrice = parsePrice(product.price);
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity, unitPrice } : item
        );
      }

      const nextItem: CartDrawerOrderItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt || product.name,
        unitPrice,
        quantity,
      };

      return [...prevItems, nextItem];
    });

    if (quantity > 0) {
      setActiveDrawer('order');
    }
  };

  const handleIncrementItem = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrementItem = (id: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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
        showMore={true}
        onShowMoreClick={() => {
          console.log('Mostrar mais produtos');
        }}
        onProductQuantityChange={handleProductQuantityChange}
        productQuantities={cartQuantities}
      />
      <CartDrawerOrder
        open={activeDrawer === 'order'}
        onClose={() => setActiveDrawer(null)}
        onContinue={() => setActiveDrawer('finish')}
        items={cartItems}
        onIncrement={handleIncrementItem}
        onDecrement={handleDecrementItem}
        onRemove={handleRemoveItem}
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
