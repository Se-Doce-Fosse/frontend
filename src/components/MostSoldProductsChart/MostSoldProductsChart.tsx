import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { Order } from '../../types/order';
import { filterOrdersByMonth } from '../../views/view-controllers/OrdersDashboard.view.controller';

interface MostSoldProductsChartProps {
  orders: Order[];
  month?: number; // 1-12
  year?: number;
  topN?: number; // Number of top products to show (default: 10)
}

interface ProductData {
  sku: string;
  nome?: string | null;
  quantidade: number;
  valorTotal: number;
}

export const MostSoldProductsChart: React.FC<MostSoldProductsChartProps> = ({
  orders,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  topN = 10,
}) => {
  const chartData = useMemo(() => {
    // Filter orders by month
    const filteredOrders = filterOrdersByMonth(orders, month, year);

    // Aggregate products by quantity
    const produtosMap = new Map<string, ProductData>();

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = produtosMap.get(item.produtoSku) || {
          sku: item.produtoSku,
          nome: item.produtoNome ?? item.produtoSku,
          quantidade: 0,
          valorTotal: 0,
        };

        existing.nome = item.produtoNome ?? existing.nome ?? item.produtoSku;
        existing.quantidade += item.quantidade;
        existing.valorTotal += item.quantidade * item.valorUnitario;

        produtosMap.set(item.produtoSku, existing);
      });
    });

    // Convert to array and sort by quantity
    const produtosArray = Array.from(produtosMap.values()).sort(
      (a, b) => b.quantidade - a.quantidade
    );

    // Get top N products
    const topProdutos = produtosArray.slice(0, topN);

    return {
      series: [
        {
          name: 'Quantidade Vendida',
          data: topProdutos.map((p) => p.quantidade),
        },
      ],
      categories: topProdutos.map((p) => p.nome || p.sku),
    };
  }, [orders, month, year, topN]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString();
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString() + ' unidades';
        },
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Produtos',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Quantidade Vendida',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#1E90FF'],
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 3,
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
        },
      },
    },
  };

  const monthName = new Date(year, month - 1).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="most-sold-products-chart">
      <h3
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '600',
        }}
      >
        Top {topN} Produtos Mais Vendidos -{' '}
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h3>
      {chartData.categories.length > 0 ? (
        <Chart
          options={options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Nenhum pedido encontrado para este período.</p>
        </div>
      )}
    </div>
  );
};
