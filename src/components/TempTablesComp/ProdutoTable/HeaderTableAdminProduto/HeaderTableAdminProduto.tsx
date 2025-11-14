import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminProduto.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { Product } from 'src/types/product';
import { formatToBR } from '../../../../utils/price';

export type ProdutoRow = {
  produto: string;
  categoria: string;
  preco: number;
  status: 'ativo' | 'inativo';
  estoque: number;
};

type TableProps = {
  produtos: Product[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

export const HeaderTableAdminProduto: React.FC<TableProps> = ({
  produtos,
  deleteRow,
  editRow,
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((row, idx) => {
            const category = row.category;
            return (
              <tr key={idx}>
                <td>{row.name}</td>
                <td>{category?.name}</td>
                <td>{formatToBR(row.price)}</td>
                <td>{row.quantity}</td>
                <td>
                  <StatusBadge status={row.isActive ? 'ativo' : 'inativo'} />
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
