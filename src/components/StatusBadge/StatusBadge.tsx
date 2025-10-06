import type { StatusEnum } from 'src/types/status';
import styles from './StatusBadge.module.scss';

export type StatusProps = {
  status: StatusEnum;
};

export const StatusBadge = ({ status }: StatusProps) => {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
