import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import styles from './AddUserModal.module.scss';
import { signup } from '../../services/auth/auth';
import {
  type AdminUserRole,
  updateAdminUser,
} from '../../services/admin-users/admin-users';
import { useUser } from '../../context/UserContext';

export interface AddUserModalProps {
  onClose: () => void;
  onUserSaved?: () => void;
  editingUser?: {
    id: number;
    username: string;
    email: string;
    role: AdminUserRole;
  };
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  onClose,
  onUserSaved,
  editingUser,
}) => {
  const isEditing = Boolean(editingUser);
  const { user } = useUser();
  const [username, setUsername] = useState(editingUser?.username ?? '');
  const [role, setRole] = useState<AdminUserRole | ''>(editingUser?.role ?? '');
  const [email, setEmail] = useState(editingUser?.email ?? '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const actionLabel = useMemo(
    () => (isEditing ? 'Salvar alterações' : 'Adicionar'),
    [isEditing]
  );

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username);
      setRole(editingUser.role);
      setEmail(editingUser.email);
      setPassword('');
      setErrorMessage(null);
    }
  }, [editingUser]);

  const handleSubmit = async () => {
    if (!username || !role || !email || (!password && !isEditing)) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }
    const selectedRole = role as AdminUserRole;

    try {
      setErrorMessage(null);
      if (isEditing && editingUser) {
        if (!user?.token) {
          setErrorMessage('Sessão expirada. Faça login novamente.');
          return;
        }
        await updateAdminUser(editingUser.id, user.token, {
          username,
          email,
          role: selectedRole,
          password: password || undefined,
        });
      } else {
        await signup(username, email, selectedRole, password);
      }
      onUserSaved?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o usuário.';
      setErrorMessage(message);
    }
  };

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modal}>
          <Dialog.Title className={styles.title}>
            {isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}
          </Dialog.Title>

          <div className={styles.form}>
            <div className={styles.fieldGroup}>
              <Input
                label="Nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Cargo</label>
              <Select
                options={[
                  { label: 'Proprietário', value: 'ROLE_OWNER' },
                  { label: 'Gerente', value: 'ROLE_MANAGER' },
                  { label: 'Usuário', value: 'ROLE_USER' },
                ]}
                placeholder="Selecione o cargo"
                value={role}
                onChange={(e) => setRole(e.target.value as AdminUserRole)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isEditing ? 'Deixe em branco para manter a senha atual' : ''
                }
              />
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            <div className={styles.buttonRow}>
              <Dialog.Close asChild>
                <Button
                  label="Cancelar"
                  variant="secondary"
                  className={styles.cancelButton}
                />
              </Dialog.Close>

              <Button
                label={actionLabel}
                onClick={handleSubmit}
                className={styles.addButton}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddUserModal;
