import { api } from '..';
import type { CreateEstoque, UpdateEstoque } from '../../types/estoque';

const BASE_URL = '/admin/supplies';

const UNIT_MAP: Record<string, number> = {
  kg: 1,
  g: 2,
  L: 3,
  mL: 4,
  pacote: 5,
};

const hasId = (obj: unknown): obj is { id?: string | number } => {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
};

const toSupplyDto = (
  e: CreateEstoque | UpdateEstoque
): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unityRaw = String((e as any).unitOfMeasure ?? '');
  const parsedId = Number(unityRaw);
  const unityId =
    !Number.isNaN(parsedId) && parsedId > 0
      ? parsedId
      : (UNIT_MAP as Record<string, number>)[unityRaw];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id = hasId(e) && (e as any).id ? Number((e as any).id) : undefined;

  return {
    id,
    name: e.name,
    unityId,
    unityName: unityRaw || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quantity: Number((e as any).quantity ?? 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purchasePrice: (e as any).price
      ? Number(String((e as any).price).replace(/[^0-9.-]/g, ''))
      : 0,
    reorderPoint: 0,
    isPackaging: false,
  };
};

const fromSupplyDto = (dto: unknown): UpdateEstoque => {
  const d = (dto as Record<string, unknown> | null) ?? {};
  const rawQuantity = d['quantity'];
  const quantity =
    typeof rawQuantity === 'number' ? rawQuantity : Number(rawQuantity ?? 0);

  return {
    id: String(d['id'] ?? ''),
    name: (d['name'] as string) ?? '',
    quantity,
    price: d['purchasePrice'] != null ? String(d['purchasePrice']) : '',
    category: '',
    unitOfMeasure: (d['unityName'] as string) ?? '',
  };
};

export const getEstoque = async (token: string): Promise<UpdateEstoque[]> => {
  const res = await api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );

  if (Array.isArray(res)) return (res as unknown[]).map(fromSupplyDto);
  if (
    res &&
    typeof res === 'object' &&
    'items' in (res as Record<string, unknown>)
  ) {
    const items = (res as Record<string, unknown>)['items'];
    if (Array.isArray(items)) return items.map(fromSupplyDto);
  }

  return [];
};

export const createEstoque = async (estoque: CreateEstoque, token: string) => {
  const dto = toSupplyDto(estoque);
  const res = await api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'POST',
      body: JSON.stringify(dto),
    }
  );

  return fromSupplyDto(res);
};

export const updateEstoque = async (
  id: string,
  estoque: UpdateEstoque,
  token: string
) => {
  const dto = toSupplyDto(estoque);
  const res = await api(
    `${BASE_URL}/${id}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'PUT',
      body: JSON.stringify(dto),
    }
  );

  return fromSupplyDto(res);
};

export const deleteEstoque = async (id: string, token: string) => {
  return api(
    `${BASE_URL}/${id}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'DELETE',
    }
  );
};
