import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TabelAdminCommentComponent from '../../components/TempTablesComp/CommentTable/TableAdminCommentComponent/TableAdminCommentComponent';

const Comentarios: React.FC = () => {
  return (
    <AdminLayout>
      <h1>Comentários</h1>
      <TabelAdminCommentComponent />
    </AdminLayout>
  );
};

export default Comentarios;
