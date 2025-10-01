import { render, fireEvent, screen } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import type { Product } from '../components/ProductList';

describe('CartContext', () => {
  const baseProduct: Product = {
    id: 'test-product',
    name: 'Cookie Teste',
    price: 'R$10,00',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Teste',
    description: 'Cookie delicioso.',
  };

  const setup = () => {
    const TestComponent = () => {
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

      return (
        <>
          <button onClick={() => updateProductQuantity(baseProduct, 2)}>
            add
          </button>
          <button onClick={() => incrementItem(baseProduct.id)}>inc</button>
          <button onClick={() => decrementItem(baseProduct.id)}>dec</button>
          <button onClick={() => removeItem(baseProduct.id)}>remove</button>
          <button onClick={() => setActiveDrawer('finish')}>finish</button>
          <pre data-testid="items">{JSON.stringify(items)}</pre>
          <span data-testid="drawer">{activeDrawer ?? 'null'}</span>
          <span data-testid="quantity">
            {quantitiesByProductId[baseProduct.id] ?? 0}
          </span>
        </>
      );
    };

    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('adiciona produtos e persiste no localStorage', () => {
    setup();

    fireEvent.click(screen.getByText('add'));

    const items = JSON.parse(screen.getByTestId('items').textContent || '[]');
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: baseProduct.id,
      quantity: 2,
      name: baseProduct.name,
    });
    expect(screen.getByTestId('drawer').textContent).toBe('order');

    const stored = JSON.parse(
      window.localStorage.getItem('sedoce-cart-items') || '[]'
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].quantity).toBe(2);
  });

  it('controle de quantidade usando increment e decrement', () => {
    setup();
    fireEvent.click(screen.getByText('add'));

    fireEvent.click(screen.getByText('inc'));
    expect(screen.getByTestId('quantity').textContent).toBe('3');

    fireEvent.click(screen.getByText('dec'));
    expect(screen.getByTestId('quantity').textContent).toBe('2');

    fireEvent.click(screen.getByText('dec'));
    expect(screen.getByTestId('quantity').textContent).toBe('1');

    fireEvent.click(screen.getByText('dec'));
    expect(screen.getByTestId('quantity').textContent).toBe('0');
    const items = JSON.parse(screen.getByTestId('items').textContent || '[]');
    expect(items).toHaveLength(0);
  });

  it('permite remover e recuperar estado salvo', () => {
    window.localStorage.setItem(
      'sedoce-cart-items',
      JSON.stringify([
        {
          id: baseProduct.id,
          name: baseProduct.name,
          description: baseProduct.description,
          imageSrc: baseProduct.imageSrc,
          imageAlt: baseProduct.imageAlt,
          unitPrice: 10,
          quantity: 1,
        },
      ])
    );
    window.localStorage.setItem('sedoce-cart-drawer', 'finish');

    setup();

    expect(screen.getByTestId('drawer').textContent).toBe('finish');
    expect(screen.getByTestId('quantity').textContent).toBe('1');

    fireEvent.click(screen.getByText('remove'));
    expect(screen.getByTestId('quantity').textContent).toBe('0');
    expect(screen.getByTestId('drawer').textContent).toBe('finish');

    fireEvent.click(screen.getByRole('button', { name: 'finish' }));
    expect(screen.getByTestId('drawer').textContent).toBe('finish');
  });
});
