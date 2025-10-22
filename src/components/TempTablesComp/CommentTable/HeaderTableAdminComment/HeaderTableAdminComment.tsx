import React from 'react';
import styles from './HeaderTableAdminComment.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';
import { Button } from '../../../Button/Button';
import { RatingStars } from '../../../RatingStars/RatingStars';

export type CommentRow = {
  pedido: string;
  cliente: string;
  estrela: number;
  status: StatusEnum;
  titulo: string;
};

type TableProps = {
  comments: CommentRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminComment: React.FC<TableProps> = ({ comments }) => {
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
                <td>
                  <RatingStars />
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.titulo}</td>
                <td>
                  <span className={styles.acptDcln}>
                    <Button
                      label={'Aceitar'}
                      className={styles.acptBtn}
                      //onClick={() => func()}
                    />
                    <Button
                      label={'Recusar'}
                      className={styles.dclnBtn}
                      //onClick={() => func()}
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
