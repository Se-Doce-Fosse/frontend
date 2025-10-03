import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminConfig.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';

export type userRow = {
  user: string;
  cargo: string;
  email: string;
  status: 'ativo' | 'inativo';
};

type TableProps = {
  users: userRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
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
                      onClick={() => editRow(idx)}
                      color="#5065B8"
                    />
                    <BsFillTrashFill
                      className={styles['delete-btn']}
                      onClick={() => deleteRow(idx)}
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
