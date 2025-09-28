import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { CartProvider } from '../../context/CartContext';

// Mock das imagens
jest.mock('../../assets/images/banner-desktop.png', () => 'bannerDesktop.png');
jest.mock('../../assets/images/banner-mobile.png', () => 'bannerMobile.png');

// Mock do CSS Module
jest.mock('./Home.module.scss', () => ({
  container: 'container',
  top: 'top',
  bannerDesktop: 'bannerDesktop',
  bannerMobile: 'bannerMobile',
}));

// Mock dos componentes compartilhados
jest.mock('../../components', () => ({
  NavBar: () => <nav data-testid="navbar">NavBar</nav>,
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
  default: ({ title }: { title: string }) => (
    <section data-testid="product-list">{title}</section>
  ),
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
    window.localStorage.clear();
  });

  it('renderiza o Header (NavBar) e o Footer', () => {
    renderHome();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza os banners com o alt correto', () => {
    renderHome();
    const banners = screen.getAllByAltText(
      'Banner promocional da loja Se Doce Fosse'
    );
    expect(banners).toHaveLength(2); // desktop + mobile
  });
});
