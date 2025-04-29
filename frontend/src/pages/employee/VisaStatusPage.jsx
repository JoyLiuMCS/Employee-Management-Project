import { Card, Upload, Button, Table, Typography, message, Spin, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const { Title } = Typography;

const VisaStatusPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [fileList, setFileList] = useState([]);
  const [visaRecords, setVisaRecords] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // ⭐️ 新增

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        message.error('Please login first!');
        navigate('/login?redirect=visa-status');
      }, 300);
      return;
    }
    fetchVisaRecords();
  }, [auth.token]);

  const fetchVisaRecords = async () => {
    try {
      setPageLoading(true);
      const res = await api.get('/documents/my'); 
      setVisaRecords(res.data || []);
    } catch (err) {
      console.error('Error loading visa records', err);
      message.error('Failed to load visa records');
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      message.loading({ content: 'Uploading visa document...', key: 'upload' });
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success({ content: 'File uploaded successfully!', key: 'upload', duration: 2 });
      setFileList([]); // ⭐️ 上传完清空fileList，防止积压
      fetchVisaRecords();
    } catch (err) {
      console.error('Upload error', err);
      message.error({ content: 'Failed to upload document', key: 'upload' });
    }
  };

  // ⭐️ 根据筛选条件过滤
  const filteredVisaRecords = visaRecords.filter((record) => {
    if (statusFilter === 'all') return true;
    return record.status === statusFilter;
  });

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'pending') return <span style={{ color: '#faad14' }}>Pending Review</span>;
        if (status === 'approved') return <span style={{ color: '#52c41a' }}>Approved</span>;
        if (status === 'rejected') return <span style={{ color: '#ff4d4f' }}>Rejected</span>;
        return status;
      },
    },
    {
      title: 'Uploaded At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
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
        {/* ⭐️ 筛选器 */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ marginBottom: '1rem', width: 200 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />

        {pageLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredVisaRecords}
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
