import styles from './Home.module.scss';
import { ProductCard } from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { Banner } from '../../components/Banner';
import { VerMaisButton } from '../../components/VerMaisButton';

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
      <Banner />
      <div className={styles.categoria}>
        <h1>Doces</h1> <VerMaisButton />
      </div>
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
