import { useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasBorder?: boolean;
}

export const Input = ({
  label,
  hasBorder = false,
  id,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={styles.input}>
      {label && (
        <label className={styles.inputLabel} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.inputField} ${hasBorder ? styles.inputBorder : ''}`}
        {...props}
      />
    </div>
  );
};
