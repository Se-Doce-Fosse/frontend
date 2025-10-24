export type CategoryDTO = {
  id?: number;
  name: string;
  description?: string;
};

export type RelatedProductDTO = {
  sku: string;
  name: string;
  imageSrc?: string;
  price?: string;
};

export type Product = {
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
};
