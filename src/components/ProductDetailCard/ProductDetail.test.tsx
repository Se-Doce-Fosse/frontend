import { render, screen, fireEvent } from '@testing-library/react';
import { ProductDetailCard } from './ProductDetailCard';

const mockProduct = {
  id: '10',
  name: 'Bolo Red Velvet',
  price: 'R$ 35,00',
  imageSrc: '/images/bolo-red-velvet.jpg',
  imageAlt: 'Bolo Red Velvet',
  allergens: ['Sem Glúten', 'Sem Lactose', 'Vegan'],
  priceCents: 3500,
  description: 'Delicioso bolo com massa vermelha e cobertura de cream cheese.',
};

function renderProductDetailCard(props = {}) {
  return render(
    <ProductDetailCard
      {...mockProduct}
      onQuantityChange={jest.fn()}
      onAddToCart={jest.fn()}
      {...props}
    />
  );
}

describe('ProductDetailCard', () => {
  it('renderiza nome, imagem, preço, alérgenos e descrição', () => {
    renderProductDetailCard();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.imageAlt)).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) => content.includes('R$') && content.includes('35,00')
      )
    ).toBeInTheDocument();
    mockProduct.allergens.forEach((a) => {
      expect(screen.getByText(a)).toBeInTheDocument();
    });
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it('ao clicar em adicionar, chama onAddToCart', () => {
    const onAddToCart = jest.fn();
    renderProductDetailCard({ onAddToCart });
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    expect(onAddToCart).toHaveBeenCalled();
  });

  it('incrementa e decrementa quantidade corretamente', () => {
    renderProductDetailCard();
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    expect(screen.getByText('1')).toBeInTheDocument();
    const increaseBtn = screen.getByRole('button', {
      name: /aumentar quantidade/i,
    });
    fireEvent.click(increaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    const decreaseBtn = screen.getByRole('button', {
      name: /diminuir quantidade/i,
    });
    fireEvent.click(decreaseBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('chama onQuantityChange ao alterar quantidade', () => {
    const onQuantityChange = jest.fn();
    render(
      <ProductDetailCard
        {...mockProduct}
        onQuantityChange={onQuantityChange}
        onAddToCart={jest.fn()}
      />
    );
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    expect(onQuantityChange).toHaveBeenCalledWith(1);
  });

  it('aplica classe alignCounter quando quantidade é maior que 0', () => {
    renderProductDetailCard();
    // Simula clique para adicionar (quantity = 1)
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    const price = screen.getByText(
      (content) => content.includes('R$') && content.includes('35,00')
    );
    const footer = price.closest('div');
    expect(footer?.className).toMatch(/alignCounter/);
  });
});
