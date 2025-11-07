/* const { user } = useUser();
const fetchOrders = async () => {
    if (!user?.token) return;
    try {
      const data = await getAllProducts(user.token);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
};
 */

/* export const getAllProductsNativeFetch = async (token: string) => {
  const response = await fetch(`${BASE_URL}`, { // Requires explicit "headers" key
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Manual header configuration
      'Content-Type': 'application/json' // Likely added automatically by the wrapper
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok'); // Manual error handling
  }

  const data = await response.json(); // Manual JSON parsing
  return data;
};
 */
