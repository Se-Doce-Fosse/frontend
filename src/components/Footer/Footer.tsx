import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.scss';
import logoFooter from '../../assets/images/logo-footer.png';
import type { ReactNode } from 'react';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

export interface CommentData {
  comment: string;
  name: string;
  phone: string;
}

export interface FooterProps {
  brandName?: string;
  workingHours?: string[];
  contacts?: {
    type: 'instagram' | 'whatsapp' | 'email';
    href: string;
    label: string;
  }[];
  highlightText?: string;
  commentTitle?: string;
  onSendComment?: (data: CommentData) => void;
  className?: string;
}

const iconByType: Record<'instagram' | 'whatsapp' | 'email', ReactNode> = {
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
  email: <FaEnvelope />,
};

export const Footer = ({
  brandName = 'Se fosse doce',
  workingHours = ['Seg-Sex | 8h-18h', 'Sáb | 8h-16h', 'Dom | Fechado'],
  contacts = [
    {
      type: 'instagram',
      href: 'https://www.instagram.com/sedocefosse/',
      label: 'Instagram',
    },
    {
      type: 'whatsapp',
      href: 'https://api.whatsapp.com/send/?phone=5551994527855&text=Ol%C3%A1%20Vim%20pelo%20site%20de%20voc%C3%AAs%20e%20gostaria%20de%20saber%20mais%20detalhes%20sobre%20a%20doceria.&type=phone_number&app_absent=0',
      label: 'Whatsapp',
    },
    { type: 'email', href: '#', label: 'E-mail' },
  ],
  highlightText = 'Queremos saber sua opinião! \n Avalie nossa loja!',
  commentTitle = 'Deixe um comentário',
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
      className={`${styles.footer} ${className}`}
      data-testid="site-footer"
    >
      <div
        className={`${styles.leftSide} ${className}`}
        data-testid="left-side-footer"
      >
        <img
          src={logoFooter}
          alt={`Logo ${brandName}`}
          className={styles.logo || ''}
        />

        <section className={styles.workingHours}>
          <h3>Horário de Funcionamento</h3>
          <ul>
            {workingHours.map((hours, index) => (
              <li key={index}>{hours}</li>
            ))}
          </ul>
        </section>

        <section className={styles.contacts}>
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

      <div
        className={`${styles.rightSide} ${className}`}
        data-testid="right-side-footer"
      >
        <h2 className={styles.highlightText}>{highlightText}</h2>

        <form
          className={styles.commentBox}
          onSubmit={handleSubmit}
          data-testid="comment-form"
        >
          <h3 className={styles.commentTitle}>{commentTitle}</h3>

          <div className={styles.textareaGroup}>
            <Textarea
              hasBorder
              aria-label="comentário"
              name="comment"
              placeholder="Escreva aqui..."
              rows={4}
            />
          </div>

          <div className={styles.nameLabel}>
            <Input
              hasBorder
              name="name"
              placeholder="Nome*"
              aria-label="Nome"
            />
          </div>

          <div className={styles.phoneLabel}>
            <Input
              hasBorder
              name="phone"
              type="tel"
              placeholder="Telefone*"
              aria-label="Telefone"
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </footer>
  );
};
