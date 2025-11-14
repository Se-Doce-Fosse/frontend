import React, { useState, useEffect } from 'react';
import { MostSoldProductsChart } from '../components/MostSoldProductsChart';
import { HourlySalesChart } from '../components/HourlySalesChart';
import { MetricCards } from '../components/MetricCards';
// import { DashboardSummary } from '../components/DashboardSummary';
import { getOrders } from './view-controllers/OrdersDashboard.view.controller';
import type { Order } from '../types/order';
import { useUser } from '../context/UserContext';
import './OrdersDashboard.scss';

const statusOptions = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ACEITO', label: 'Novo' },
  { value: 'PREPARANDO', label: 'Preparando' },
  { value: 'ROTA', label: 'Em rota' },
  { value: 'ENTREGUE', label: 'Finalizado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const backendStatusesForAll = statusOptions
  .filter((option) => option.value !== 'TODOS')
  .map((option) => option.value);

const normalizeOrdersResponse = (response: unknown): Order[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    response &&
    typeof response === 'object' &&
    Array.isArray((response as { data?: Order[] }).data)
  ) {
    return (response as { data?: Order[] }).data ?? [];
  }

  return [];
};

export const OrdersDashboardView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [topN, setTopN] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('PREPARANDO');
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setError('Usuário não autenticado.');
          return;
        }

        let fetchedOrders: Order[] = [];

        if (orderStatus === 'TODOS') {
          const responses = await Promise.all(
            backendStatusesForAll.map((status) => getOrders(user.token, status))
          );
          fetchedOrders = responses.flatMap(normalizeOrdersResponse);
        } else {
          const response = await getOrders(user.token, orderStatus);
          fetchedOrders = normalizeOrdersResponse(response);
        }

        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar pedidos. Tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderStatus, user]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2025, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  return (
    <div className="orders-dashboard">
      <div className="header-row">
        <div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="date-range">
          <label>De</label>
          <input type="date" />
          <label>A</label>
          <input type="date" />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          <strong>⚠️ Erro:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '4px',
            color: '#0c5460',
          }}
        >
          <p>Carregando pedidos...</p>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: error ? '20px' : '0',
        }}
      >
        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>
            Status do Pedido:
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>Mês:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>Ano:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - 2 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>
            Top Produtos:
          </label>
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      {!loading && orders.length > 0 ? (
        <div style={{ marginTop: '24px' }}>
          {/* <DashboardSummary
            orders={orders}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          /> */}
          <MetricCards
            orders={orders}
            month={selectedMonth}
            year={selectedYear}
          />
          <div style={{ height: 24 }} />
          <div className="panels">
            <div className="panel-large">
              <div className="panel-title">Pedidos</div>
              <MostSoldProductsChart
                orders={orders}
                month={selectedMonth}
                year={selectedYear}
                topN={topN}
              />
            </div>

            <div className="panel-large">
              <div className="panel-title">Produtos mais vendidos</div>
              <HourlySalesChart
                orders={orders}
                month={selectedMonth}
                year={selectedYear}
              />
            </div>
          </div>

          <div style={{ height: 24 }} />
        </div>
      ) : !loading && orders.length === 0 && !error ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            color: '#495057',
          }}
        >
          <p>Nenhum pedido encontrado para o status selecionado.</p>
        </div>
      ) : null}
    </div>
  );
};
