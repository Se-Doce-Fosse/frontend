import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteModal } from './DeleteModal';

describe('DeleteModal', () => {
  test('renderiza o item no texto de confirmação', () => {
    render(
      <DeleteModal
        item="Produto Teste"
        open={true}
        onOpenChange={jest.fn()}
        onClickConfirm={jest.fn()}
      />
    );

    expect(
      screen.getByText(/tem certeza que deseja excluir/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/produto teste/i)).toBeInTheDocument();
  });

  test('clica em Cancelar e dispara onOpenChange(false)', () => {
    const onOpenChange = jest.fn();

    render(
      <DeleteModal
        item="Produto Teste"
        open={true}
        onOpenChange={onOpenChange}
        onClickConfirm={jest.fn()}
      />
    );

    const cancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelar);

    // Dialog.Close deveria chamar onOpenChange(false)
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('clica em Confirmar e dispara onClickConfirm + onOpenChange(false)', () => {
    const onOpenChange = jest.fn();
    const onClickConfirm = jest.fn();

    render(
      <DeleteModal
        item="Produto Teste"
        open={true}
        onOpenChange={onOpenChange}
        onClickConfirm={onClickConfirm}
      />
    );

    const confirmar = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmar);

    expect(onClickConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
