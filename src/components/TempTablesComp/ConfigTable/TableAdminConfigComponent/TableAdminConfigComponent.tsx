import { useCallback, useMemo, useState, useEffect } from 'react';
import { HeaderTableAdminConfig } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
import type { userRow } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import { AddUserModal } from '../../../AddUserModal';
import styles from './TableAdminConfigComponent.module.scss';
import { fetchAdminUsers } from '../../../../services/admin-users/admin-users';
import { useUser } from '../../../../context/UserContext';

const ROLE_LABELS: Record<string, string> = {
  ROLE_OWNER: 'Proprietário',
  ROLE_MANAGER: 'Gerente',
  ROLE_USER: 'Usuário',
};

interface TableAdminConfigComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TableAdminConfigComponent({
  filterStatus,
  searchTerm,
}: TableAdminConfigComponentProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<userRow[]>([]);

  const [_rowToEdit, setRowToEdit] = useState<number | null>(null);
  void _rowToEdit;

  const loadUsers = useCallback(async () => {
    if (!user?.token) {
      setFetchError(
        'Faça login como administrador para visualizar os usuários.'
      );
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      setFetchError(null);
      const apiUsers = await fetchAdminUsers(user.token);
      setUsers(
        apiUsers.map((admin) => ({
          user: admin.username,
          cargo: ROLE_LABELS[admin.role] ?? admin.role,
          email: admin.email,
          status: 'ativo',
        }))
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os usuários.';
      setFetchError(message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleDeleteRow = (targetIndex: number) => {
    setUsers((prev) => prev.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedTerm = searchTerm.toLowerCase();
      const matchesSearch =
        user.user.toLowerCase().includes(normalizedTerm) ||
        user.email.toLowerCase().includes(normalizedTerm);
      const matchesStatus = filterStatus ? user.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

  return (
    <div className={styles.TableAdminConfigComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Usuários</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Adicionar Usuário"
            icon={BsPlus}
            onClick={() => {
              setRowToEdit(null);
              setModalOpen(true);
            }}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>

      <HeaderTableAdminConfig
        users={filteredUsers}
        deleteRow={handleDeleteRow}
        editRow={handleEditRow}
      />

      {isLoading && <p className={styles.feedback}>Carregando usuários...</p>}
      {fetchError && (
        <p className={`${styles.feedback} ${styles.feedbackError}`}>
          {fetchError}
        </p>
      )}
      {!isLoading && !fetchError && filteredUsers.length === 0 && (
        <p className={styles.feedback}>Nenhum usuário encontrado.</p>
      )}

      {modalOpen && (
        <AddUserModal
          onClose={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onUserCreated={() => {
            void loadUsers();
          }}
        />
      )}
    </div>
  );
}

export default TableAdminConfigComponent;
