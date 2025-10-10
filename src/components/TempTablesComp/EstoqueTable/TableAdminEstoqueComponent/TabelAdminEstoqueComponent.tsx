import { useEffect, useMemo, useState } from 'react';
import { HeaderTableAdminEstoque } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import type { EstoqueRow } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEstoqueComponent.module.scss';

import {
  adminFetchSupplies,
  adminCreateSupply,
  adminUpdateSupply,
  adminDeleteSupply,
  type SupplyDTO,
} from '../../../../services/supply/supplyService';

import {
  SuppliesModal,
  type SuppliesValues,
  type Option,
} from '../../../../pages/Estoque/components/SuppliesModal/SuppliesModal';
import { DeleteModal } from '../../../../components/DeleteModal/DeleteModal';


function toNumberLoose(n: unknown): number {
  if (typeof n === 'number') return n;
  if (typeof n === 'string') {
    const trimmed = n.trim();
    if (!trimmed) return 0;
    const x = Number(trimmed.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(x) ? x : 0;
  }
  return 0;
}

function isValidId(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}

type Mode = 'create' | 'edit';

export default function TableAdminEstoqueComponent() {
  const [rows, setRows] = useState<EstoqueRow[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [data, setData] = useState<SupplyDTO[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('create');
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [values, setValues] = useState<SuppliesValues>({
    nome: '',
    quantidade: '',
    preco: '',
    categoria: '',
    unidade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await adminFetchSupplies();
        if (cancelled) return;

        const mapped: EstoqueRow[] = [];
        const idArr: number[] = [];
        const rawArr: SupplyDTO[] = [];

        for (const s of list) {
          const idNum = Number((s as any)?.id);
          if (!Number.isFinite(idNum) || idNum <= 0) {
            continue;
          }

          const uniNome =
            (typeof s.unidadeNome === 'string' && s.unidadeNome) ||
            (typeof (s as any)?.unidade?.nome === 'string' && (s as any).unidade.nome) ||
            '-';

          const preco = toNumberLoose((s as any).precoCompra ?? (s as any).preco_compra);
          const pontoReposicao =
            typeof (s as any).pontoReposicao === 'number'
              ? (s as any).pontoReposicao
              : typeof (s as any).ponto_reposicao === 'number'
                ? (s as any).ponto_reposicao
                : 0;

          const isPack =
            typeof (s as any).ehEmbalagem === 'boolean'
              ? (s as any).ehEmbalagem
              : typeof (s as any).embalagem === 'boolean'
                ? (s as any).embalagem
                : false;

          mapped.push({
            item: (s as any)?.nome ?? '—',
            quantidade: Number((s as any)?.quantidade ?? 0),
            pontoReposicao: Number(pontoReposicao),
            uniMedida: uniNome,
            preco,
            categoria: isPack ? 'embalagem' : 'insumo',
          });

          idArr.push(idNum);
          rawArr.push(s);
        }

        setRows(mapped);
        setIds(idArr);
        setData(rawArr);
      } catch (e) {
        console.error('Falha ao carregar supplies:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoriaOptions: Option[] = useMemo(
    () => [
      { label: 'Insumo', value: 'insumo' },
      { label: 'Embalagem', value: 'embalagem' },
    ],
    []
  );

  const unidadeOptions: Option[] = useMemo(() => {
    const uniq = new Map<string, string>();
    for (const s of data) {
      const uid =
        (typeof (s as any).unidadeId === 'number' || typeof (s as any).unidadeId === 'string')
          ? String((s as any).unidadeId)
          : (typeof (s as any).unidade?.id === 'number' || typeof (s as any).unidade?.id === 'string')
            ? String((s as any).unidade?.id)
            : '';
      const nome =
        (typeof (s as any).unidadeNome === 'string' && (s as any).unidadeNome) ||
        (typeof (s as any).unidade?.nome === 'string' && (s as any).unidade?.nome) ||
        '';
      if (uid && nome && !uniq.has(uid)) uniq.set(uid, nome);
    }
    return Array.from(uniq, ([value, label]) => ({ value, label }));
  }, [data]);

  const openCreate = () => {
    setMode('create');
    setRowToEdit(null);
    setValues({
      nome: '',
      quantidade: '',
      preco: '',
      categoria: 'insumo',
      unidade: unidadeOptions[0]?.value ?? '',
    });
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const editId = ids[idx];
    if (!isValidId(editId)) {
      console.error('ID inválido para edição:', editId);
      return;
    }

    setMode('edit');
    setRowToEdit(idx);

    const raw = data[idx];
    const r = rows[idx];

    const unidadeIdStr =
      (typeof (raw as any)?.unidadeId === 'number' || typeof (raw as any)?.unidadeId === 'string')
        ? String((raw as any).unidadeId)
        : (typeof (raw as any)?.unidade?.id === 'number' || typeof (raw as any)?.unidade?.id === 'string')
          ? String((raw as any).unidade?.id)
          : '';

    setValues({
      nome: r.item,
      quantidade: String(r.quantidade),
      preco: String(r.preco).replace('.', ','),
      categoria: r.categoria,
      unidade: unidadeIdStr,
    });

    setModalOpen(true);
  };

  function validate(): string | null {
    if (!values.nome || !values.nome.trim()) return 'Informe o nome';
    if (!values.quantidade || !values.quantidade.trim()) return 'Informe a quantidade';
    if (!values.preco || !values.preco.trim()) return 'Informe o preço de compra';
    if (!values.categoria) return 'Selecione a categoria';
    if (!values.unidade) return 'Selecione a unidade';

    if (toNumberLoose(values.quantidade) < 0) return 'Quantidade inválida';
    if (toNumberLoose(values.preco) < 0) return 'Preço inválido';

    return null;
  }

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      console.warn(err);
      return;
    }
    setIsSubmitting(true);

    try {
      const bodyBase = {
        nome: values.nome.trim(),
        unidade: { id: Number(values.unidade) },
        quantidade: toNumberLoose(values.quantidade),
        preco_compra: toNumberLoose(values.preco),
        embalagem: values.categoria === 'embalagem',
      };

      if (mode === 'create' || rowToEdit === null) {
        const created = await adminCreateSupply({
          ...bodyBase,
          ponto_reposicao: 0,
        });

        const createdId = Number((created as any)?.id);
        if (!Number.isFinite(createdId) || createdId <= 0) {
          console.error('Create retornou id inválido:', (created as any)?.id);
          setModalOpen(false);
          setRowToEdit(null);
          setIsSubmitting(false);
          return;
        }

        const uniNome =
          unidadeOptions.find((o) => o.value === values.unidade)?.label ?? '-';

        const newRow: EstoqueRow = {
          item: bodyBase.nome,
          quantidade: bodyBase.quantidade,
          pontoReposicao: 0,
          uniMedida: uniNome,
          preco: bodyBase.preco_compra,
          categoria: bodyBase.embalagem ? 'embalagem' : 'insumo',
        };

        setRows((s) => [newRow, ...s]);
        setIds((s) => [createdId, ...s]);
        setData((s) => [
          {
            id: createdId,
            nome: bodyBase.nome,
            unidadeId: Number(values.unidade),
            unidadeNome: uniNome,
            quantidade: bodyBase.quantidade,
            precoCompra: bodyBase.preco_compra,
            pontoReposicao: 0,
            ehEmbalagem: bodyBase.embalagem,
          } as any,
          ...s,
        ]);
      } else {
        const idx = rowToEdit;
        const currentId = ids[idx];

        if (!isValidId(currentId)) {
          console.error('ID do item inválido para PUT:', currentId);
          setIsSubmitting(false);
          return;
        }

        const pontoRepoAtual = rows[idx]?.pontoReposicao ?? 0;

        await adminUpdateSupply(currentId, {
          ...bodyBase,
          ponto_reposicao: pontoRepoAtual,
        });

        const uniNome =
          unidadeOptions.find((o) => o.value === values.unidade)?.label ??
          rows[idx].uniMedida;

        const patched: EstoqueRow = {
          item: bodyBase.nome,
          quantidade: bodyBase.quantidade,
          pontoReposicao: pontoRepoAtual,
          uniMedida: uniNome,
          preco: bodyBase.preco_compra,
          categoria: bodyBase.embalagem ? 'embalagem' : 'insumo',
        };

        setRows((s) => s.map((r, i) => (i === idx ? patched : r)));
        setData((s) =>
          s.map((d, i) =>
            i === idx
              ? ({
                  id: currentId,
                  nome: bodyBase.nome,
                  unidadeId: Number(values.unidade),
                  unidadeNome: uniNome,
                  quantidade: bodyBase.quantidade,
                  precoCompra: bodyBase.preco_compra,
                  pontoReposicao: pontoRepoAtual,
                  ehEmbalagem: bodyBase.embalagem,
                } as any)
              : d
          )
        );
      }

      setModalOpen(false);
      setRowToEdit(null);
    } catch (e) {
      console.error('Falha ao salvar supply:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const id = ids[deleteIndex];
    try {
      await adminDeleteSupply(id);
      setRows((s) => s.filter((_, i) => i !== deleteIndex));
      setIds((s) => s.filter((_, i) => i !== deleteIndex));
      setData((s) => s.filter((_, i) => i !== deleteIndex));
    } catch (e) {
      console.error('Falha ao excluir supply:', e);
    } finally {
      setDeleteOpen(false);
      setDeleteIndex(null);
    }
  };

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Estoque de Insumos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Item"
            icon={BsPlus}
            onClick={openCreate}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>

      <div>
        <HeaderTableAdminEstoque
          estoque={rows}
          deleteRow={handleDeleteRow}
          editRow={(idx) => openEdit(idx)}
        />
      </div>

      {modalOpen && (
        <SuppliesModal
          open={modalOpen}
          onOpenChange={(o) => {
            setModalOpen(o);
            if (!o) setRowToEdit(null);
          }}
          title={mode === 'create' ? 'Novo item' : 'Editar item'}
          isSubmitting={isSubmitting}
          values={values}
          onChange={(patch) => setValues((s) => ({ ...s, ...patch }))}
          categoriaOptions={categoriaOptions}
          unidadeOptions={unidadeOptions}
          onSubmit={onSubmit}
        />
      )}

      <DeleteModal
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setDeleteIndex(null);
        }}
        item={deleteIndex !== null ? rows[deleteIndex]?.item : ''}
        onClickConfirm={confirmDelete}
      />
    </div>
  );
}
