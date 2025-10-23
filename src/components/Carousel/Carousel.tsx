import React, { useState } from 'react';
import { Button } from '../Button';
import styles from './Carousel.module.scss';

export type CarouselProps = {
  items: React.ReactNode[];
  visibleCount?: number; // número de itens visíveis ao mesmo tempo
};

export const Carousel: React.FC<CarouselProps> = ({
  items,
  visibleCount = 3,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const next = () => {
    setCurrentIndex((i) => Math.min(i + 1, items.length - visibleCount));
  };

  // Pegando os itens visíveis
  const visibleItems = items.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div className={styles.head}>
      <h1 className={styles.tittle}>Comentários</h1>
      <div className={styles.body}>
        <div className={styles.carouselContainer}>
          <Button
            onClick={prev}
            label=""
            icon={() => <span>&lt;</span>}
            className={styles.arrow}
          />

          <div className={styles.slides}>
            {visibleItems.map((item, idx) => (
              <div key={idx} className={styles.slide}>
                {item}
              </div>
            ))}
          </div>

          <Button
            onClick={next}
            label=""
            icon={() => <span>&gt;</span>}
            className={styles.arrow}
          />
        </div>
      </div>
    </div>
  );
};
