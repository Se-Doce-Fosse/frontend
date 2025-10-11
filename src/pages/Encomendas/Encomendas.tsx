import { useNavigate } from 'react-router-dom';
import styles from './Encomendas.module.scss';
import { NavBar, Footer } from '../../components';
import tortaImage from '/images/encomendas.jpg';
import { FaWhatsapp } from 'react-icons/fa';

const Encomendas = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5511999999999?text=$`, '_blank');
  };

  return (
    <div className={styles.container}>
      <NavBar onCartClick={() => navigate('/carrinho')} />

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Encomendas Personalizadas</h1>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.textColumn}>
            <div className={styles.textContent}>
              <p>
                Além dos nossos produtos deliciosos à pronta entrega, também
                aceitamos encomendas sob medida — seja uma torta especial,
                fatias para adoçar o dia, ou até grandes quantidades de cookies
                e brownies para eventos. Atendemos também pedidos corporativos,
                perfeitos para presentear equipes, clientes ou deixar o café da
                tarde muito mais gostoso.
              </p>

              <p>
                Aceitamos encomendas com até 48h de antecedência, e a entrega é
                combinada com você da melhor forma possível.{' '}
                <strong>
                  Cancelamentos são possíveis em até 24h antes da entrega.
                </strong>
              </p>

              <p>
                O pagamento é feito em duas etapas: 50% no ato da encomenda e
                50% antes da entrega. Formas de pagamento: Pix ou cartão de
                crédito (com taxa da operadora).
              </p>

              <p>
                Para conhecer nosso catálogo completo de produtos e valores, é
                só chamar a gente no WhatsApp!
              </p>
            </div>

            <button
              className={styles.whatsappButton}
              onClick={handleWhatsAppClick}
            >
              <FaWhatsapp className={styles.whatsappIcon} />
              Realizar encomenda
            </button>
          </div>

          <div className={styles.imageColumn}>
            <img
              src={tortaImage}
              alt="Torta personalizada da Se Doce Fosse"
              className={styles.productImage}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Encomendas;
