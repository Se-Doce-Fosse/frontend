import styles from './Home.module.scss';
import { ProductList } from '../../components/ProductList';

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
    description: 'Delicioso cookie recheado com Nutella cremosa.',
  },
  {
    id: 2,
    name: 'Cookie Oreo com Nutella',
    price: 'R$20,00',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    description: 'Delicioso cookie recheado com Nutella cremosa.',
  },
  {
    id: 3,
    name: 'Cookie Oreo com Nutella',
    price: 'R$20,00',
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    description: 'Delicioso cookie recheado com Nutella cremosa.',
  },
  {
    id: 4,
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
    <ProductList
      title="Doces"
      products={products.map((p) => ({
        ...p,
        id: String(p.id),
      }))}
      showMore
    />
  </div>
);

export default Home;
