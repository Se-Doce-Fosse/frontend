import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';

// Mock das imagens
jest.mock('../../assets/images/banner-desktop.png', () => 'banner-desktop.png');
jest.mock('../../assets/images/banner-mobile.png', () => 'banner-mobile.png');

// Mock do CSS Module
jest.mock('./Home.module.scss', () => ({
  container: 'container',
  top: 'top',
  bannerDesktop: 'bannerDesktop',
  bannerMobile: 'bannerMobile',
}));

// Mock dos componentes compartilhados
jest.mock('../../components', () => ({
  NavBar: ({ onCartClick }: { onCartClick: () => void }) => (
    <nav data-testid="navbar">
      <button onClick={onCartClick}>Cart</button>
    </nav>
  ),
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock do ProductList
jest.mock('../../components/ProductList', () => ({
  __esModule: true,
  default: ({ title, products }: { title: string; products: unknown[] }) => (
    <div data-testid="product-list">
      <h2>{title}</h2>
      <div>{products.length} products</div>
    </div>
  ),
}));

// Mock do CartDrawerOrder
jest.mock('../../components/Cart/CartDrawerOrder/CartDrawerOrder', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="cart-drawer" style={{ display: open ? 'block' : 'none' }}>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock do serviço de produtos
const mockFetchProducts = jest.fn();
jest.mock('../../services/product/productService', () => ({
  fetchProducts: () => mockFetchProducts(),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock padrão de sucesso
    mockFetchProducts.mockResolvedValue({
      categories: [
        {
          id: '1',
          name: 'Categoria Teste',
          products: [
            {
              id: '1',
              name: 'Produto Teste',
              price: '10.00',
              imageSrc: '/images/cookie.jpg',
              imageAlt: 'Produto teste',
            },
          ],
        },
      ],
    });
  });

  it('renderiza o Header (NavBar) e o Footer', async () => {
    render(<Home />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Aguarda o carregamento dos produtos
    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('renderiza os banners com o alt correto', async () => {
    render(<Home />);

    const banners = screen.getAllByAltText(
      'Banner promocional da loja Se Doce Fosse'
    );
    expect(banners).toHaveLength(2); // desktop + mobile

    // Aguarda o carregamento dos produtos
    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('exibe loading inicialmente e depois carrega os produtos', async () => {
    render(<Home />);

    // Verifica se o loading aparece inicialmente
    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();

    // Aguarda os produtos carregarem
    await waitFor(() => {
      expect(
        screen.queryByText('Carregando produtos...')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('exibe erro quando falha ao carregar produtos', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Erro na API'));

    render(<Home />);

    // Aguarda o erro aparecer
    await waitFor(() => {
      expect(
        screen.getByText('Um erro ocorreu tente novamente mais tarde')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Carregando produtos...')
      ).not.toBeInTheDocument();
    });
  });
});
