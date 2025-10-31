import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminCupom.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';

export type CupomRow = {
  cupom: string;
  desconto: string;
  validade: Date;
  status: StatusEnum;
  unico: string;
};

type TableProps = {
  cupons: CupomRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminCupom: React.FC<TableProps> = ({
  cupons,
  deleteRow,
  editRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cupons</th>
            <th>Desconto</th>
            <th>Validade</th>
            <th>Status</th>
            <th>Unico</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cupons.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.cupom}</td>
                <td>{row.desconto}</td>
                <td>{row.validade.toLocaleDateString()}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.unico}</td>
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
