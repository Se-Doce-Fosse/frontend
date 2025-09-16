import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from './CartItem';
import type { CartItemProps } from './CartItem';

const mockProps: CartItemProps = {
  id: '1',
  name: 'Cookie Oreo com Nutella',
  description:
    'Lorem ipsum dolor sit amet. Eum amet culpa aut commodi accusamus vel culpa suscipit!',
  price: 'R$ 15,00',
  imageSrc: '/images/cookie.png',
  imageAlt: 'Cookie Oreo com Nutella',
  quantity: 2,
  onIncrement: jest.fn(),
  onDecrement: jest.fn(),
  onRemove: jest.fn(),
};

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente com todas as informações', () => {
    render(<CartItem {...mockProps} />);

    expect(screen.getByText('Cookie Oreo com Nutella')).toBeInTheDocument();
    expect(screen.getByText('R$ 15,00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByAltText('Cookie Oreo com Nutella')).toBeInTheDocument();
  });

  it('deve chamar onIncrement quando o botão + for clicado', () => {
    render(<CartItem {...mockProps} />);

    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);

    expect(mockProps.onIncrement).toHaveBeenCalledWith('1');
  });

  it('deve chamar onDecrement quando o botão - for clicado', () => {
    render(<CartItem {...mockProps} />);

    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);

    expect(mockProps.onDecrement).toHaveBeenCalledWith('1');
  });

  it('deve desabilitar o botão - quando quantity for 1', () => {
    const propsWithQuantityOne = { ...mockProps, quantity: 1 };
    render(<CartItem {...propsWithQuantityOne} />);

    const decrementButton = screen.getByText('-');
    expect(decrementButton).toBeDisabled();
  });

  it('deve chamar onRemove quando o botão de lixeira for clicado', () => {
    render(<CartItem {...mockProps} />);

    const removeButton = screen.getByLabelText('Remover item');
    fireEvent.click(removeButton);

    expect(mockProps.onRemove).toHaveBeenCalledWith('1');
  });

  it('deve habilitar o botão - quando quantity for maior que 1', () => {
    render(<CartItem {...mockProps} />);

    const decrementButton = screen.getByText('-');
    expect(decrementButton).not.toBeDisabled();
  });

  it('deve renderizar a imagem com src e alt corretos', () => {
    render(<CartItem {...mockProps} />);

    const image = screen.getByAltText('Cookie Oreo com Nutella');
    expect(image).toHaveAttribute('src', '/images/cookie.png');
    expect(image).toHaveAttribute('alt', 'Cookie Oreo com Nutella');
  });
});
