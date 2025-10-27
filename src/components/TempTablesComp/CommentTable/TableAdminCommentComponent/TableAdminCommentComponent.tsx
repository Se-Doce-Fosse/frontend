import { useState, useMemo } from 'react';
import { HeaderTableAdminComment } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import type { CommentRow } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCommentComponent.module.scss';
import { IoReload } from 'react-icons/io5';

interface TableAdminCommentComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TableAdminCommentComponent({
  filterStatus,
  searchTerm,
}: TableAdminCommentComponentProps) {
  const [comments, setComments] = useState<CommentRow[]>([
    {
      pedido: 'Cookie Vegano',
      cliente: 'Vegano',
      estrela: 4,
      status: 'aprovado',
      titulo: 'muito bom',
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

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch = comment.pedido
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus
        ? comment.status === filterStatus
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchTerm, filterStatus]);

  return (
    <div className={styles.TableAdminCommentComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Comentários</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Atualizar"
            icon={IoReload}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminComment
          comments={filteredComments}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
    </div>
  );
}

export default TableAdminCommentComponent;
