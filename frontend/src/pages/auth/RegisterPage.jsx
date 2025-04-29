import { Form, Input, Button, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';  // ⭐️ 引入统一message工具

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useParams();

  const onFinish = async (values) => {
    try {
      showLoading('Registering...');
      const res = await api.post(`/auth/register/${token}`, values);
      showSuccess('Registration successful! Please login.');
      navigate('/login'); // 修改跳回到 /login
    } catch (err) {
      console.error(err);
      showError('Registration failed. Please check your input.');
    } finally {
      hideLoading();
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
