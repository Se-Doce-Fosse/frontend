import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import { Loading } from '@components';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useUser();
  if (loading) return <Loading />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
