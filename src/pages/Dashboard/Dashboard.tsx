import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { OrdersDashboardView } from '../../views/OrdersDashboard.view';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="app">
        <OrdersDashboardView />
        <div style={{ marginTop: '40px' }}></div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
