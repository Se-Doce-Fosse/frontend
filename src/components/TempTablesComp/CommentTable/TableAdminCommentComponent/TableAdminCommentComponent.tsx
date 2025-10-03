import { useState } from 'react';
import { HeaderTableAdminComment } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import type { CommentRow } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCommentComponent.module.scss';

function TabelAdminCommentComponent() {
  const [comments, setComments] = useState<CommentRow[]>([
    {
      pedido: 'Cookie Vegano',
      cliente: 'Vegano',
      estrela: 4,
      status: 'ativo',
    },
  ]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const handleDeleteRow = (targetIndex: number) => {
    setComments(comments.filter((_, idx) => idx !== targetIndex));
  };

  const tempHandleEditRow = (idx: number) => {
    setRowToEdit(idx);
    console.log(rowToEdit);
    console.log('not done');
  };

  // const handleEditRow = (idx: number) => {
  //   setRowToEdit(idx);
  //   setModalOpen(true);
  // };

  return (
    <div className={styles.TabelAdminCommentComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Comments</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Atualizar"
            icon={BsPlus}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminComment
          comments={comments}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
    </div>
  );
}

export default TabelAdminCommentComponent;
