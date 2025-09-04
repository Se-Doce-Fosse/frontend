import React from 'react';
import type { IconType } from 'react-icons';
import styles from './DefaultButton.module.scss';

export interface DefaultButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  icon?: IconType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function DefaultButton({
  label,
  variant = 'primary',
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  ...buttonProps
}: DefaultButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {Icon && <Icon className={styles.icon} />}
      <span className={styles.label}>{label}</span>
    </button>
  );
}
