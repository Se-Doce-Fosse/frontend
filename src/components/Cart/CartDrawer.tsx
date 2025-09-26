import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './CartDrawer.module.scss';

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
}

export default function CartDrawer({
  open,
  onClose,
  icon,
  title,
  children,
}: CartDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {icon && icon}
                {title && <h2 className={styles.title}>{title}</h2>}
              </div>

              <button
                className={styles.closeButton}
                onClick={() => onClose()}
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.contentWrapper}>{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
