import * as Dialog from '@radix-ui/react-dialog';
import styles from './SuppliesModal.module.scss';
import { Button, Input, Select } from '@components';

export type Option = { label: string; value: string };

export type SuppliesValues = {
  nome: string;
  quantidade: string;
  preco: string;
  categoria: string;
  unidade: string;
};

export interface SuppliesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  isSubmitting?: boolean;
  values: SuppliesValues;
  onChange: (patch: Partial<SuppliesValues>) => void;
  categoriaOptions: Option[];
  unidadeOptions: Option[];
  onSubmit: () => void;
}

export function SuppliesModal({
  open,
  onOpenChange,
  title = 'Formulário',
  isSubmitting,
  values,
  onChange,
  categoriaOptions,
  unidadeOptions,
  onSubmit,
}: SuppliesModalProps) {
  const handleNome: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ nome: e.target.value });

  const handleQtd: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ quantidade: e.target.value });

  const handlePreco: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ preco: e.target.value });

  const handleCategoria: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange({ categoria: e.target.value });

  const handleUnidade: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange({ unidade: e.target.value });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>

          <form
            className={styles.formGrid}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className={styles.fieldNome}>
              <Input label="Nome" value={values.nome} onChange={handleNome} />
            </div>

            <div className={styles.fieldQtd}>
              <Input
                label="Quantidade"
                type="number"
                value={values.quantidade}
                onChange={handleQtd}
              />
            </div>

            <div className={styles.fieldPreco}>
              <Input
                label="Preço"
                type="number"
                value={values.preco}
                onChange={handlePreco}
              />
            </div>

            <div className={styles.fieldCategoria}>
              <label className={styles.label}>Categoria</label>
              <Select
                placeholder="Selecione a categoria"
                options={categoriaOptions}
                value={values.categoria}
                onChange={handleCategoria}
              />
            </div>

            <div className={styles.fieldUnidade}>
              <label className={styles.label}>Unidade de Medida</label>
              <Select
                placeholder="Selecione a unidade"
                options={unidadeOptions}
                value={values.unidade}
                onChange={handleUnidade}
              />
            </div>

            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button label="Cancelar" variant="outlined" />
              </Dialog.Close>
              <Button
                label="Continuar"
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
