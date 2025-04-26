import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSuccess } from '../../redux/slices/authSlice';
import api from '../../utils/api';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    console.log('📍LoginPage mounted, location.search:', location.search);   // 👈 加这一行
    console.log('📍Parsed redirect param:', redirectParam);                   // 👈 加这一行
    if (redirectParam) {
      setTimeout(() => {
        message.error('Please login first!');
      }, 300);
    }
  }, [location.search]);
  

  const onFinish = async (values) => {
    try {
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || '/onboarding'; // 没有redirect参数默认跳/onboarding
  
      const res = await api.post('/auth/login', values);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      localStorage.setItem('token', res.data.token);
      message.success('Login successful!');
      navigate(`/${redirectPath}`);  // ⭐️ 根据redirect跳
    } catch (err) {
      console.error(err);
      message.error('Login failed. Please check your credentials.');
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
