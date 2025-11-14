import { api } from '../../services/index';
import type { Order } from '../../types/order';

const BASE_URL = '/admin/order';

export const getOrders = async (token: string, status: string) => {
  return api(
    `${BASE_URL}/${status}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

/**
 * Filters orders by date range
 * @param orders - Array of orders to filter
 * @param startDate - Start date (inclusive). If null, no lower bound
 * @param endDate - End date (inclusive). If null, no upper bound
 * @returns Filtered array of orders within the date range
 */
export const filterOrdersByDateRange = (
  orders: Order[],
  startDate?: Date | null,
  endDate?: Date | null
): Order[] => {
  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);

    if (startDate && orderDate < startDate) {
      return false;
    }

    if (endDate && orderDate > endDate) {
      return false;
    }

    return true;
  });
};

/**
 * Filters orders by day
 * @param orders - Array of orders to filter
 * @param date - The specific date to filter by (defaults to today)
 * @returns Orders that occurred on the specified date
 */
export const filterOrdersByDay = (
  orders: Order[],
  date: Date = new Date()
): Order[] => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return filterOrdersByDateRange(orders, startOfDay, endOfDay);
};

/**
 * Filters orders by week
 * @param orders - Array of orders to filter
 * @param date - Any date within the week (defaults to today)
 * @returns Orders that occurred within the same week (Monday-Sunday)
 */
export const filterOrdersByWeek = (
  orders: Order[],
  date: Date = new Date()
): Order[] => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();
  // Calculate Monday (0 = Sunday, so Monday = 1)
  const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const startOfWeek = new Date(currentDate.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return filterOrdersByDateRange(orders, startOfWeek, endOfWeek);
};

/**
 * Filters orders by month
 * @param orders - Array of orders to filter
 * @param month - Month (1-12), defaults to current month
 * @param year - Year, defaults to current year
 * @returns Orders that occurred in the specified month/year
 */
export const filterOrdersByMonth = (
  orders: Order[],
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
): Order[] => {
  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return filterOrdersByDateRange(orders, startDate, endDate);
};
