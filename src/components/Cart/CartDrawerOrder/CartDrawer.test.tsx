import { render, screen, fireEvent } from '@testing-library/react';
import CartDrawerOrder from './CartDrawerOrder';

describe('CartDrawerOrder', () => {
  const mockOnClose = jest.fn();

  const setup = (open: boolean = true) => {
    return render(<CartDrawerOrder open={open} onClose={mockOnClose} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente quando aberto', () => {
    setup(true);

    expect(screen.getByText('Meu carrinho')).toBeInTheDocument();
    expect(screen.getByText('Cookie Oreo com Nutella')).toBeInTheDocument();
    expect(screen.getByText('R$20,00')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Continuar/i })
    ).toBeInTheDocument();
  });

  it('não deve renderizar conteúdo quando fechado', () => {
    setup(false);

    expect(screen.queryByText('Meu carrinho')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Cookie Oreo com Nutella')
    ).not.toBeInTheDocument();
  });

  it('deve chamar onClose quando o drawer for fechado', () => {
    setup(true);

    // Simulando que o CartDrawer tem um botão de fechar acessível
    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("deve permitir clicar no botão 'Continuar'", () => {
    setup(true);

    const continueButton = screen.getByRole('button', { name: /Continuar/i });
    fireEvent.click(continueButton);

    // Aqui você poderia verificar se uma navegação ou ação é disparada futuramente
    expect(continueButton).toBeEnabled();
  });
});
