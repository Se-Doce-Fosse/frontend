import { useState } from 'react';
import { HeaderTableAdminEncomendas } from '../HeaderTableAdminEncomendas/HeaderTableAdminEncomendas';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminEncomendasComponent.module.scss';

export type EncomendaRow = {
  pedido: string;
  cliente: string;
  itensCount: number;
  status: string;
  data: Date;
  total: number;
};

function TableAdminEncomendasComponent() {
  const [encomendas, setEncomendas] = useState<EncomendaRow[]>([
    {
      pedido: '#ENQ-001',
      cliente: 'Ana',
      itensCount: 3,
      status: 'Novo',
      data: new Date(),
      total: 45.5,
    },
    {
      pedido: '#ENQ-002',
      cliente: 'Cleison',
      itensCount: 1,
      status: 'Em preparo',
      data: new Date(),
      total: 12.0,
    },
  ]);

  const handleDeleteRow = (targetIndex: number) => {
    setEncomendas(encomendas.filter((_, idx) => idx !== targetIndex));
  };

  const tempHandleEditRow = (idx: number) => {
    console.log('editar', idx);
  };

  return (
    <div className={styles.TableAdminComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Encomendas</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Nova Encomenda"
            icon={BsPlus}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>

      <div>
        <HeaderTableAdminEncomendas
          encomendas={encomendas}
          deleteRow={handleDeleteRow}
          editRow={tempHandleEditRow}
        />
      </div>
    </div>
  );
}

export default TableAdminEncomendasComponent;
