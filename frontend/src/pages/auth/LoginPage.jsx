import { Form, Input, Button, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { loginSuccess } from '../../redux/slices/authSlice';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';  // ⭐️ 引入统一message工具

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownMessage = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    console.log('📍LoginPage mounted, location.search:', location.search);
    console.log('📍Parsed redirect param:', redirectParam);
    if (redirectParam && !hasShownMessage.current) {
      hasShownMessage.current = true;
      setTimeout(() => {
        showError('Please login first!'); // 用封装的 showError
      }, 300);
    }
  }, [location.search]);
  
  const onFinish = async (values) => {
    try {
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || 'onboarding';

      showLoading('Logging in...');

      const res = await api.post('/auth/login', values);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      localStorage.setItem('token', res.data.token);

      showSuccess('Login successful!');
      navigate(`/${redirectPath}`);
    } catch (err) {
      console.error(err);
      showError('Login failed. Please check your credentials.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Employee Login" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
