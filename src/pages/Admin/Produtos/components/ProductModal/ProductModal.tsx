import * as Dialog from '@radix-ui/react-dialog';
import styles from './ProductModal.module.scss';
import { Button, Input, Select } from '@components';

export type Option = { label: string; value: string };

export type ProductValues = {
  sku?: string;
  nome: string;
  descricao: string;
  valor: string;
  imagemUrl: string;
  ativo: string;
  categoriaId: string;
};

export interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  title?: string;
  isSubmitting?: boolean;

  values: ProductValues;
  errors?: Partial<Record<keyof ProductValues, string>>;
  onChange: (patch: Partial<ProductValues>) => void;

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
  onSubmit,
}: ProductModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {title ??
              (mode === 'create' ? 'Adicionar Produto' : 'Editar Produto')}
          </Dialog.Title>

          <form
            className={styles.grid}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Imagem */}
            <div className={styles.cellImage}>
              <label className={styles.fieldLabel}>Imagem</label>
              <label className={styles.imageDrop}>
                {values.imagemUrl ? (
                  <img
                    className={styles.imagePreview}
                    src={values.imagemUrl}
                    alt={values.nome || 'Prévia da imagem'}
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
                    onChange({ imagemUrl: preview });
                  }}
                />
              </label>
            </div>

            {/* Nome */}
            <div className={styles.cellNome}>
              <Input
                label="Nome"
                value={values.nome}
                onChange={(e) => onChange({ nome: e.target.value })}
                error={errors?.nome}
              />
            </div>

            {/* Preço */}
            <div className={styles.cellPreco}>
              <Input
                label="Preço"
                type="text"
                value={values.valor}
                onChange={(e) => onChange({ valor: e.target.value })}
                error={errors?.valor}
              />
            </div>

            {/* Categoria */}
            <div className={styles.cellCategoria}>
              <label className={styles.fieldLabel}>Categoria</label>
              <Select
                placeholder="Selecione a categoria"
                options={categoriaOptions}
                value={values.categoriaId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange({ categoriaId: e.target.value })
                }
              />
              {errors?.categoriaId && (
                <span className={styles.errorMsg}>{errors.categoriaId}</span>
              )}
            </div>

            {/* Status */}
            <div className={styles.cellStatus}>
              <label className={styles.fieldLabel}>Status</label>
              <Select
                placeholder="Selecione o status"
                options={[
                  { label: 'Ativo', value: 'true' },
                  { label: 'Inativo', value: 'false' },
                ]}
                value={values.ativo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange({ ativo: e.target.value })
                }
              />
            </div>

            {/* Descrição */}
            <div className={styles.cellDescricao}>
              <Input
                label="Descrição"
                value={values.descricao}
                onChange={(e) => onChange({ descricao: e.target.value })}
              />
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button label="Cancelar" variant="outlined" />
              </Dialog.Close>
              <Button
                label={mode === 'create' ? 'Criar' : 'Salvar'}
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
