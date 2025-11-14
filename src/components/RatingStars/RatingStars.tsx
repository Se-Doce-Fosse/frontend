import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './RatingStars.module.scss';

export interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
}

export const RatingStars = ({ value, onChange }: RatingStarsProps = {}) => {
  const [internalValue, setInternalValue] = useState(0);
  const currentValue = value ?? internalValue;

  const updateRating = (nextValue: number) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleClick = (index: number) => {
    const clickedValue = index + 1;
    const nextValue = currentValue === clickedValue ? 0 : clickedValue;
    updateRating(nextValue);
  };

  return (
    <div className={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          data-testid="star"
          onClick={() => handleClick(index)}
          className={`${styles.star} ${
            index < currentValue ? styles.active : ''
          }`}
        />
      ))}
    </div>
  );
};
