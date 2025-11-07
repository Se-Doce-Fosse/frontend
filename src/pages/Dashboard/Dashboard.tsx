import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import styles from './Dashboard.module.scss';
import { DataCard } from './components/CardData/CardData';
import { AiOutlineDollar } from 'react-icons/ai';
import { Input, Select } from '@components';

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState('');
  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.head}>
          <h1>Dashboard</h1>
          <div className={styles.filtro}>
            <p>De</p>
            <Input type="date" />
            <p>Até</p>
            <Input type="date" />
            <p>Gráfico: </p>
            <Select
              options={statusOptions}
              placeholder="Selecione o status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.cards}>
          <DataCard
            title="Algum Título"
            data="Algum dado"
            icon={<AiOutlineDollar size={25} />}
          />
          <DataCard
            title="Algum Título"
            data="Algum dado"
            icon={<AiOutlineDollar size={25} />}
          />
          <DataCard
            title="Algum Título"
            data="Algum dado"
            icon={<AiOutlineDollar size={25} />}
          />
          <DataCard
            title="Algum Título"
            data="Algum dado"
            icon={<AiOutlineDollar size={25} />}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
