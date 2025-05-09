import {
  Card, Upload, Button, Table, Typography,
  message, Spin, Select, Alert
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

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

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => navigate('/login?redirect=visa-status'), 300);
    } else {
      fetchProfile();
      fetchVisaRecords();
    }
  }, [auth.token]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get(`/users/${auth.user.id}`);
      setUser(res.data);
    } catch {
      message.error('Failed to load profile info.');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchVisaRecords = async () => {
    try {
      const res = await api.get('/documents/my');
      setRecords(res.data || []);
    } catch {
      message.error('Could not load your visa documents.');
    }
  };

  const getNextStep = () => {
    for (const step of steps) {
      const doc = records.find((r) => r.type === step);
      if (!doc || doc.status === 'rejected') return step;
      if (doc.status !== 'approved') return null;
    }
    return null;
  };

  const currentStep = getNextStep();
  const currentRejectedRecord = records.find((r) => r.type === currentStep && r.status === 'rejected');

  const handleUpload = async ({ file }) => {
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
    } catch {
      message.error({ content: 'Upload failed.', key: 'upload' });
    }
  };

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
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <a
            href={`http://localhost:3000/uploads/${record.filename}`}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: 10 }}
          >
            Preview
          </a>
          <a
            href={`http://localhost:3000/uploads/${record.filename}`}
            download
          >
            Download
          </a>
        </>
      ),
    },
  ];

  if (profileLoading) return <Spin style={{ marginTop: '3rem' }} size="large" />;

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
    <>
      <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Visa Document Center</Title>

        <Card title={`Upload: ${stepLabels[currentStep] || 'All done!'}`} style={{ marginBottom: '2rem' }}>
          {currentRejectedRecord && (
            <Alert
              type="error"
              message="Document Rejected"
              description={currentRejectedRecord.feedback || 'Please re-upload the document.'}
              showIcon
              style={{ marginBottom: '1rem' }}
            />
          )}

          {currentStep === 'i_983' && (
            <div style={{ marginBottom: '1rem' }}>
              <Button
                href="/templates/i983-empty.pdf"
                target="_blank"
                style={{ marginRight: 10 }}
              >
                Download Empty Template
              </Button>
              <Button
                href="/templates/i983-sample.pdf"
                target="_blank"
                type="dashed"
              >
                Download Sample
              </Button>
            </div>
          )}

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
    </>
  );
};

export default VisaStatusPage;
