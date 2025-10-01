import { render, screen, fireEvent } from '@testing-library/react';
import { AdressCard } from './AddressCard';

describe('AdressCard component', () => {
  it('renders with title and all form fields', () => {
    render(<AdressCard />);

    expect(screen.getByText('Endereço de entrega')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CEP*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome da Rua*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bairro*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nº do endereço*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nº do apto/casa')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', () => {
    const mockOnSubmit = jest.fn();
    render(<AdressCard onSubmit={mockOnSubmit} />);

    const form = screen.getByTestId('address-form');
    fireEvent.submit(form);

    expect(screen.getByText('CEP é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Nome da Rua é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Bairro é obrigatório')).toBeInTheDocument();
    expect(
      screen.getByText('Número do endereço é obrigatório')
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when valid', () => {
    const mockOnSubmit = jest.fn();
    render(<AdressCard onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('CEP*'), {
      target: { value: '12345-678' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nome da Rua*'), {
      target: { value: 'Rua das Flores' },
    });
    fireEvent.change(screen.getByPlaceholderText('Bairro*'), {
      target: { value: 'Centro' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nº do endereço*'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nº do apto/casa'), {
      target: { value: 'Apto 101' },
    });

    const form = screen.getByTestId('address-form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      cep: '12345-678',
      street: 'Rua das Flores',
      neighborhood: 'Centro',
      number: '123',
      complement: 'Apto 101',
    });
  });

  it('renders with initial data', () => {
    const initialData = {
      cep: '12345-678',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      number: '456',
      complement: 'Casa',
    };

    render(<AdressCard initialData={initialData} />);

    expect(screen.getByDisplayValue('12345-678')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rua Teste')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bairro Teste')).toBeInTheDocument();
    expect(screen.getByDisplayValue('456')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Casa')).toBeInTheDocument();
  });

  it('removes error when user starts typing', () => {
    render(<AdressCard />);

    const form = screen.getByTestId('address-form');
    fireEvent.submit(form);

    expect(screen.getByText('CEP é obrigatório')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('CEP*'), {
      target: { value: '1' },
    });

    expect(screen.queryByText('CEP é obrigatório')).not.toBeInTheDocument();
  });
});
