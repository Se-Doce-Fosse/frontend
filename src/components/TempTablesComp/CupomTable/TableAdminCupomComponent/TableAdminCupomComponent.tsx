import { useState } from 'react';
import { HeaderTableAdminCupom } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
import type { CupomRow } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
// import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCupomComponent.module.scss';

function TabelAdminCupomComponent() {
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [cupons, setCupoms] = useState<CupomRow[]>([
    {
      cupom: 'manteiga',
      desconto: '10',
      validade: new Date(),
      status: 'ativo',
      unico: 'Sim',
    },
  ]);

  const tempHandleEditRow = (idx: number) => {
    setRowToEdit(idx);
    console.log(rowToEdit);
    console.log('not done');
  };

  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const handleDeleteRow = (targetIndex: number) => {
    setCupoms(cupons.filter((_, idx) => idx !== targetIndex));
  };

  // const handleEditRow = (idx: number) => {
  //   setRowToEdit(idx);
  //   setModalOpen(true);
  // };

  // const handleSubmit = (newRow: CupomRow) => {
  //   if (rowToEdit === null) {
  //     setCupoms([...cupons, newRow]);
  //   } else {
  //     setCupoms(
  //       cupons.map((currRow, idx) => {
  //         if (idx !== rowToEdit) return currRow;
  //         return newRow;
  //       })
  //     );
  //   }
  // };

  return (
    <div className={styles.TableAdminCupomComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Cupons</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Cupom"
            icon={BsPlus}
            // onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminCupom
          cupons={cupons}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
      {/* {modalOpen && (
        <TempModalComponent
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null ? cupons[rowToEdit] : undefined}
        />
      )} */}
    </div>
  );
}

export default TabelAdminCupomComponent;
