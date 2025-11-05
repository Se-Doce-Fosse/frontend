import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import style from './Pedidos.module.scss';
// import { Filter } from '../../components/Filter';
// import TableAdminEncomendasComponent from '../../components/TempTablesComp/EncomendasTable/TableAdminEncomendasComponent/TableAdminEncomendasComponent';
import OrderSummaryCard from '../../components/OrderSummaryCard/OrderSummaryCard';
import { Button } from '../../components/Button';

/*const status = [
  { label: 'Todos os status', value: 'todos' },
  { label: 'Novo', value: 'novo' },
  { label: 'Em preparo', value: 'em_preparacao' },
  { label: 'Pronto', value: 'pronto' },
  { label: 'Entregue', value: 'entregue' },
];*/

/*const encomendasOptions = [
  { label: 'Todos os status', value: 'todos' },
  { label: 'Novo', value: 'novo' },
  { label: 'Preparando', value: 'em_preparacao' },
  { label: 'Pronto', value: 'pronto' },
];*/

const tabs = [
  { id: 'pedidos', label: 'Pedidos' },
  //{ id: 'encomendas', label: 'Encomendas' },
  //{ id: 'concluidos', label: 'Concluídos' },
];

const Pedidos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pedidos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  type Order = {
    orderCode: string;
    clientName: string;
    items: string[];
    isNew?: boolean;
    status: string;
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      orderCode: '#0caa7673',
      clientName: 'Ana',
      items: ['2x Cookie Tradicional', '1x Cookie de Oreo'],
      isNew: true,
      status: 'novo',
    },
    {
      orderCode: '#0caa7674',
      clientName: 'Cleison',
      items: ['2x Cookie Tradicional'],
      isNew: true,
      status: 'novo',
    },
    {
      orderCode: '#0caa7777',
      clientName: 'Felipe',
      items: ['2x Cookie Tradicional'],
      isNew: false,
      status: 'pronto',
    },
    {
      orderCode: '#0caa7679',
      clientName: 'Julia',
      items: ['3x Cookie Tradicional'],
      isNew: false,
      status: 'pronto',
    },
    {
      orderCode: '#0caa7654',
      clientName: 'Samuel',
      items: [
        '1x Cookie Tradicional',
        '1x Cookie de Oreo',
        '1x Cookie de Avelã',
        '1x Cookie de Amendoim',
      ],
      isNew: false,
      status: 'pronto',
    },
    {
      orderCode: '#0caa1245',
      clientName: 'Luan',
      items: [
        '1x Cookie Tradicional',
        '1x Cookie de Oreo',
        '1x Cookie de Avelã',
        '1x Cookie de Amendoim',
        '1x Cookie de Chocolate',
        '1x Cookie de Banana',
        '1x Cookie de Caju',
      ],
      isNew: false,
      status: 'pronto',
    },
    {
      orderCode: '#6785cbed',
      clientName: 'Samara',
      items: ['2x Cookie Tradicional'],
      isNew: false,
      status: 'em_preparacao',
    },
    {
      orderCode: '#6785aaaa',
      clientName: 'Jonas',
      items: ['7x Cookie Morango'],
      isNew: false,
      status: 'finalizado',
    },
    {
      orderCode: '#6785a45a',
      clientName: 'Laura',
      items: ['3x Cookie M&Ms'],
      isNew: false,
      status: 'cancelado',
    },
  ]);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const visibleOrders = orders.filter(
    (o) => selectedStatus === 'todos' || o.status === selectedStatus
  );

  return (
    <AdminLayout>
      <div className={style.pedidos}>
        <div className={style.headerRow}>
          <h1>Pedidos</h1>
          <div className={style.headerActions}>
            <Button
              label="Atualizar"
              variant="secondary"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>

        {/* Global filters above the tabs */}
        {/* <div className={style.filterWrapper}>
          <Filter
            title="Filtros"
            searchPlaceholder="Busque por pedido ou cliente..."
            selectPlaceholder="Todos os status"
            selectOptions={status}
          />
        </div> */}

        <div className={style.panel}>
          <nav
            className={style.tabs}
            role="tablist"
            aria-label="Seções de pedidos"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === t.id}
                className={`${style.tab} ${activeTab === t.id ? style.active : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* status chips (filter by order stage) - only show on Pedidos tab */}
          {activeTab === 'pedidos' && (
            <div className={style.statusRow}>
              <div className={style.statusChips}>
                <button
                  type="button"
                  className={`${style.statusItem} ${selectedStatus === 'novo' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('novo')}
                  aria-pressed={selectedStatus === 'novo'}
                >
                  Novo{' '}
                  <span className={style.badge}>
                    {statusCounts['novo'] || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${style.statusItemMuted} ${selectedStatus === 'em_preparacao' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('em_preparacao')}
                  aria-pressed={selectedStatus === 'em_preparacao'}
                >
                  Preparo{' '}
                  <span className={style.badge}>
                    {statusCounts['em_preparacao'] || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${style.statusItemMuted} ${selectedStatus === 'pronto' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('pronto')}
                  aria-pressed={selectedStatus === 'pronto'}
                >
                  Pronto{' '}
                  <span className={style.badge}>
                    {statusCounts['pronto'] || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${style.statusItemMuted} ${selectedStatus === 'finalizado' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('finalizado')}
                  aria-pressed={selectedStatus === 'finalizado'}
                >
                  Finalizado{' '}
                  <span className={style.badge}>
                    {statusCounts['finalizado'] || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${style.statusItemMuted} ${selectedStatus === 'cancelado' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('cancelado')}
                  aria-pressed={selectedStatus === 'cancelado'}
                >
                  Cancelado{' '}
                  <span className={style.badge}>
                    {statusCounts['cancelado'] || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${style.statusItemMuted} ${selectedStatus === 'todos' ? style.statusActive : ''}`}
                  onClick={() => setSelectedStatus('todos')}
                  aria-pressed={selectedStatus === 'todos'}
                >
                  Todos
                </button>
              </div>
            </div>
          )}

          <div className={style.tabContent}>
            {activeTab === 'pedidos' && (
              <>
                <div className={style.cardsGrid}>
                  {visibleOrders.map((o) => (
                    <OrderSummaryCard
                      key={o.orderCode}
                      orderCode={o.orderCode}
                      clientName={o.clientName}
                      items={o.items}
                      isNew={o.isNew}
                      status={o.status}
                      onMoveStage={() => {
                        setOrders((prev) =>
                          prev.map((p) => {
                            if (p.orderCode !== o.orderCode) return p;
                            const nextStatus =
                              p.status === 'novo'
                                ? 'em_preparacao'
                                : p.status === 'em_preparacao'
                                  ? 'pronto'
                                  : p.status === 'pronto'
                                    ? 'finalizado'
                                    : p.status === 'finalizado'
                                      ? 'cancelado'
                                      : p.status === 'cancelado'
                                        ? 'novo'
                                        : p.status;
                            return {
                              ...p,
                              status: nextStatus,
                              isNew: nextStatus === 'novo',
                            };
                          })
                        );
                      }}
                      onDetails={() => console.log('detalhes', o.orderCode)}
                    />
                  ))}
                </div>
              </>
            )}

            {/*
              Aba 'encomendas' comentada temporariamente.
              <div>

                <div className={style.filterWrapper}>
                  <Filter
                    title="Filtros"
                    searchPlaceholder="Busque por encomenda ou cliente..."
                    selectPlaceholder="Todos os status"
                    selectOptions={encomendasOptions}
                  />
                </div>

                <TableAdminEncomendasComponent />
              </div>
            */}

            {/*
              Aba 'concluidos' comentada temporariamente.
              <div className={style.emptyPlaceholder}>
                <h2>Concluídos</h2>
              </div>
            */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pedidos;
