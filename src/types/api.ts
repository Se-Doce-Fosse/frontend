export type ApiProduct = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export interface CartItem {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
}

export interface CategoriesWithProducts {
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Product {
  allergens: string[] | null;
  id: string;
  imageAlt: string;
  imageSrc: string;
  name: string;
  price: string;
  relatedProducts: string[] | null;
}
