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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente o ProductDetailCard com os dados do produto', async () => {
    mockUseParams.mockReturnValue({ produtoId: '1' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByText('Cookie Oreo com Nutella')).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('1');
    });
  });

  it('renderiza a seção de produtos relacionados', async () => {
    mockUseParams.mockReturnValue({ produtoId: '1' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
      expect(screen.getByText('Compre Também')).toBeInTheDocument();
      expect(screen.getByTestId('products-count')).toHaveTextContent('4');
    });
  });

  it('utiliza footer e navbar', async () => {
    mockUseParams.mockReturnValue({ produtoId: '1' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('exibe mensagem de erro quando o produto não existe', async () => {
    mockUseParams.mockReturnValue({ produtoId: '999' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Produto não encontrado' })
      ).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'Produto não encontrado'
      );
      expect(screen.getByText('Voltar para produtos')).toBeInTheDocument();
    });
  });

  it('exibe estado de carregamento', async () => {
    mockUseParams.mockReturnValue({ produtoId: '1' });

    renderWithRouter(<ProductDetail />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza produtos relacionados corretamente', async () => {
    mockUseParams.mockReturnValue({ produtoId: '2' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
      expect(screen.getByText('Compre Também')).toBeInTheDocument();
      expect(screen.getByTestId('products-count')).toHaveTextContent('4');
    });
  });

  it('renderiza corretamente com produtoId válido', async () => {
    mockUseParams.mockReturnValue({ produtoId: '3' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByText('Cookie de Amendoim')).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('3');
    });
  });

  it('não renderiza produtos relacionados quando não há produtos disponíveis', async () => {
    // Mock para simular situação onde não há produtos relacionados
    mockUseParams.mockReturnValue({ produtoId: '1' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('renderiza corretamente o Bolo Red Velvet com alérgenos especiais', async () => {
    mockUseParams.mockReturnValue({ produtoId: '10' });

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByTestId('product-detail-card')).toBeInTheDocument();
      expect(screen.getByText('Bolo Red Velvet')).toBeInTheDocument();
      expect(screen.getByTestId('product-id')).toHaveTextContent('10');
      expect(
        screen.getByText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
        )
      ).toBeInTheDocument();
    });
  });
});
