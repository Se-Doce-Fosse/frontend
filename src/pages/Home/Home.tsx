import styles from './Home.module.scss';
import { ProductCard } from '../../components/ProductCard';

const parseBRLToCents = (price: string): number => {
  const numberString = price.replace(/[R$\s.]/g, '').replace(',', '.');
  return Math.round(parseFloat(numberString) * 100);
};

const products = [
  {
    id: 1,
    name: 'Cookie Oreo com Nutella',
    price: 'R$20,00',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    description:
      'Imagine um cookie dourado por fora, crocante nas bordas e incrivelmente macio no centro. Esse é o nosso Cookie Recheado com Nutella, uma verdadeira explosão de sabor para quem ama chocolate. Feito com massa artesanal, preparada com manteiga de qualidade, açúcar mascavo que dá um toque de caramelo e pedacinhos de chocolate que derretem na boca, cada mordida é uma experiência única..',
    allergens: ['sem lactose'],
  },
  {
    id: 2,
    name: 'Cookie Oreo com Nutella',
    price: 'R$20,00',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    description: 'Delicioso cookie recheado com Nutella cremosa.',
  },
];

const Home = () => (
  <div className={styles.container}>
    <h1>Página Inicial</h1>
    <p>Bem-vindo ao site!</p>
    <div className={styles.productCard}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          imageSrc={p.imageSrc}
          imageAlt={p.imageAlt}
          title={p.name}
          description={p.description}
          priceCents={parseBRLToCents(p.price)}
        />
      ))}
    </div>
  </div>
);

export default Home;
