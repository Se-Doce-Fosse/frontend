import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';
import React from 'react';

// Wrapper para simular componente controlado
function ControlledAddToCartButton({ initialQuantity = 0 }) {
  const [quantity, setQuantity] = React.useState(initialQuantity);
  return <AddToCartButton quantity={quantity} onQuantityChange={setQuantity} />;
}

describe('AddToCartButton', () => {
  it('deve renderizar estado inicial com label + Adicionar (desktop)', () => {
    render(<ControlledAddToCartButton />);
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar/i })
    ).toBeInTheDocument();
  });

  it('ao clicar, deve trocar para contador [-] 1 [+]', () => {
    render(<ControlledAddToCartButton />);
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /diminuir quantidade/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /aumentar quantidade/i })
    ).toBeInTheDocument();
  });

  it('incrementa a quantidade ao clicar no botão [+]', () => {
    render(<ControlledAddToCartButton />);
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    const increaseBtn = screen.getByRole('button', {
      name: /aumentar quantidade/i,
    });

    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('decrementa a quantidade ao clicar no botão [-]', () => {
    render(<ControlledAddToCartButton initialQuantity={3} />);
    const decreaseBtn = screen.getByRole('button', {
      name: /diminuir quantidade/i,
    });

    fireEvent.click(decreaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('retorna ao estado inicial quando quantidade volta para 0', () => {
    render(<ControlledAddToCartButton initialQuantity={1} />);
    const decreaseBtn = screen.getByRole('button', {
      name: /diminuir quantidade/i,
    });

    fireEvent.click(decreaseBtn);

    expect(
      screen.getByRole('button', { name: /adicionar/i })
    ).toBeInTheDocument();
  });
});
