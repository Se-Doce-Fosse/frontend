import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminEstoque.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';

export type EstoqueRow = {
  item: string;
  quantidade: number;
  uniMedida: string;
  preco: number;
  categoria: 'ativo' | 'inativo';
};

type TableProps = {
  estoque: EstoqueRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminEstoque: React.FC<TableProps> = ({
  estoque,
  deleteRow,
  editRow,
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
              <tr key={idx}>
                <td>{row.item}</td>
                <td>{row.quantidade}</td>
                <td>{row.uniMedida}</td>
                <td>{row.preco}</td>
                <td>
                  <StatusBadge status={row.categoria} />
                </td>
                <td>atualizadoEm.toLocaleDateString()</td>
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
