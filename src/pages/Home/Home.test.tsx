import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

// Evita setState assíncrono durante o teste, simulando dados já carregados
jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({ products: [], loading: false, error: null }),
}));

test('renderiza título da seção Doces na Home', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  expect(
    screen.getByRole('heading', { level: 1, name: /doces/i })
  ).toBeInTheDocument();
});
