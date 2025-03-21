import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  return currentUser && userRole === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;