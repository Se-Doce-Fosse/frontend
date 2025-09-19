import { useId } from 'react';
import styles from './ModalDropdown.module.scss';

export interface ModalDropdownProps {
  label: string; // Adicione a propriedade 'label'
  options: string[];
}

export const ModalDropdown = ({ label, options }: ModalDropdownProps) => {
  const generatedId = useId();

  return (
    <div className={styles.dropdownContainer}>
      {/* O novo label */}
      <label htmlFor={generatedId} className={styles.dropdownLabel}>
        {label}
      </label>

      <select id={generatedId} className={styles.select}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
