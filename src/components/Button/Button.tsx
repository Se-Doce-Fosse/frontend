import React from 'react';
import type { IconType } from 'react-icons';
import styles from './Button.module.scss';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  icon?: IconType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
}

export const Button = ({
  label,
  variant = 'primary',
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  ...buttonProps
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    disabled || loading ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {Icon && <Icon className={styles.icon} />}
      {loading ? (
        <span>Carregando...</span>
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </button>
  );
};
