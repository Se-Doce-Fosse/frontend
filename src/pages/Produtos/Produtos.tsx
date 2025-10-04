import { useEffect } from 'react';
import styles from './Produtos.module.scss';
import { NavBar, Footer } from '../../components';
import ProductList from '../../components/ProductList';
import CartDrawerOrder from '../../components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from '../../components/Cart/CartDrawerFinish/CartDrawerFinish';
import { TRADITIONAL_PRODUCTS, STUFFED_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';

const productSections = [
  {
    title: 'Cookies Tradicionais',
    products: TRADITIONAL_PRODUCTS,
  },
  {
    title: 'Cookies Recheados',
    products: STUFFED_PRODUCTS,
  },
];

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.page}>
      <NavBar onCartClick={() => setActiveDrawer('order')} />
      <main className={styles.content}>
        {productSections.map((section) => (
          <ProductList
            key={section.title}
            title={section.title}
            products={section.products}
            onProductQuantityChange={updateProductQuantity}
            productQuantities={quantitiesByProductId}
          />
        ))}
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
