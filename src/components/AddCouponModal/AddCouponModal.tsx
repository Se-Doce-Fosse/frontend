import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import styles from './AddCouponModal.module.scss';

export type CouponFormValues = {
  name: string;
  discount: number;
  validity: string;
  status: string;
  unique: boolean;
};

export interface AddCouponModalProps {
  onClose: () => void;
  onAdd: (data: CouponFormValues) => Promise<void> | void;
  submitting?: boolean;
  initialValues?: CouponFormValues;
  title?: string;
  submitLabel?: string;
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({
  onClose,
  onAdd,
  submitting = false,
  initialValues,
  title,
  submitLabel,
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [discount, setDiscount] = useState<number | ''>(
    initialValues?.discount ?? ''
  );
  const [validity, setValidity] = useState(initialValues?.validity ?? '');
  const [status, setStatus] = useState(initialValues?.status ?? '');
  const [unique, setUnique] = useState<boolean | null>(
    typeof initialValues?.unique === 'boolean' ? initialValues?.unique : null
  );

  const isFormValid =
    Boolean(name.trim()) &&
    discount !== '' &&
    Number(discount) > 0 &&
    Boolean(validity) &&
    Boolean(status) &&
    unique !== null;

  const handleAdd = async () => {
    if (!isFormValid || submitting) return;

    try {
      await onAdd({
        name: name.trim(),
        discount: Number(discount),
        validity,
        status,
        unique,
      });
      onClose();
    } catch (error) {
      console.error('Falha ao adicionar cupom:', error);
    }
  };

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modal}>
          <Dialog.Title className={styles.title}>
            {title ?? 'Adicionar Cupom'}
          </Dialog.Title>

          <div className={styles.form}>
            <div className={styles.fieldGroup}>
              <Input
                label="Nome do Cupom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Input
                label="Desconto (%)"
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <Input
                label="Validade"
                type="date"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Status</label>
              <Select
                options={[
                  { label: 'Ativo', value: 'ativo' },
                  { label: 'Inativo', value: 'inativo' },
                ]}
                placeholder="Selecione o status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div className={styles.radioGroup}>
              <p>Único</p>
              <div className={styles.radioOptions}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unique"
                    value="true"
                    checked={unique === true}
                    onChange={() => setUnique(true)}
                  />
                  Sim
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unique"
                    value="false"
                    checked={unique === false}
                    onChange={() => setUnique(false)}
                  />
                  Não
                </label>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <Dialog.Close asChild>
                <Button
                  label="Cancelar"
                  variant="secondary"
                  className={styles.cancelButton}
                  disabled={submitting}
                />
              </Dialog.Close>

              <Button
                label={
                  submitting ? 'Salvando...' : (submitLabel ?? 'Adicionar')
                }
                onClick={handleAdd}
                className={styles.addButton}
                disabled={!isFormValid || submitting}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddCouponModal;
