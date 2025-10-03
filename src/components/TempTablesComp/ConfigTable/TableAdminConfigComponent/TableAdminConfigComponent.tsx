import { useState } from 'react';
import { HeaderTableAdminConfig } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
import type { userRow } from '../HeaderTableAdminConfig/HeaderTableAdminConfig';
// import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminConfigComponent.module.scss';

function TabelAdminConfigComponent() {
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<userRow[]>([
    {
      user: 'Cookie Vegano',
      cargo: 'vegano',
      email: 'Vegano',
      status: 'ativo',
    },
  ]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const tempHandleEditRow = (idx: number) => {
    setRowToEdit(idx);
    console.log(rowToEdit);
    console.log('not done');
  };

  const handleDeleteRow = (targetIndex: number) => {
    setUsers(users.filter((_, idx) => idx !== targetIndex));
  };

  // const handleEditRow = (idx: number) => {
  //   setRowToEdit(idx);
  //   setModalOpen(true);
  // };

  // const handleSubmit = (newRow: userRow) => {
  //   if (rowToEdit === null) {
  //     setUsers([...users, newRow]);
  //   } else {
  //     setUsers(
  //       users.map((currRow, idx) => {
  //         if (idx !== rowToEdit) return currRow;
  //         return newRow;
  //       })
  //     );
  //   }
  // };

  return (
    <div className={styles.TabelAdminConfigComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Usuárioss</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Adicionar"
            icon={BsPlus}
            // onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminConfig
          users={users}
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
          defaultValue={rowToEdit !== null ? users[rowToEdit] : undefined}
        />
      )} */}
    </div>
  );
}

export default TabelAdminConfigComponent;
