import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

function Harness({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <SearchBar placeholder="Pesquisar..." value={value} onChange={setValue} />
  );
}

describe('SearchBar', () => {
  test('renderiza input com placeholder e controla o valor quando passado', async () => {
    const user = userEvent.setup();
    render(<Harness initial="pré" />);

    const input = screen.getByPlaceholderText(/pesquisar/i) as HTMLInputElement;
    expect(input.value).toBe('pré');

    await user.clear(input);
    await user.type(input, 'bolo');
    expect(input.value).toBe('bolo');
  });

  test('funciona sem onChange (modo não-controlado)', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar..." />);

    const input = screen.getByPlaceholderText(/buscar/i) as HTMLInputElement;
    await user.type(input, 'abc');
    expect(input.value).toBe('abc');
  });
});
