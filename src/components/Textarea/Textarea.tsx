import { useId } from 'react';
import styles from './Textarea.module.scss';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hasBorder?: boolean;
  error?: string;
}

export const Textarea = ({
  label,
  hasBorder = false,
  id,
  error,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;
  const labelId = `${textareaId}-label`;

  return (
    <div className={styles.textarea}>
      {label && (
        <label
          id={labelId}
          className={styles.textareaLabel}
          htmlFor={textareaId}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${styles.textareaField} ${hasBorder ? styles.textareaBorder : ''} ${error ? styles.textareaError : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <span id={errorId} className={styles.textareaErrorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};
