import { useEffect, useState, useMemo } from 'react';
import { HeaderTableAdminEstoque } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import type { EstoqueRow } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import { EstoqueModal, type EstoqueValues } from '../../../EstoqueModal';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEstoqueComponent.module.scss';
import {
  getEstoque,
  createEstoque,
  updateEstoque,
  deleteEstoque,
} from '../../../../services/admin-estoque/admin-estoque';
import { parseBRLToCents } from '../../../../utils/price';
import { useUser } from '../../../../context/UserContext';
import { DeleteModal } from '../../../DeleteModal/DeleteModal';
import { Loading } from '../../../Loading/Loading';
import type {
  Estoque,
  CreateEstoque,
  UpdateEstoque,
} from '../../../../types/estoque';

interface TableAdminEstoqueComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TableAdminEstoqueComponent({
  filterStatus,
  searchTerm,
}: TableAdminEstoqueComponentProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [estoques, setEstoques] = useState<EstoqueRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const { user } = useUser();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [formValues, setFormValues] = useState<EstoqueValues>({
    nome: '',
    quantidade: '',
    preco: '',
    unidadeMedida: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof EstoqueValues, string>>
  >({});

  const unidadeMedidaOptions = [
    { label: 'kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'L', value: 'L' },
    { label: 'mL', value: 'mL' },
    { label: 'pacote', value: 'pacote' },
  ];

  useEffect(() => {
    fetchEstoque();
    // eslint-disable-next-line
  }, [user?.token]);

  const mapEstoqueToEstoqueRow = (estoque: Estoque): EstoqueRow => {
    return {
      id: estoque.id,
      item: estoque.name,
      quantidade: estoque.quantity,
      uniMedida: estoque.unitOfMeasure,
      preco: parseBRLToCents(String(estoque.price)) / 100,
      atualizadoEm: new Date(),
    };
  };

  const mapToCreateEstoque = (formValues: EstoqueValues): CreateEstoque => {
    return {
      name: formValues.nome,
      quantity: Number(formValues.quantidade),
      price: formValues.preco,
      category: '',
      unitOfMeasure: formValues.unidadeMedida,
    };
  };

  const mapToUpdateEstoque = (
    formValues: EstoqueValues,
    id: string
  ): UpdateEstoque => {
    return {
      id,
      name: formValues.nome,
      quantity: Number(formValues.quantidade),
      price: formValues.preco,
      category: '',
      unitOfMeasure: formValues.unidadeMedida,
    };
  };

  const fetchEstoque = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await getEstoque(user.token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyData = data as any;
      const estoquesArray = Array.isArray(anyData)
        ? anyData
        : anyData?.items || [];
      const mappedEstoques = estoquesArray.map(mapEstoqueToEstoqueRow);
      setEstoques(mappedEstoques);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (!user?.token || deleteIndex === null) return;
    const estoque = estoques?.[deleteIndex];
    if (!estoque) {
      console.warn('handleDeleteRow: índice inválido', deleteIndex);
      return;
    }
    try {
      await deleteEstoque(estoque.id, user.token);
      setEstoques((prev) => prev.filter((_, i) => i !== deleteIndex));
    } catch (error) {
      console.error('Erro ao deletar estoque:', error);
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    const row = estoques[idx];
    setFormValues({
      nome: row.item,
      quantidade: String(row.quantidade),
      preco: String(row.preco),
      unidadeMedida: row.uniMedida,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleViewRow = (idx: number) => {
    const row = estoques[idx];
    setFormValues({
      nome: row.item,
      quantidade: String(row.quantidade),
      preco: String(row.preco),
      unidadeMedida: row.uniMedida,
    });
    setViewModalOpen(true);
  };

  const validateForm = (values: EstoqueValues) => {
    const errors: Partial<Record<keyof EstoqueValues, string>> = {};
    if (!values.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!values.quantidade || Number(values.quantidade) <= 0)
      errors.quantidade = 'Quantidade deve ser maior que zero';
    if (!values.preco || Number(values.preco) <= 0)
      errors.preco = 'Preço deve ser maior que zero';
    if (!values.unidadeMedida)
      errors.unidadeMedida = 'Unidade de medida é obrigatória';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!user?.token) return;

    setIsSubmitting(true);
    try {
      if (rowToEdit === null) {
        const estoqueData = mapToCreateEstoque(formValues);
        await createEstoque(estoqueData, user.token);
      } else {
        const estoqueData = mapToUpdateEstoque(
          formValues,
          estoques[rowToEdit].id
        );
        await updateEstoque(estoques[rowToEdit].id, estoqueData, user.token);
      }

      setFormValues({
        nome: '',
        quantidade: '',
        preco: '',
        unidadeMedida: '',
      });
      setRowToEdit(null);
      setModalOpen(false);
      setFormErrors({});
      await fetchEstoque();
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setFormValues({
      nome: '',
      quantidade: '',
      preco: '',
      unidadeMedida: '',
    });
    setRowToEdit(null);
    setFormErrors({});
    setModalOpen(true);
  };

  const filteredEstoque = useMemo(() => {
    return estoques.filter((item) => {
      const matchesSearch = item.item
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = true;
      return matchesSearch && matchesStatus;
    });
  }, [estoques, searchTerm, filterStatus]);

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Insumos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Item"
            icon={BsPlus}
            onClick={handleOpenModal}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <HeaderTableAdminEstoque
            estoque={filteredEstoque}
            deleteRow={handleDeleteRow}
            editRow={handleEditRow}
            viewRow={handleViewRow}
          />
        )}
      </div>

      <DeleteModal
        item={
          deleteIndex !== null && estoques[deleteIndex]
            ? estoques[deleteIndex].item
            : ''
        }
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onClickConfirm={confirmDeleteRow}
      />

      <EstoqueModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={rowToEdit === null ? 'Adicionar Item' : 'Editar Item'}
        values={formValues}
        onChange={(patch) => {
          setFormValues({ ...formValues, ...patch });
          if (formErrors) {
            const fieldName = Object.keys(patch)[0] as keyof EstoqueValues;
            if (formErrors[fieldName]) {
              setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
              });
            }
          }
        }}
        categoriaOptions={[]}
        unidadeMedidaOptions={unidadeMedidaOptions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={formErrors}
      />

      <EstoqueModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Visualizar Item"
        values={formValues}
        onChange={(patch) => setFormValues({ ...formValues, ...patch })}
        categoriaOptions={[]}
        unidadeMedidaOptions={unidadeMedidaOptions}
        mode="view"
      />
    </div>
  );
}

export default TableAdminEstoqueComponent;
