import styles from './Select.module.scss';
import { SlArrowDown } from 'react-icons/sl';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  placeholder?: string;
  options: SelectOption[];
}

export const Select = ({ placeholder, options, ...props }: SelectProps) => {
  return (
    <div className={styles.selectWrapper}>
      <select className={styles.selectField} {...props}>
        {placeholder && (
          <option value="" hidden selected>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <SlArrowDown className={styles.selectIcon} aria-hidden="true" />
    </div>
  );
};
