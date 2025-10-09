import React, { useState } from 'react';
import styles from './CupomBanner.module.scss';

const CouponBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.text}>
          Cupom 10% de desconto na primeira compra:{' '}
          <strong>PRIMEIRACOMPRA</strong>
        </span>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Fechar banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CouponBanner;
