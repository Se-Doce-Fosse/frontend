import { render, screen, waitFor } from '@testing-library/react';
import Produtos from './Produtos';
import { CartProvider } from '../../context/CartContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./Produtos.module.scss', () => ({
  page: 'page',
  content: 'content',
  productListWrapper: 'productListWrapper',
}));

const navBarSpy = jest.fn();
const footerSpy = jest.fn();
const productListSpy = jest.fn();

jest.mock('../../components', () => ({
  NavBar: (props: unknown) => {
    navBarSpy(props);
    return <nav data-testid="navbar-mock">NavBar</nav>;
  },
  Footer: (props: unknown) => {
    footerSpy(props);
    return <footer data-testid="footer-mock">Footer</footer>;
  },
}));

jest.mock('../../components/ProductList', () => ({
  __esModule: true,
  default: (props: { title: string; products: Array<unknown> }) => {
    productListSpy(props);
    return (
      <section data-testid={`product-list-${props.title}`}>
        {props.title} - {props.products.length}
      </section>
    );
  },
}));

jest.mock('../../components/Cart/CartDrawerOrder/CartDrawerOrder', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-drawer-order" />,
}));

jest.mock('../../components/Cart/CartDrawerFinish/CartDrawerFinish', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-drawer-finish" />,
}));

const mockFetchProducts = jest.fn();

jest.mock('../../services/product/productService', () => ({
  fetchProducts: () => mockFetchProducts(),
}));

const renderProdutos = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <Produtos />
      </CartProvider>
    </MemoryRouter>
  );

describe('Produtos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollTo = jest.fn();
    window.localStorage.clear();
    mockFetchProducts.mockResolvedValue({
      categories: [
        {
          id: 'category-1',
          name: 'Categoria 1',
          products: [
            {
              id: 'product-1',
              name: 'Produto 1',
              price: 'R$10,00',
              imageSrc: '/images/produto1.png',
              imageAlt: 'Produto 1',
            },
          ],
        },
        {
          id: 'category-2',
          name: 'Categoria 2',
          products: [
            {
              id: 'product-2',
              name: 'Produto 2',
              price: 'R$20,00',
              imageSrc: '/images/produto2.png',
              imageAlt: 'Produto 2',
            },
            {
              id: 'product-3',
              name: 'Produto 3',
              price: 'R$30,00',
              imageSrc: '/images/produto3.png',
              imageAlt: 'Produto 3',
            },
          ],
        },
      ],
    });
  });

  it('renderiza a NavBar e o Footer', async () => {
    renderProdutos();

    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(navBarSpy).toHaveBeenCalledTimes(1);
    expect(footerSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(productListSpy).toHaveBeenCalled());
  });

  it('renderiza as seções de produtos com os dados esperados', async () => {
    renderProdutos();

    await waitFor(() => expect(productListSpy).toHaveBeenCalled());

    const renderedSections = productListSpy.mock.calls.map(
      ([props]) => props.title
    );

    expect(renderedSections).toEqual(['Categoria 1', 'Categoria 2']);

    const [, secondCategoryCall] = productListSpy.mock.calls;

    expect(secondCategoryCall[0].products).toHaveLength(2);

    await waitFor(() =>
      expect(screen.getByTestId('product-list-Categoria 1')).toBeInTheDocument()
    );
    expect(screen.getByTestId('product-list-Categoria 2')).toBeInTheDocument();
  });

  it('posiciona a página no topo ao montar', async () => {
    renderProdutos();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    await waitFor(() => expect(productListSpy).toHaveBeenCalled());
  });

  it('exibe mensagem de carregamento e depois remove', async () => {
    renderProdutos();

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.queryByText('Carregando produtos...')
      ).not.toBeInTheDocument()
    );
  });

  it('exibe mensagem de erro quando a requisição falha', async () => {
    mockFetchProducts.mockRejectedValueOnce(new Error('Erro'));

    renderProdutos();

    await waitFor(() => {
      expect(
        screen.getByText('Um erro ocorreu tente novamente mais tarde')
      ).toBeInTheDocument();
    });
  });
});
