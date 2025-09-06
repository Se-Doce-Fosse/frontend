import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

jest.mock('../AddToCartButton', () => ({
  AddToCartButton: ({
    onQuantityChange,
  }: {
    onQuantityChange?: (q: number) => void;
  }) => (
    <button
      aria-label="Adicionar ao carrinho"
      onClick={() => onQuantityChange?.(1)}
    >
      Adicionar
    </button>
  ),
}));

describe('ProductCard component', () => {
  const baseProps = {
    imageSrc: '/images/cookie.png',
    imageAlt: 'Cookie Oreo com Nutella',
    title: 'Cookie Oreo com Nutella',
    description: 'Delicioso cookie recheado com Nutella cremosa.',
    priceCents: 1500,
  } as const;

  it('renders image, title and description', () => {
    render(<ProductCard {...baseProps} />);

    expect(
      screen.getByRole('img', { name: baseProps.imageAlt })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: baseProps.title })
    ).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it('hides description when empty string', () => {
    render(<ProductCard {...baseProps} description="" />);
    expect(screen.queryByText(baseProps.description)).not.toBeInTheDocument();
  });

  it('formats price as BRL', () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText(/R\$\s?15,00/)).toBeInTheDocument();
  });

  it('sets aria-label on article with title', () => {
    render(<ProductCard {...baseProps} />);
    const article = screen.getByRole('article', { name: baseProps.title });
    expect(article).toBeInTheDocument();
  });

  it('applies extra className when provided', () => {
    render(<ProductCard {...baseProps} className="extra-class" />);
    const article = screen.getByRole('article', { name: baseProps.title });
    expect(article.className).toMatch(/extra-class/);
  });

  it('calls onQuantityChange when AddToCartButton is clicked (mocked)', () => {
    const handleQuantity = jest.fn();
    render(<ProductCard {...baseProps} onQuantityChange={handleQuantity} />);

    const btn = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    fireEvent.click(btn);

    expect(handleQuantity).toHaveBeenCalledWith(1);
  });
});
