import { Table, Card, Button, message } from 'antd';
import api from '../../utils/api'; // 确保路径正确

const ApplicationReview = () => {
  const data = [
    {
      key: '1',
      name: 'John Doe',
      position: 'Software Engineer',
      status: 'Pending',
      email: 'john@example.com',
    },
    {
      key: '2',
      name: 'Jane Smith',
      position: 'Product Manager',
      status: 'Approved',
      email: 'jane@example.com',
    },
  ];

  const handleSendEmail = async (record) => {
    if (!record.email) {
      message.error('Email not available.');
      return;
    }

    try {
      await api.post('/email/send-registration-email', {
        name: record.name,
        email: record.email,
      });
      message.success(`Email sent to ${record.name}`);
    } catch (err) {
      console.error(err);
      message.error('Failed to send email');
    }
  };

  const columns = [
    {
      title: 'Applicant Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleSendEmail(record)}>
          Send Email
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Card title="Application Review" bordered={false}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ApplicationReview;
