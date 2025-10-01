import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { Filter } from '@components';
import style from './Estoque.module.scss';

const categorias = [
  { label: 'Insumo', value: 'insumo' },
  { label: 'Embalagem', value: 'embalagem' },
];

const Estoque: React.FC = () => {
  return (
    <AdminLayout>
      <div className={style.estoque}>
        <h1>Estoque</h1>
        <Filter
          title="Filtro"
          searchPlaceholder="Busque por um insumo ou embalagem..."
          selectPlaceholder="Todas as categorias"
          selectOptions={categorias}
        />
      </div>
    </AdminLayout>
  );
};

export default Estoque;
