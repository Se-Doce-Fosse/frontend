import { useState } from 'react';
import { AiOutlinePushpin } from 'react-icons/ai';
import styles from './AddressCard.module.scss';
import { Textarea as TextArea } from '../Textarea/Textarea';

export interface AddressData {
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
}

export interface AddressCardProps {
  onSubmit?: (data: AddressData) => void;
  initialData?: Partial<AddressData>;
}

export const AdressCard = ({ onSubmit, initialData }: AddressCardProps) => {
  const [formData, setFormData] = useState<AddressData>({
    cep: initialData?.cep || '',
    street: initialData?.street || '',
    neighborhood: initialData?.neighborhood || '',
    number: initialData?.number || '',
    complement: initialData?.complement || '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressData, string>>
  >({});

  const blockEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleChange =
    (field: keyof AddressData) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.replace(/\r?\n/g, '');
      setFormData((p) => ({ ...p, [field]: value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validate = () => {
    const e: Partial<Record<keyof AddressData, string>> = {};
    if (!formData.cep.trim()) e.cep = 'CEP é obrigatório';
    if (!formData.street.trim()) e.street = 'Nome da Rua é obrigatório';
    if (!formData.neighborhood.trim()) e.neighborhood = 'Bairro é obrigatório';
    if (!formData.number.trim()) e.number = 'Número do endereço é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate() && onSubmit) onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <AiOutlinePushpin className={styles.pin} aria-hidden="true" />
        <h2 className={styles.heading}>Endereço de entrega</h2>
      </div>

      <div className={styles.addressCard}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          data-testid="address-form"
        >
          <TextArea
            placeholder="CEP*"
            value={formData.cep}
            onChange={handleChange('cep')}
            onKeyDown={blockEnter}
            required
            hasBorder
            rows={1}
            inputMode="numeric"
            spellCheck={false}
            error={errors.cep}
          />

          <TextArea
            placeholder="Nome da Rua*"
            value={formData.street}
            onChange={handleChange('street')}
            onKeyDown={blockEnter}
            required
            hasBorder
            rows={1}
            spellCheck={false}
            error={errors.street}
          />

          <TextArea
            placeholder="Bairro*"
            value={formData.neighborhood}
            onChange={handleChange('neighborhood')}
            onKeyDown={blockEnter}
            required
            hasBorder
            rows={1}
            spellCheck={false}
            error={errors.neighborhood}
          />

          <div className={styles.inlineRow}>
            <TextArea
              placeholder="Nº do endereço*"
              value={formData.number}
              onChange={handleChange('number')}
              onKeyDown={blockEnter}
              required
              hasBorder
              rows={1}
              inputMode="numeric"
              spellCheck={false}
              error={errors.number}
            />
            <TextArea
              placeholder="Nº do apto/casa"
              value={formData.complement}
              onChange={handleChange('complement')}
              hasBorder
              rows={1}
              error={undefined}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
