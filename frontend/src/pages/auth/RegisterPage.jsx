import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useParams();  // 从 URL 拿注册 token

  const onFinish = async (values) => {
    try {
      const res = await api.post(`/api/auth/register/${token}`, values);
      message.success('Registration successful! Please login.');
      navigate('/'); // 注册成功后跳回登录页
    } catch (err) {
      console.error(err);
      message.error('Registration failed. Please check your input.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Employee Registration" style={{ width: 400 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="Confirm Password" name="confirmPassword" dependencies={['password']} rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              }
            })
          ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>Register</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
