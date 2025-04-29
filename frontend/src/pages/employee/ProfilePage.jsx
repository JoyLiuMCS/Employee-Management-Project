import { Card, Typography, Space, Button, Form, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';
import PersonalInfoForm from './onboarding/PersonalInfoForm';
import ContactInfoForm from './onboarding/ContactInfoForm';
import AddressForm from './onboarding/AddressForm';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
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
      if (!auth.user || !auth.user.id) throw new Error('No user ID available');
      setPageLoading(true);
      const res = await api.get(`/users/${auth.user.id}`);
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
    form.setFieldsValue(user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      if (!auth.user || !auth.user.id) throw new Error('No user ID available');
      setLoading(true);
      showLoading('Saving your profile...');
      const res = await api.patch(`/users/${auth.user.id}`, values);
      setUser(res.data.user || values);
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
              <PersonalInfoForm />
              <ContactInfoForm />
              <AddressForm />
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
              <Text><b>Phone:</b> {user.phoneNumber}</Text>

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
