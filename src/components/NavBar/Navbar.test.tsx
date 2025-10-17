import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-router's useNavigate so NavBar can call navigate('/login') in tests
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as unknown;
  return {
    ...(actual as Record<string, unknown>),
    useNavigate: () => mockNavigate,
  };
});

import { NavBar } from './';

jest.mock(
  '../../assets//images/logo-se-doce-fosse-dark.png',
  () => 'test-file-stub'
);

describe('NavBar Component', () => {
  const mockOnLoginClick = jest.fn();
  const mockOnCartClick = jest.fn();

  beforeEach(() => {
    mockOnLoginClick.mockClear();
    mockOnCartClick.mockClear();
  });

  describe('Rendering', () => {
    it('renders correctly on desktop with all links and logo image', () => {
      render(<NavBar />);

      const logo = screen.getByAltText('Se Doce Fosse - Logotipo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'test-file-stub');

      expect(screen.getByText('Produtos')).toBeInTheDocument();
      expect(screen.getByText('Encomendas')).toBeInTheDocument();
      expect(screen.getByText('Sobre Nós')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Carrinho')).toBeInTheDocument();
    });
  });

  describe('Click Behavior', () => {
    it('calls onLoginClick when the login button is clicked', () => {
      render(<NavBar onLoginClick={mockOnLoginClick} />);
      const loginButton = screen.getByText('Entrar').closest('button');

      fireEvent.click(loginButton!);
      expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
    });

    it('calls onCartClick when the cart button is clicked', () => {
      render(<NavBar onCartClick={mockOnCartClick} />);
      const cartButton = screen.getByText('Carrinho').closest('button');

      fireEvent.click(cartButton!);
      expect(mockOnCartClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active States', () => {
    it('applies the "active" class to the login button when isLoginModalActive is true', () => {
      render(<NavBar isLoginModalActive={true} />);
      const loginButton = screen.getByText('Entrar').closest('button');

      expect(loginButton).toHaveClass('active');
    });

    it('applies the "active" class to the cart button when isCartDrawerActive is true', () => {
      render(<NavBar isCartDrawerActive={true} />);
      const cartButton = screen.getByText('Carrinho').closest('button');

      expect(cartButton).toHaveClass('active');
    });

    it('does not apply the "active" class when state props are false or undefined', () => {
      render(<NavBar />);
      const loginButton = screen.getByText('Entrar').closest('button');
      const cartButton = screen.getByText('Carrinho').closest('button');

      expect(loginButton).not.toHaveClass('active');
      expect(cartButton).not.toHaveClass('active');
    });
  });

  describe('Mobile Behavior', () => {
    it('toggles the mobile menu when the hamburger icon is clicked', () => {
      render(<NavBar />);

      const hamburgerButton = screen.getByRole('button', {
        name: /abrir ou fechar menu/i,
      });

      expect(screen.getAllByText('Produtos').length).toBe(1);

      fireEvent.click(hamburgerButton);

      expect(screen.getAllByText('Produtos').length).toBe(2);
      expect(screen.getAllByText('Encomendas').length).toBe(2);

      fireEvent.click(hamburgerButton);

      expect(screen.getAllByText('Produtos').length).toBe(1);
    });
  });
});
