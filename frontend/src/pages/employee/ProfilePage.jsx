import { Card, Typography, Space, Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';  // ⭐️ 加了 useNavigate
import { useSelector } from 'react-redux'; 
import { useEffect, useState } from 'react';
import api from '../../utils/api'; 
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';


const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // ⭐️ 新增：控制 Loading 状态
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        navigate('/login?redirect=onboarding');
      }, 100); // 小小加快跳转
    }
  }, [auth.token, navigate]);
  
  

  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: {
      building: '123',
      street: 'Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      showLoading('Saving your profile...');
      // 发 PATCH 请求到后端
      const res = await api.patch('/api/user/update', values);
      console.log('✅ Server Response:', res.data);
  
      setUser(values); // 更新本地展示
      setIsEditing(false);
  
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      showError('Failed to update profile.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };
  

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Card
        title="My Profile"
        extra={
          !isEditing && (
            <Button type="primary" onClick={handleEdit}>
              Edit
            </Button>
          )
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {isEditing ? (
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Title level={4}>Personal Information</Title>

              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input disabled />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>

              <Title level={4} style={{ marginTop: '2rem' }}>Address</Title>

              <Form.Item label="Building/Apt" name={['address', 'building']}>
                <Input />
              </Form.Item>

              <Form.Item label="Street" name={['address', 'street']}>
                <Input />
              </Form.Item>

              <Form.Item label="City" name={['address', 'city']}>
                <Input />
              </Form.Item>

              <Form.Item label="State" name={['address', 'state']}>
                <Input />
              </Form.Item>

              <Form.Item label="ZIP" name={['address', 'zip']}>
                <Input />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '1rem' }}>
                  Save
                </Button>
                <Button onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Title level={4}>Personal Information</Title>
              <Text><b>First Name:</b> {user.firstName}</Text>
              <Text><b>Last Name:</b> {user.lastName}</Text>
              <Text><b>Email:</b> {user.email}</Text>
              <Text><b>Phone:</b> {user.phone}</Text>

              <Title level={4} style={{ marginTop: '2rem' }}>Address</Title>
              <Text><b>Building/Apt:</b> {user.address.building}</Text>
              <Text><b>Street:</b> {user.address.street}</Text>
              <Text><b>City:</b> {user.address.city}</Text>
              <Text><b>State:</b> {user.address.state}</Text>
              <Text><b>ZIP:</b> {user.address.zip}</Text>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage;
