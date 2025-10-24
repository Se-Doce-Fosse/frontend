import { api } from '..';

export async function login(email: string, password: string) {
  return api(
    '/auth/login',
    {},
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function signup(
  username: string,
  email: string,
  role: string,
  password: string
) {
  return api(
    '/auth/signup',
    {},
    {
      method: 'POST',
      body: JSON.stringify({ username, email, role, password }),
    }
  );
}

export async function loginCliente(nome: string, telefone: string) {
  return api(
    '/login',
    {},
    {
      method: 'POST',
      body: JSON.stringify({ nome, telefone }),
    }
  );
}
