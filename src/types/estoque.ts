export type Estoque = {
  id: string;
  name: string;
  quantity: number;
  price: string;
  category: string;
  unitOfMeasure: string;
};

export type CreateEstoque = Omit<Estoque, 'id'>;
export type UpdateEstoque = Estoque;
