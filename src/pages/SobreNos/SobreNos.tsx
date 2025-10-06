import styles from './SobreNos.module.scss';
import { NavBar, Footer } from '../../components';
import bannerDesktop from '../../assets/images/banner-desktop.png';
import bannerMobile from '../../assets/images/banner-mobile.png';
import bannerSobreNos from '../../assets/images/banner-sobre-nos.png';

const SobreNos = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <NavBar />

        <img
          src={bannerDesktop}
          alt="Banner promocional da loja Se Doce Fosse Desktop"
          className={styles.bannerDesktop || ''}
        />

        <img
          src={bannerMobile}
          alt="Banner promocional da loja Se Doce Fosse Mobile"
          className={styles.bannerMobile || ''}
        />
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Sobre Nós</h1>
          <p className={styles.description}>
            Na Se Doce Fosse, acreditamos que um doce vai muito além do sabor.
            Ele pode ser um gesto de carinho, um abraço silencioso, uma pausa
            que transforma o simples em especial. Nosso nome nasceu da ideia de
            encantamento e possibilidades, como se cada mordida fosse capaz de
            abrir portas para lembranças, afetos e momentos inesquecíveis. Por
            trás da marca está Carolina, engenheira de alimentos que sempre
            acreditou na magia de um docinho bem-feito. Desde cedo, ela entendeu
            que confeitar é mais do que misturar ingredientes: é criar
            experiências que conectam pessoas, aquecem corações e celebram a
            vida nos detalhes. Com autenticidade e cuidado artesanal,
            transformamos receitas em momentos de aconchego e encantamento.
            Nossa identidade combina força e elegância, mas também traz leveza,
            acolhimento e um toque artesanal que se reflete em cada detalhe —
            dos ingredientes escolhidos à apresentação final. A Se Doce Fosse
            nasceu para ser referência em doçura com significado. Mais que
            cookies, criamos memórias.
          </p>
        </div>

        <img
          src={bannerSobreNos}
          alt="Banner sobre nós da loja Se Doce Fosse"
          className={styles.bannerSobreNos || ''}
        />
      </div>

      <div className={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};

export default SobreNos;
