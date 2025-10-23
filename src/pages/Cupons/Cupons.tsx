import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TableAdminCupomComponent from '../../components/TempTablesComp/CupomTable/TableAdminCupomComponent/TableAdminCupomComponent';
import { Filter } from '../../components/Filter/Filter';
import style from './Cupons.module.scss';

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
      <div className={style.cupons}>
        <h1>Cupons</h1>
        <Filter
          title="Filtrar Cupons"
          selectOptions={statusOptions}
          selectPlaceholder="Status"
          searchPlaceholder="Buscar cupom..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectProps={{
            value: filterStatus,
            onChange: (event) => setFilterStatus(event.target.value),
            options: statusOptions,
          }}
        />
        <TableAdminCupomComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default Cupons;
