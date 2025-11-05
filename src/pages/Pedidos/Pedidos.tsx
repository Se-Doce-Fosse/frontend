import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TableAdminPedidoComponent from '../../components/TempTablesComp/PedidosTable/TableAdminComponent/TableAdminPedidoComponent';
import { Filter } from '../../components/Filter/Filter';
import style from './Pedidos.module.scss';

const Pedidos: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  return (
    <AdminLayout>
      <div className={style.pedidos}>
        <h1>Pedidos</h1>
        <div className={style.filter}>
          <Filter
            title="Filtros"
            selectOptions={statusOptions}
            selectPlaceholder="Status"
            searchPlaceholder="Buscar pedido..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectProps={{
              value: filterStatus,
              onChange: (event) => setFilterStatus(event.target.value),
              options: statusOptions,
            }}
          />
        </div>
        <TableAdminPedidoComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default Pedidos;
