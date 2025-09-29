import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail.module.scss';
import { ProductDetailCard } from '../../components/ProductDetailCard';
import { ProductList } from '../../components/ProductList';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import type { ApiProduct } from '../../types/api';

const mockProducts: ApiProduct[] = [
  {
    id: '1',
    name: 'Cookie Oreo com Nutella',
    price: 'R$ 15,00',
    imageSrc: '/images/brownie-com-sorvete.png',
    imageAlt: 'Cookie Oreo com Nutella',
  },
  {
    id: '2',
    name: 'Cookie Chocolate Branco',
    price: 'R$ 15,00',
    imageSrc: '/images/bolo.png',
    imageAlt: 'Cookie Chocolate Branco',
  },
  {
    id: '3',
    name: 'Cookie de Amendoim',
    price: 'R$ 16,00',
    imageSrc: '/images/brownie-com-sorvete.png',
    imageAlt: 'Cookie de Amendoim',
  },
  {
    id: '4',
    name: 'Cookie de Chocolate ao Leite',
    price: 'R$ 16,00',
    imageSrc: '/images/bolinho-de-cookie.png',
    imageAlt: 'Cookie de Chocolate ao Leite',
  },
  {
    id: '10',
    name: 'Bolo Red Velvet',
    price: 'R$ 35,00',
    imageSrc: '/images/brownie-red-velvet.png',
    imageAlt: 'Bolo Red Velvet',
  },
];

type ProductDetail = ApiProduct & {
  description: string;
  allergens?: string[];
  relatedProducts?: ApiProduct[];
};

const mockProductDetails: ProductDetail[] = [
  {
    id: '1',
    name: 'Cookie Oreo com Nutella',
    price: 'R$ 15,00',
    imageSrc: '/images/cookie-oreo.jpg',
    imageAlt: 'Cookie Oreo com Nutella',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    allergens: ['contém glúten', 'contém lactose'],
  },
  {
    id: '2',
    name: 'Cookie Chocolate Branco',
    price: 'R$ 15,00',
    imageSrc: '/images/cookie-branco.jpg',
    imageAlt: 'Cookie Chocolate Branco',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    allergens: ['contém glúten', 'contém lactose'],
  },
  {
    id: '3',
    name: 'Cookie de Amendoim',
    price: 'R$ 16,00',
    imageSrc: '/images/cookie-amendoim.jpg',
    imageAlt: 'Cookie de Amendoim',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    allergens: ['contém glúten', 'contém amendoim'],
  },
  {
    id: '4',
    name: 'Cookie de Chocolate ao Leite',
    price: 'R$ 16,00',
    imageSrc: '/images/cookie-chocolate.jpg',
    imageAlt: 'Cookie de Chocolate ao Leite',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    allergens: ['contém glúten', 'contém lactose'],
  },
  {
    id: '10',
    name: 'Bolo Red Velvet',
    price: 'R$ 35,00',
    imageSrc: '/images/bolo-red-velvet.jpg',
    imageAlt: 'Bolo Red Velvet',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    allergens: ['Sem Glúten', 'Sem Lactose', 'Vegan'],
    relatedProducts: [
      {
        id: '1',
        name: 'Cookie Oreo com Nutella',
        price: 'R$ 15,00',
        imageSrc: '/images/cookie-oreo.jpg',
        imageAlt: 'Cookie Oreo com Nutella',
      },
      {
        id: '2',
        name: 'Cookie Chocolate Branco',
        price: 'R$ 15,00',
        imageSrc: '/images/cookie-branco.jpg',
        imageAlt: 'Cookie Chocolate Branco',
      },
      {
        id: '3',
        name: 'Cookie de Amendoim',
        price: 'R$ 16,00',
        imageSrc: '/images/cookie-amendoim.jpg',
        imageAlt: 'Cookie de Amendoim',
      },
      {
        id: '4',
        name: 'Cookie de Chocolate ao Leite',
        price: 'R$ 16,00',
        imageSrc: '/images/cookie-chocolate.jpg',
        imageAlt: 'Cookie de Chocolate ao Leite',
      },
    ],
  },
];

export const ProductDetail: React.FC = () => {
  const { produtoId } = useParams<{ produtoId: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const foundProduct = mockProductDetails.find((p) => p.id === produtoId);

        if (!foundProduct) {
          setError('Produto não encontrado');
          return;
        }

        setProduct(foundProduct);

        if (
          foundProduct.relatedProducts &&
          foundProduct.relatedProducts.length > 0
        ) {
          setRelatedProducts(foundProduct.relatedProducts);
        } else {
          const related = mockProducts.filter((p) => p.id !== produtoId);
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (err) {
        setError('Erro ao carregar produto');
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (produtoId) {
      fetchProductData();
    }
  }, [produtoId]);

  const handleAddToCart = (id: string) => {
    console.log('Adicionando ao carrinho:', id);
  };

  const handleQuantityChange = (quantity: number) => {
    console.log('Quantidade alterada:', quantity);
  };

  const handleShowMoreRelated = () => {
    console.log('Ver mais produtos relacionados');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.main}>
          <div className={styles.loading}>
            <p>Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Produto não encontrado</h2>
            <p>{error || 'O produto solicitado não existe.'}</p>
            <a href="/produtos" className={styles.backLink}>
              Voltar para produtos
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.productSection}>
          <ProductDetailCard
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            imageSrc={product.imageSrc}
            imageAlt={product.imageAlt}
            allergens={product.allergens}
            priceCents={Number(product.price.replace(/[^\d]/g, ''))}
            onAddToCart={handleAddToCart}
            onQuantityChange={handleQuantityChange}
          />
        </section>

        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <ProductList
              title="Compre Também"
              products={relatedProducts}
              showMore={true}
              onShowMoreClick={handleShowMoreRelated}
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};
