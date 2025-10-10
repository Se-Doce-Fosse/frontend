import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { Filter } from '../../components/Filter';
import TableAdminEstoqueComponent from '../../components/TempTablesComp/EstoqueTable/TableAdminEstoqueComponent/TabelAdminEstoqueComponent';
import styles from './Estoque.module.scss';

const status = [
  { label: 'Todos os status', value: 'todos' },
  { label: 'Insumo', value: 'insumo' },
  { label: 'Embalagem', value: 'embalagem' },
];

const Estoque: React.FC = () => {
  return (
    <AdminLayout>
      <div className={styles.estoque}>
        <h1>Estoque</h1>
        <Filter
          title="Filtro"
          searchPlaceholder="Busque por um item..."
          selectPlaceholder="Todos os status"
          selectOptions={status}
        />
        <TableAdminEstoqueComponent />
      </div>
    </AdminLayout>
  );
};

export default Estoque;
