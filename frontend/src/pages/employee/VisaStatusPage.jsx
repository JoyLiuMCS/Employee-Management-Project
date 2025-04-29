import { Card, Upload, Button, Table, Typography, message, Spin, Select, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const { Title } = Typography;

const steps = ['opt_receipt', 'opt_ead', 'i_983', 'i_20'];
const stepLabels = {
  opt_receipt: 'OPT Receipt',
  opt_ead: 'OPT EAD',
  i_983: 'I-983 Form',
  i_20: 'I-20 Document',
};

const VisaStatusPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchVisaRecords = async () => {
    try {
      const res = await api.get('/documents/my');
      setRecords(res.data || []);
    } catch (err) {
      console.error('Failed to load visa records', err);
      message.error('Could not load your visa documents.');
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get(`/users/${auth.user.id}`);
      setUser(res.data);
    } catch (err) {
      message.error('Failed to load profile info.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpload = async ({ file }) => {
    const currentStep = getNextStep();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', currentStep);

    try {
      message.loading({ content: 'Uploading...', key: 'upload' });
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success({ content: 'Uploaded successfully!', key: 'upload', duration: 2 });
      setFileList([]);
      fetchVisaRecords();
    } catch (err) {
      message.error({ content: 'Upload failed.', key: 'upload' });
    }
  };

  const getNextStep = () => {
    for (const step of steps) {
      const match = records.find((r) => r.type === step);
      if (!match || match.status === 'rejected') return step;
      if (match.status !== 'approved') return null;
    }
    return null;
  };

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => navigate('/login?redirect=visa-status'), 300);
      return;
    }
    fetchProfile();
    fetchVisaRecords();
  }, [auth.token]);

  const currentStep = getNextStep();
  const filtered = records.filter(r => statusFilter === 'all' || r.status === statusFilter);

  const columns = [
    {
      title: 'Document Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => stepLabels[type] || type,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => {
        const colors = { pending: '#faad14', approved: '#52c41a', rejected: '#ff4d4f' };
        return <span style={{ color: colors[s] }}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
      },
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (f) => f || '--',
    },
    {
      title: 'Uploaded At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  if (profileLoading) {
    return <Spin style={{ marginTop: '3rem' }} size="large" />;
  }

  if (user?.visaType !== 'F1') {
    return (
      <Alert
        message="Not Applicable"
        description="Visa status tracking is only available for F1 visa holders."
        type="info"
        showIcon
        style={{ maxWidth: 600, margin: '3rem auto' }}
      />
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Visa Document Center</Title>

      <Card title={`Upload: ${stepLabels[currentStep] || 'All done!'}`} style={{ marginBottom: '2rem' }}>
        {currentStep ? (
          <Upload
            customRequest={handleUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            showUploadList={false}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button type="primary" icon={<UploadOutlined />}>
              Upload {stepLabels[currentStep]}
            </Button>
          </Upload>
        ) : (
          <Alert message="All documents uploaded and approved!" type="success" />
        )}
      </Card>

      <Card title="Your Uploaded Documents">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ marginBottom: '1rem', width: 200 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default VisaStatusPage;
