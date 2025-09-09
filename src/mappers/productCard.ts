import type { ProductCardProps } from 'src/components/ProductCard/ProductCard';
import type { ApiProduct } from 'src/types/api';
import { parseBRLToCents } from 'src/utils/price';

export function mapApiProductToCard(p: ApiProduct): ProductCardProps {
  return {
    imageSrc: p.imageSrc,
    imageAlt: p.imageAlt || p.name,
    title: p.name,
    description: '',
    priceCents: parseBRLToCents(p.price),
  };
}
