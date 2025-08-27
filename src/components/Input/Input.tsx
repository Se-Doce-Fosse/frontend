import styles from './Input.module.scss';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasBorder?: boolean;
}

export const Input = ({ label, hasBorder = false, ...props }: InputProps) => {
  return (
    <div className={styles.input}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        className={hasBorder ? styles.inputBorder : styles.inputField}
        {...props}
      />
    </div>
  );
};
