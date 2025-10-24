import React from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import TableAdminCommentComponent from '../../components/TempTablesComp/CommentTable/TableAdminCommentComponent/TableAdminCommentComponent';
import style from './Comentarios.module.scss';

const Comentarios: React.FC = () => {
  return (
    <AdminLayout>
      <div className={style.comentarios}>
        <h1>Comentários</h1>
        <TableAdminCommentComponent />
      </div>
    </AdminLayout>
  );
};

export default Comentarios;
