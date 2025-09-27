import styles from './Loading.module.scss';

export const Loading = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};
