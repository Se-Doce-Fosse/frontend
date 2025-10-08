import { useState, useEffect } from 'react';
import { HeaderTableAdminProduto } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
import type { ProdutoRow } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
// import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminProdutoComponent.module.scss';
import { fetchProducts } from '../../../../services/product/productService';
import {
  ProductModal,
  type ProductValues,
  type Option,
} from '../../../../pages/Admin/Produtos/components/ProductModal/ProductModal';
import { fetchProductById } from '../../../../services/product/productService';
import { DeleteModal } from '../../../../components/DeleteModal/DeleteModal';

import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../../../services/product/adminProduct';

const brlFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

function moneyToNumber(v: string | number): number {
  if (typeof v === 'number') return v;

  // Normaliza para número: remove pontos (milhar) e troca vírgula por ponto
  const normalized = v
    .trim()
    .replace(/\./g, '') // remove milhar
    .replace(',', '.') // vírgula -> ponto
    .replace(/[^\d.-]/g, ''); // remove qualquer outra coisa

  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function formatBRL(n: number): string {
  return brlFmt.format(n); // ex: R$ 1.234,56
}

function extractCategoriaNome(x: unknown): string | null {
  if (!x || typeof x !== 'object') return null;
  // alguns backends retornam `categoriaNome` no GET /products/:id
  const v = (x as { categoriaNome?: unknown }).categoriaNome;
  return typeof v === 'string' && v.trim() ? v : null;
}

function TabelAdminProdutoComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<ProdutoRow[]>([]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const [produtoIds, setProdutoIds] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // estados específicos do ProductModal
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [values, setValues] = useState<ProductValues>({
    sku: undefined,
    nome: '',
    descricao: '',
    valor: '',
    imagemUrl: '',
    ativo: 'true',
    categoriaId: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // opções de categorias para o Select do modal
  const [categoriaOptions, setCategoriaOptions] = useState<Option[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const categorias = await fetchProducts();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const categoriasArr = Array.isArray((categorias as any)?.categories)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (categorias as any).categories
          : Array.isArray(categorias)
            ? categorias
            : [];

        const rows: ProdutoRow[] = [];
        const ids: string[] = [];

        for (const cat of categoriasArr) {
          const catNome = cat?.name ?? cat?.nome ?? 'Sem categoria';
          const prods = Array.isArray(cat?.products) ? cat.products : [];

          for (const p of prods) {
            const raw = p?.price ?? p?.valor ?? 'R$ 0,00';

            // aceita "12,34", "1.234,56", número etc.
            const precoNumero =
              typeof raw === 'number' ? raw : moneyToNumber(String(raw));

            const precoFormatado = formatBRL(precoNumero);

            rows.push({
              produto: p?.name ?? p?.nome ?? 'Produto',
              categoria: catNome,
              preco: precoFormatado,
              precoNumero,
              estoque: Number(p?.stock ?? p?.estoque ?? 0),
              status: (p?.ativo ? 'ativo' : 'inativo') as 'ativo' | 'inativo',
            });

            // capturar id/sku do backend para PUT/DELETE futuros
            const idStr =
              (typeof p?.sku === 'string' && p.sku) ||
              (typeof p?.id === 'string' && p.id) ||
              (typeof p?.id === 'number' && String(p.id)) ||
              '';
            ids.push(idStr);
          }
        }

        // montar opções únicas de categoria para o modal (sem stringify/parse)
        const seen = new Map<number, string>();

        for (const raw of categoriasArr as unknown[]) {
          if (!raw || typeof raw !== 'object') continue;

          const c = raw as {
            id?: number | string;
            nome?: string;
            name?: string;
          };

          const id =
            typeof c.id === 'number'
              ? c.id
              : typeof c.id === 'string'
                ? Number(c.id)
                : 0;

          if (!Number.isFinite(id) || id <= 0) continue;

          const label =
            (typeof c.nome === 'string' && c.nome) ||
            (typeof c.name === 'string' && c.name) ||
            'Sem categoria';

          if (!seen.has(id)) {
            seen.set(id, label);
          }
        }

        const options: Option[] = Array.from(seen, ([id, label]) => ({
          label,
          value: String(id),
        }));

        if (!cancelled) setCategoriaOptions(options);
        if (!cancelled) {
          setProdutos(rows);
          setProdutoIds(ids);
        }
      } catch (e) {
        console.error('Falha ao carregar produtos:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteOpen(true);
  };

  function openCreate() {
    setMode('create');
    setValues({
      sku: undefined,
      nome: '',
      descricao: '',
      valor: '',
      imagemUrl: '',
      ativo: 'true',
      categoriaId: '',
    });
    setErrors({});
    setModalOpen(true);
  }

  async function openEdit(idx: number) {
    setMode('edit');
    setRowToEdit(idx);

    const row = produtos[idx];

    // Pré-preenche com o que já temos na tabela (abre o modal rápido)
    setValues({
      sku: produtoIds[idx], // já guardamos o id/sku correspondente ao índice
      nome: row.produto,
      descricao: '',
      valor: (row.precoNumero ?? moneyToNumber(row.preco))
        .toFixed(2)
        .replace('.', ','),
      imagemUrl: '',
      ativo: row.status === 'ativo' ? 'true' : 'false',
      categoriaId:
        categoriaOptions.find((o) => o.label === row.categoria)?.value ?? '',
    });
    setErrors({});
    setModalOpen(true);

    // >>> Enriquecer com o GET /products/:id
    const id = produtoIds[idx];
    if (!id) return;

    try {
      const detail = await fetchProductById(id);
      const categoriaNomeApi = extractCategoriaNome(detail);
      const categoriaIdFromApi = categoriaNomeApi
        ? (categoriaOptions.find((o) => o.label === categoriaNomeApi)?.value ??
          '')
        : undefined;

      setValues((prev) => ({
        ...prev,
        sku: detail.id ?? prev.sku,
        nome: detail.name ?? prev.nome,
        descricao: detail.description ?? prev.descricao,
        // `price` vem como "R$ 28,00" no teu mapper → normaliza p/ "28,00"
        valor: moneyToNumber(detail.price).toFixed(2).replace('.', ','),
        imagemUrl: detail.imageSrc ?? prev.imagemUrl,
        // mantém `ativo` do row (se teu detalhe tiver isso no futuro, dá pra trocar aqui)
        categoriaId: categoriaIdFromApi ?? prev.categoriaId,
      }));
    } catch (e) {
      console.error('Falha ao carregar detalhes do produto:', e);
      // segue com os valores já exibidos
    }
  }

  function validate(v: ProductValues): boolean {
    const next: Partial<Record<keyof ProductValues, string>> = {};
    if (!v.nome.trim()) next.nome = 'Informe o nome';
    const valorN = moneyToNumber(v.valor);
    if (!(valorN > 0)) next.valor = 'Preço inválido';
    if (!v.categoriaId) next.categoriaId = 'Selecione a categoria';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmitModal() {
    if (!validate(values)) return;
    setIsSubmitting(true);
    try {
      if (mode === 'create' || rowToEdit === null) {
        // >>> POST (sem mudanças aqui)
        const bodyCreate = {
          nome: values.nome.trim(),
          descricao: values.descricao.trim(),
          valor: moneyToNumber(values.valor),
          imagemUrl: values.imagemUrl.trim(),
          ativo: values.ativo === 'true',
          categoria: { id: Number(values.categoriaId) },
        };

        const created = await adminCreateProduct(bodyCreate);

        const categoriaLabel =
          categoriaOptions.find(
            (o) => o.value === String(bodyCreate.categoria.id)
          )?.label ?? 'Sem categoria';

        const newRow: ProdutoRow = {
          produto: created?.nome ?? bodyCreate.nome,
          categoria: categoriaLabel,
          preco: formatBRL(created?.valor ?? bodyCreate.valor),
          precoNumero: created?.valor ?? bodyCreate.valor,
          estoque: 0,
          status: (created?.ativo ?? bodyCreate.ativo) ? 'ativo' : 'inativo',
        };

        setProdutos((s) => [newRow, ...s]);

        const newId =
          (typeof (created as { sku?: unknown })?.sku === 'string' &&
            (created as { sku: string }).sku) ||
          (typeof (created as { id?: unknown })?.id === 'number' &&
            String((created as { id: number }).id)) ||
          (typeof (created as { id?: unknown })?.id === 'string' &&
            (created as { id: string }).id) ||
          '';
        setProdutoIds((s) => [newId, ...s]);
      } else {
        // >>> PUT (enriquecido com GET /products/:id)
        const idx = rowToEdit;
        const currentId = produtoIds[idx];
        if (!currentId) {
          throw new Error('ID do produto não encontrado para edição.');
        }

        // 1) Busca detalhe do produto para completar campos faltantes
        const detail = await fetchProductById(currentId);

        // 2) Deriva categoriaId final:
        //    - prioridade: selecionado no form
        //    - senão: tenta casar categoriaNome do detalhe com options
        //    - senão: usa a categoria atual da linha
        const categoriaNomeApi = extractCategoriaNome(detail);
        const categoriaIdFromApi = categoriaNomeApi
          ? (categoriaOptions.find((o) => o.label === categoriaNomeApi)
              ?.value ?? '')
          : '';
        const categoriaIdFromRow =
          categoriaOptions.find((o) => o.label === produtos[idx].categoria)
            ?.value ?? '';
        const categoriaIdFinal =
          values.categoriaId || categoriaIdFromApi || categoriaIdFromRow;

        // 3) Define valor final: formulário > detalhe
        const valorFinal =
          moneyToNumber(values.valor) || moneyToNumber(detail.price);

        // 4) Monta body do PUT usando:
        //    - nome/descricao/imagem do form se preenchidos, senão do detalhe
        const bodyUpdate = {
          nome: values.nome.trim() || detail.name || produtos[idx].produto,
          descricao: values.descricao.trim() || detail.description || '',
          valor: valorFinal,
          imagemUrl: values.imagemUrl.trim() || detail.imageSrc || '',
          ativo: values.ativo === 'true',
          categoria: { id: Number(categoriaIdFinal || 0) },
        };

        const updated = await adminUpdateProduct(currentId, bodyUpdate);

        const categoriaLabelFinal =
          categoriaOptions.find(
            (o) => o.value === String(bodyUpdate.categoria.id)
          )?.label ?? produtos[idx].categoria;

        const patched: ProdutoRow = {
          produto: updated?.nome ?? bodyUpdate.nome,
          categoria: categoriaLabelFinal,
          preco: formatBRL(updated?.valor ?? bodyUpdate.valor),
          precoNumero: updated?.valor ?? bodyUpdate.valor,
          estoque: produtos[idx].estoque,
          status: (updated?.ativo ?? bodyUpdate.ativo) ? 'ativo' : 'inativo',
        };

        setProdutos((s) => s.map((r, i) => (i === idx ? patched : r)));

        const updatedId =
          (typeof (updated as { sku?: unknown })?.sku === 'string' &&
            (updated as { sku: string }).sku) ||
          (typeof (updated as { id?: unknown })?.id === 'number' &&
            String((updated as { id: number }).id)) ||
          (typeof (updated as { id?: unknown })?.id === 'string' &&
            (updated as { id: string }).id) ||
          currentId;

        setProdutoIds((s) => s.map((v, i) => (i === idx ? updatedId : v)));
      }

      setModalOpen(false);
      setRowToEdit(null);
    } catch (e) {
      console.error('Falha ao salvar produto:', e);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (deleteIndex === null) return;

    const sku = produtoIds[deleteIndex];
    if (!sku) {
      console.error('SKU não encontrado para exclusão.');
      setDeleteOpen(false);
      setDeleteIndex(null);
      return;
    }

    try {
      await adminDeleteProduct(sku);
      setProdutos((s) => s.filter((_, i) => i !== deleteIndex));
      setProdutoIds((s) => s.filter((_, i) => i !== deleteIndex));
    } catch (e) {
      console.error('Falha ao excluir produto:', e);
    } finally {
      setDeleteOpen(false);
      setDeleteIndex(null);
    }
  }

  return (
    <div className={styles.TabelAdminProdutoComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Produto"
            icon={BsPlus}
            onClick={openCreate}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminProduto
          produtos={produtos}
          deleteRow={handleDeleteRow}
          editRow={(idx) => openEdit(idx)}
        />
      </div>
      {modalOpen && (
        <ProductModal
          open={modalOpen}
          onOpenChange={(o) => {
            setModalOpen(o);
            if (!o) {
              setRowToEdit(null);
              setErrors({});
            }
          }}
          mode={mode}
          values={values}
          errors={errors}
          onChange={(patch) => setValues((s) => ({ ...s, ...patch }))}
          categoriaOptions={categoriaOptions}
          statusOptions={[
            { label: 'Ativo', value: 'true' },
            { label: 'Inativo', value: 'false' },
          ]}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitModal}
        />
      )}

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setDeleteIndex(null);
        }}
        item={deleteIndex !== null ? produtos[deleteIndex]?.produto : ''}
        onClickConfirm={confirmDelete}
      />
    </div>
  );
}

export default TabelAdminProdutoComponent;
