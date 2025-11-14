import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import type { ReactNode } from 'react';
import Pedidos from './Pedidos';
import type { AdminOrderResponse } from '../../services/admin-order/admin-order';

jest.mock('../../layouts/AdminLayout/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    user: { email: 'admin@email.com', token: 'test-token' },
    saveUser: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    loading: false,
  }),
}));

const mockOrdersByStatus: Record<string, AdminOrderResponse[]> = {
  ACEITO: [
    {
      orderId: 101,
      clientId: 'customer-1',
      clientName: 'Ana Souza',
      address: 'Rua Flores, 123',
      couponCode: 'DOCE10',
      orderDate: '2025-01-01T10:00:00',
      totalPrice: 25,
      orderStatus: 'ACEITO',
      cupomId: null,
      items: [
        {
          produtoSku: 'ck001',
          produtoNome: 'Cookie Clássico',
          quantidade: 2,
          valorUnitario: 12,
        },
        {
          produtoSku: 'ck002',
          produtoNome: 'Cookie Branco',
          quantidade: 1,
          valorUnitario: 7,
        },
      ],
    },
    {
      orderId: 102,
      clientId: 'customer-2',
      clientName: 'Cleison Andrade',
      address: 'Rua Flores, 123',
      orderDate: '2025-01-02T10:00:00',
      totalPrice: 18,
      orderStatus: 'ACEITO',
      cupomId: null,
      items: [
        {
          produtoSku: 'ck003',
          produtoNome: 'Cookie Dark',
          quantidade: 2,
          valorUnitario: 9,
        },
      ],
    },
  ],
  PREPARANDO: [
    {
      orderId: 103,
      clientId: 'customer-3',
      clientName: 'Julia Lima',
      address: 'Av. Brasil, 45',
      orderDate: '2025-01-03T10:00:00',
      totalPrice: 12,
      orderStatus: 'PREPARANDO',
      cupomId: null,
      items: [
        {
          produtoSku: 'ck004',
          produtoNome: 'Cookie Nozes',
          quantidade: 3,
          valorUnitario: 4,
        },
      ],
    },
  ],
  ROTA: [],
  ENTREGUE: [
    {
      orderId: 201,
      clientId: 'customer-4',
      clientName: 'Jonas Freitas',
      address: 'Alameda Santos, 89',
      couponCode: 'ENTREGUE10',
      orderDate: '2025-01-04T10:00:00',
      totalPrice: 30,
      orderStatus: 'ENTREGUE',
      cupomId: null,
      items: [
        {
          produtoSku: 'ck005',
          produtoNome: 'Cookie Romeu e Julieta',
          quantidade: 1,
          valorUnitario: 30,
        },
      ],
    },
  ],
  CANCELADO: [
    {
      orderId: 301,
      clientId: 'customer-5',
      clientName: 'Laura Braga',
      address: null,
      orderDate: '2025-01-05T10:00:00',
      totalPrice: 22,
      orderStatus: 'CANCELADO',
      cupomId: null,
      items: [
        {
          produtoSku: 'ck006',
          produtoNome: 'Cookie M&Ms',
          quantidade: 2,
          valorUnitario: 11,
        },
      ],
    },
  ],
};

const originalFetch = global.fetch;
let fetchMock: jest.Mock;

describe.skip('Pedidos page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock = jest.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (/admin\/order\/\d+\/status$/i.test(url)) {
        return Promise.resolve({
          ok: true,
          json: async () => ({}),
        } as Response);
      }

      const match = url.match(/admin\/order\/([^/]+)$/i);
      const statusKey = match ? match[1].toUpperCase() : '';
      const payload = mockOrdersByStatus[statusKey] ?? [];
      return Promise.resolve({
        ok: true,
        json: async () => payload,
      } as Response);
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('renderiza título e chips de status iniciais', async () => {
    render(<Pedidos />);

    expect(await screen.findByTestId('admin-layout')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: /pedidos/i })
    ).toBeVisible();

    // chips devem existir
    const novoBtn = await screen.findByRole('button', { name: /novo/i });
    const preparoBtn = await screen.findByRole('button', { name: /preparo/i });
    const prontoBtn = await screen.findByRole('button', { name: /pronto/i });

    expect(novoBtn).toBeInTheDocument();
    expect(preparoBtn).toBeInTheDocument();
    expect(prontoBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(novoBtn).toHaveTextContent(/2/);
      expect(preparoBtn).toHaveTextContent(/1/);
    });
  });

  it('filtra por preparo quando clicar no chip Preparo', async () => {
    render(<Pedidos />);

    const preparoBtn = await screen.findByRole('button', { name: /preparo/i });
    fireEvent.click(preparoBtn);

    await waitFor(() => {
      expect(screen.queryByText('#000101')).not.toBeInTheDocument();
    });

    // o pedido em preparo deve estar
    expect(await screen.findByText('#000103')).toBeInTheDocument();
  });

  it('ciclo de mover estágio afeta badges: Novo -> Finalizado -> Cancelado -> Novo', async () => {
    render(<Pedidos />);

    // pegar o cartão do pedido inicial que tem orderCode #000101
    const orderCode = '#000101';
    const orderNode = await screen.findByText(orderCode);
    const card = orderNode.closest('div') as HTMLElement;
    expect(card).toBeTruthy();

    const withinCard = within(card);

    // badge Novo aparece inicialmente
    expect(withinCard.getByText(/novo/i)).toBeInTheDocument();

    const moveBtn = withinCard.getByRole('button', { name: /mover estágio/i });

    // avançar 3 vezes: novo -> em_preparacao -> pronto -> finalizado
    fireEvent.click(moveBtn);
    await waitFor(() =>
      expect(withinCard.getByText(/em preparo/i)).toBeInTheDocument()
    );

    fireEvent.click(moveBtn);
    await waitFor(() =>
      expect(withinCard.getByText(/pronto/i)).toBeInTheDocument()
    );

    fireEvent.click(moveBtn);
    await waitFor(() => {
      expect(withinCard.queryByText(/novo/i)).not.toBeInTheDocument();
      expect(withinCard.getByText(/finalizado/i)).toBeInTheDocument();
    });

    // clicar mais uma vez para ir a cancelado
    fireEvent.click(moveBtn);
    await waitFor(() =>
      expect(withinCard.getByText(/cancelado/i)).toBeInTheDocument()
    );

    // clicar mais uma vez para retornar a novo
    fireEvent.click(moveBtn);
    await waitFor(() =>
      expect(withinCard.getByText(/novo/i)).toBeInTheDocument()
    );

    const patchCalls = fetchMock.mock.calls.filter(([url]) => {
      const parsed = typeof url === 'string' ? url : url.toString();
      return parsed.includes('/status');
    });
    expect(patchCalls.length).toBeGreaterThanOrEqual(5);
  });

  it('abre modal de detalhes com informações do pedido selecionado', async () => {
    render(<Pedidos />);

    const detailButtons = await screen.findAllByRole('button', {
      name: /detalhes/i,
    });
    fireEvent.click(detailButtons[0]);

    const heading = await screen.findByRole('heading', {
      name: /detalhes do pedido #000101/i,
    });
    expect(heading).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const modalScope = within(dialog);

    expect(modalScope.getByText(/ana souza/i)).toBeInTheDocument();
    expect(modalScope.getByText(/rua flores, 123/i)).toBeInTheDocument();
    expect(modalScope.getByText(/doce10/i)).toBeInTheDocument();
    expect(modalScope.getByText(/cookie clássico/i)).toBeInTheDocument();

    const closeButton = modalScope.getByRole('button', {
      name: /fechar modal/i,
    });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
