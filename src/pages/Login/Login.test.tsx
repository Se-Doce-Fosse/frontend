import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

const submit = async () => {
  const btn = screen.getByRole('button', { name: /entrar/i });
  await userEvent.click(btn);
};

describe('Login page', () => {
  test('renderiza títulos e campos', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', { name: /se doce fosse/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /painel administrativo/i, level: 2 })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const senha = screen.getByLabelText(/senha/i) as HTMLInputElement;
    expect(senha).toBeInTheDocument();
    expect(senha.type).toBe('password');

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('mostra erro quando email é inválido', async () => {
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'invalido@sem-tld');
    await userEvent.type(screen.getByLabelText(/senha/i), 'qualquer');
    await submit();

    expect(screen.getByText(/digite um email válido/i)).toBeInTheDocument();
  });

  test('mostra erro quando senha está vazia', async () => {
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@dominio.com');
    await submit();

    expect(
      screen.getByText(/a senha não pode estar vazia/i)
    ).toBeInTheDocument();
  });

  test('remove os erros quando o usuário corrige os campos e submete', async () => {
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'x@sem-tld');
    await submit();
    expect(screen.getByText(/digite um email válido/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'ok@dominio.com');

    const senhaInput = screen.getByLabelText(/senha/i);
    await userEvent.clear(senhaInput);
    await userEvent.type(senhaInput, 'minhaSenha@123');

    await submit();

    expect(
      screen.queryByText(/digite um email válido/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/a senha não pode estar vazia/i)
    ).not.toBeInTheDocument();
  });

  test('aceita emails válidos de forma case-insensitive (regex com /i)', async () => {
    render(<Login />);
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'USER+tag@EXAMPLE-CO.com.br'
    );
    await userEvent.type(screen.getByLabelText(/senha/i), '123');
    await submit();

    expect(
      screen.queryByText(/digite um email válido/i)
    ).not.toBeInTheDocument();
  });
});
