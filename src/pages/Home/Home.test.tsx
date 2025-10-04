import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { CartProvider } from '../../context/CartContext';

jest.mock('../../assets/images/banner-desktop.png', () => 'banner-desktop.png');
jest.mock('../../assets/images/banner-mobile.png', () => 'banner-mobile.png');

jest.mock('./Home.module.scss', () => ({
  container: 'container',
  top: 'top',
  bannerDesktop: 'bannerDesktop',
  bannerMobile: 'bannerMobile',
  contentContainer: 'contentContainer',
}));

jest.mock('../../components', () => ({
  NavBar: ({ onCartClick }: { onCartClick: () => void }) => (
    <nav data-testid="navbar">
      <button onClick={onCartClick}>Cart</button>
    </nav>
  ),
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('../../components/Cart/CartDrawerOrder/CartDrawerOrder', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-drawer-order" />,
}));

jest.mock('../../components/Cart/CartDrawerFinish/CartDrawerFinish', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-drawer-finish" />,
}));

jest.mock('../../components/ProductList', () => ({
  __esModule: true,
  default: ({
    title,
    products,
    showMore,
    onShowMoreClick,
  }: {
    title: string;
    products: unknown[];
    showMore?: boolean;
    onShowMoreClick?: () => void;
  }) => (
    <section data-testid="product-list">
      <h2>{title}</h2>
      <div>{products.length} products</div>
      {showMore ? (
        <button type="button" onClick={onShowMoreClick}>
          Ver mais
        </button>
      ) : null}
    </section>
  ),
}));

const mockFetchProducts = jest.fn();

jest.mock('../../services/product/productService', () => ({
  fetchProducts: () => mockFetchProducts(),
}));

const renderHome = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <Home />
      </CartProvider>
    </MemoryRouter>
  );

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
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
    renderHome();

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('renderiza os banners com o alt correto', async () => {
    renderHome();

    const banners = screen.getAllByAltText(
      'Banner promocional da loja Se Doce Fosse'
    );
    expect(banners).toHaveLength(2);

    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('exibe loading inicialmente e depois carrega os produtos', async () => {
    renderHome();

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Carregando produtos...')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });
  });

  it('exibe erro quando falha ao carregar produtos', async () => {
    mockFetchProducts.mockRejectedValueOnce(new Error('Erro na API'));

    renderHome();

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
