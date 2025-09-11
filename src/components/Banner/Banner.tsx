import { FaClock } from 'react-icons/fa';
import styles from './Banner.module.scss';

export const Banner = () => {
  return (
    <section className={styles.hero} aria-label="Doces artesanais">
      <div className={styles.left}>
        <h2>Doces artesanais feitos com amor</h2>

        <p className={styles.subtext}>
          Lorem ipsum dolor sit amet. Eum amet culpa aut commodi accusamus vel
          culpa suscipit! Et obcaecati cupiditate et repudiandae autem aut
          libero voluptatem id voluptatem numquam aut voluptas praesentium.
        </p>

        <p className={styles.hours}>
          <FaClock aria-hidden="true" />
          <span>Seg-Sex: 8h-18h | Sáb: 8h-16h</span>
        </p>
      </div>

      <div className={styles.right} aria-hidden="true">
        <img src="/images/banner.png" alt="" className={styles.photoA} />
      </div>
    </section>
  );
};
