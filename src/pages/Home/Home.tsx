import styles from './Home.module.scss';
import { ProductCard } from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';

const Home = () => {
  const { products, loading, error } = useProducts();

  if (loading)
    return (
      <div className={styles.container}>
        <p>Carregando produtos…</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.container}>
        <p style={{ color: 'crimson' }}>{error}</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1>Página Inicial</h1>
      <p>Bem-vindo ao site!</p>
      <div className={styles.productCard}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            imageSrc={p.imageSrc}
            imageAlt={p.imageAlt}
            title={p.title}
            description={p.description}
            priceCents={p.priceCents}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
