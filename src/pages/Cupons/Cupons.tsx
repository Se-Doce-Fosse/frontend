import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TabelAdminCupomComponent from '../../components/TempTablesComp/CupomTable/TableAdminCupomComponent/TableAdminCupomComponent';
const Cupons: React.FC = () => {
  return (
    <AdminLayout>
      <h1>Cupons</h1>
      <TabelAdminCupomComponent />
    </AdminLayout>
  );
};

export default Cupons;
