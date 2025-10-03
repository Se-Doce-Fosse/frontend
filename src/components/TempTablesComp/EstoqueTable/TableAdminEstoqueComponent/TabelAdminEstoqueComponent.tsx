import { useState } from 'react';
import { HeaderTableAdminEstoque } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
import type { EstoqueRow } from '../HeaderTableAdminEstoque/HeaderTableAdminEstoque';
//import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEstoqueComponent.module.scss';

function TableAdminEstoqueComponent() {
  //const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [estoques, setEstoques] = useState<EstoqueRow[]>([
    {
      item: 'manteiga',
      quantidade: 10,
      uniMedida: 'kg',
      preco: 10,
      categoria: 'ativo',
      atualizadoEm: new Date(),
    },
    {
      item: 'farinha',
      quantidade: 20,
      uniMedida: 'pacote',
      preco: 1000.0,
      categoria: 'ativo',
      atualizadoEm: new Date(),
    },
  ]);

  const handleDeleteRow = (targetIndex: number) => {
    setEstoques(estoques.filter((_, idx) => idx !== targetIndex));
  };

  const tempHandleEditRow = (idx: number) => {
    setRowToEdit(idx);
    console.log(rowToEdit);
    console.log('not done');
  };

  // Precisa do modal

  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  // const handleEditRow = (idx: number) => {
  //   setRowToEdit(idx);
  //   setModalOpen(true);
  // };

  //Precisa fazer o modal, mas o submit ja ta pronto

  // const handleSubmit = (newRow: EstoqueRow) => {
  //   if (rowToEdit === null) {
  //     setEstoques([...estoques, newRow]);
  //   } else {
  //     setEstoques(
  //       estoques.map((currRow, idx) => {
  //         if (idx !== rowToEdit) return currRow;
  //         return newRow;
  //       })
  //     );
  //   }
  // };

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Item"
            icon={BsPlus}
            //onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminEstoque
          estoque={estoques}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
      {
        //Precisa fazer o modal, mas essa parte ja esta pronta.
        /* {modalOpen && (
        <TempModalComponent
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null ? estoques[rowToEdit] : undefined}
        />
      )} */
      }
    </div>
  );
}

export default TableAdminEstoqueComponent;
