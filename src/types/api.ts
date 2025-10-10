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
  description: string;
  relatedProducts: Product[] | null;
}

export interface ProductDetail extends Product {
  description: string;
}

// Tipo que corresponde ao retorno da API /products/:id
export interface ApiProductDetail {
  sku: string;
  nome: string;
  descricao: string;
  valor: number;
  imagemUrl: string;
  ativo: boolean;
  categoriaNome: string;
}