import { useState } from 'react';
import { HeaderTableAdminPedido } from '../HeaderTableAdminPedido/HeaderTableAdminPedido';
import type { PedidoRow } from '../HeaderTableAdminPedido/HeaderTableAdminPedido';
// import { TempModalComponent } from '../../../TempModalComponent/TempModalComponent';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminPedidoComponent.module.scss';

function TabelAdminPedidoComponent() {
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pedidos, setPedidos] = useState<PedidoRow[]>([
    {
      pedido: '0000101',
      cliente: 'Vegano',
      total: 35.99,
      status: 'pendente',
      atualizadoEm: new Date(),
    },
  ]);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);

  const tempHandleEditRow = (idx: number) => {
    setRowToEdit(idx);
    console.log(rowToEdit);
    console.log('not done');
  };

  const handleDeleteRow = (targetIndex: number) => {
    setPedidos(pedidos.filter((_, idx) => idx !== targetIndex));
  };

  // const handleEditRow = (idx: number) => {
  //   setRowToEdit(idx);
  //   setModalOpen(true);
  // };

  // const handleSubmit = (newRow: PedidoRow) => {
  //   if (rowToEdit === null) {
  //     setPedidos([...pedidos, newRow]);
  //   } else {
  //     setPedidos(
  //       pedidos.map((currRow, idx) => {
  //         if (idx !== rowToEdit) return currRow;
  //         return newRow;
  //       })
  //     );
  //   }
  // };

  return (
    <div className={styles.TabelAdminPedidoComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Pedidos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Atualizar"
            icon={BsPlus}
            // onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminPedido
          pedidos={pedidos}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
    </div>
  );
}

export default TabelAdminPedidoComponent;
