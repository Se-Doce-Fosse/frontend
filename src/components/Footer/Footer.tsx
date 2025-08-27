import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.scss';
import type { ReactNode } from 'react';

export interface CommentData {
  comment: string;
  name: string;
  phone: string;
}

export interface FooterProps {
  brandName?: string[];
  workingHours?: string[];
  contacts?: {
    type: 'instagram' | 'whatsapp' | 'email';
    href: string;
    label?: string;
  }[];
  highlightText?: string;
  commentTitle?: string;
  className?: string;
  onSendComment?: (data: CommentData) => void;
}

const iconByType: Record<'instagram' | 'whatsapp' | 'email', ReactNode> = {
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
  email: <FaEnvelope />,
};

export const Footer = ({
  brandName = ['Se', 'Doce', 'Fosse'],
  workingHours = ['Seg-Sex | 8h-18h', 'sáb | 8h-16h', 'Dom | Fechado'],
  contacts = [
    { type: 'instagram', href: '#', label: 'Instagram' },
    { type: 'whatsapp', href: '#', label: 'Whatsapp' },
    { type: 'email', href: '#', label: 'E-mail' },
  ],
  highlightText = 'Queremos saber sua opinião!   Avalie nossa loja!',
  commentTitle = 'Deixe um Comentário',
  className = '',
  onSendComment,
}: FooterProps) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!onSendComment) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    onSendComment({
      comment: String(formData.get('comment') || ''),
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
    });
    form.reset();
  };

  return (
    <footer
      className={`${styles.footer || ''} ${className}`}
      data-testid="site-footer"
      aria-labelledby="footer-brand"
    >
      <div className={styles.brand || ''}>
        <h2 id="footer-brand">
          {brandName.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h2>
      </div>

      <div className={styles.info || ''}>
        <section
          className={styles.hours || ''}
          aria-label="Horário de funcionamento"
        >
          <h3>Horário de funcionamento</h3>
          <ul>
            {workingHours.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>

        <section className={styles.contact} aria-label="Contato">
          <h3>Contato</h3>
          <ul>
            {contacts.map((c, i) => (
              <li key={i}>
                <a href={c.href} aria-label={c.label || c.type}>
                  {iconByType[c.type]}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.rightSide || ''}>
        <section aria-label="Destaque">
          <p>{highlightText}</p>
        </section>

        <aside
          className={styles.commentBox || ''}
          aria-labelledby="comment-title"
        >
          <h3 id="comment-title">{commentTitle}</h3>
          <form onSubmit={handleSubmit} data-testid="comment-form">
            <label>
              <textarea
                name="comment"
                required
                placeholder="Comentário*"
                rows={3}
              />
            </label>

            <div className={styles.row || ''}>
              <label>
                <input name="name" type="text" required placeholder="Nome*" />
              </label>

              <label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Telefone*"
                />
              </label>
            </div>

            <button type="submit">Enviar</button>
          </form>
        </aside>
      </div>
    </footer>
  );
};
