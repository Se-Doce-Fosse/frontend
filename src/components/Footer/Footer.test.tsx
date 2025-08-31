import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from './Footer';
import type { FooterProps, CommentData } from './Footer';
import styles from './Footer.module.scss';

describe('Footer Component', () => {
  it('renders with default props', () => {
    render(<Footer />);

    expect(screen.getByTestId('site-footer')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /logo se fosse doce/i })
    ).toBeInTheDocument();

    // Seções
    expect(
      screen.getByRole('heading', { name: /horário de funcionamento/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /contato/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /deixe um comentário/i })
    ).toBeInTheDocument();

    // Texto de destaque
    expect(screen.getByText(/Queremos saber sua opinião/i)).toBeInTheDocument();
  });

  it('renders custom workingHours and contacts', () => {
    const customProps: FooterProps = {
      workingHours: ['Seg-Sex | 9h-17h'],
      contacts: [
        {
          type: 'email',
          href: 'mailto:test@test.com',
          label: 'Envie um e-mail',
        },
      ],
    };

    render(<Footer {...customProps} />);

    expect(screen.getByText('Seg-Sex | 9h-17h')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Envie um e-mail/i })
    ).toHaveAttribute('href', 'mailto:test@test.com');
  });

  it('applies custom className', () => {
    render(<Footer className="custom-footer" />);

    const footer = screen.getByTestId('site-footer');
    expect(footer).toHaveClass(styles.footer);
    expect(footer).toHaveClass('custom-footer');
  });

  it('submits the form and calls onSendComment', () => {
    const handleSendComment = jest.fn();

    render(<Footer onSendComment={handleSendComment} />);

    const form = screen.getByTestId('comment-form');
    const textarea = screen.getByPlaceholderText('Comentário*');
    const inputName = screen.getByPlaceholderText('Nome*');
    const inputPhone = screen.getByPlaceholderText('Telefone*');

    fireEvent.change(textarea, { target: { value: 'Ótimo atendimento!' } });
    fireEvent.change(inputName, { target: { value: 'João' } });
    fireEvent.change(inputPhone, { target: { value: '123456789' } });
    fireEvent.submit(form);

    expect(handleSendComment).toHaveBeenCalledWith({
      comment: 'Ótimo atendimento!',
      name: 'João',
      phone: '123456789',
    } as CommentData);
  });

  it('does not throw error when onSendComment is not provided', () => {
    render(<Footer />);
    const form = screen.getByTestId('comment-form');

    fireEvent.submit(form);

    // Se não passar onSendComment, apenas ignora
    expect(true).toBe(true);
  });
});
