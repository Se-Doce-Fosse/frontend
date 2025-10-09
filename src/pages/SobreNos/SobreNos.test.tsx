// SobreNos.test.jsx
import { render, screen } from '@testing-library/react';
import SobreNos from './SobreNos';

// mockando componentes que vêm de ../../components
jest.mock('../../components', () => ({
  NavBar: () => <div data-testid="navbar">NavBar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// mockando imagens (para não quebrar o teste)
jest.mock('../../assets/images/banner-desktop.png', () => 'bannerDesktop.png');
jest.mock('../../assets/images/banner-mobile.png', () => 'bannerMobile.png');
jest.mock(
  '../../assets/images/banner-sobre-nos.png',
  () => 'bannerSobreNos.png'
);

describe('Componente SobreNos', () => {
  it('deve renderizar o título corretamente', () => {
    render(<SobreNos />);
    const titulo = screen.getByText(/Sobre Nós/i);
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar a descrição da empresa', () => {
    render(<SobreNos />);
    const descricao = screen.getByText(
      /Na Se Doce Fosse, acreditamos que um doce vai muito além do sabor./i
    );
    expect(descricao).toBeInTheDocument();
  });

  it('deve renderizar as imagens principais', () => {
    render(<SobreNos />);
    const bannerDesktop = screen.getByAltText(
      /Banner promocional da loja Se Doce Fosse Desktop/i
    );
    const bannerMobile = screen.getByAltText(
      /Banner promocional da loja Se Doce Fosse Mobile/i
    );
    const bannerSobreNos = screen.getByAltText(
      /Banner sobre nós da loja Se Doce Fosse/i
    );

    expect(bannerDesktop).toBeInTheDocument();
    expect(bannerMobile).toBeInTheDocument();
    expect(bannerSobreNos).toBeInTheDocument();
  });

  it('deve renderizar o NavBar e o Footer', () => {
    render(<SobreNos />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
