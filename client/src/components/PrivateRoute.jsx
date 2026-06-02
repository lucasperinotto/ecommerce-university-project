import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  return usuario ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export default PrivateRoute;
