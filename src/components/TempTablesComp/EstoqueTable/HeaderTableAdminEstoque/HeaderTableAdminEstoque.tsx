import React from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import styles from './HeaderTableAdminEstoque.module.scss';
import { StatusBadge } from '../../../StatusBadge/StatusBadge';
import type { StatusEnum } from 'src/types/status';

export type EstoqueRow = {
  item: string;
  quantidade: number;
  pontoReposicao: number;
  uniMedida: string;
  preco: number;
  categoria: StatusEnum;
};

type TableProps = {
  estoque: EstoqueRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
};

const brlFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

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
            <th>Ponto de Reposição</th>
            <th>Uni.Medida</th>
            <th>Preço Compra</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{row.item}</td>
                <td>{row.quantidade}</td>
                <td>{row.pontoReposicao}</td>
                <td>{row.uniMedida}</td>
                <td>{brlFmt.format(row.preco)}</td>
                <td>
                  <StatusBadge status={row.categoria} />
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
