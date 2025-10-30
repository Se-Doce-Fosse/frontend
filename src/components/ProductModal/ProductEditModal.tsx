import { ProductModal, type ProductModalProps } from './ProductModal';

type Override = 'mode' | 'title';
export type ProductEditModalProps = Omit<ProductModalProps, Override> & {
  title?: string;
};

export function ProductEditModal({ title, ...rest }: ProductEditModalProps) {
  return (
    <ProductModal {...rest} mode="edit" title={title ?? 'Editar Produto'} />
  );
}
