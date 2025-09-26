import * as Dialog from '@radix-ui/react-dialog';
import styles from './DeleteModal.module.scss';
import { Button } from '../Button';

export interface DeleteModalProps {
  item: string;
  onClickConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteModal = ({ item, onClickConfirm, open, onOpenChange }: DeleteModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            Confirmar exclusão
          </Dialog.Title>
          <Dialog.Description className={styles.description}>
            Tem certeza que deseja excluir <strong>{item}</strong>?
          </Dialog.Description>

          <div className={styles.actions}>
            <Dialog.Close asChild>
              <Button label='Cancelar' variant='outlined' />
            </Dialog.Close>
            <Button label='Confirmar' onClick={() => { onClickConfirm(); onOpenChange(false); }} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}