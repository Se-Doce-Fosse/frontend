import React, { useEffect, useState } from 'react';
import type { Order } from '../../types/order';
import { useUser } from '../../context/UserContext';
import {
  obterMetricasDia,
  obterMetricasSemana,
  obterMetricasMes,
  encontrarMesComMaiorVenda,
} from '../../views/views-model/OrdersDashboard.view.model';
import { getOrders } from '../../views/view-controllers/OrdersDashboard.view.controller';
import {
  filterOrdersByDay,
  filterOrdersByWeek,
  filterOrdersByMonth,
} from '../../views/view-controllers/OrdersDashboard.view.controller';

interface DashboardSummaryProps {
  orders: Order[];
  selectedMonth: number;
  selectedYear: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  orders,
  selectedMonth,
  selectedYear,
}) => {
  const { user } = useUser();
  const [canceledOrders, setCanceledOrders] = useState<Order[]>([]);
  const [loadingCanceled, setLoadingCanceled] = useState(false);

  useEffect(() => {
    const fetchCanceled = async () => {
      if (!user) return;
      try {
        setLoadingCanceled(true);
        const data = await getOrders(user.token, 'CANCELADO');
        setCanceledOrders(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching canceled orders', err);
        setCanceledOrders([]);
      } finally {
        setLoadingCanceled(false);
      }
    };
    fetchCanceled();
  }, [user]);

  const dia = obterMetricasDia(orders, new Date());
  const semana = obterMetricasSemana(orders, new Date());
  const mes = obterMetricasMes(orders, selectedMonth, selectedYear);

  const canceledToday = filterOrdersByDay(canceledOrders, new Date()).length;
  const canceledWeek = filterOrdersByWeek(canceledOrders, new Date()).length;
  const canceledMonth = filterOrdersByMonth(
    canceledOrders,
    selectedMonth,
    selectedYear
  ).length;

  const bestMonth = encontrarMesComMaiorVenda(orders, selectedYear);

  return (
    <div className="summary-grid">
      {[
        { title: 'Dia', data: dia, canceled: canceledToday },
        { title: 'Semana', data: semana, canceled: canceledWeek },
        { title: 'Mês', data: mes, canceled: canceledMonth },
      ].map((col) => (
        <div key={col.title} className="summary-card">
          <h4 style={{ marginTop: 0 }}>{col.title}</h4>
          <p style={{ margin: '6px 0' }}>
            <strong>Produto mais vendido:</strong>{' '}
            {col.data.produtoMaisVendido
              ? `${col.data.produtoMaisVendido.produtoSku} (${col.data.produtoMaisVendido.quantidade})`
              : '—'}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Quantidade de itens vendidos:</strong>{' '}
            {col.data.quantidadeItensVendidos}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Valor total:</strong>{' '}
            {formatCurrency(col.data.valorTotalVendas)}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Ticket médio:</strong>{' '}
            {formatCurrency(col.data.ticketMedio)}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Pedidos cancelados:</strong>{' '}
            {loadingCanceled ? 'Carregando...' : col.canceled}
          </p>
        </div>
      ))}

      <div style={{ gridColumn: '1 / -1' }}>
        <div className="summary-card" style={{ background: '#f7f7f9' }}>
          <strong>Mês que mais vendeu:</strong>{' '}
          {bestMonth
            ? `${bestMonth.mes}/${bestMonth.ano} — ${bestMonth.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            : '—'}
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
