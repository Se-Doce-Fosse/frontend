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
