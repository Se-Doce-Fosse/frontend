import styles from './StatusBadge.module.scss';

export type StatusProps = {
  status: 'ativo' | 'inativo';
};

export const StatusBadge = ({ status }: StatusProps) => {
  const isActive = status === 'ativo';

  return (
    <span
      className={`${styles.badge} ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  );
};

export default StatusBadge;
