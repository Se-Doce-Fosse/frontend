import { Link } from 'react-router-dom';
import styles from './VerMaisButton.module.scss';

export const VerMaisButton = () => {
  return (
    <Link to="/produtos" className={styles.button}>
      Ver mais
    </Link>
  );
};
