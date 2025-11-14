import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminEncomendas.module.scss';

export type EncomendaRow = {
  pedido: string;
  cliente: string;
  status: string;
  data: Date;
  total: number;
};

type TableProps = {
  encomendas: EncomendaRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminEncomendas: React.FC<TableProps> = ({
  encomendas,
  deleteRow,
  editRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Encomenda</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Status</th>
            <th>Atualizado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {encomendas.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.pedido}</td>
                <td>{row.cliente}</td>
                <td>{row.total.toFixed(2)}</td>
                <td>{row.status}</td>
                <td>{row.data.toLocaleDateString()}</td>

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

export default HeaderTableAdminEncomendas;
