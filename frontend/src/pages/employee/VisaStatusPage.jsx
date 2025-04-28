import { Card, Upload, Button, Table, Typography, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';

const { Title } = Typography;

const VisaStatusPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [fileList, setFileList] = useState([]);
  const [visaRecords, setVisaRecords] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        navigate('/login?redirect=visa-status');
      }, 300);
    }
  }, [auth.token, navigate]);

  const fetchVisaRecords = async () => {
    try {
      setPageLoading(true);
      const res = await api.get('/api/visa/status');
      setVisaRecords(res.data.visaRecords || []);
    } catch (err) {
      console.error('Error loading visa records', err);
      showError('Failed to load visa records');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaRecords();
  }, []);

  const handleUpload = async (options) => {
    const { file } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      showLoading('Uploading visa document...');
      const res = await api.post('/api/visa/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccess('File uploaded successfully!');
      fetchVisaRecords();
    } catch (err) {
      console.error('Upload error', err);
      showError('Failed to upload document');
    } finally {
      hideLoading();
    }
  };

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 'pending') return <span style={{ color: '#faad14' }}>Pending Review</span>;
        if (text === 'approved') return <span style={{ color: '#52c41a' }}>Approved</span>;
        if (text === 'rejected') return <span style={{ color: '#ff4d4f' }}>Rejected</span>;
        return text;
      },
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>Visa Document Center</Title>

      <Card title="Upload Visa Documents" style={{ marginBottom: '2rem' }}>
        <Upload
          customRequest={handleUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          showUploadList={false}
          accept=".pdf,.jpg,.jpeg,.png"
        >
          <Button type="primary" icon={<UploadOutlined />}>Upload Visa File</Button>
        </Upload>
      </Card>

      <Card title="My Visa Applications">
        {pageLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={visaRecords}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default VisaStatusPage;
