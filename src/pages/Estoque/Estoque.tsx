import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { Filter } from '../../components/Filter';
import TableAdminEstoqueComponent from '../../components/TempTablesComp/EstoqueTable/TableAdminEstoqueComponent/TabelAdminEstoqueComponent';

const status = [
  { label: 'Todos os status', value: 'todos' },
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
];

const Estoque: React.FC = () => {
  return (
    <AdminLayout>
      <h1>Estoque</h1>
      <Filter
        title="Filtro"
        searchPlaceholder="Busque por produto ou categoria..."
        selectPlaceholder="Todos os status"
        selectOptions={status}
      />
      <TableAdminEstoqueComponent />
    </AdminLayout>
  );
};

export default Estoque;
