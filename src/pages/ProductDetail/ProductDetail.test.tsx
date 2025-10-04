import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
}));

jest.mock('../../components/ProductDetailCard', () => ({
  ProductDetailCard: ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) => (
    <div data-testid="product-detail-card">
      <h2>{name}</h2>
      <p>{description}</p>
      <span data-testid="product-id">{id}</span>
    </div>
  ),
}));

jest.mock('../../components/ProductList', () => ({
  ProductList: ({
    title,
    products,
  }: {
    title: string;
    products: unknown[];
  }) => (
    <div data-testid="product-list">
      <h3>{title}</h3>
      <div data-testid="products-count">{products.length}</div>
    </div>
  ),
}));

jest.mock('../../components/NavBar', () => ({
  NavBar: () => <nav data-testid="navbar">NavBar</nav>,
}));

jest.mock('../../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock dos services
jest.mock('../../services/product/productService', () => ({
  fetchProductById: jest.fn(),
  fetchProducts: jest.fn(),
}));

import {
  fetchProductById,
  fetchProducts,
} from '../../services/product/productService';

const mockFetchProductById = fetchProductById as jest.MockedFunction<
  typeof fetchProductById
>;
const mockFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>;

// Dados de teste mockados
const mockProductData = {
  id: 'CK001',
  name: 'Cookie Clássico com Gotas de Chocolate',
  description:
    'Massa amanteigada com baunilha e gotas de chocolate meio amargo.',
  price: 'R$ 41,50',
  imageSrc: 'http://example.com/img/cookie-chocolate.jpg',
  imageAlt: 'Cookie Clássico com Gotas de Chocolate',
  allergens: null,
  relatedProducts: null,
};

const mockProductsData = {
  categories: [
    {
      id: '1',
      name: 'Cookies',
      products: [
        {
          id: 'CK002',
          name: 'Cookie Oreo',
          price: 'R$ 35,00',
          imageSrc: 'http://example.com/img/cookie-oreo.jpg',
          imageAlt: 'Cookie Oreo',
          allergens: null,
          relatedProducts: null,
        },
        {
          id: 'CK003',
          name: 'Cookie de Amendoim',
          price: 'R$ 38,00',
          imageSrc: 'http://example.com/img/cookie-amendoim.jpg',
          imageAlt: 'Cookie de Amendoim',
          allergens: null,
          relatedProducts: null,
        },
        {
          id: 'CK004',
          name: 'Cookie Duplo Chocolate',
          price: 'R$ 42,00',
          imageSrc: 'http://example.com/img/cookie-duplo.jpg',
          imageAlt: 'Cookie Duplo Chocolate',
          allergens: null,
          relatedProducts: null,
        },
        {
          id: 'CK005',
          name: 'Cookie de Baunilha',
          price: 'R$ 36,00',
          imageSrc: 'http://example.com/img/cookie-baunilha.jpg',
          imageAlt: 'Cookie de Baunilha',
          allergens: null,
          relatedProducts: null,
        },
      ],
    },
  ],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup padrão dos mocks
    mockFetchProductById.mockResolvedValue(mockProductData);
    mockFetchProducts.mockResolvedValue(mockProductsData);
  });

  it('renderiza corretamente o ProductDetailCard com os dados do produto', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK001' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(
        screen.getByText('Cookie Clássico com Gotas de Chocolate')
      ).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('CK001');
    });
  });

  it('renderiza a seção de produtos relacionados', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK001' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
      expect(screen.getByText('Compre Também')).toBeInTheDocument();
      expect(screen.getByTestId('products-count')).toHaveTextContent('4'); // Todos os 4 produtos porque CK001 não está na lista mockada
    });
  });

  it('utiliza footer e navbar', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK001' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('exibe mensagem de erro quando o produto não existe', async () => {
    mockUseParams.mockReturnValue({ produtoId: '999' });
    mockFetchProductById.mockRejectedValue(new Error('Produto não encontrado'));

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Produto não encontrado' })
      ).toBeInTheDocument();
      expect(screen.getByText('Erro ao carregar produto')).toBeInTheDocument();
      expect(screen.getByText('Voltar para produtos')).toBeInTheDocument();
    });
  });

  it('exibe estado de carregamento', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK001' });

    renderWithRouter(<ProductDetail />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza produtos relacionados corretamente', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK002' });

    const productData = {
      ...mockProductData,
      id: 'CK002',
      name: 'Cookie Oreo',
    };
    mockFetchProductById.mockResolvedValue(productData);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
      expect(screen.getByText('Compre Também')).toBeInTheDocument();
      expect(screen.getByTestId('products-count')).toHaveTextContent('3'); // 4 produtos totais - 1 produto atual (CK002) = 3 relacionados
    });
  });

  it('renderiza corretamente com produtoId válido', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK003' });

    const productData = {
      ...mockProductData,
      id: 'CK003',
      name: 'Cookie de Amendoim',
    };
    mockFetchProductById.mockResolvedValue(productData);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByText('Cookie de Amendoim')).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('CK003');
    });
  });

  it('não renderiza produtos relacionados quando não há produtos disponíveis', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK001' });
    mockFetchProducts.mockResolvedValue({ categories: [] });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      // Não deve renderizar a lista se não há produtos
      expect(screen.queryByTestId('product-list')).not.toBeInTheDocument();
    });
  });

  it('renderiza corretamente o produto com descrição personalizada', async () => {
    mockUseParams.mockReturnValue({ produtoId: 'CK010' });

    const productData = {
      ...mockProductData,
      id: 'CK010',
      name: 'Cookie Especial',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    };
    mockFetchProductById.mockResolvedValue(productData);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByText('Cookie Especial')).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('CK010');
      expect(
        screen.getByText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
        )
      ).toBeInTheDocument();
    });
  });
});
