import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

// Mock das imagens
jest.mock('../../assets/images/bannerDesktop.png', () => 'bannerDesktop.png');
jest.mock('../../assets/images/bannerMobile.png', () => 'bannerMobile.png');

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

describe('Home', () => {
  it('renderiza o Header (NavBar) e o Footer', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza os banners com o alt correto', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const banners = screen.getAllByAltText(
      'Banner promocional da loja Se Doce Fosse'
    );
    expect(banners).toHaveLength(2); // desktop + mobile
  });
});
