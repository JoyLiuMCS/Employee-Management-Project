import { useEffect, useState } from 'react';
import { Table, Card, Button, message } from 'antd';
import api from '../../utils/api';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications');
        const data = res.data?.applications || res.data || [];
        setApplications(data);
      } catch (err) {
        console.error(err);
        message.error('Failed to load applications');
      }
    };

    fetchApps();
  }, []);

  const handleSendEmail = async (record) => {
    if (!record.email && !record.userId?.email) {
      message.error('Email not available.');
      return;
    }

    try {
      await api.post('/email/send-registration-email', {
        name: record.name || record.userId?.name,
        email: record.email || record.userId?.email,
      });
      message.success(`Email sent to ${record.name || record.userId?.name}`);
    } catch (err) {
      console.error(err);
      message.error('Failed to send email');
    }
  };

  const columns = [
    {
      title: 'Applicant Name',
      render: (_, record) => record.name || record.userId?.name || 'N/A',
    },
    {
      title: 'Position',
      dataIndex: 'position', // only works if this field exists in your schema
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            href={`/view-application/${record._id}`}
            target="_blank"
            style={{ marginRight: 8 }}
          >
            View Application
          </Button>
          <Button type="primary" onClick={() => handleSendEmail(record)}>
            Send Email
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Card title="Application Review" bordered={false}>
        <Table
          rowKey="_id"
          dataSource={applications}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ApplicationReview;
