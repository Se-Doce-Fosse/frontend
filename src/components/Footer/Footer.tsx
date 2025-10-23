import styles from './Footer.module.scss';
import logoFooter from '../../assets/images/logo-footer.png';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useState, type ReactNode } from 'react';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { RatingStars } from '../RatingStars';
import { createComment } from '../../services/comment/commentService';
import type { ApiError } from '../../services';

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
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    comment?: string;
    name?: string;
    phone?: string;
  }>({});

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const comment = String(formData.get('comment') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '');
    const digitsOnly = phone.replace(/\D/g, '');
    const normalizedId = digitsOnly.slice(-9);
    const clienteId = Number(normalizedId);
    const errors: typeof fieldErrors = {};
    setFeedback(null);
    setFieldErrors({});

    if (!comment) {
      errors.comment = 'Escreva seu comentário.';
    }
    if (!name) {
      errors.name = 'Informe seu nome.';
    }
    if (!normalizedId) {
      errors.phone = 'Informe um telefone.';
    } else if (normalizedId.length < 8) {
      errors.phone = 'Informe um telefone com DDD (mínimo 8 dígitos).';
    } else if (Number.isNaN(clienteId)) {
      errors.phone = 'Informe um telefone válido para continuar.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment({
        clienteId,
        descricao: comment,
        nomeExibicao: name,
        nota: rating,
        pedidoId: null,
      });

      onSendComment?.({
        comment,
        name,
        phone,
      });

      form.reset();
      setFieldErrors({});
      setRating(0);
      setFeedback({
        type: 'success',
        message: 'Comentário enviado com sucesso!',
      });
    } catch (error) {
      console.error(error);
      const apiError = error as ApiError;
      let message =
        apiError instanceof Error
          ? apiError.message
          : 'Não foi possível enviar seu comentário.';

      if (apiError?.status === 403) {
        message =
          'Você precisa ter pelo menos um pedido para enviar um comentário.';
      }

      setFeedback({
        type: 'error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
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

          <div
            className={`${styles.textareaGroup} ${
              fieldErrors.comment ? styles.inputError : ''
            }`}
          >
            <Textarea
              hasBorder
              aria-label="comentário"
              name="comment"
              placeholder="Escreva aqui..."
              rows={4}
            />
            {fieldErrors.comment && (
              <span className={styles.fieldError}>{fieldErrors.comment}</span>
            )}
          </div>

          <div
            className={`${styles.nameLabel} ${
              fieldErrors.name ? styles.inputError : ''
            }`}
          >
            <Input
              hasBorder
              name="name"
              placeholder="Nome*"
              aria-label="Nome"
            />
            {fieldErrors.name && (
              <span className={styles.fieldError}>{fieldErrors.name}</span>
            )}
          </div>

          <div
            className={`${styles.phoneLabel} ${
              fieldErrors.phone ? styles.inputError : ''
            }`}
          >
            <Input
              hasBorder
              name="phone"
              type="tel"
              placeholder="Telefone*"
              aria-label="Telefone"
            />
            {fieldErrors.phone && (
              <span className={styles.fieldError}>{fieldErrors.phone}</span>
            )}
          </div>

          <div className={styles.avaliation}>
            <RatingStars value={rating} onChange={setRating} />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className={
                feedback.type === 'success'
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {feedback.message}
            </p>
          )}
        </form>
      </div>
    </footer>
  );
};
