import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCouponModal from './AddCouponModal';

describe('AddCouponModal', () => {
  const onAddMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const findStatusElement = () => {
    return (
      screen.queryByLabelText('Status') ||
      screen.queryByRole('combobox') ||
      screen.queryByPlaceholderText('Selecione o status') ||
      screen.queryByText('Selecione o status') ||
      null
    );
  };

  it('renderiza título, inputs, radios e botões', () => {
    render(<AddCouponModal onAdd={onAddMock} onClose={onCloseMock} />);

    expect(screen.getByText('Adicionar Cupom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Cupom')).toBeInTheDocument();
    expect(screen.getByLabelText('Desconto (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Validade')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Único')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cancelar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar/i })
    ).toBeInTheDocument();
  });

  it('não chama onAdd se algum campo estiver vazio', () => {
    render(<AddCouponModal onAdd={onAddMock} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(onAddMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('preenche todos os campos e chama onAdd + onClose com os valores corretos', () => {
    render(<AddCouponModal onAdd={onAddMock} onClose={onCloseMock} />);

    const nameInput = screen.getByLabelText('Nome do Cupom');
    fireEvent.change(nameInput, { target: { value: 'CUPOM10' } });

    const discountInput = screen.getByLabelText('Desconto (%)');
    fireEvent.change(discountInput, { target: { value: '10' } });

    const dateInput = screen.getByLabelText('Validade');
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

    const statusEl = findStatusElement();
    expect(statusEl).toBeTruthy();

    if (statusEl) {
      const tag = statusEl.tagName?.toLowerCase();

      if (
        tag === 'select' ||
        tag === 'input' ||
        statusEl.getAttribute('role') === 'combobox'
      ) {
        fireEvent.change(statusEl, { target: { value: 'ativo' } });
      } else {
        fireEvent.click(statusEl);
        const option =
          screen.queryByText('Ativo') || screen.queryByText('ativo');
        expect(option).toBeTruthy();
        if (option) fireEvent.click(option);
      }
    }

    const radioNo = screen.getByLabelText('Não');
    fireEvent.click(radioNo);

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(onAddMock).toHaveBeenCalledTimes(1);
    expect(onAddMock).toHaveBeenCalledWith({
      name: 'CUPOM10',
      discount: 10,
      validity: '2025-12-31',
      status: 'ativo',
      unique: false,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('botão cancelar chama onClose', () => {
    render(<AddCouponModal onAdd={onAddMock} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
