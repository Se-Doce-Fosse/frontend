import type { Order } from '../../types/order';
import {
  filterOrdersByDay,
  filterOrdersByWeek,
  filterOrdersByMonth,
} from '../view-controllers/OrdersDashboard.view.controller';

/**
 * Dashboard data interfaces
 */
export interface ProductSalesInfo {
  produtoSku: string;
  quantidade: number;
  valorTotal: number;
}

export interface HourlySalesData {
  hora: number; // 0-23
  quantidade: number;
  valorTotal: number;
}

export interface MonthlySalesData {
  mes: number; // 1-12
  ano: number;
  quantidade: number;
  valorTotal: number;
}

export interface DashboardMetrics {
  periodo: 'dia' | 'semana' | 'mês';
  dataInicio: Date;
  dataFim: Date;
  quantidadeItensVendidos: number;
  valorTotalVendas: number;
  ticketMedio: number;
  pedidosCancelados: number;
  produtoMaisVendido: ProductSalesInfo | null;
  vendaPorHorario: HourlySalesData[];
}

/**
 * Calcula a quantidade total de itens vendidos
 * @param orders - Array de pedidos
 * @returns Quantidade total de itens
 */
export const calcularQuantidadeItensVendidos = (orders: Order[]): number => {
  return orders.reduce((total, order) => {
    const quantidadePedido = order.items.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );
    return total + quantidadePedido;
  }, 0);
};

/**
 * Calcula o valor total de vendas
 * @param orders - Array de pedidos
 * @returns Valor total das vendas
 */
export const calcularValorTotalVendas = (orders: Order[]): number => {
  return orders.reduce((total, order) => total + order.totalPrice, 0);
};

/**
 * Encontra o produto mais vendido
 * @param orders - Array de pedidos
 * @returns Informações do produto mais vendido
 */
export const encontrarProdutoMaisVendido = (
  orders: Order[]
): ProductSalesInfo | null => {
  const produtosMap = new Map<string, ProductSalesInfo>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = produtosMap.get(item.produtoSku) || {
        produtoSku: item.produtoSku,
        quantidade: 0,
        valorTotal: 0,
      };

      existing.quantidade += item.quantidade;
      existing.valorTotal += item.quantidade * item.valorUnitario;

      produtosMap.set(item.produtoSku, existing);
    });
  });

  let maisVendido: ProductSalesInfo | null = null;
  produtosMap.forEach((produto) => {
    if (!maisVendido || produto.quantidade > maisVendido.quantidade) {
      maisVendido = produto;
    }
  });

  return maisVendido;
};

/**
 * Calcula vendas por hora do dia
 * @param orders - Array de pedidos
 * @returns Array com vendas por hora (0-23)
 */
export const calcularVendaPorHorario = (orders: Order[]): HourlySalesData[] => {
  const horasMap = new Map<number, HourlySalesData>();

  // Inicializa todas as horas
  for (let hora = 0; hora < 24; hora++) {
    horasMap.set(hora, {
      hora,
      quantidade: 0,
      valorTotal: 0,
    });
  }

  // Agrupa vendas por hora
  orders.forEach((order) => {
    const hora = new Date(order.orderDate).getHours();
    const dadosHora = horasMap.get(hora)!;

    const quantidadePedido = order.items.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );
    dadosHora.quantidade += quantidadePedido;
    dadosHora.valorTotal += order.totalPrice;
  });

  return Array.from(horasMap.values());
};

/**
 * Gera métricas de dashboard para um período específico (dia)
 * @param orders - Array de pedidos
 * @param date - Data para filtro (padrão: hoje)
 * @returns Métricas do dashboard para o dia
 */
export const obterMetricasDia = (
  orders: Order[],
  date: Date = new Date()
): DashboardMetrics => {
  const pedidosFiltrados = filterOrdersByDay(orders, date);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    periodo: 'dia',
    dataInicio: startOfDay,
    dataFim: endOfDay,
    quantidadeItensVendidos: calcularQuantidadeItensVendidos(pedidosFiltrados),
    valorTotalVendas: calcularValorTotalVendas(pedidosFiltrados),
    ticketMedio:
      pedidosFiltrados.length > 0
        ? calcularValorTotalVendas(pedidosFiltrados) / pedidosFiltrados.length
        : 0,
    pedidosCancelados: pedidosFiltrados.filter(
      (o) => o.orderStatus === 'CANCELADO'
    ).length,
    produtoMaisVendido: encontrarProdutoMaisVendido(pedidosFiltrados),
    vendaPorHorario: calcularVendaPorHorario(pedidosFiltrados),
  };
};

/**
 * Gera métricas de dashboard para um período específico (semana)
 * @param orders - Array de pedidos
 * @param date - Data para filtro (padrão: hoje)
 * @returns Métricas do dashboard para a semana
 */
