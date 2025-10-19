import React, { useState } from 'react';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import styles from './AddCouponModal.module.scss';

export interface AddCouponModalProps {
  onClose: () => void;
  onAdd: (data: {
    name: string;
    discount: number;
    validity: string;
    status: string;
    unique: boolean;
  }) => void;
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [validity, setValidity] = useState('');
  const [status, setStatus] = useState('');
  const [unique, setUnique] = useState<boolean | null>(null);

  const handleAdd = () => {
    if (!name || discount === '' || !validity || !status || unique === null)
      return;
    onAdd({
      name,
      discount: Number(discount),
      validity,
      status,
      unique,
    });
    onClose();
  };

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>Adicionar Cupom</h2>

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
              setDiscount(e.target.value === '' ? '' : Number(e.target.value))
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
          <Button
            label="Cancelar"
            onClick={onClose}
            variant="secondary"
            className={styles.cancelButton}
          />
          <Button
            label="Adicionar"
            onClick={handleAdd}
            className={styles.addButton}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCouponModal;
