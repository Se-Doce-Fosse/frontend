import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { label: 'Opção A', value: 'a' },
  { label: 'Opção B', value: 'b' },
  { label: 'Desabilitada', value: 'x', disabled: true },
];

describe('Select', () => {
  test('renderiza placeholder hidden como primeiro item e o mantém selecionado inicialmente', () => {
    render(<Select placeholder="Selecione..." options={OPTIONS} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(screen.getByDisplayValue(/selecione/i)).toBeInTheDocument();

    const placeholderOpt = select.querySelector(
      'option[value=""]'
    ) as HTMLOptionElement;
    expect(placeholderOpt).toBeTruthy();
    expect(placeholderOpt.hidden).toBe(true);
    expect(placeholderOpt.textContent).toMatch(/selecione/i);

    expect(select.selectedIndex).toBe(0);

    expect(screen.getByRole('option', { name: 'Opção A' })).toBeEnabled();
    expect(screen.getByRole('option', { name: 'Opção B' })).toBeEnabled();
    expect(screen.getByRole('option', { name: 'Desabilitada' })).toBeDisabled();

    expect(document.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  test('permite alterar a seleção (não controlado)', async () => {
    const user = userEvent.setup();
    render(<Select placeholder="Selecione..." options={OPTIONS} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'b');

    expect(select.value).toBe('b');
    expect(screen.getByDisplayValue('Opção B')).toBeInTheDocument();
  });

  test('não renderiza placeholder quando não fornecido', () => {
    render(<Select options={OPTIONS} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.querySelector('option[value=""]')).toBeNull();
  });
});
