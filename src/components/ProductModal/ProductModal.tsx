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

interface SelectedSupply {
  id: string;
  quantity: number;
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
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [selectedSupplies, setSelectedSupplies] = useState<SelectedSupply[]>([
    { id: '', quantity: 1 },
  ]);
  const { user } = useUser();

  useEffect(() => {
    const fetchSupplies = async () => {
      if (!user?.token) return;
      const response = await getSupplies(user.token);
      setSupplies(response);
    };
    fetchSupplies();
  }, [user?.token]);

  useEffect(() => {
    const suppliesData = selectedSupplies
      .filter((s) => s.id !== '')
      .map((s) => ({
        id: Number(s.id),
        quantity: s.quantity,
        name: '',
      }));

    onChange({ supplies: suppliesData });
  }, [onChange, selectedSupplies]);

  const handleSupplyChange = (index: number, value: string) => {
    const updated = [...selectedSupplies];
    updated[index].id = value;
    setSelectedSupplies(updated);
    if (index === selectedSupplies.length - 1 && value !== '') {
      setSelectedSupplies([...updated, { id: '', quantity: 1 }]);
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...selectedSupplies];
    updated[index].quantity = value;
    setSelectedSupplies(updated);
  };

  const handleRemoveSupply = (index: number) => {
    if (index === 0) {
      setSelectedSupplies([{ id: '', quantity: 1 }]);
    } else {
      const updated = selectedSupplies.filter((_, i) => i !== index);
      setSelectedSupplies(updated.length ? updated : [{ id: '', quantity: 1 }]);
    }
  };

  const supplyOptions = supplies.map((s) => ({
    label: s.name,
    value: String(s.id),
  }));

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
            {/* Campos padrão */}
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

            {/* 🔥 SUPPLIES */}
            <div className={styles.cellSupplies}>
              <label className={styles.fieldLabel}>Ingredientes</label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {selectedSupplies.map((supply, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                    }}
                  >
                    <Select
                      placeholder="Selecione um ingrediente"
                      options={supplyOptions}
                      value={supply.id}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSupplyChange(index, e.target.value)
                      }
                      disabled={disabled}
                      style={{ flex: '1', minWidth: '250px' }}
                    />
                    <Input
                      type="number"
                      value={String(supply.quantity)}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      disabled={disabled}
                      placeholder="Quantidade"
                      style={{ width: '8rem' }}
                    />
                    <Button
                      label={index === 0 ? 'Remover todos' : 'Remover'}
                      variant="secondary"
                      type="button"
                      onClick={() => handleRemoveSupply(index)}
                      style={{ width: '16rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé */}
            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button label="Fechar" variant="outlined" />
              </Dialog.Close>
              {mode !== 'view' && (
                <Button
                  label={mode === 'create' ? 'Criar' : 'Editar'}
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
