import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TableAdminEstoqueComponent from '../../components/TempTablesComp/EstoqueTable/TableAdminEstoqueComponent/TabelAdminEstoqueComponent';
import { Filter } from '../../components/Filter/Filter';
import style from './Estoque.module.scss';

const Cupons: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  return (
    <AdminLayout>
      <div className={style.estoque}>
        <h1>Estoque</h1>
        <div className={style.filter}>
          <Filter
            title="Filtros"
            selectOptions={statusOptions}
            selectPlaceholder="Categorias"
            searchPlaceholder="Buscar Insumo..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectProps={{
              value: filterStatus,
              onChange: (event) => setFilterStatus(event.target.value),
              options: statusOptions,
            }}
          />
        </div>
        <TableAdminEstoqueComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default Cupons;
