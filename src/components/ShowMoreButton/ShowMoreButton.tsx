import React from 'react';
import styles from './ShowMoreButton.module.scss';

type ShowMoreButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  onClick,
  children = 'Ver mais',
  className,
}) => (
  <button
    type="button"
    className={
      className
        ? `${styles.showMoreButton} ${className}`
        : styles.showMoreButton
    }
    onClick={onClick}
  >
    {children}
  </button>
);

export default ShowMoreButton;
