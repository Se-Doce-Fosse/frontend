import styles from './Home.module.scss';
import { ProductCard } from '../../components/ProductCard';
import { ProductDetailCard } from '@components';

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
];

const Home = () => (
  <div className={styles.container}>
    <h1>Página Inicial</h1>
    <p>Bem-vindo ao site!</p>
    <div className={styles.productCard}>
      {products.map((p) => {
        return (
          <>
            <ProductCard
              key={p.id}
              imageSrc={p.imageSrc}
              imageAlt={p.imageAlt}
              title={p.name}
              description={p.description}
              priceCents={parseBRLToCents(p.price)}
            />
            <ProductDetailCard
              key={p.id}
              imageSrc={p.imageSrc}
              imageAlt={p.imageAlt}
              name={p.name}
              description={p.description}
              priceCents={parseBRLToCents(p.price)}
              id={p.id.toString()}
              price="R$20,00"
              onAddToCart={(id) => console.log(`Adicionado ao carrinho: ${id}`)}
            />
          </>
        );
      })}
    </div>
  </div>
);

export default Home;
