// src/services/supply/adminSupply.ts
import { apiAdmin } from '../indexAdmin';

export type SupplyDTO = {
  id: number | string;
  nome: string;

  unidadeId?: number | string;
  unidadeNome?: string;

  unidade?: { id?: number | string; nome?: string } | null;

  quantidade: number;

  precoCompra?: number | string;
  preco_compra?: number | string;

  pontoReposicao?: number;
  ponto_reposicao?: number;

  ehEmbalagem?: boolean;
  embalagem?: boolean;
};

export const adminFetchSupplies = async (): Promise<SupplyDTO[]> => {
  return apiAdmin('/supplies', { method: 'GET' });
};

export const adminCreateSupply = (body: {
  nome: string;
  unidade: { id: number };
  quantidade: number;
  preco_compra: number;
  ponto_reposicao: number;
  embalagem: boolean;
}) =>
  apiAdmin('/supplies', { method: 'POST', body: JSON.stringify(body) });

export const adminUpdateSupply = (
  id: number | string,
  body: Partial<{
    nome: string;
    unidade: { id: number };
    quantidade: number;
    preco_compra: number;
    ponto_reposicao: number;
    embalagem: boolean;
  }>
) => apiAdmin(`/supplies/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const adminDeleteSupply = (id: number | string) =>
  apiAdmin(`/supplies/${id}`, { method: 'DELETE' });
