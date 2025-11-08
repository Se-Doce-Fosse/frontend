import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminEstoque.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';

export type EstoqueRow = {
  item: string;
  quantidade: number;
  uniMedida: string;
  preco: number;
  categoria: StatusEnum;
  atualizadoEm: Date;
};

type TableProps = {
  estoque: EstoqueRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
  viewRow: (idx: number) => void;
};

export const HeaderTableAdminEstoque: React.FC<TableProps> = ({
  estoque,
  deleteRow,
  editRow,
  viewRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Uni.Medida</th>
            <th>Preco</th>
            <th>Categoria</th>
            <th>Atualizado Em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((row, idx) => {
            return (
              <tr
                key={idx}
                className={styles['clickable-row']}
                onClick={() => viewRow(idx)}
              >
                <td>{row.item}</td>
                <td>{row.quantidade}</td>
                <td>{row.uniMedida}</td>
                <td>{row.preco}</td>
                <td>
                  <StatusBadge status={row.categoria} />
                </td>
                <td>{row.atualizadoEm.toLocaleDateString()}</td>
                <td>
                  <span className={styles.actions}>
                    <BsFillPencilFill
                      className={styles['edit-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        editRow(idx);
                      }}
                      color="#5065B8"
                    />
                    <BsFillTrashFill
                      className={styles['delete-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRow(idx);
                      }}
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
