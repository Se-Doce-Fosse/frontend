import { useCallback } from 'react';
import { Button } from '../components/Button/Button';
import { useUser } from '../context/UserContext';
import { getProductsHeaders } from './view-controllers/ProductsDashboard.view.controller';

export function ProductDashboard() {
  const { user } = useUser();

  const handleLogHeaders = useCallback(async () => {
    try {
      if (user?.token) {
        const headers = await getProductsHeaders({
          admin: true,
          token: user.token,
        });
        console.log('Product headers (admin):', headers);
      } else {
        const headers = await getProductsHeaders();
        console.log('Product headers (public):', headers);
      }
    } catch (err) {
      console.error('Error fetching product headers:', err);
    }
  }, [user?.token]);

  return (
    <div style={{ padding: '20px' }}>
      <Button
        label="Log Products"
        onClick={handleLogHeaders}
        variant="primary"
      />
    </div>
  );
}

export default ProductDashboard;
