import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartDrawer from './CartDrawer';

jest.mock('react-icons/fa', () => ({
  FaShoppingCart: () => <div data-testid="shopping-cart-icon">🛒</div>,
  FaTimes: () => <div data-testid="times-icon">✕</div>,
  FaPlus: () => <div data-testid="plus-icon">+</div>,
  FaMinus: () => <div data-testid="minus-icon">-</div>,
  FaTrash: () => <div data-testid="trash-icon">🗑️</div>,
}));

describe('CartDrawer', () => {
  const mockOnClose = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o drawer com ícone, título e children', () => {
    render(
      <CartDrawer
        open={true}
        onClose={mockOnClose}
        icon={<div data-testid="shopping-cart-icon">🛒</div>}
        title="Meu carrinho"
      >
        <div>Seu carrinho está vazio</div>
        <button>Continuar</button>
      </CartDrawer>
    );
    expect(screen.getByText('Meu carrinho')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

  it('não deve renderizar o drawer quando open é false', () => {
    render(
      <CartDrawer
        open={false}
        onClose={mockOnClose}
        icon={<div data-testid="shopping-cart-icon">🛒</div>}
        title="Meu carrinho"
      >
        <div>Seu carrinho está vazio</div>
      </CartDrawer>
    );
    expect(screen.queryByText('Meu carrinho')).not.toBeInTheDocument();
  });

  it('deve chamar onClose quando o botão de fechar é clicado', () => {
    render(
      <CartDrawer
        open={true}
        onClose={mockOnClose}
        icon={<div data-testid="shopping-cart-icon">🛒</div>}
        title="Meu carrinho"
      />
    );
    const closeButton = screen.getByTestId('times-icon').parentElement;
    fireEvent.click(closeButton!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar a classe open quando o drawer está aberto', () => {
    const { container } = render(
      <CartDrawer
        open={true}
        onClose={mockOnClose}
        icon={<div data-testid="shopping-cart-icon">🛒</div>}
        title="Meu carrinho"
      />
    );
    const drawer = container.querySelector('[class*="drawer"]');
    expect(drawer).toHaveClass('open');
  });

  it('deve renderizar children corretamente', () => {
    render(
      <CartDrawer
        open={true}
        onClose={mockOnClose}
        icon={<div data-testid="shopping-cart-icon">🛒</div>}
        title="Meu carrinho"
      >
        <div>Conteúdo do carrinho</div>
      </CartDrawer>
    );
    expect(screen.getByText('Conteúdo do carrinho')).toBeInTheDocument();
  });
});
