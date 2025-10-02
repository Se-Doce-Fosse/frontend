import {
  FEATURED_PRODUCTS,
  TRADITIONAL_PRODUCTS,
  STUFFED_PRODUCTS,
} from './products';

describe('products catalog data', () => {
  const ensureUniqueIds = (products: { id: string }[]) => {
    const ids = products.map((product) => product.id);
    return new Set(ids).size === ids.length;
  };

  it('possui produtos em destaque com ids únicos', () => {
    expect(FEATURED_PRODUCTS.length).toBeGreaterThan(0);
    expect(ensureUniqueIds(FEATURED_PRODUCTS)).toBe(true);
  });

  it('possui produtos tradicionais com ids únicos', () => {
    expect(TRADITIONAL_PRODUCTS.length).toBeGreaterThan(0);
    expect(ensureUniqueIds(TRADITIONAL_PRODUCTS)).toBe(true);
  });

  it('possui produtos recheados com ids únicos', () => {
    expect(STUFFED_PRODUCTS.length).toBeGreaterThan(0);
    expect(ensureUniqueIds(STUFFED_PRODUCTS)).toBe(true);
  });
});
