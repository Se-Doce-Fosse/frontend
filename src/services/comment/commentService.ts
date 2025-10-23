import { api } from '..';

export interface CreateCommentPayload {
  id?: number;
  pedidoId?: number | null;
  clienteId: number;
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
