import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';

describe('AddToCartButton', () => {
  it('deve renderizar estado inicial com label + Adicionar (desktop)', () => {
    render(<AddToCartButton />);
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar/i })
    ).toBeInTheDocument();
  });

  it('ao clicar, deve trocar para contador [-] 1 [+]', () => {
    render(<AddToCartButton />);
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
    render(<AddToCartButton />);
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    const increaseBtn = screen.getByRole('button', {
      name: /aumentar quantidade/i,
    });

    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('decrementa a quantidade ao clicar no botão [-]', () => {
    render(<AddToCartButton quantity={3} />);
    const decreaseBtn = screen.getByRole('button', {
      name: /diminuir quantidade/i,
    });

    fireEvent.click(decreaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('retorna ao estado inicial quando quantidade volta para 0', () => {
    render(<AddToCartButton quantity={1} />);
    const decreaseBtn = screen.getByRole('button', {
      name: /diminuir quantidade/i,
    });

    fireEvent.click(decreaseBtn);

    expect(
      screen.getByRole('button', { name: /adicionar/i })
    ).toBeInTheDocument();
  });

  it('chama onQuantityChange sempre que a quantidade muda', () => {
    const handleChange = jest.fn();
    render(<AddToCartButton onQuantityChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /aumentar quantidade/i })
    );
    fireEvent.click(
      screen.getByRole('button', { name: /diminuir quantidade/i })
    );

    // Inicial (0), depois (1), depois (2), depois (1)
    expect(handleChange).toHaveBeenCalledTimes(4);
    expect(handleChange).toHaveBeenNthCalledWith(1, 0);
    expect(handleChange).toHaveBeenNthCalledWith(2, 1);
    expect(handleChange).toHaveBeenNthCalledWith(3, 2);
    expect(handleChange).toHaveBeenNthCalledWith(4, 1);
  });
});
