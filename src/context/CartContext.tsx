import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartDrawerOrderItem } from '../components/Cart/CartDrawerOrder/CartDrawerOrder';
import type { Product } from '../components/ProductList';

export type CartDrawerType = 'order' | 'finish' | null;

export interface CartContextValue {
  items: CartDrawerOrderItem[];
  activeDrawer: CartDrawerType;
  setActiveDrawer: (drawer: CartDrawerType) => void;
  updateProductQuantity: (product: Product, quantity: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  quantitiesByProductId: Record<string, number>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_ITEMS_STORAGE_KEY = 'sedoce-cart-items';
const CART_DRAWER_STORAGE_KEY = 'sedoce-cart-drawer';

const parsePriceToNumber = (price: string) =>
  Number(price.replace(/[^\d,]/g, '').replace(',', '.'));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartDrawerOrderItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(CART_ITEMS_STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored) as CartDrawerOrderItem[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse stored cart items', error);
    }

    return [];
  });
  const [activeDrawer, setActiveDrawerState] = useState<CartDrawerType>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = window.localStorage.getItem(CART_DRAWER_STORAGE_KEY);
      if (!stored) {
        return null;
      }

      if (stored === 'order' || stored === 'finish') {
        return stored;
      }
    } catch (error) {
      console.error('Failed to parse stored drawer state', error);
    }

    return null;
  });

  const setActiveDrawer = useCallback((drawer: CartDrawerType) => {
    setActiveDrawerState(drawer);
    if (typeof window !== 'undefined') {
      if (drawer) {
        window.localStorage.setItem(CART_DRAWER_STORAGE_KEY, drawer);
      } else {
        window.localStorage.removeItem(CART_DRAWER_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_ITEMS_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error('Failed to persist cart items', error);
    }
  }, [items]);

  const updateProductQuantity = useCallback(
    (product: Product, quantity: number) => {
      setItems((prevItems) => {
        if (quantity <= 0) {
          return prevItems.filter((item) => item.id !== product.id);
        }

        const unitPrice = parsePriceToNumber(product.price);
        const existingItem = prevItems.find((item) => item.id === product.id);

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity,
                  unitPrice,
                  name: product.name,
                  description: product.description,
                  imageSrc: product.imageSrc,
                  imageAlt: product.imageAlt || product.name,
                }
              : item
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
    },
    [setActiveDrawer]
  );

  const incrementItem = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementItem = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const quantitiesByProductId = useMemo(
    () =>
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {}),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      activeDrawer,
      setActiveDrawer,
      updateProductQuantity,
      incrementItem,
      decrementItem,
      removeItem,
      quantitiesByProductId,
    }),
    [
      items,
      activeDrawer,
      setActiveDrawer,
      updateProductQuantity,
      incrementItem,
      decrementItem,
      removeItem,
      quantitiesByProductId,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
