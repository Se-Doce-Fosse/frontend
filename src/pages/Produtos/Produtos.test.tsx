import { render, screen } from '@testing-library/react';
import Produtos from './Produtos';

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

describe('Produtos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollTo = jest.fn();
  });

  it('renderiza a NavBar e o Footer', () => {
    render(<Produtos />);

    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(navBarSpy).toHaveBeenCalledTimes(1);
    expect(footerSpy).toHaveBeenCalledTimes(1);
  });

  it('renderiza as seções de produtos com os dados esperados', () => {
    render(<Produtos />);

    expect(productListSpy).toHaveBeenCalledTimes(2);

    const [firstCall, secondCall] = productListSpy.mock.calls;
    const firstProps = firstCall[0];
    const secondProps = secondCall[0];

    expect(firstProps.title).toBe('Cookies Tradicionais');
    expect(firstProps.products).toHaveLength(3);
    expect(secondProps.title).toBe('Cookies Recheados');
    expect(secondProps.products).toHaveLength(5);

    expect(
      screen.getByTestId('product-list-Cookies Tradicionais')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('product-list-Cookies Recheados')
    ).toBeInTheDocument();
  });

  it('posiciona a página no topo ao montar', () => {
    render(<Produtos />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
