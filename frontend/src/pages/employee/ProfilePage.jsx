import { Card, Typography, Space, Button, Form, Input, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 保存按钮loading
  const [pageLoading, setPageLoading] = useState(false); // 整个页面loading
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        navigate('/login?redirect=profile');
      }, 100);
    } else {
      fetchProfile();
    }
  }, [auth.token, navigate]);

  const fetchProfile = async () => {
    try {
      if (!auth.user || !auth.user.id) {
        throw new Error('No user id available');
      }
      setPageLoading(true);
      const res = await api.get(`/users/${auth.user.id}`); // 🔥 GET当前用户
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      showError('Failed to load profile.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user); // 填充表单
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      if (!auth.user || !auth.user.id) {
        throw new Error('No user id available');
      }
      setLoading(true);
      showLoading('Saving your profile...');
      
      const res = await api.patch(`/users/${auth.user.id}`, values); // 🔥 PATCH当前用户
      console.log('✅ Server Response:', res.data);

      setUser(res.data.user || values); // 更新页面数据（根据后端返回调整）
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

  if (pageLoading || !user) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <Spin size="large" />
      </div>
    );
  }

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
              <Text><b>Building/Apt:</b> {user.address?.building}</Text>
              <Text><b>Street:</b> {user.address?.street}</Text>
              <Text><b>City:</b> {user.address?.city}</Text>
              <Text><b>State:</b> {user.address?.state}</Text>
              <Text><b>ZIP:</b> {user.address?.zip}</Text>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage;
