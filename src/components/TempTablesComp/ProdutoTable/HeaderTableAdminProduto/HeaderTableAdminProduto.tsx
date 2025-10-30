import React from 'react';
import { BsFillTrashFill, BsFillPencilFill, BsEye } from 'react-icons/bs';
import styles from './HeaderTableAdminProduto.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { Product } from 'src/types/product';

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
  viewRow?: (idx: number) => void;
};

export const HeaderTableAdminProduto: React.FC<TableProps> = ({
  produtos,
  deleteRow,
  editRow,
  viewRow,
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
                <td
                  onClick={() => viewRow && viewRow(idx)}
                  role={viewRow ? 'button' : undefined}
                  tabIndex={viewRow ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (!viewRow) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      viewRow(idx);
                    }
                  }}
                >
                  {row.name}
                </td>
                <td>{category?.name}</td>
                <td>{row.price}</td>
                <td>{row.quantity}</td>
                <td>
                  <StatusBadge status={row.isActive ? 'ativo' : 'inativo'} />
                </td>
                <td>
                  <span className={styles.actions}>
                    {viewRow && (
                      <BsEye
                        className={styles['view-btn']}
                        onClick={() => viewRow(idx)}
                        color="#2E3A59"
                      />
                    )}
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
