import styles from './Home.module.scss';
import { NavBar, Footer } from '../../components';
import bannerDesktop from '../../assets/images/bannerDesktop.png';
import bannerMobile from '../../assets/images/bannerMobile.png';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <NavBar />
        <img
          src={bannerDesktop}
          alt="Banner promocional da loja Se Doce Fosse"
          className={styles.bannerDesktop || ''}
        />

        <img
          src={bannerMobile}
          alt="Banner promocional da loja Se Doce Fosse"
          className={styles.bannerMobile || ''}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
