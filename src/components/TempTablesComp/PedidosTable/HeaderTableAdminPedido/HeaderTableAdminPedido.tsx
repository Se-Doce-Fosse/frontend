import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminPedido.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';

export type PedidoRow = {
  pedido: string;
  cliente: string;
  total: number;
  status: StatusEnum;
  atualizadoEm: Date;
};

type TableProps = {
  pedidos: PedidoRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminPedido: React.FC<TableProps> = ({
  pedidos,
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
            <th>Total</th>
            <th>Status</th>
            <th>Atualizado Em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.pedido}</td>
                <td>{row.cliente}</td>
                <td>{row.total}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.atualizadoEm.toLocaleDateString()}</td>
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
