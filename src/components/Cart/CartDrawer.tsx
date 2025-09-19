import React, { useEffect } from 'react';
import {
  FaShoppingCart,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
} from 'react-icons/fa';
import styles from './CartDrawer.module.scss';
import type { CartItem } from '../../types/api';

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
}

export default function CartDrawer({ open, onClose, items }: CartDrawerProps) {
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

  // Calcular subtotal
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const subtotalFormatted = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <FaShoppingCart className={styles.cartIcon} />
                <h2 className={styles.title}>Meu carrinho</h2>
              </div>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Fechar carrinho"
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.contentWrapper}>
                {items.length === 0 ? (
                  <div className={styles.emptyArea}>
                    <p>Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.itemsList}>
                      {items.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                          <div className={styles.itemImage}>
                            <img src={item.imageSrc} alt={item.imageAlt} />
                          </div>
                          <div className={styles.itemDetails}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <p className={styles.itemPrice}>{item.price}</p>
                            <div className={styles.quantityControls}>
                              <button
                                className={styles.quantityButton}
                                aria-label="Diminuir quantidade"
                              >
                                <FaMinus />
                              </button>
                              <span className={styles.quantity}>
                                {item.quantity}
                              </span>
                              <button
                                className={styles.quantityButton}
                                aria-label="Aumentar quantidade"
                              >
                                <FaPlus />
                              </button>
                              <button
                                className={styles.removeButton}
                                aria-label="Remover item"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.subtotal}>
                      <div className={styles.subtotalRow}>
                        <span>Subtotal:</span>
                        <span className={styles.subtotalValue}>
                          {subtotalFormatted}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.footer}>
                  <button
                    onClick={onClose}
                    className={styles.continueButton}
                    disabled={items.length === 0}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
