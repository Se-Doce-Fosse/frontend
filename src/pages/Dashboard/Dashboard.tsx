import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { OrdersDashboardView } from '../../views/OrdersDashboard.view';
import { ProductDashboard } from '../../views/ProductDashboard.view';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="app">
        <OrdersDashboardView />
        <div style={{ marginTop: '40px' }}>
          <ProductDashboard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
