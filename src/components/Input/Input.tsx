import { useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasBorder?: boolean;
  error?: string;
}

export const Input = ({
  label,
  hasBorder = false,
  id,
  error,
  className = '',
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputClassNames = [
    styles.inputField,
    hasBorder ? styles.inputBorder : '',
    error ? styles.inputError : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.input}>
      {label && (
        <label
          className={styles.inputLabel}
          aria-labelledby={label}
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClassNames}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
};
