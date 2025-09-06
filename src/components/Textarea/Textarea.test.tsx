import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea component', () => {
  it('renders with label', () => {
    render(<Textarea label="Descrição" />);
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies textareaField class when hasBorder is false', () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea.className).toMatch(/textareaField/);
  });

  it('applies textareaBorder class when hasBorder is true', () => {
    render(<Textarea hasBorder data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea.className).toMatch(/textareaBorder/);
  });

  it('shows error message and applies textareaError class', () => {
    render(<Textarea error="Campo obrigatório" data-testid="textarea" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    const textarea = screen.getByTestId('textarea');
    expect(textarea.className).toMatch(/textareaError/);
  });

  it('passes props to textarea', () => {
    render(<Textarea placeholder="Digite aqui" />);
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
