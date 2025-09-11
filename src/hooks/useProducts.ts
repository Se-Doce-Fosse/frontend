import { useEffect, useState } from 'react';
import type { ViewProduct } from '../types/products';
import { getProductsView } from '../services/product/product';

export function useProducts() {
  const [products, setProducts] = useState<ViewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const view = await getProductsView();
        setProducts(view);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Erro ao carregar produtos';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { products, loading, error };
}
