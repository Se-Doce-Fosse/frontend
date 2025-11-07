import { api } from '../../services/index';

const BASE_URL = 'admin/';

export const getOrders = async (token: string) => {
  return api(
    `${BASE_URL}`,
    { Authorization: `Bearer ${token}` },
    {
      method: 'GET',
    }
  );
};

export const getAllProductsFetch = async (token: string) => {
  const response = await fetch(`${BASE_URL}products`, {
    // Requires explicit "headers" key
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Manual header configuration
      'Content-Type': 'application/json', // Likely added automatically by the wrapper
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok'); // Manual error handling
  }

  const data = await response.json(); // Manual JSON parsing
  return data;
};

export const getOrdersByStatusFetch = async (token: string) => {
  const response = await fetch(`${BASE_URL}`, {
    // Requires explicit "headers" key
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Manual header configuration
      'Content-Type': 'application/json', // Likely added automatically by the wrapper
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok'); // Manual error handling
  }

  const data = await response.json(); // Manual JSON parsing
  return data;
};
