import { render, screen, fireEvent } from '@testing-library/react';
import { ProductDetailCard } from './ProductDetailCard';

describe('ProductDetailCard - onAddToCart', () => {
  const mockProduct = {
    id: '10',
    name: 'Bolo Red Velvet',
    price: 'R$ 35,00',
    imageSrc: '/images/bolo-red-velvet.jpg',
    imageAlt: 'Bolo Red Velvet',
    allergens: ['Sem Glúten', 'Sem Lactose', 'Vegan'],
    priceCents: 3500, // 👈 adicionei porque o componente usa isso
  };

  it('dispara onAddToCart ao clicar no botão', () => {
    const handleAddToCart = jest.fn();

    render(
      <ProductDetailCard
        {...mockProduct}
        description="Delicioso bolo red velvet com cobertura de cream cheese"
        onAddToCart={handleAddToCart}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith('10'); // 👈 confere se usou o id certo
  });
});
