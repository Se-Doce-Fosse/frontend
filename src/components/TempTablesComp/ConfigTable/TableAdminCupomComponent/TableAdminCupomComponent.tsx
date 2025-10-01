import { useState } from 'react';
import { HeaderTableAdminCupom } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
import type { CupomRow } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCupomComponent.module.scss';

function TabelAdminCupomComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [cupons, setCupoms] = useState<CupomRow[]>([
    {
      cupom: 'Cookie Vegano',
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
    setCupoms(cupons.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = (newRow: CupomRow) => {
    if (rowToEdit === null) {
      setCupoms([...cupons, newRow]);
    } else {
      setCupoms(
        cupons.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return newRow;
        })
      );
    }
  };

  return (
    <div className={styles.TabelAdminCupomComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Cupoms</h2>
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
        <HeaderTableAdminCupom
          cupons={cupons}
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
          defaultValue={rowToEdit !== null ? cupons[rowToEdit] : undefined}
        />
      )}
    </div>
  );
}

export default TabelAdminCupomComponent;
