import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/slices/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      dispatch(loginSuccess({ user, token }));
    }
  }, [dispatch]);  // 页面一加载时执行

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
