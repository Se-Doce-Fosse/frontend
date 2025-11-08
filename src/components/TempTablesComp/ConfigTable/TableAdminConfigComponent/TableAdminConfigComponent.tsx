import { useState, useMemo } from 'react';
import { HeaderTableAdminConfig } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
import type { userRow } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import { AddUserModal } from '../../../AddUserModal';
import styles from './TableAdminConfigComponent.module.scss';

interface TableAdminConfigComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TableAdminConfigComponent({
  filterStatus,
  searchTerm,
}: TableAdminConfigComponentProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<userRow[]>([
    {
      user: 'Cookie Vegano',
      cargo: 'admin',
      email: 'Vegano',
      status: 'ativo',
    },
  ]);

  const [_rowToEdit, setRowToEdit] = useState<number | null>(null);
  void _rowToEdit;

  const handleDeleteRow = (targetIndex: number) => {
    setUsers((prev) => prev.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.user
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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

      {modalOpen && (
        <AddUserModal
          onClose={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
        />
      )}
    </div>
  );
}

export default TableAdminConfigComponent;
