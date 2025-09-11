import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdmin.module.scss';
import { StatusBadge } from '../StatusBadge/StatusBadge';

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
            <th>Quantidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((row, idx) => {
            return (
              <tr key={idx}>
                <td className={styles.expand}>{row.produto}</td>
                <td>{row.categoria}</td>
                <td>{row.preco}</td>
                <td className={styles.quantidade}>{row.quantidade}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
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
