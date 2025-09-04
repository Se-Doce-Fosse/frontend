import { FiPlus, FiCheck } from 'react-icons/fi';
import DefaultButton from '../../components/Button';
import styles from './Home.module.scss';

const Home = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Botão ${buttonName} clicado!`);
    alert(`Você clicou no botão: ${buttonName}`);
  };

  return (
    <div className={styles.container}>
      <h1>Demonstração dos Botões</h1>

      <div className={styles.buttonShowcase}>
        <section className={styles.section}>
          <div className={styles.buttonGroup}>
            <DefaultButton
              label="Adicionar"
              variant="primary"
              onClick={() => handleButtonClick('Adicionar')}
            />
            <DefaultButton
              label="Novo Item"
              icon={FiPlus}
              variant="primary"
              onClick={() => handleButtonClick('Novo Item')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.buttonGroup}>
            <DefaultButton
              label="Adicionar"
              icon={FiPlus}
              variant="secondary"
              onClick={() => handleButtonClick('Adicionar')}
            />
            <DefaultButton
              label="Cancelar"
              variant="secondary"
              onClick={() => handleButtonClick('Cancelar')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Variante Outlined</h2>
          <div className={styles.buttonGroup}>
            <DefaultButton
              label="Continuar comprando"
              variant="outlined"
              onClick={() => handleButtonClick('Continuar comprando')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.buttonGroup}>
            <DefaultButton
              label="Botão Desabilitado"
              variant="primary"
              disabled={true}
              onClick={() => handleButtonClick('Desabilitado')}
            />
            <DefaultButton
              label="Salvar (Disabled)"
              icon={FiCheck}
              variant="secondary"
              disabled={true}
              onClick={() => handleButtonClick('Salvar Disabled')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.buttonGroup}>
            <DefaultButton
              label="Botão Grande"
              variant="primary"
              className={styles.largeButton}
              onClick={() => handleButtonClick('Botão Grande')}
            />
            <DefaultButton
              label="Botão Pequeno"
              variant="outlined"
              className={styles.smallButton}
              onClick={() => handleButtonClick('Botão Pequeno')}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
