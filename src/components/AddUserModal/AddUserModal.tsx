import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import styles from './AddUserModal.module.scss';
import { signup } from '../../services/auth/auth';

export interface AddUserModalProps {
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdd = async () => {
    if (!username || !role || !email || !password) return;

    try {
      await signup(username, email, role, password);
    } catch (error) {
      console.log(error);
    }
    onClose();
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
            Adicionar Usuário
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
                onChange={(e) => setRole(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.buttonRow}>
              <Dialog.Close asChild>
                <Button
                  label="Cancelar"
                  variant="secondary"
                  className={styles.cancelButton}
                />
              </Dialog.Close>

              <Button
                label="Adicionar"
                onClick={handleAdd}
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
