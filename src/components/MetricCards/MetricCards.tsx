import React, { useMemo } from 'react';
import type { Order } from '../../types/order';
import { obterMetricasMes } from '../../views/views-model/OrdersDashboard.view.model';

interface MetricCardsProps {
  orders: Order[];
  month?: number;
  year?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  orders,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}) => {
  const metrics = useMemo(() => {
    const metricas = obterMetricasMes(orders, month, year);
    return metricas;
  }, [orders, month, year]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}
    >
      {/* Total Sales Card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          💰 Valor Total de Vendas
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#28a745',
          }}
        >
          {formatCurrency(metrics.valorTotalVendas)}
        </p>
      </div>

      {/* Total Items Card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          📦 Quantidade de Itens
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#007bff',
          }}
        >
          {metrics.quantidadeItensVendidos} unidades
        </p>
      </div>

      {/* Most Sold Product Card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          🏆 Produto Mais Vendido
        </h4>
        {metrics.produtoMaisVendido ? (
          <>
            <p
              style={{
                margin: '5px 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fd7e14',
              }}
            >
              {metrics.produtoMaisVendido.produtoNome ??
                metrics.produtoMaisVendido.produtoSku}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              {metrics.produtoMaisVendido.quantidade} unidades
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Sem dados
          </p>
        )}
      </div>

      {/* Average Order Value Card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          📊 Ticket Médio
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#6f42c1',
          }}
        >
          {formatCurrency(
            metrics.valorTotalVendas > 0
              ? metrics.valorTotalVendas / (orders.length || 1)
              : 0
          )}
        </p>
      </div>
    </div>
  );
};
