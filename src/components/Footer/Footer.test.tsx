import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Footer } from './Footer';
import type { FooterProps } from './Footer';
import { createComment } from '../../services/comment/commentService';

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
  successMessage: 'success-message',
  errorMessage: 'error-message',
  inputError: 'input-error-class',
  fieldError: 'field-error-class',
}));

// Mocka qualquer import de imagem para não quebrar os testes
jest.mock('../../assets/images/logo-footer.png', () => 'logo-footer-mock');

jest.mock('../../services/comment/commentService', () => ({
  createComment: jest.fn(),
}));

const mockedCreateComment = createComment as jest.Mock;

describe('Footer Component', () => {
  beforeEach(() => {
    mockedCreateComment.mockReset();
  });

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

  it('submits the form, sends the comment and triggers callback', async () => {
    const onSendCommentMock = jest.fn();
    mockedCreateComment.mockResolvedValueOnce({});
    render(<Footer onSendComment={onSendCommentMock} />);

    const commentInput = screen.getByPlaceholderText('Escreva aqui...');
    const nameInput = screen.getByPlaceholderText('Nome*');
    const phoneInput = screen.getByPlaceholderText('Telefone*');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(commentInput, { target: { value: 'Ótimo serviço!' } });
    fireEvent.change(nameInput, { target: { value: 'Ana Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(51) 93456-7890' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateComment).toHaveBeenCalledTimes(1);
    });
    expect(mockedCreateComment).toHaveBeenCalledWith({
      clienteId: 934567890,
      descricao: 'Ótimo serviço!',
      nomeExibicao: 'Ana Silva',
      nota: 0,
      pedidoId: null,
    });

    expect(onSendCommentMock).toHaveBeenCalledTimes(1);
    expect(onSendCommentMock).toHaveBeenCalledWith({
      comment: 'Ótimo serviço!',
      name: 'Ana Silva',
      phone: '(51) 93456-7890',
    });
  });

  it('resets the form after submission', async () => {
    mockedCreateComment.mockResolvedValueOnce({});
    render(<Footer />);

    const form = screen.getByTestId('comment-form');
    const commentInput = screen.getByPlaceholderText('Escreva aqui...');
    const nameInput = screen.getByPlaceholderText('Nome*');
    const phoneInput = screen.getByPlaceholderText('Telefone*');

    fireEvent.change(commentInput, { target: { value: 'Test' } });
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(commentInput).toHaveValue('');
    });
    expect(nameInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
  });

  it('shows an error when required fields are missing', async () => {
    render(<Footer />);

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Escreva seu comentário.')).toBeInTheDocument();
    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument();
    expect(screen.getByText('Informe um telefone.')).toBeInTheDocument();
    expect(mockedCreateComment).not.toHaveBeenCalled();
  });

  it('submits the form even without onSendComment callback', async () => {
    mockedCreateComment.mockResolvedValueOnce({});
    render(<Footer />);

    const commentInput = screen.getByPlaceholderText('Escreva aqui...');
    const nameInput = screen.getByPlaceholderText('Nome*');
    const phoneInput = screen.getByPlaceholderText('Telefone*');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(commentInput, { target: { value: 'Comentário' } });
    fireEvent.change(nameInput, { target: { value: 'João' } });
    fireEvent.change(phoneInput, { target: { value: '987654321' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateComment).toHaveBeenCalledTimes(1);
    });
    expect(
      screen.getByText('Comentário enviado com sucesso!')
    ).toBeInTheDocument();
  });

  it('shows a specific error when user has no orders', async () => {
    const error = new Error(
      'Usuário deve fazer um pedido antes de poder comentar.'
    );
    (error as Error & { status?: number }).status = 403;
    mockedCreateComment.mockRejectedValueOnce(error);

    render(<Footer />);

    const commentInput = screen.getByPlaceholderText('Escreva aqui...');
    const nameInput = screen.getByPlaceholderText('Nome*');
    const phoneInput = screen.getByPlaceholderText('Telefone*');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(commentInput, { target: { value: 'Teste' } });
    fireEvent.change(nameInput, { target: { value: 'Fulano' } });
    fireEvent.change(phoneInput, { target: { value: '5194035757' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateComment).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText(
        'Você precisa ter pelo menos um pedido para enviar um comentário.'
      )
    ).toBeInTheDocument();
  });
});
