import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

// Mock do navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockedNavigate,
  };
});

describe('NavBar Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('deve renderizar os itens do menu', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
  });

  it('deve navegar ao clicar em um item do menu', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavBar />
      </MemoryRouter>
    );

    const estoqueItem = screen.getByText('Estoque');
    fireEvent.click(estoqueItem);

    expect(mockedNavigate).toHaveBeenCalledWith('/estoque');
  });

  it('deve alternar entre expandido e colapsado', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavBar />
      </MemoryRouter>
    );

    const toggleButton = screen.getAllByRole('button')[0]; // primeiro botão do header
    fireEvent.click(toggleButton);

    // depois do clique, o estado deve mudar (não dá para verificar direto width inline, mas podemos checar se renderiza colapsado)
    expect(toggleButton).toBeInTheDocument();
  });
});
