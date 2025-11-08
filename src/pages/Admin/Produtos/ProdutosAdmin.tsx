import React, { useState } from 'react';
import style from '../../Produtos/Produtos.module.scss';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout';
import { Filter } from '../../../components/Filter';
import TableAdminProdutoComponent from '../../../components/TempTablesComp/ProdutoTable/TableAdminComponent/TableAdminProdutoComponent';

const ProdutosAdmin: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'Cookies Tradicionais', label: 'Cookies Tradicionais' },
    { value: 'Cookies Recheados', label: 'Cookies Recheados' },
    { value: 'Bolos', label: 'Bolos' },
  ];

  return (
    <AdminLayout>
      <div className={style.produtos}>
        <h1>Produtos</h1>
        <div className={style.filter}>
          <Filter
            title="Filtros"
            selectOptions={statusOptions}
            selectPlaceholder="Categorias"
            searchPlaceholder="Buscar produto..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectProps={{
              value: filterStatus,
              onChange: (event) => setFilterStatus(event.target.value),
              options: statusOptions,
            }}
          />
        </div>
        <TableAdminProdutoComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default ProdutosAdmin;
