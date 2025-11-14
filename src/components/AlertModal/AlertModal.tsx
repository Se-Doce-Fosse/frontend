/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog';
import styles from './AlertModal.module.scss';
import { Button } from '@components';
import { BsCheckCircle, BsXCircle, BsInfoCircle } from 'react-icons/bs';
export type AlertVariant = 'success' | 'error' | 'info';

export interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  variant?: AlertVariant;
  // explicit messages can be passed
  messages?: string[];
  // or pass an error object returned by the backend / api wrapper
  error?: unknown;
}

function extractMessagesFromError(err: unknown): string[] {
  if (!err) return [];
  // If it's a simple Error
  if (err instanceof Error) return [err.message];
  if (typeof err === 'string') return [err];

  const msgs: string[] = [];
  try {
    const obj = err as any;
    // common shapes: { message: '...' }
    if (obj?.message && typeof obj.message === 'string') msgs.push(obj.message);

    // { errors: ['a','b'] } or { errors: [{message:'..'}] }
    if (Array.isArray(obj?.errors)) {
      obj.errors.forEach((e: any) => {
        if (typeof e === 'string') msgs.push(e);
        else if (e?.message) msgs.push(String(e.message));
      });
    }

    // { errors: { field: ['msg'] } }
    if (
      obj?.errors &&
      typeof obj.errors === 'object' &&
      !Array.isArray(obj.errors)
    ) {
      Object.values(obj.errors).forEach((v: any) => {
        if (Array.isArray(v)) v.forEach((it) => msgs.push(String(it)));
        else msgs.push(String(v));
      });
    }

    // { detail: '...' }
    if (obj?.detail) msgs.push(String(obj.detail));

    // fallback: stringify
    if (msgs.length === 0) {
      const asString =
        typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
      if (asString && asString !== '{}') msgs.push(asString);
    }
  } catch {
    // ignore
  }

  return msgs.filter(Boolean);
}

export function AlertModal({
  open,
  onOpenChange,
  title,
  variant = 'info',
  messages,
  error,
}: AlertModalProps) {
  const derived = messages ?? [];
  const extracted = extractMessagesFromError(error);
  const allMessages = [...derived, ...extracted];

  const icon =
    variant === 'success' ? (
      <BsCheckCircle className={styles.successIcon} size={22} />
    ) : variant === 'error' ? (
      <BsXCircle className={styles.errorIcon} size={22} />
    ) : (
      <BsInfoCircle className={styles.infoIcon} size={22} />
    );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.iconRow}>
            {icon}
            <Dialog.Title className={styles.title}>
              {title ??
                (variant === 'success'
                  ? 'Sucesso'
                  : variant === 'error'
                    ? 'Erro'
                    : 'Aviso')}
            </Dialog.Title>
          </div>

          {allMessages.length > 0 ? (
            <ul className={styles.messageList}>
              {allMessages.map((m, i) => (
                <li key={i} className={styles.messageItem}>
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: '0.75rem' }}>
              {variant === 'success'
                ? 'Operação realizada com sucesso.'
                : variant === 'error'
                  ? 'Ocorreu um erro.'
                  : 'Informação.'}
            </p>
          )}

          <div className={styles.footer}>
            <Dialog.Close asChild>
              <Button label="Fechar" variant="primary" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AlertModal;
