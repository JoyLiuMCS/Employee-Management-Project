import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // 如果没有token，强制跳转到 /login
    return <Navigate to="/login" replace />;
  }

  // 有token，正常渲染子组件
  return children;
};

export default ProtectedRoute;
