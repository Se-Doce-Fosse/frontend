import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TableAdminCommentComponent from '../../components/TempTablesComp/CommentTable/TableAdminCommentComponent/TableAdminCommentComponent';
import { Filter } from '../../components/Filter/Filter';
import style from './Comentarios.module.scss';

const Comentarios: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'recusado', label: 'Recusado' },
    { value: 'pendente', label: 'Pendente' },
  ];

  return (
    <AdminLayout>
      <div className={style.comentarios}>
        <h1>Comentários</h1>
        <div className={style.filter}>
          <Filter
            title="Filtros"
            selectOptions={statusOptions}
            selectPlaceholder="Status"
            searchPlaceholder="Buscar comentário..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectProps={{
              value: filterStatus,
              onChange: (event) => setFilterStatus(event.target.value),
              options: statusOptions,
            }}
          />
        </div>
        <TableAdminCommentComponent
          filterStatus={filterStatus}
          searchTerm={searchValue}
        />
      </div>
    </AdminLayout>
  );
};

export default Comentarios;
