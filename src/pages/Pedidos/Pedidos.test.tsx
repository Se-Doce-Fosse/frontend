import { render, screen, within, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import Pedidos from './Pedidos';

jest.mock('../../layouts/AdminLayout/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

describe('Pedidos page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza título e chips de status iniciais', () => {
    render(<Pedidos />);

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /pedidos/i })
    ).toBeInTheDocument();

    // chips devem existir
    const novoBtn = screen.getByRole('button', { name: /novo/i });
    const preparoBtn = screen.getByRole('button', { name: /preparo/i });
    const prontoBtn = screen.getByRole('button', { name: /pronto/i });

    expect(novoBtn).toBeInTheDocument();
    expect(preparoBtn).toBeInTheDocument();
    expect(prontoBtn).toBeInTheDocument();

    // o contador do Novo deve mostrar 2 (conforme dados iniciais do componente)
    expect(novoBtn).toHaveTextContent(/2/);
  });

  it('filtra por preparo quando clicar no chip Preparo', () => {
    render(<Pedidos />);

    const preparoBtn = screen.getByRole('button', { name: /preparo/i });
    fireEvent.click(preparoBtn);

    // o pedido com status 'novo' não deve estar visível
    expect(screen.queryByText('#0caa7673')).not.toBeInTheDocument();

    // o pedido em preparo deve estar
    expect(screen.getByText('#6785cbed')).toBeInTheDocument();
  });

  it('ciclo de mover estágio afeta badges: Novo -> Finalizado -> Cancelado -> Novo', () => {
    render(<Pedidos />);

    // pegar o cartão do pedido inicial que tem orderCode #0caa7673
    const orderCode = '#0caa7673';
    const orderNode = screen.getByText(orderCode);
    const card = orderNode.closest('div') as HTMLElement;
    expect(card).toBeTruthy();

    const withinCard = within(card);

    // badge Novo aparece inicialmente
    expect(withinCard.getByText(/novo/i)).toBeInTheDocument();

    const moveBtn = withinCard.getByRole('button', { name: /mover estágio/i });

    // avançar 3 vezes: novo -> em_preparacao -> pronto -> finalizado
    fireEvent.click(moveBtn);
    fireEvent.click(moveBtn);
    fireEvent.click(moveBtn);

    // agora Novo deve desaparecer e Finalizado deve aparecer
    expect(withinCard.queryByText(/novo/i)).not.toBeInTheDocument();
    expect(withinCard.getByText(/finalizado/i)).toBeInTheDocument();

    // clicar mais uma vez para ir a cancelado
    fireEvent.click(moveBtn);
    expect(withinCard.getByText(/cancelado/i)).toBeInTheDocument();

    // clicar mais uma vez para retornar a novo
    fireEvent.click(moveBtn);
    expect(withinCard.getByText(/novo/i)).toBeInTheDocument();
  });
});
