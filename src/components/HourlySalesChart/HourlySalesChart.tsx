import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { Order } from '../../types/order';
import { filterOrdersByMonth } from '../../views/view-controllers/OrdersDashboard.view.controller';

interface HourlySalesChartProps {
  orders: Order[];
  month?: number; // 1-12
  year?: number;
}

export const HourlySalesChart: React.FC<HourlySalesChartProps> = ({
  orders,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}) => {
  const chartData = useMemo(() => {
    // Filter orders by month
    const filteredOrders = filterOrdersByMonth(orders, month, year);

    // Create hourly aggregation
    const horasMap = new Map<
      number,
      { quantidade: number; valorTotal: number }
    >();

    for (let hora = 0; hora < 24; hora++) {
      horasMap.set(hora, { quantidade: 0, valorTotal: 0 });
    }

    filteredOrders.forEach((order) => {
      const hora = new Date(order.orderDate).getHours();
      const dadosHora = horasMap.get(hora)!;

      const quantidadePedido = order.items.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );
      dadosHora.quantidade += quantidadePedido;
      dadosHora.valorTotal += order.totalPrice;
    });

    return {
      quantidade: Array.from(horasMap.values()).map((h) => h.quantidade),
      valor: Array.from(horasMap.values()).map((h) => h.valorTotal),
      horas: Array.from({ length: 24 }, (_, i) => `${i}h`),
    };
  }, [orders, month, year]);

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
        columnWidth: '70%',
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
        fontSize: '11px',
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
      categories: chartData.horas,
      title: {
        text: 'Horário',
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
      colors: ['#FF6B6B'],
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 3,
    },
  };

  const monthName = new Date(year, month - 1).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hourly-sales-chart">
      <h3
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '600',
        }}
      >
        Vendas por Horário -{' '}
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h3>
      {chartData.quantidade.some((q) => q > 0) ? (
        <Chart
          options={options}
          series={[
            {
              name: 'Quantidade Vendida',
              data: chartData.quantidade,
            },
          ]}
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
