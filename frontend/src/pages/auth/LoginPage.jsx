import { Form, Input, Button, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { loginSuccess } from '../../redux/slices/authSlice';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownMessage = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam && !hasShownMessage.current) {
      hasShownMessage.current = true;
      setTimeout(() => {
        showError('Please login first!');
      }, 300);
    }
  }, [location.search]);

  const onFinish = async (values) => {
    try {
      showLoading('Logging in...');
      const res = await api.post('/auth/login', values);  // 🔥 注意，去掉了/api
      const { user, accessToken } = res.data;

      dispatch(loginSuccess({ user, token: accessToken }));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      showSuccess('Login successful!');

      // 登录成功后，拉取onboarding状态
      const onboardingRes = await api.get('/onboarding/status');  // 🔥 修改这里，去掉了/api
      const onboardingStatus = onboardingRes.data.status;

      if (onboardingStatus === 'approved') {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error(err);
      showError('Login failed. Please check your credentials.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Login" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
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
