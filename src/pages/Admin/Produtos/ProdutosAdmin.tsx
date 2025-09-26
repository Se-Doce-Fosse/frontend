import style from './Produtos.module.scss';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout';
import { Filter } from '../../../components/Filter';
import TableAdminComponent from '../../../components/TableAdminComponent/TableAdminComponent';

const status = [
  { label: 'Todos os status', value: 'todos' },
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
];

const ProdutosAdmin: React.FC = () => {
  return (
    <AdminLayout>
      <div className={style.produtos}>
        <h1>Produtos</h1>
        <Filter
          title="Filtro"
          searchPlaceholder="Busque por produto ou categoria..."
          selectPlaceholder="Todos os status"
          selectOptions={status}
        />
        <TableAdminComponent />
      </div>
    </AdminLayout>
  );
};

export default ProdutosAdmin;
