import { render, screen, fireEvent } from '@testing-library/react';
import { Filter } from './Filter';

type Option = { label: string; value: string; disabled?: boolean };

jest.mock('../Select', () => {
  const Select = (props: { placeholder?: string; options?: Option[] }) => {
    const { placeholder, options } = props;
    return (
      <div
        data-testid="select-mock"
        data-placeholder={placeholder ?? ''}
        data-options-length={(options?.length ?? 0).toString()}
      >
        SelectMock
      </div>
    );
  };
  return { __esModule: true, Select };
});

jest.mock('./components/SearchBar', () => {
  const SearchBar = (props: {
    placeholder?: string;
    value?: string;
    onChange?: (v: string) => void;
  }) => {
    const { placeholder, value, onChange } = props;
    return (
      <input
        data-testid="search-mock"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange?.((e.target as HTMLInputElement).value)}
      />
    );
  };
  return { __esModule: true, SearchBar };
});

describe('Filter', () => {
  test('renderiza título, repassa props ao SearchBar e Select, e dispara onSearchChange', () => {
    const onSearchChange = jest.fn<void, [string]>();

    render(
      <Filter
        title="Filtros"
        searchPlaceholder="Buscar produto..."
        searchValue="bolo"
        onSearchChange={onSearchChange}
        selectPlaceholder="Status"
        selectOptions={[
          { label: 'Ativo', value: 'ativo' },
          { label: 'Inativo', value: 'inativo' },
        ]}
      />
    );

    expect(
      screen.getByRole('heading', { name: /filtros/i })
    ).toBeInTheDocument();

    const search = screen.getByTestId('search-mock') as HTMLInputElement;
    expect(search).toHaveAttribute('placeholder', 'Buscar produto...');
    expect(search.value).toBe('bolo');

    fireEvent.change(search, { target: { value: 'brigadeiro' } });
    expect(onSearchChange).toHaveBeenCalledWith('brigadeiro');

    const select = screen.getByTestId('select-mock');
    expect(select.getAttribute('data-placeholder')).toBe('Status');
    expect(select.getAttribute('data-options-length')).toBe('2');
  });
});