export const obterMetricasSemana = (
  orders: Order[],
  date: Date = new Date()
): DashboardMetrics => {
  const pedidosFiltrados = filterOrdersByWeek(orders, date);

  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();
  const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const startOfWeek = new Date(currentDate.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    periodo: 'semana',
    dataInicio: startOfWeek,
    dataFim: endOfWeek,
    quantidadeItensVendidos: calcularQuantidadeItensVendidos(pedidosFiltrados),
    valorTotalVendas: calcularValorTotalVendas(pedidosFiltrados),
    ticketMedio:
      pedidosFiltrados.length > 0
        ? calcularValorTotalVendas(pedidosFiltrados) / pedidosFiltrados.length
        : 0,
    pedidosCancelados: pedidosFiltrados.filter(
      (o) => o.orderStatus === 'CANCELADO'
    ).length,
    produtoMaisVendido: encontrarProdutoMaisVendido(pedidosFiltrados),
    vendaPorHorario: calcularVendaPorHorario(pedidosFiltrados),
  };
};

/**
 * Gera métricas de dashboard para um período específico (mês)
 * @param orders - Array de pedidos
 * @param month - Mês (1-12), padrão: mês atual
 * @param year - Ano, padrão: ano atual
 * @returns Métricas do dashboard para o mês
 */
export const obterMetricasMes = (
  orders: Order[],
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
): DashboardMetrics => {
  const pedidosFiltrados = filterOrdersByMonth(orders, month, year);

  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return {
    periodo: 'mês',
    dataInicio: startDate,
    dataFim: endDate,
    quantidadeItensVendidos: calcularQuantidadeItensVendidos(pedidosFiltrados),
    valorTotalVendas: calcularValorTotalVendas(pedidosFiltrados),
    ticketMedio:
      pedidosFiltrados.length > 0
        ? calcularValorTotalVendas(pedidosFiltrados) / pedidosFiltrados.length
        : 0,
    pedidosCancelados: pedidosFiltrados.filter(
      (o) => o.orderStatus === 'CANCELADO'
    ).length,
    produtoMaisVendido: encontrarProdutoMaisVendido(pedidosFiltrados),
    vendaPorHorario: calcularVendaPorHorario(pedidosFiltrados),
  };
};

/**
 * Encontra o mês que mais vendeu em um período
 * @param orders - Array de pedidos
 * @param year - Ano para análise (padrão: ano atual)
 * @returns Dados do mês com maior venda
 */
export const encontrarMesComMaiorVenda = (
  orders: Order[],
  year: number = new Date().getFullYear()
): MonthlySalesData | null => {
  const mesesMap = new Map<number, MonthlySalesData>();

  // Inicializa todos os meses
  for (let mes = 1; mes <= 12; mes++) {
    mesesMap.set(mes, {
      mes,
      ano: year,
      quantidade: 0,
      valorTotal: 0,
    });
  }

  // Agrupa vendas por mês
  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate.getFullYear() === year) {
      const mes = orderDate.getMonth() + 1;
      const dadosMes = mesesMap.get(mes)!;

      const quantidadePedido = order.items.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );
      dadosMes.quantidade += quantidadePedido;
      dadosMes.valorTotal += order.totalPrice;
    }
  });

  let mesMaiorVenda: MonthlySalesData | null = null;
  let maiorValor = 0;

  mesesMap.forEach((mes) => {
    if (mes.valorTotal > maiorValor) {
      maiorValor = mes.valorTotal;
      mesMaiorVenda = mes;
    }
  });

  return mesMaiorVenda && maiorValor > 0 ? mesMaiorVenda : null;
};

/**
 * Obtém dados de vendas de todos os meses para comparação
 * @param orders - Array de pedidos
 * @param year - Ano para análise (padrão: ano atual)
 * @returns Array com dados de vendas por mês
 */
export const obterVendasPorMes = (
  orders: Order[],
  year: number = new Date().getFullYear()
): MonthlySalesData[] => {
  const mesesMap = new Map<number, MonthlySalesData>();

  // Inicializa todos os meses
  for (let mes = 1; mes <= 12; mes++) {
    mesesMap.set(mes, {
      mes,
      ano: year,
      quantidade: 0,
      valorTotal: 0,
    });
  }

  // Agrupa vendas por mês
  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate.getFullYear() === year) {
      const mes = orderDate.getMonth() + 1;
      const dadosMes = mesesMap.get(mes)!;

      const quantidadePedido = order.items.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );
      dadosMes.quantidade += quantidadePedido;
      dadosMes.valorTotal += order.totalPrice;
    }
  });

  return Array.from(mesesMap.values());
};

/**
 * Gera um resumo completo do dashboard
 * @param orders - Array de pedidos
 * @returns Objeto com todas as métricas consolidadas
 */
export const gerarResumoDashboard = (orders: Order[]) => {
  const hoje = new Date();

  return {
    dia: obterMetricasDia(orders, hoje),
    semana: obterMetricasSemana(orders, hoje),
    mes: obterMetricasMes(orders, hoje.getMonth() + 1, hoje.getFullYear()),
    mesComMaiorVenda: encontrarMesComMaiorVenda(orders, hoje.getFullYear()),
    vendasPorMes: obterVendasPorMes(orders, hoje.getFullYear()),
  };
};
