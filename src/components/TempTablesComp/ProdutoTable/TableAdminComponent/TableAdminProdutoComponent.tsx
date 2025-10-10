// TableAdminProdutoComponent.tsx
import { useState, useEffect } from 'react';
import { HeaderTableAdminProduto } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
import type { ProdutoRow } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminProdutoComponent.module.scss';
import { fetchProducts, fetchProductById } from '../../../../services/product/productService';
import {
  ProductModal,
  type ProductValues,
  type Option,
} from '../../../../pages/Admin/Produtos/components/ProductModal/ProductModal';
import { DeleteModal } from '../../../../components/DeleteModal/DeleteModal';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../../../services/product/adminProduct';

// === helpers
const brlFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const formatBRL = (n: number) => brlFmt.format(n);
function priceToNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const clean = v.trim().replace(/^R\$\s?/, '').replace(/\./g, '').replace(',', '.');
    const n = Number(clean);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
function priceToBackendString(v: string | number): string {
  const n = typeof v === 'number' ? v : priceToNumber(v);
  return n.toFixed(2);
}

function TabelAdminProdutoComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoRow[]>([]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const [produtoIds, setProdutoIds] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [values, setValues] = useState<ProductValues>({
    sku: undefined,
    nome: '',
    descricao: '',
    valor: '',
    imagemUrl: '',
    ativo: 'false',
    categoriaId: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriaOptions, setCategoriaOptions] = useState<Option[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchProducts();
        const categoriasArr: Array<{ id?: unknown; name?: unknown; products?: unknown; }> =
          Array.isArray((all as any)?.categories) ? (all as any).categories : [];

        const rows: ProdutoRow[] = [];
        const ids: string[] = [];
        const opts: Option[] = [];

        for (const cat of categoriasArr) {
          const catId = typeof cat.id === 'string' ? cat.id : String(cat.id ?? '');
          const catName = typeof cat.name === 'string' ? cat.name : 'Sem categoria';
          if (catId && catName) opts.push({ value: catId, label: catName });

          const prods = Array.isArray(cat.products) ? (cat.products as any[]) : [];
          for (const p of prods) {
            const precoNumero = priceToNumber(p?.price ?? '0');
            rows.push({
              produto: p?.name ?? 'Produto',
              categoria: catName,
              preco: formatBRL(precoNumero),
              precoNumero,
              estoque: 0,
              status: p?.isActive === true ? 'ativo' : 'inativo',
            });
            ids.push(typeof p?.id === 'string' ? p.id : String(p?.id ?? ''));
          }
        }

        const uniq = new Map<string, string>();
        for (const o of opts) if (!uniq.has(o.value)) uniq.set(o.value, o.label);
        const uniqOptions: Option[] = Array.from(uniq, ([value, label]) => ({ value, label }));

        if (!cancelled) {
          setCategoriaOptions(uniqOptions);
          setProdutos(rows);
          setProdutoIds(ids);
        }
      } catch (e) {
        console.error('Falha ao carregar produtos:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteOpen(true);
  };
  async function confirmDelete() {
    if (deleteIndex === null) return;
    const sku = produtoIds[deleteIndex];
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

  function openCreate() {
    setMode('create');
    setValues({ sku: undefined, nome: '', descricao: '', valor: '', imagemUrl: '', ativo: 'false', categoriaId: '' });
    setErrors({});
    setModalOpen(true);
  }

  async function openEdit(idx: number) {
    setMode('edit');
    setRowToEdit(idx);

    setValues((s) => ({
      ...s,
      sku: produtoIds[idx],
      nome: produtos[idx].produto,
      descricao: '',
      valor: String(produtos[idx].precoNumero).replace('.', ','),
      imagemUrl: '',
      ativo: produtos[idx].status === 'ativo' ? 'true' : 'false',
      categoriaId: categoriaOptions.find((o) => o.label === produtos[idx].categoria)?.value ?? '',
    }));
    setErrors({});
    setModalOpen(true);

    try {
      const id = produtoIds[idx];
      if (!id) return;
      const detail = await fetchProductById(id);
      setValues((prev) => ({
        ...prev,
        sku: detail.id ?? prev.sku,
        nome: detail.name ?? prev.nome,
        descricao: (detail as any)?.description ?? prev.descricao,
        valor: priceToNumber(detail.price).toFixed(2).replace('.', ','),
        imagemUrl: detail.imageSrc ?? prev.imagemUrl,
        ativo: ((detail as any)?.isActive === true ? 'true' : 'false'),
        categoriaId: (detail as any)?.category?.id ?? prev.categoriaId,
      }));
    } catch (e) {
      console.error('Falha ao carregar detalhes do produto:', e);
    }
  }

  function validate(v: ProductValues): boolean {
    const next: Partial<Record<keyof ProductValues, string>> = {};
    if (!v.nome.trim()) next.nome = 'Informe o nome';
    if (!v.valor || priceToNumber(v.valor) <= 0) next.valor = 'Preço inválido';
    if (!v.categoriaId) next.categoriaId = 'Selecione a categoria';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmitModal() {
    if (!validate(values)) return;
    setIsSubmitting(true);
    try {
      if (mode === 'create' || rowToEdit === null) {
        const bodyCreate = {
          name: values.nome.trim(),
          price: priceToBackendString(values.valor),
          imageSrc: values.imagemUrl.trim(),
          imageAlt: values.nome.trim(),
          description: values.descricao?.trim?.() ?? '',
          isActive: values.ativo === 'true',
          category: { id: values.categoriaId },
        };
        const created = await adminCreateProduct(bodyCreate as any);

        const categoriaLabel = categoriaOptions.find((o) => o.value === values.categoriaId)?.label ?? 'Sem categoria';
        const precoNumero = priceToNumber((created as any)?.price ?? bodyCreate.price);

        const newRow: ProdutoRow = {
          produto: (created as any)?.name ?? bodyCreate.name,
          categoria: categoriaLabel,
          preco: formatBRL(precoNumero),
          precoNumero,
          estoque: 0,
          status: ((created as any)?.isActive ?? bodyCreate.isActive) === true ? 'ativo' : 'inativo',
        };
        setProdutos((s) => [newRow, ...s]);

        const newId =
          (typeof (created as any)?.id === 'string' && (created as any).id) ||
          (typeof (created as any)?.sku === 'string' && (created as any).sku) || '';
        setProdutoIds((s) => [newId, ...s]);
      } else {
        const idx = rowToEdit;
        const currentId = produtoIds[idx];

        const bodyUpdate = {
          nome: values.nome.trim(),
          descricao: values.descricao?.trim?.() ?? '',
          valor: priceToNumber(values.valor),
          imagemUrl: values.imagemUrl.trim(),
          ativo: values.ativo === 'true',
        };
        const updated = await adminUpdateProduct(currentId, bodyUpdate as any);

        const precoNumero = priceToNumber((updated as any)?.valor ?? bodyUpdate.valor);
        const statusAtivo =
          (typeof (updated as any)?.ativo === 'boolean' ? (updated as any).ativo : bodyUpdate.ativo);

        const patched: ProdutoRow = {
          produto: (updated as any)?.nome ?? bodyUpdate.nome,
          categoria: produtos[idx].categoria,
          preco: formatBRL(precoNumero),
          precoNumero,
          estoque: produtos[idx].estoque,
          status: statusAtivo ? 'ativo' : 'inativo',
        };
        setProdutos((s) => s.map((r, i) => (i === idx ? patched : r)));
      }

      setModalOpen(false);
      setRowToEdit(null);
    } catch (e) {
      console.error('Falha ao salvar produto:', e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.TabelAdminProdutoComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button label="Novo Produto" icon={BsPlus} variant="primary" className={styles.btn} onClick={openCreate} />
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
            if (!o) { setRowToEdit(null); setErrors({}); }
          }}
          mode={mode}
          values={values}
          errors={errors}
          onChange={(patch) => setValues((s) => ({ ...s, ...patch }))}
          categoriaOptions={categoriaOptions}
          statusOptions={[{ label: 'Ativo', value: 'true' }, { label: 'Inativo', value: 'false' }]}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitModal}
        />
      )}

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(o) => { setDeleteOpen(o); if (!o) setDeleteIndex(null); }}
        item={deleteIndex !== null ? produtos[deleteIndex]?.produto : ''}
        onClickConfirm={confirmDelete}
      />
    </div>
  );
}

export default TabelAdminProdutoComponent;
