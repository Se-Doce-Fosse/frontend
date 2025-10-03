import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminComment.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';

export type CommentRow = {
  pedido: string;
  cliente: string;
  estrela: number;
  status: 'ativo' | 'inativo';
};

type TableProps = {
  comments: CommentRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminComment: React.FC<TableProps> = ({
  comments,
  deleteRow,
  editRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Estrelas</th>
            <th>Status</th>
            <th>Titulo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.pedido}</td>
                <td>{row.cliente}</td>
                <td>{row.estrela}</td>
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
