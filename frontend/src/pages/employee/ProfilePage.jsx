import { Card, Typography, Space, Button, Form, Spin, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';
import PersonalInfoForm from './onboarding/PersonalInfoForm';
import ContactInfoForm from './onboarding/ContactInfoForm';
import AddressForm from './onboarding/AddressForm';
import Navbar from '../../components/Navbar';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        navigate('/login?redirect=profile');
      }, 100);
    } else {
      fetchProfile();
      fetchApplicationStatus();
      fetchDocuments();
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

  const fetchApplicationStatus = async () => {
    try {
      const res = await api.get('/onboarding/status');
      setApplicationStatus(res.data.status);
    } catch (err) {
      console.error('Error fetching onboarding status:', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const [docRes, onboardRes] = await Promise.all([
        api.get('/documents/my'),
        api.get('/onboarding/status'),
      ]);
      const docsFromOnboarding = onboardRes.data.application?.documents || [];
      setDocuments([...docRes.data, ...docsFromOnboarding]);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };
  

  const handleEdit = () => {
    if (applicationStatus === 'pending') {
      Modal.warning({
        title: 'Cannot Edit',
        content: 'Your onboarding application is still under review. You cannot edit your profile at this time.',
      });
      return;
    }

    setIsEditing(true);

    const valuesToSet = {
      ...user,
      visaStartDate: user.visaStartDate ? dayjs(user.visaStartDate) : null,
      visaEndDate: user.visaEndDate ? dayjs(user.visaEndDate) : null,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    };

    form.setFieldsValue(valuesToSet);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Discard Changes?',
      content: 'Are you sure you want to discard all your changes?',
      onOk: () => {
        setIsEditing(false);
        form.resetFields();
      },
    });
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

  const handleDownload = (filename) => {
    const url = `http://localhost:3000/uploads/${filename}`;
    window.open(url, '_blank');
  };

  if (pageLoading || !user) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
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
          {applicationStatus === 'pending' && (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Text type="warning" strong>
                Please wait for HR to review your onboarding application.
              </Text>
            </div>
          )}

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
                <Text><b>First Name:</b> {user.firstName}</Text><br />
                <Text><b>Last Name:</b> {user.lastName}</Text><br />
                <Text><b>Email:</b> {user.email}</Text><br />
                <Text><b>Phone:</b> {user.phoneNumber}</Text><br />
                <Text><b>Gender:</b> {user.gender}</Text><br />
                <Text><b>Date of Birth:</b> {user.dateOfBirth?.slice(0, 10)}</Text><br />

                <Title level={4} style={{ marginTop: '2rem' }}>Address</Title>
                <Text><b>Building/Apt:</b> {user.address?.building}</Text><br />
                <Text><b>Street:</b> {user.address?.street}</Text><br />
                <Text><b>City:</b> {user.address?.city}</Text><br />
                <Text><b>State:</b> {user.address?.state}</Text><br />
                <Text><b>ZIP:</b> {user.address?.zip}</Text><br />

                <Title level={4} style={{ marginTop: '2rem' }}>Uploaded Documents</Title>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc._id} style={{ marginBottom: '1rem' }}>
                      <Text>{doc.filename}</Text><br />
                      <Button type="link" onClick={() => handleDownload(doc.filename)}>
                        Download / Preview
                      </Button>
                    </div>
                  ))
                ) : (
                  <Text>No documents uploaded yet.</Text>
                )}
              </>
            )}
          </Space>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
