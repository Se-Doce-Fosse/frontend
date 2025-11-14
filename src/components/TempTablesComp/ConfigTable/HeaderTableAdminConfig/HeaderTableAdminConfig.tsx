import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminConfig.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';
import type { AdminUserRole } from '../../../../services/admin-users/admin-users';

export type userRow = {
  id: number;
  user: string;
  cargo: string;
  email: string;
  status: StatusEnum;
  role: AdminUserRole;
};

type TableProps = {
  users: userRow[];
  deleteRow: (row: userRow) => void;
  editRow: (row: userRow) => void;
};

export const HeaderTableAdminConfig: React.FC<TableProps> = ({
  users,
  deleteRow,
  editRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Usuários</th>
            <th>Cargo</th>
            <th>E-mail</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.user}</td>
                <td>{row.cargo}</td>
                <td>{row.email}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <span className={styles.actions}>
                    <BsFillPencilFill
                      className={styles['edit-btn']}
                      onClick={() => editRow(row)}
                      color="#5065B8"
                    />
                    <BsFillTrashFill
                      className={styles['delete-btn']}
                      onClick={() => deleteRow(row)}
                      color="#CA071A"
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
