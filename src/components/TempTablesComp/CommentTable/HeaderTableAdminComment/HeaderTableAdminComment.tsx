import React from 'react';
import styles from './HeaderTableAdminComment.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';
import { Button } from '../../../Button/Button';
import { RatingStars } from '../../../RatingStars/RatingStars';

export type CommentRow = {
  id: number;
  pedido: string;
  cliente: string;
  estrela: number;
  status: StatusEnum;
  titulo: string;
};

type TableProps = {
  comments: CommentRow[];
  onShow: (id: number) => void;
  onRemove: (id: number) => void;
};

export const HeaderTableAdminComment: React.FC<TableProps> = ({
  comments,
  onShow,
  onRemove,
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
          {comments.map((row) => {
            const isHidden = row.status === 'recusado';

            return (
              <tr key={row.id}>
                <td>{row.pedido}</td>
                <td>{row.cliente}</td>
                <td>
                  <RatingStars value={row.estrela} readOnly />
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.titulo}</td>
                <td>
                  <span className={styles.acptDcln}>
                    <Button
                      label={'Mostrar'}
                      className={styles.acptBtn}
                      disabled={!isHidden}
                      onClick={() => onShow(row.id)}
                    />
                    <Button
                      label={'Remover'}
                      className={styles.dclnBtn}
                      disabled={isHidden}
                      onClick={() => onRemove(row.id)}
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
