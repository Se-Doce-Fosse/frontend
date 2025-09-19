import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdmin.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';

export type ProdutoRow = {
  item: string;
  quantidade: number;
  uniMedida: string;
  preco: number;
  categoria: string;
  atualizadoEm: Date;
};

type TableProps = {
  produtos: ProdutoRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdmin: React.FC<TableProps> = ({
  produtos,
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
          {produtos.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.produto}</td>
                <td>{row.categoria}</td>
                <td>{row.preco}</td>
                <td>{row.estoque}</td>
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
