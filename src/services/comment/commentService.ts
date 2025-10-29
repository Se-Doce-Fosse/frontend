import type { Comment } from '../../data/comments.mock';
import { MOCK_COMMENTS } from '../../data/comments.mock';

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

// Simula uma imp do serviço para buscar comentários
export const fetchComments = async (): Promise<CommentsResponse> => {
  return {
    comments: MOCK_COMMENTS,
    total: MOCK_COMMENTS.length,
  };
};

// Simula uma chamada da API para buscar comentários
export const fetchFeaturedComments = async (): Promise<Comment[]> => {
  // Retorna os 9 primeiros comentários
  return MOCK_COMMENTS.slice(0, 9);
};
