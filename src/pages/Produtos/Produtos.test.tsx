import { render, screen } from '@testing-library/react';
import Produtos from './Produtos';
import { CartProvider } from '../../context/CartContext';

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

const renderProdutos = () =>
  render(
    <CartProvider>
      <Produtos />
    </CartProvider>
  );

describe('Produtos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollTo = jest.fn();
    window.localStorage.clear();
  });

  it('renderiza a NavBar e o Footer', () => {
    renderProdutos();

    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(navBarSpy).toHaveBeenCalledTimes(1);
    expect(footerSpy).toHaveBeenCalledTimes(1);
  });

  it('renderiza as seções de produtos com os dados esperados', () => {
    renderProdutos();

    const renderedSections = productListSpy.mock.calls.map(
      ([props]) => props.title
    );

    expect(renderedSections).toEqual([
      'Cookies Tradicionais',
      'Cookies Recheados',
    ]);

    const [, stuffedCall] = productListSpy.mock.calls;

    expect(stuffedCall[0].products).toHaveLength(5);

    expect(
      screen.getByTestId('product-list-Cookies Tradicionais')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('product-list-Cookies Recheados')
    ).toBeInTheDocument();
  });

  it('posiciona a página no topo ao montar', () => {
    renderProdutos();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
