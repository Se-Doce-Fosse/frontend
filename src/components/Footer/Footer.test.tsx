import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from './Footer';
import type { FooterProps } from './Footer';

// Mocka o módulo de estilos
jest.mock('./Footer.module.scss', () => ({
  footer: 'footer-class',
  leftSide: 'left-side-class',
  rightSide: 'right-side-class',
  logo: 'logo-class',
  workingHours: 'working-hours-class',
  contacts: 'contacts-class',
  highlightText: 'highlight-text-class',
  commentBox: 'comment-box-class',
  commentTitle: 'comment-title-class',
  nameLabel: 'name-label-class',
  phoneLabel: 'phone-label-class',
  buttonContainer: 'button-container-class',
}));

// Mocka qualquer import de imagem para não quebrar os testes
jest.mock('../../assets/images/logo-footer.png', () => 'logo-footer-mock');

describe('Footer Component', () => {
  it('renders with default props', () => {
    render(<Footer />);

    expect(screen.getByTestId('site-footer')).toBeInTheDocument();
    expect(screen.getByTestId('left-side-footer')).toBeInTheDocument();
    expect(screen.getByTestId('right-side-footer')).toBeInTheDocument();

    expect(screen.getByText('Horário de Funcionamento')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(
      screen.getByText(/Queremos saber sua opinião!/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Deixe um comentário')).toBeInTheDocument();
  });

  it('renders working hours and contacts correctly', () => {
    const customWorkingHours: string[] = ['Seg-Sex | 9h-17h'];
    const customContacts: FooterProps['contacts'] = [
      { type: 'instagram', href: 'url-ig', label: 'ig' },
    ];

    render(
      <Footer workingHours={customWorkingHours} contacts={customContacts} />
    );

    expect(screen.getByText('Seg-Sex | 9h-17h')).toBeInTheDocument();
    expect(screen.queryByText('sáb | 8h-16h')).not.toBeInTheDocument();

    expect(screen.getByLabelText('ig')).toBeInTheDocument();
    expect(screen.getByLabelText('ig')).toHaveAttribute('href', 'url-ig');
    expect(screen.queryByLabelText('Whatsapp')).not.toBeInTheDocument();
  });

  it('submits the form and calls onSendComment with form data', () => {
    const onSendCommentMock = jest.fn();
    render(<Footer onSendComment={onSendCommentMock} />);

    const commentInput = screen.getByPlaceholderText('Comentário*');
    const nameInput = screen.getByPlaceholderText('Nome*');
    const phoneInput = screen.getByPlaceholderText('Telefone*');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(commentInput, { target: { value: 'Ótimo serviço!' } });
    fireEvent.change(nameInput, { target: { value: 'Ana Silva' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });

    fireEvent.click(submitButton);

    expect(onSendCommentMock).toHaveBeenCalledTimes(1);
    expect(onSendCommentMock).toHaveBeenCalledWith({
      comment: 'Ótimo serviço!',
      name: 'Ana Silva',
      phone: '123456789',
    });
  });

  it('resets the form after submission', () => {
    const onSendCommentMock = jest.fn();
    render(<Footer onSendComment={onSendCommentMock} />);

    const form = screen.getByTestId('comment-form');
    const commentInput = screen.getByPlaceholderText('Comentário*');
    const nameInput = screen.getByPlaceholderText('Nome*');

    fireEvent.change(commentInput, { target: { value: 'Test' } });
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });

    fireEvent.submit(form);

    expect(commentInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });

  it('does not call onSendComment if it is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    render(<Footer onSendComment={undefined} />);

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
