export type ProdutoPT = {
  sku: string | number;
  nome: string;
  descricao?: string;
  valor: number;
  imagemUrl?: string;
  ativo?: boolean;
  categoriaNome?: string;
};

export type DetailProductPT = {
  sku: string | number;
  nome?: string;
  descricao?: string;
  valor?: number;
  imagemUrl?: string;
};

export type ProductsCategoriasPT = {
  id: string | number;
  nome: string;
  produtos: ProdutoPT[];
};

export type ProductsResponsePT =
  | ProdutoPT[]
  | { categorias: ProductsCategoriasPT[] };

export type ListProductEN = {
  id: string | number;
  name: string;
  price: string | number;
  imageSrc?: string;
  imageAlt?: string;
  description?: string;
};

export type CategoryEN = {
  id: string | number;
  name: string;
  products: ListProductEN[];
};

export type ProductsResponseEN = {
  categories: CategoryEN[];
};

// View model para a UI
export type ViewProduct = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  priceCents: number;
  description: string;
};
