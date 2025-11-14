export interface Product {
  sku: string;
  name: string;
  price: string;
  imageSrc: string;
  description: string;
  isActive: boolean;
  quantity: number;
  category: CategoryDTO;
  allergens: string[];
  relatedProducts: RelatedProductDTO[];
}

export interface CategoryDTO {
  id?: number;
  name: string;
  description?: string;
}

export interface RelatedProductDTO {
  sku: string;
  name: string;
  imageSrc?: string;
  price?: string;
}
