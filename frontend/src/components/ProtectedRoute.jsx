// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireHR = false }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.token) {
    // 没有登录，跳去login
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (requireHR && auth.user?.role !== 'hr') {
    // 需要HR权限但不是HR，跳去普通profile
    return <Navigate to="/profile" replace />;
  }

  // 正常允许访问
  return children;
};

export default ProtectedRoute;
