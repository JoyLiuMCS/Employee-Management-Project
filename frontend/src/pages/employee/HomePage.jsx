import { Card, Typography, Button, Alert, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/onboarding/status');
        setApplicationStatus(res.data.status);
        setRejectionReason(res.data.rejectionReason || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, []);

  const handleViewApplication = () => {
    navigate('/onboarding');
  };

  // 未提交直接跳转
  if (!applicationStatus || applicationStatus === 'never_submitted') {
    navigate('/onboarding');
    return null;
  }

  const statusColorMap = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Card style={{ border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2}>Employee Onboarding Portal</Title>
        <Paragraph>
          Welcome! This portal guides you through the onboarding process. You can check your application status below and manage your personal profile and visa documents.
        </Paragraph>

        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '1rem' }}>
          <Alert 
            message={`Application Status: ${applicationStatus.toUpperCase()}`}
            type={applicationStatus === 'approved' ? 'success' : applicationStatus === 'pending' ? 'warning' : 'error'}
            showIcon
          />
          
          {applicationStatus === 'pending' && (
            <Paragraph style={{ color: statusColorMap.pending }}>
              Please wait for HR to review your application. You can view your submitted application below.
            </Paragraph>
          )}

          {applicationStatus === 'approved' && (
            <Paragraph style={{ color: statusColorMap.approved }}>
              Your application has been approved. You can access other features now.
            </Paragraph>
          )}

          {applicationStatus === 'rejected' && (
            <>
              <Paragraph style={{ color: statusColorMap.rejected }}>
                Your application was rejected.
              </Paragraph>
              {rejectionReason && (
                <Alert
                  message={`Reason: ${rejectionReason}`}
                  type="error"
                  showIcon
                />
              )}
              <Paragraph style={{ color: statusColorMap.rejected }}>
                Please review and correct your onboarding information below.
              </Paragraph>
            </>
          )}

          <Button type="primary" onClick={handleViewApplication}>
            View Submitted Application
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
