import { useState } from 'react';
import { HeaderTableAdmin } from '../../ProdutoTable/HeaderTableAdminProduto/HeaderTableAdminProduto';
import type { ProdutoRow } from '../../ProdutoTable/HeaderTableAdminProduto/HeaderTableAdminProduto';
import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEstoqueComponent.module.scss';

function TableAdminEstoqueComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<ProdutoRow[]>([
    {
      produto: 'Cookie Vegano',
      categoria: 'Vegano',
      preco: 35.99,
      estoque: 10,
      status: 'ativo',
    },
    {
      produto: 'Cookie',
      categoria: 'Cookie',
      preco: 19.99,
      estoque: 5,
      status: 'inativo',
    },
  ]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const handleDeleteRow = (targetIndex: number) => {
    setProdutos(produtos.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = (newRow: ProdutoRow) => {
    if (rowToEdit === null) {
      setProdutos([...produtos, newRow]);
    } else {
      setProdutos(
        produtos.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return newRow;
        })
      );
    }
  };

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Adicionar"
            icon={BsPlus}
            onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdmin
          produtos={produtos}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
        />
      </div>
      {modalOpen && (
        <TempModalComponent
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null ? produtos[rowToEdit] : undefined}
        />
      )}
    </div>
  );
}

export default TableAdminEstoqueComponent;
