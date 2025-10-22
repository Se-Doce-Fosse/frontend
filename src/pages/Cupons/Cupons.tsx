import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TabelAdminCupomComponent from '../../components/TempTablesComp/CupomTable/TableAdminCupomComponent/TableAdminCupomComponent';
import style from './Cupons.module.scss';
const Cupons: React.FC = () => {
  return (
    <AdminLayout>
      <div className={style.cupons}>
        <h1>Cupons</h1>

        <TabelAdminCupomComponent />
      </div>
    </AdminLayout>
  );
};

export default Cupons;
