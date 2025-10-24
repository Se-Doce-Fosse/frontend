import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './Log.tsx';
import { ClienteProvider } from '../../../context/ClienteContext';

// Mock the backend login for cliente so tests don't perform network calls
jest.mock('../../../services/auth/auth', () => ({
  loginCliente: jest.fn(async (nome: string) => ({ id: 'local-1', nome })),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithProviders = () =>
    render(
      <ClienteProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </ClienteProvider>
    );

  it('renderiza formulário de login', () => {
    renderWithProviders();
    expect(screen.getByText('Entre com sua conta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /acessar/i })
    ).toBeInTheDocument();
  });

  it('mostra erro quando nome tem menos de 2 caracteres', () => {
    renderWithProviders();
    const nomeInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nomeInput, { target: { value: 'A' } });
    fireEvent.blur(nomeInput);
    expect(
      screen.getByText('Nome deve ter pelo menos 2 caracteres')
    ).toBeInTheDocument();
  });

  it('mostra erro quando telefone é muito curto', () => {
    renderWithProviders();
    const telefoneInput = screen.getByLabelText(/telefone/i);
    fireEvent.change(telefoneInput, { target: { value: '119998' } });
    fireEvent.blur(telefoneInput);
    expect(
      screen.getByText('Telefone deve ter pelo menos 10 dígitos')
    ).toBeInTheDocument();
  });

  it('formata telefone automaticamente', () => {
    renderWithProviders();
    const telefoneInput = screen.getByLabelText(
      /telefone/i
    ) as HTMLInputElement;
    fireEvent.change(telefoneInput, { target: { value: '11999887766' } });
    expect(telefoneInput.value).toBe('(11) 99988-7766');
  });

  it('processa login localmente quando formulário válido', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11999887766' },
    });

    // spy on localStorage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        'cliente',
        expect.stringContaining('João Silva')
      );
    });
    setItemSpy.mockRestore();
  });

  it('não envia requisição se formulário inválido', () => {
    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'A' },
    });
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '119998' },
    });

    const submitButton = screen.getByRole('button', { name: /acessar/i });
    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);
    expect(window.alert).not.toHaveBeenCalled();
  });
});
