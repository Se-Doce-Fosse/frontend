import * as Dialog from '@radix-ui/react-dialog';
import styles from './SuppliesModal.module.scss';
import { Button, Input, Select } from '@components';

export interface SuppliesModalProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const uniMedida = [
  { label: 'Unidade', value: 'unidade' },
  { label: 'Gramas', value: 'gramas' },
];

const categoria = [
  { label: 'Insumo', value: 'insumo' },
  { label: 'Embalagem', value: 'embalagem' },
];

export const SuppliesModal = ({
  title,
  open,
  onOpenChange,
}: SuppliesModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description asChild>
            <form className={styles.formGrid}>
              {/* Linha 1 */}
              <div className={styles.fieldNome}>
                <Input label="Nome" />
              </div>

              <div className={styles.fieldQtd}>
                <Input label="Quantidade" />
              </div>

              <div className={styles.fieldPreco}>
                <Input label="Preço" />
              </div>

              {/* Linha 2 */}
              <div className={styles.fieldCategoria}>
                <label className={styles.label}>Categoria</label>
                <Select
                  placeholder="Selecione a categoria"
                  options={categoria}
                />
              </div>

              <div className={styles.fieldUnidade}>
                <label className={styles.label}>Unidade de Medida</label>
                <Select placeholder="Selecione a unidade" options={uniMedida} />
              </div>

              {/* Ações */}
              <div className={styles.footer}>
                <Dialog.Close asChild>
                  <Button label="Cancelar" variant="outlined" />
                </Dialog.Close>
                <Button label="Continuar" variant="primary" />
              </div>
            </form>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
