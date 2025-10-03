import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ProdutosAdmin from './ProdutosAdmin';

jest.mock('../../Produtos/Produtos.module.scss', () => ({
  produtos: 'produtos',
}));

jest.mock('../../../layouts/AdminLayout/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

const filterSpy = jest.fn();

jest.mock('../../../components/Filter', () => ({
  Filter: (props: {
    title: string;
    selectOptions: Array<{ label: string; value: string }>;
  }) => {
    filterSpy(props);
    return <div data-testid="filter-mock">{props.title}</div>;
  },
}));

const tableSpy = jest.fn();

jest.mock(
  '../../../components/TempTablesComp/ProdutoTable/TableAdminComponent/TableAdminProdutoComponent',
  () => ({
    __esModule: true,
    default: () => {
      tableSpy();
      return <div data-testid="table-admin-mock">Tabela</div>;
    },
  })
);

describe('ProdutosAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envolve o conteúdo no layout administrativo e exibe o título', () => {
    render(<ProdutosAdmin />);

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Produtos', level: 1 })
    ).toBeInTheDocument();
  });

  it('configura o filtro com as opções esperadas', () => {
    render(<ProdutosAdmin />);

    expect(filterSpy).toHaveBeenCalledTimes(1);
    const props = filterSpy.mock.calls[0][0] as {
      selectOptions: Array<{ label: string; value: string }>;
    };
    expect(props.selectOptions).toHaveLength(3);
    expect(
      props.selectOptions.map((option: { value: string }) => option.value)
    ).toEqual(['todos', 'ativos', 'inativos']);
  });

  it('renderiza a tabela administrativa', () => {
    render(<ProdutosAdmin />);

    expect(tableSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('table-admin-mock')).toBeInTheDocument();
  });
});
