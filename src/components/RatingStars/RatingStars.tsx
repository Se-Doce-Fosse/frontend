import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './RatingStars.module.scss';

export const RatingStars = () => {
  const [rating, setRating] = useState(0);

  const handleClick = (index: number) => {
    if (rating === index + 1) {
      setRating(0);
    } else {
      setRating(index + 1);
    }
  };

  return (
    <div className={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          data-testid="star"
          onClick={() => handleClick(index)}
          className={`${styles.star} ${index < rating ? styles.active : ''}`}
        />
      ))}
    </div>
  );
};
