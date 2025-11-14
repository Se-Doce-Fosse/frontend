import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import style from './Pedidos.module.scss';
// import { Filter } from '../../components/Filter';
// import TableAdminEncomendasComponent from '../../components/TempTablesComp/EncomendasTable/TableAdminEncomendasComponent/TableAdminEncomendasComponent';
import OrderSummaryCard from '../../components/OrderSummaryCard/OrderSummaryCard';
import { Button } from '../../components/Button';
import {
  fetchAdminOrdersByStatus,
  type AdminOrderItemResponse,
  type AdminOrderStatus,
} from '../../services/admin-order/admin-order';
import { useUser } from '../../context/UserContext';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';

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

type FrontOrderStatus =
  | 'novo'
  | 'em_preparacao'
  | 'pronto'
  | 'finalizado'
  | 'cancelado';

type OrderFilter = 'todos' | FrontOrderStatus;

type Order = {
  orderCode: string;
  clientName: string;
  address?: string | null;
  items: string[];
  rawItems: AdminOrderItemResponse[];
  isNew: boolean;
  status: FrontOrderStatus;
  statusLabel: string;
  totalPrice?: number;
  orderDate?: string;
  couponCode?: string | null;
};

const backendToFrontStatus: Record<AdminOrderStatus, FrontOrderStatus> = {
  ACEITO: 'novo',
  PREPARANDO: 'em_preparacao',
  ROTA: 'pronto',
  ENTREGUE: 'finalizado',
  CANCELADO: 'cancelado',
};

const backendStatuses = Object.keys(backendToFrontStatus) as AdminOrderStatus[];

const frontStatusLabels: Record<FrontOrderStatus, string> = {
  novo: 'Novo',
  em_preparacao: 'Em preparo',
  pronto: 'Pronto',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
};

const tabs = [
  { id: 'pedidos', label: 'Pedidos' },
  //{ id: 'encomendas', label: 'Encomendas' },
  //{ id: 'concluidos', label: 'Concluídos' },
];

const formatOrderCode = (orderId?: number | null) => {
  if (typeof orderId !== 'number') {
    return '#------';
  }
  return `#${orderId.toString().padStart(6, '0')}`;
};

const formatOrderItems = (items?: AdminOrderItemResponse[]) => {
  if (!items || items.length === 0) {
    return ['Itens não informados'];
  }
  return items.map(
    (item) =>
      `${item.quantidade}x ${
        item.produtoNome ?? item.produtoSku?.toUpperCase() ?? 'Produto'
      }`
  );
};

const Pedidos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pedidos');
  const [selectedStatus, setSelectedStatus] = useState<OrderFilter>('todos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.token) {
      setErrorMessage('Sessão expirada. Faça login novamente para continuar.');
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const responses = await Promise.all(
        backendStatuses.map(async (status) => {
          const apiOrders = await fetchAdminOrdersByStatus(status, user.token);
          const mappedStatus = backendToFrontStatus[status];
          const statusLabel = frontStatusLabels[mappedStatus];
          return apiOrders.map((order) => ({
            orderCode: formatOrderCode(order.orderId),
            clientName:
              order.clientName || order.clientId || 'Cliente não identificado',
            address: order.address ?? null,
            items: formatOrderItems(order.items),
            rawItems: order.items ?? [],
            status: mappedStatus,
            statusLabel,
            isNew: mappedStatus === 'novo',
            totalPrice: order.totalPrice,
            orderDate: order.orderDate,
            couponCode: order.couponCode ?? null,
          }));
        })
      );
      setOrders(responses.flat());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os pedidos.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (userLoading) return;
    if (user?.token) {
      void loadOrders();
    } else {
      setOrders([]);
      setErrorMessage(
        'Faça login como administrador para visualizar os pedidos.'
      );
    }
  }, [user?.token, userLoading, loadOrders]);

  const statusCounts = orders.reduce<Record<FrontOrderStatus, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {
      novo: 0,
      em_preparacao: 0,
      pronto: 0,
      finalizado: 0,
      cancelado: 0,
    }
  );

  const visibleOrders =
    selectedStatus === 'todos'
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  return (
    <AdminLayout>
      <div className={style.pedidos}>
        <div className={style.headerRow}>
          <h1>Pedidos</h1>
          <div className={style.headerActions}>
            <Button
              label="Atualizar"
              variant="secondary"
              onClick={() => void loadOrders()}
              disabled={isLoading || userLoading || !user?.token}
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
                {isLoading && (
                  <div role="status" className={style.feedbackMessage}>
                    Carregando pedidos...
                  </div>
                )}

                {errorMessage && (
                  <div role="alert" className={style.feedbackMessage}>
                    <p>{errorMessage}</p>
                    <Button
                      label="Tentar novamente"
                      onClick={() => void loadOrders()}
                      variant="secondary"
                    />
                  </div>
                )}

                {!isLoading && !errorMessage && visibleOrders.length === 0 && (
                  <div className={style.feedbackMessage}>
                    Nenhum pedido encontrado para este status.
                  </div>
                )}

                <div className={style.cardsGrid}>
                  {visibleOrders.map((o) => (
                    <OrderSummaryCard
                      key={`${o.orderCode}-${o.clientName}`}
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
                      onDetails={() => setSelectedOrder(o)}
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
        {selectedOrder && (
          <OrderDetailsModal
            order={{
              orderCode: selectedOrder.orderCode,
              clientName: selectedOrder.clientName,
              address: selectedOrder.address,
              statusLabel: selectedOrder.statusLabel,
              totalPrice: selectedOrder.totalPrice,
              orderDate: selectedOrder.orderDate,
              couponCode: selectedOrder.couponCode,
              items: selectedOrder.rawItems,
            }}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Pedidos;
