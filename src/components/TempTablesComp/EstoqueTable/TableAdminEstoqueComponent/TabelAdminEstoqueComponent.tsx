import { useState } from 'react';
import { HeaderTableAdminEstoque } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import type { EstoqueRow } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import { EstoqueModal, type EstoqueValues } from '../../../EstoqueModal';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEstoqueComponent.module.scss';

export default function TableAdminEstoqueComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [estoques, setEstoques] = useState<EstoqueRow[]>([
    {
      item: 'manteiga',
      quantidade: 10,
      uniMedida: 'kg',
      preco: 10,
      categoria: 'insumo',
      atualizadoEm: new Date(),
    },
    {
      item: 'farinha',
      quantidade: 20,
      uniMedida: 'pacote',
      preco: 1000.0,
      categoria: 'embalagem',
      atualizadoEm: new Date(),
    },
  ]);

  const handleDeleteRow = (targetIndex: number) => {
    setEstoques(estoques.filter((_, idx) => idx !== targetIndex));
  };

  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<EstoqueValues>({
    nome: '',
    quantidade: '',
    preco: '',
    categoria: '',
    unidadeMedida: '',
  });

  const categoriaOptions = [
    { label: 'Insumo', value: 'insumo' },
    { label: 'Embalagem', value: 'embalagem' },
  ];

  const unidadeMedidaOptions = [
    { label: 'kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'L', value: 'L' },
    { label: 'mL', value: 'mL' },
  ];

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    const row = estoques[idx];
    setFormValues({
      nome: row.item,
      quantidade: String(row.quantidade),
      preco: String(row.preco),
      categoria: row.categoria,
      unidadeMedida: row.uniMedida,
    });
    setModalOpen(true);
  };

  const handleViewRow = (idx: number) => {
    const row = estoques[idx];
    setFormValues({
      nome: row.item,
      quantidade: String(row.quantidade),
      preco: String(row.preco),
      categoria: row.categoria,
      unidadeMedida: row.uniMedida,
    });
    setViewModalOpen(true);
  };

  const handleSubmit = () => {
    if (rowToEdit === null) {
      const newRow: EstoqueRow = {
        item: formValues.nome,
        quantidade: Number(formValues.quantidade),
        uniMedida: formValues.unidadeMedida,
        preco: Number(formValues.preco),
        categoria: formValues.categoria as 'insumo' | 'embalagem',
        atualizadoEm: new Date(),
      };
      setEstoques([...estoques, newRow]);
    } else {
      setEstoques(
        estoques.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return {
            item: formValues.nome,
            quantidade: Number(formValues.quantidade),
            uniMedida: formValues.unidadeMedida,
            preco: Number(formValues.preco),
            categoria: formValues.categoria as 'insumo' | 'embalagem',
            atualizadoEm: new Date(),
          };
        })
      );
    }

    setFormValues({
      nome: '',
      quantidade: '',
      preco: '',
      categoria: '',
      unidadeMedida: '',
    });
    setRowToEdit(null);
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setFormValues({
      nome: '',
      quantidade: '',
      preco: '',
      categoria: '',
      unidadeMedida: '',
    });
    setRowToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
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
        <HeaderTableAdminEstoque
          estoque={estoques}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
          viewRow={handleViewRow}
        />
      </div>

      <EstoqueModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={rowToEdit === null ? 'Adicionar Item' : 'Editar Item'}
        values={formValues}
        onChange={(patch) => setFormValues({ ...formValues, ...patch })}
        categoriaOptions={categoriaOptions}
        unidadeMedidaOptions={unidadeMedidaOptions}
        onSubmit={handleSubmit}
      />

      <EstoqueModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Visualizar Item"
        values={formValues}
        onChange={(patch) => setFormValues({ ...formValues, ...patch })}
        categoriaOptions={categoriaOptions}
        unidadeMedidaOptions={unidadeMedidaOptions}
        mode="view"
      />
    </div>
  );
}
