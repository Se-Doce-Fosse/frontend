import { useEffect } from 'react';
import styles from './Produtos.module.scss';
import { NavBar, Footer } from '../../components';
import ProductList from '../../components/ProductList';

const productSections = [
  {
    title: 'Cookies Tradicionais',
    products: [
      {
        //precisamos considerar o que vai definir a categoria no back coloquei id mas tem que ver
        id: 'trad-1',
        name: 'Cookie Clássico',
        price: 'R$15,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie Clássico',
        description:
          'Nosso cookie tradicional com gotas generosas de chocolate.',
      },
      {
        id: 'trad-2',
        name: 'Cookie Crocante',
        price: 'R$16,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie Crocante',
        description:
          'Textura equilibrada e crocância marcante em cada mordida.',
      },
      {
        id: 'trad-3',
        name: 'Cookie Red Velvet',
        price: 'R$18,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie Red Velvet',
        description: 'Massa aveludada e pedacinhos de chocolate branco.',
      },
    ],
  },
  {
    title: 'Cookies Recheados',
    products: [
      {
        id: 'rech-1',
        name: 'Cookie Oreo com Nutella',
        price: 'R$20,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie Oreo com Nutella',
        description: 'Recheio cremoso de Nutella com pedacinhos de Oreo.',
      },
      {
        id: 'rech-2',
        name: 'Cookie Pistache',
        price: 'R$22,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie Pistache',
        description: 'Recheado com pasta de pistache e crocante caramelizado.',
      },
      {
        id: 'rech-3',
        name: 'Cookie de Amêndoas',
        price: 'R$19,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie de Amêndoas',
        description: 'Recheio suave com lâminas de amêndoas tostadas.',
      },
      {
        id: 'rech-4',
        name: 'Cookie Ninho com Nutella',
        price: 'R$19,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie de Amêndoas',
        description: 'Recheio suave com lâminas de amêndoas tostadas.',
      },
      {
        id: 'rech-5',
        name: 'Cookie Limão Siciliano com Blueberry',
        price: 'R$19,00',
        imageSrc: '/images/cookie.png',
        imageAlt: 'Cookie de Amêndoas',
        description: 'Recheio suave com lâminas de amêndoas tostadas.',
      },
    ],
  },
];

const Produtos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.content}>
        {productSections.map((section) => (
          <ProductList
            key={section.title}
            title={section.title}
            products={section.products}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Produtos;
