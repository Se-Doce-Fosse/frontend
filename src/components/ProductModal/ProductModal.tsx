import * as Dialog from '@radix-ui/react-dialog';
import styles from './ProductModal.module.scss';
import { Button, Input, Select } from '@components';
import type { Product, CategoryDTO } from '../../types/product';
import { useEffect, useState } from 'react';
import type { Supply } from '../../types/supply';
import { getSupplies } from '../../services/admin-supplies/admin-supplies';
import { useUser } from '../../context/UserContext';

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
  disabled?: boolean;
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
  disabled,
}: ProductModalProps) {
  const [, setSupplies] = useState<Supply[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchSupplies = async () => {
      if (!user?.token) return;
      const token = user.token;
      const response = await getSupplies(token);
      setSupplies(response);
    };
    fetchSupplies();
  }, [user?.token]);

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
                  : 'Detalhes do Produto')}
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
                {!disabled && (
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
                )}
              </label>
            </div>
            <div className={styles.cellNome}>
              <Input
                label="Nome"
                value={values.name ?? ''}
                onChange={(e) => onChange({ name: e.target.value })}
                error={errors?.name}
                disabled={disabled}
              />
            </div>
            <div className={styles.cellPreco}>
              <Input
                label="Preço"
                type="text"
                value={values.price ?? ''}
                onChange={(e) => onChange({ price: e.target.value })}
                error={errors?.price}
                disabled={disabled}
              />
            </div>
            <div className={styles.cellCategoria}>
              <label className={styles.fieldLabel}>Categoria</label>
              <Select
                placeholder="Selecione a categoria"
                options={categoriaOptions}
                value={values.category?.id ? String(values.category.id) : ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange({
                    category: {
                      id: e.target.value,
                      name:
                        categoriaOptions.find(
                          (opt) => opt.value === e.target.value
                        )?.label || '',
                    } as unknown as CategoryDTO,
                  })
                }
                disabled={disabled}
              />
              {errors?.category && (
                <span className={styles.errorMsg}>{errors.category}</span>
              )}
            </div>
            <div className={styles.cellStatus}>
              <label className={styles.fieldLabel}>Status</label>
              <Select
                placeholder="Selecione o status"
                options={statusOptions}
                value={values.isActive ? 'true' : 'false'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange({ isActive: e.target.value === 'true' })
                }
                disabled={disabled}
              />
            </div>
            <div className={styles.cellQuantidade}>
              <Input
                label="Quantidade"
                type="number"
                value={
                  values.quantity !== undefined ? String(values.quantity) : ''
                }
                onChange={(e) => onChange({ quantity: Number(e.target.value) })}
                disabled={disabled}
              />
            </div>
            <div className={styles.cellDescricao}>
              <Input
                label="Descrição"
                value={values.description ?? ''}
                onChange={(e) => onChange({ description: e.target.value })}
                disabled={disabled}
              />
            </div>
            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button label="Fechar" variant="outlined" />
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
