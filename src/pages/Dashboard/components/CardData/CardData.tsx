import styles from './CardData.module.scss';
import type { ReactNode } from 'react';

export interface DataCardProps {
  title: string;
  data: string | number;
  icon: ReactNode;
}

export const DataCard = ({ title, data, icon }: DataCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h2>{title}</h2>
        <span>{icon}</span>
      </div>
      <p className={styles.data}>{data}</p>
    </div>
  );
};
