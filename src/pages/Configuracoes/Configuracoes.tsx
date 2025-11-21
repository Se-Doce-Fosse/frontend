import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import style from './Configuracoes.module.scss';
import { Filter } from '../../components/Filter/Filter';
import TableAdminConfigComponent from '../../components/TempTablesComp/ConfigTable/TableAdminConfigComponent/TableAdminConfigComponent';

const Configuracoes: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  return (
    <AdminLayout>
      <div className={style.users}>
        <h1>Configurações</h1>

        <div className={style.filter}>
          <h1>Outras Contas</h1>
          <Filter
            title="Filtros"
            selectOptions={statusOptions}
            selectPlaceholder="Cargos"
            searchPlaceholder="Buscar Usuário"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectProps={{
              value: filterStatus,
              onChange: (event) => setFilterStatus(event.target.value),
              options: statusOptions,
            }}
          />
        </div>
        <TableAdminConfigComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
