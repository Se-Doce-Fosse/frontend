import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdmin.module.scss';

export type ProdutoRow = {
  produto: string;
  categoria: string;
  preco: number;
  status: 'ativo' | 'inativo';
  quantidade: number;
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
            <th className={styles.expand}>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Quantidade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((row, idx) => {
            const statusText =
              row.status.charAt(0).toUpperCase() + row.status.slice(1);

            return (
              <tr key={idx}>
                <td className={styles.expand}>{row.produto}</td>
                <td>{row.categoria}</td>
                <td>{row.preco}</td>
                <td>
                  <span
                    className={`${styles.label} ${styles[`label-${row.status}`]}`}
                  >
                    {statusText}
                  </span>
                </td>
                <td className={styles.quantidade}>{row.quantidade}</td>
                <td>
                  <span className={styles.actions}>
                    <BsFillPencilFill
                      className={styles['edit-btn']}
                      onClick={() => editRow(idx)}
                    />
                    <BsFillTrashFill
                      className={styles['delete-btn']}
                      onClick={() => deleteRow(idx)}
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
