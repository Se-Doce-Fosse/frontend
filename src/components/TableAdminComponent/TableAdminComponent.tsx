import { useState } from 'react';
import { HeaderTableAdmin } from '../HeaderTableAdmin/HeaderTableAdmin';
import type { ProdutoRow } from '../HeaderTableAdmin/HeaderTableAdmin';
import { TempModalComponent } from '../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import styles from './TableAdminComponent.module.scss';

function TableAdminComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<ProdutoRow[]>([
    {
      produto: 'Cookie Vegano',
      categoria: 'Vegano',
      preco: 35.99,
      status: 'ativo',
      quantidade: 10,
    },
    {
      produto: 'Cookie',
      categoria: 'Cookie',
      preco: 19.99,
      status: 'inativo',
      quantidade: 5,
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
      <div className={styles.btnWrapper}>
        <button onClick={() => setModalOpen(true)} className={styles.btn}>
          <BsPlus style={{ fontSize: '1.2em', marginRight: '0.3em' }} />
          Adicionar
        </button>
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
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

export default TableAdminComponent;
