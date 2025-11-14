import { useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './RatingStars.module.scss';

export type RatingStarsProps = {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};

export const RatingStars = ({
  value,
  onChange,
  readOnly = false,
}: RatingStarsProps) => {
  const [internalRating, setInternalRating] = useState<number>(value ?? 0);
  const isControlled = useMemo(() => typeof value === 'number', [value]);
  const currentRating = isControlled ? (value as number) : internalRating;

  useEffect(() => {
    if (isControlled) {
      setInternalRating(value as number);
    }
  }, [isControlled, value]);

  const handleClick = (index: number) => {
    if (readOnly) {
      return;
    }

    const newRating = currentRating === index + 1 ? 0 : index + 1;

    if (!isControlled) {
      setInternalRating(newRating);
    }

    onChange?.(newRating);
  };

  return (
    <div className={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          data-testid="star"
          onClick={() => handleClick(index)}
          className={`${styles.star} ${index < currentRating ? styles.active : ''} ${
            readOnly ? styles.readOnly : ''
          }`}
        />
      ))}
    </div>
  );
};
