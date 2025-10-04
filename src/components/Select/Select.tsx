import styles from './Select.module.scss';
import { SlArrowDown } from 'react-icons/sl';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  placeholder,
  options,
  value,
  defaultValue,
  ...rest
}) => {
  const selectValueProps =
    value !== undefined ? { value } : { defaultValue: defaultValue ?? '' };

  return (
    <div className={styles.selectWrapper}>
      <select className={styles.selectField} {...selectValueProps} {...rest}>
        {placeholder && (
          <option value="" hidden>
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
