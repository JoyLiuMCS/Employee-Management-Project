import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message, Modal } from 'antd';
import api from '../../utils/api';

const { Search } = Input;
const { TabPane } = Tabs;

const HiringManagementPage = () => {
  const [tokens, setTokens] = useState([]);
  const [applications, setApplications] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadTokens();
    loadApplications();
  }, []);

  const loadTokens = async () => {
    try {
      const res = await api.get('/api/register-tokens');
      setTokens(res.data);
    } catch (err) {
      console.error('Failed to fetch tokens', err);
    }
  };

  const loadApplications = async () => {
    try {
      const pending = await api.get('/api/onboarding-applications?status=pending');
      const approved = await api.get('/api/onboarding-applications?status=approved');
      const rejected = await api.get('/api/onboarding-applications?status=rejected');

      setApplications({
        pending: pending.data,
        approved: approved.data,
        rejected: rejected.data,
      });
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const handleGenerateToken = async (email) => {
    try {
      await api.post('/api/register-token', { email });
      message.success('Token generated and email sent!');
      loadTokens();
    } catch (err) {
      console.error(err);
      message.error('Failed to generate token');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/onboarding-applications/${id}/approve`);
      message.success('Application approved');
      loadApplications();
    } catch (err) {
      console.error(err);
      message.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    Modal.confirm({
      title: 'Reject Application',
      content: (
        <Input.TextArea rows={4} placeholder="Enter rejection feedback" id="feedback" />
      ),
      onOk: async () => {
        const feedback = document.getElementById('feedback').value;
        if (!feedback) {
          message.error('Feedback is required');
          throw new Error('No feedback');
        }
        try {
          await api.post(`/api/onboarding-applications/${id}/reject`, { feedback });
          message.success('Application rejected');
          loadApplications();
        } catch (err) {
          console.error(err);
          message.error('Failed to reject');
        }
      },
    });
  };

  const columnsTokens = [
    { title: 'Email', dataIndex: 'email' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Link', dataIndex: 'link', render: link => <a href={link} target="_blank" rel="noopener noreferrer">{link}</a> },
    { title: 'Submitted', dataIndex: 'submitted', render: submitted => (submitted ? '✅' : '❌') },
  ];

  const columnsApplications = (showActions) => [
    { title: 'Name', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Action',
      render: (_, record) => (
        showActions ? (
          <>
            <Button type="primary" onClick={() => handleApprove(record._id)} style={{ marginRight: 8 }}>
              Approve
            </Button>
            <Button danger onClick={() => handleReject(record._id)}>
              Reject
            </Button>
          </>
        ) : (
          <Button type="link" href={`/view-application/${record._id}`} target="_blank">
            View Application
          </Button>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Hiring Management</h1>

      <Tabs defaultActiveKey="registration">
        <TabPane tab="Registration Tokens" key="registration">
          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder="Enter employee email to send token"
              enterButton="Send Token"
              onSearch={handleGenerateToken}
              allowClear
            />
          </div>
          <Table
            columns={columnsTokens}
            dataSource={tokens}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
          />
        </TabPane>

        <TabPane tab="Onboarding Applications" key="applications">
          <Tabs type="card">
            <TabPane tab="Pending" key="pending">
              <Table
                columns={columnsApplications(true)}
                dataSource={applications.pending}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
              />
            </TabPane>
            <TabPane tab="Approved" key="approved">
              <Table
                columns={columnsApplications(false)}
                dataSource={applications.approved}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
              />
            </TabPane>
            <TabPane tab="Rejected" key="rejected">
              <Table
                columns={columnsApplications(false)}
                dataSource={applications.rejected}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
              />
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HiringManagementPage;
