import type { Comment } from '../../data/comments.mock';
import type { ApiComment } from '../../types/api';
import { MOCK_COMMENTS } from '../../data/comments.mock';
import { api } from '../index';
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

export const fetchComments = async (): Promise<Comment[]> => {
  try {
    const apiComments: ApiComment[] = await api(
      '/comments',
      {},
      { method: 'GET' }
    );
    const comments = apiComments.map(mapApiCommentToComment);

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários da API:', error);
    // Fallback para dados mockados em caso de erro
    return MOCK_COMMENTS;
  }
};
