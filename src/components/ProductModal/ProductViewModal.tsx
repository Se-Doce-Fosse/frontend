import { ProductModal, type ProductModalProps } from './ProductModal';

type OmitForView = 'mode' | 'statusOptions' | 'onSubmit' | 'isSubmitting';

export type ProductViewModalProps = Omit<ProductModalProps, OmitForView>;

export function ProductViewModal(props: ProductViewModalProps) {
  return (
    <ProductModal
      {...props}
      mode="view"
      statusOptions={[]}
      onSubmit={() => {}}
    />
  );
}
