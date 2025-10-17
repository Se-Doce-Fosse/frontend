import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Log.tsx';

// Não mockamos services externos aqui; a página usa um login local simulado

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza formulário de login', () => {
    render(<Login />);
    expect(screen.getByText('Entre com sua conta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /acessar/i })
    ).toBeInTheDocument();
  });

  it('mostra erro quando nome tem menos de 2 caracteres', () => {
    render(<Login />);
    const nomeInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nomeInput, { target: { value: 'A' } });
    fireEvent.blur(nomeInput);
    expect(
      screen.getByText('Nome deve ter pelo menos 2 caracteres')
    ).toBeInTheDocument();
  });

  it('mostra erro quando telefone é muito curto', () => {
    render(<Login />);
    const telefoneInput = screen.getByLabelText(/telefone/i);
    fireEvent.change(telefoneInput, { target: { value: '119998' } });
    fireEvent.blur(telefoneInput);
    expect(
      screen.getByText('Telefone deve ter pelo menos 10 dígitos')
    ).toBeInTheDocument();
  });

  it('formata telefone automaticamente', () => {
    render(<Login />);
    const telefoneInput = screen.getByLabelText(
      /telefone/i
    ) as HTMLInputElement;
    fireEvent.change(telefoneInput, { target: { value: '11999887766' } });
    expect(telefoneInput.value).toBe('(11) 99988-7766');
  });

  it('processa login localmente quando formulário válido', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11999887766' },
    });

    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Acesso realizado com sucesso!\n\nBem-vindo(a), João Silva!'
      );
    });
  });

  it('não envia requisição se formulário inválido', () => {
    render(<Login />);
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
