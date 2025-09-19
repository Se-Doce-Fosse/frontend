import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartDrawer from './CartDrawer';
import type { CartItem } from '../../types/api';

jest.mock('react-icons/fa', () => ({
  FaShoppingCart: () => <div data-testid="shopping-cart-icon">🛒</div>,
  FaTimes: () => <div data-testid="times-icon">✕</div>,
  FaPlus: () => <div data-testid="plus-icon">+</div>,
  FaMinus: () => <div data-testid="minus-icon">-</div>,
  FaTrash: () => <div data-testid="trash-icon">🗑️</div>,
}));

describe('CartDrawer', () => {
  const mockOnClose = jest.fn();
  const mockItems: CartItem[] = [
    {
      id: '1',
      name: 'Cookie de Chocolate',
      price: 'R$ 5,00',
      imageSrc: '/cookie.png',
      imageAlt: 'Cookie de chocolate',
      quantity: 2,
    },
    {
      id: '2',
      name: 'Brigadeiro',
      price: 'R$ 3,50',
      imageSrc: '/brigadeiro.png',
      imageAlt: 'Brigadeiro',
      quantity: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o drawer quando open é true', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={[]} />);

    expect(screen.getByText('Meu carrinho')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

  it('não deve renderizar o drawer quando open é false', () => {
    render(<CartDrawer open={false} onClose={mockOnClose} items={[]} />);

    expect(screen.queryByText('Meu carrinho')).not.toBeInTheDocument();
  });

  it('deve chamar onClose quando o botão de fechar é clicado', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={[]} />);

    const closeButton = screen.getByTestId('times-icon').parentElement;
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar a classe open quando o drawer está aberto', () => {
    const { container } = render(
      <CartDrawer open={true} onClose={mockOnClose} items={[]} />
    );

    const drawer = container.querySelector('[class*="drawer"]');
    expect(drawer).toHaveClass('open');
  });

  it('deve chamar onClose quando o botão Continuar é clicado', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={mockItems} />);

    const continueButton = screen.getByText('Continuar');
    fireEvent.click(continueButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve exibir a lista de itens quando há itens no carrinho', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={mockItems} />);

    expect(screen.getByText('Cookie de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Brigadeiro')).toBeInTheDocument();
    expect(screen.getByText('R$ 5,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 3,50')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('deve calcular e exibir o subtotal corretamente', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={mockItems} />);

    // Subtotal: (5.00 * 2) + (3.50 * 1) = 10.00 + 3.50 = 13.50
    expect(screen.getByText('R$ 13,50')).toBeInTheDocument();
  });

  it('deve desabilitar o botão Continuar quando o carrinho está vazio', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={[]} />);

    const continueButton = screen.getByText('Continuar');
    expect(continueButton).toBeDisabled();
  });

  it('deve habilitar o botão Continuar quando há itens no carrinho', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={mockItems} />);

    const continueButton = screen.getByText('Continuar');
    expect(continueButton).not.toBeDisabled();
  });

  it('deve exibir os controles de quantidade para cada item', () => {
    render(<CartDrawer open={true} onClose={mockOnClose} items={mockItems} />);

    const plusButtons = screen.getAllByTestId('plus-icon');
    const minusButtons = screen.getAllByTestId('minus-icon');
    const trashButtons = screen.getAllByTestId('trash-icon');

    expect(plusButtons).toHaveLength(2);
    expect(minusButtons).toHaveLength(2);
    expect(trashButtons).toHaveLength(2);
  });
});
