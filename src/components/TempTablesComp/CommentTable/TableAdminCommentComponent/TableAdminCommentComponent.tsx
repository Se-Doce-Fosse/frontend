import { useState, useMemo, useEffect, useCallback } from 'react';
import { HeaderTableAdminComment } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import type { CommentRow } from '../HeaderTableAdminComment/HeaderTableAdminComment';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCommentComponent.module.scss';
import { IoReload } from 'react-icons/io5';
import { fetchAdminComments } from '../../../../services/comment/commentService';
import type { ApiComment } from '../../../../types/api';
import {
  addHiddenCommentId,
  getHiddenCommentIds,
  removeHiddenCommentId,
} from '../../../../utils/commentModeration';

interface TableAdminCommentComponentProps {
  filterStatus: string;
  searchTerm: string;
}

const mapCommentToRow = (
  comment: ApiComment,
  hiddenIds: Set<number>
): CommentRow => ({
  id: comment.id,
  pedido:
    comment.pedidoId !== null && comment.pedidoId !== undefined
      ? `Pedido #${comment.pedidoId}`
      : 'Sem pedido',
  cliente: comment.nomeExibicao || comment.clienteId,
  estrela: comment.nota,
  status: hiddenIds.has(comment.id) ? 'recusado' : 'aprovado',
  titulo: comment.descricao || 'Sem descrição',
});

function TableAdminCommentComponent({
  filterStatus,
  searchTerm,
}: TableAdminCommentComponentProps) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiComments = await fetchAdminComments();
      const hiddenIds = new Set(getHiddenCommentIds());
      setComments(
        apiComments.map((comment) => mapCommentToRow(comment, hiddenIds))
      );
    } catch (err) {
      console.error('Erro ao carregar comentários', err);
      setError('Não foi possível carregar os comentários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const filteredComments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return comments.filter((comment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [comment.pedido, comment.cliente, comment.titulo]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesStatus = filterStatus
        ? comment.status === filterStatus
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchTerm, filterStatus]);

  const handleRemoveComment = (commentId: number) => {
    const targetComment = comments.find((comment) => comment.id === commentId);
    if (!targetComment || targetComment.status === 'recusado') {
      return;
    }

    addHiddenCommentId(commentId);
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, status: 'recusado' } : comment
      )
    );
  };

  const handleShowComment = (commentId: number) => {
    const targetComment = comments.find((comment) => comment.id === commentId);
    if (!targetComment || targetComment.status === 'aprovado') {
      return;
    }

    removeHiddenCommentId(commentId);
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, status: 'aprovado' } : comment
      )
    );
  };

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
            onClick={loadComments}
            loading={loading}
          />
        </div>
      </div>
      <div className={styles.tableContent}>
        {loading && (
          <p className={styles.stateMessage}>Carregando comentários...</p>
        )}
        {!loading && error && (
          <p className={`${styles.stateMessage} ${styles.stateError}`}>
            {error}
          </p>
        )}
        {!loading && !error && filteredComments.length === 0 && (
          <p className={styles.stateMessage}>Nenhum comentário encontrado.</p>
        )}
        {!loading && !error && filteredComments.length > 0 && (
          <HeaderTableAdminComment
            comments={filteredComments}
            onRemove={handleRemoveComment}
            onShow={handleShowComment}
          />
        )}
      </div>
    </div>
  );
}

export default TableAdminCommentComponent;
