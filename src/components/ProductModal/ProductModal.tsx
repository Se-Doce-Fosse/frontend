import * as Dialog from '@radix-ui/react-dialog';
import styles from './ProductModal.module.scss';
import { Button, Input, Select } from '@components';
import type { Product, CategoryDTO } from '../../types/product';

export type Option = { label: string; value: string };

export interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  title?: string;
  isSubmitting?: boolean;

  values: Partial<Product>;
  errors?: Partial<Record<keyof Product, string>>;
  onChange: (patch: Partial<Product>) => void;

  categoriaOptions: Option[];
  statusOptions: Option[];
  onSubmit: () => void;
}

export function ProductModal({
  open,
  onOpenChange,
  mode,
  title,
  isSubmitting,
  values,
  errors,
  onChange,
  categoriaOptions,
  statusOptions,
  onSubmit,
}: ProductModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {title ??
              (mode === 'create'
                ? 'Adicionar Produto'
                : mode === 'edit'
                  ? 'Editar Produto'
                  : 'Visualizar Produto')}
          </Dialog.Title>

          <form
            className={styles.grid}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className={styles.cellImage}>
              <label className={styles.fieldLabel}>Imagem</label>
              {mode === 'view' ? (
                values.imageSrc ? (
                  <img
                    className={styles.imagePreview}
                    src={values.imageSrc}
                    alt={values.name || 'Prévia da imagem'}
                  />
                ) : (
                  <span className={styles.imagePlaceholder}>Sem imagem</span>
                )
              ) : (
                <label className={styles.imageDrop}>
                  {values.imageSrc ? (
                    <img
                      className={styles.imagePreview}
                      src={values.imageSrc}
                      alt={values.name || 'Prévia da imagem'}
                    />
                  ) : (
                    <span className={styles.imagePlaceholder}>
                      Selecionar imagem
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const preview = URL.createObjectURL(f);
                      onChange({ imageSrc: preview });
                    }}
                  />
                </label>
              )}
            </div>

            {/* Nome */}
            <div className={styles.cellNome}>
              <Input
                label="Nome"
                value={values.name ?? ''}
                onChange={(e) => onChange({ name: e.target.value })}
                disabled={mode === 'view'}
                error={errors?.name}
              />
            </div>

            <div className={styles.cellPreco}>
              <Input
                label="Preço"
                type="text"
                value={values.price ?? ''}
                onChange={(e) => onChange({ price: e.target.value })}
                disabled={mode === 'view'}
                error={errors?.price}
              />
            </div>

            <div className={styles.cellCategoria}>
              <label className={styles.fieldLabel}>Categoria</label>
              {mode === 'view' ? (
                <Input
                  label=""
                  value={
                    values.category?.name ||
                    (values.category?.id
                      ? categoriaOptions.find(
                          (o) => o.value === String(values.category?.id)
                        )?.label || ''
                      : '')
                  }
                  disabled
                />
              ) : (
                <Select
                  placeholder="Selecione a categoria"
                  options={categoriaOptions}
                  value={values.category?.id ? String(values.category.id) : ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onChange({
                      category: {
                        id: Number(e.target.value),
                        name:
                          categoriaOptions.find(
                            (opt) => opt.value === e.target.value
                          )?.label || '',
                      } as unknown as CategoryDTO,
                    })
                  }
                />
              )}
              {errors?.category && (
                <span className={styles.errorMsg}>{errors.category}</span>
              )}
            </div>

            {/* Status */}
            <div className={styles.cellStatus}>
              <label className={styles.fieldLabel}>Status</label>
              {mode === 'view' ? (
                <Input
                  label=""
                  value={values.isActive ? 'Ativo' : 'Inativo'}
                  disabled
                />
              ) : (
                <Select
                  placeholder="Selecione o status"
                  options={statusOptions}
                  value={values.isActive ? 'true' : 'false'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onChange({ isActive: e.target.value === 'true' })
                  }
                />
              )}
            </div>

            <div className={styles.cellQuantidade}>
              <Input
                label="Quantidade"
                type="number"
                value={
                  values.quantity !== undefined ? String(values.quantity) : ''
                }
                onChange={(e) => onChange({ quantity: Number(e.target.value) })}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.cellDescricao}>
              <Input
                label="Descrição"
                value={values.description ?? ''}
                onChange={(e) => onChange({ description: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button
                  label={mode === 'view' ? 'Fechar' : 'Cancelar'}
                  variant="outlined"
                />
              </Dialog.Close>
              {mode !== 'view' && (
                <Button
                  label={mode === 'create' ? 'Criar' : 'Salvar'}
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                />
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
