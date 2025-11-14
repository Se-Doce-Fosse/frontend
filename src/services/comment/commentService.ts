import type { Comment } from '../../data/comments.mock';
import type { ApiComment } from '../../types/api';
import { MOCK_COMMENTS } from '../../data/comments.mock';
import { api } from '../index';
import { getHiddenCommentIds } from '../../utils/commentModeration';

const COMMENTS_ENDPOINT = '/comments';
export interface CreateCommentPayload {
  id?: number;
  pedidoId?: number | null;
  clienteId: string;
  nota: number;
  descricao: string;
  nomeExibicao: string;
}

export async function createComment(payload: CreateCommentPayload) {
  return api(
    '/comments',
    {},
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

const mapApiCommentToComment = (apiComment: ApiComment): Comment => ({
  id: apiComment.id.toString(),
  name: apiComment.nomeExibicao,
  description: apiComment.descricao,
  rating: apiComment.nota,
  createdAt: new Date().toISOString(), // API não retorna data, usando data atual
});

const requestApiComments = async (): Promise<ApiComment[]> => {
  return api(COMMENTS_ENDPOINT, {}, { method: 'GET' });
};

const isCommentHidden = (
  commentId: number | string,
  hiddenIds: Set<number>
) => {
  const normalizedId =
    typeof commentId === 'number' ? commentId : Number(commentId);

  if (!Number.isFinite(normalizedId)) {
    return false;
  }

  return hiddenIds.has(normalizedId);
};

export const fetchComments = async (): Promise<Comment[]> => {
  const hiddenIdsSet = new Set(getHiddenCommentIds());

  try {
    const apiComments = await requestApiComments();
    const comments = apiComments
      .filter((comment) => !isCommentHidden(comment.id, hiddenIdsSet))
      .map(mapApiCommentToComment);

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários da API:', error);
    // Fallback para dados mockados em caso de erro
    return MOCK_COMMENTS.filter(
      (comment) => !isCommentHidden(comment.id, hiddenIdsSet)
    );
  }
};

export const fetchAdminComments = async (): Promise<ApiComment[]> => {
  try {
    return await requestApiComments();
  } catch (error) {
    console.error('Erro ao buscar comentários da API:', error);
    throw error;
  }
};
