import styles from './CommentCard.module.scss';
import { FaStar } from 'react-icons/fa';

export type CommentCardProps = {
  name: string;
  description: string;
  rating?: number;
};
<h2 className={styles.emptyStateTitle}>Seu carrinho está vazio</h2>;

export const CommentCard = ({
  name,
  description,
  rating,
}: CommentCardProps) => {
  return (
    <div className={styles.commentCard}>
      <div className={styles.header}>
        <h2 className={styles.name} title={name} aria-label={name}>
          {name}
        </h2>

        <div className={styles.avaliation}>
          {rating &&
            Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                data-testid="star"
                className={`${styles.star} ${index < rating ? styles.active : ''}`}
              />
            ))}
        </div>
      </div>

      {description && <p className={styles.comment}>{description}</p>}
    </div>
  );
};
