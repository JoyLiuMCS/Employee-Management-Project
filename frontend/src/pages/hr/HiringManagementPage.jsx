// src/pages/hr/HiringManagementPage.jsx
import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message, Modal } from 'antd';
import api from '../../utils/api';

const { Search } = Input;

const HiringManagementPage = () => {
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [applications, setApplications] = useState({ pending: [], approved: [], rejected: [] });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    fetchEmailHistory();
    fetchApplications();
  };

  const fetchEmailHistory = async () => {
    // TODO: 你需要写一个 API 拿发过token的历史（现在先假设空）
    setHistory([]);
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      const pending = res.data.filter(app => app.status === 'pending');
      const approved = res.data.filter(app => app.status === 'approved');
      const rejected = res.data.filter(app => app.status === 'rejected');
      setApplications({ pending, approved, rejected });
    } catch (err) {
      console.error(err);
      message.error('Failed to load applications');
    }
  };

  const sendRegistrationEmail = async () => {
    try {
      await api.post('/api/email/send-registration-email', { email });
      message.success('Registration email sent!');
      setEmail('');
      fetchEmailHistory();
    } catch (err) {
      console.error(err);
      message.error('Failed to send email');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/applications/${id}/approve`);
      message.success('Application approved!');
      fetchApplications();
    } catch (err) {
      console.error(err);
      message.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    Modal.confirm({
      title: 'Reject Application',
      content: (
        <Input.TextArea rows={3} placeholder="Enter rejection reason" id="rejectReason" />
      ),
      onOk: async () => {
        const reason = document.getElementById('rejectReason').value;
        if (!reason) {
          message.error('Rejection reason is required!');
          return Promise.reject();
        }
        try {
          await api.post(`/api/applications/${id}/reject`, { rejectionReason: reason });
          message.success('Application rejected!');
          fetchApplications();
        } catch (err) {
          console.error(err);
          message.error('Failed to reject');
        }
      },
    });
  };

  const columnsApplications = [
    {
      title: 'Name',
      render: (_, record) => `${record.fullName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <>
          {record.status === 'pending' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleApprove(record._id)}>Approve</Button>
              <Button danger onClick={() => handleReject(record._id)}>Reject</Button>
            </>
          )}
          <Button type="link" href={`/view-application/${record._id}`} target="_blank">View Application</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Hiring Management</h1>
      <Tabs defaultActiveKey="registration">
        <Tabs.TabPane tab="Registration Tokens" key="registration">
          <Input
            placeholder="Enter new employee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: 300, marginRight: 8 }}
          />
          <Button type="primary" onClick={sendRegistrationEmail}>Generate Token and Send Email</Button>

          <h3 style={{ marginTop: 24 }}>History (TODO)</h3>
          {/* TODO: 这里以后展示历史列表 */}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Onboarding Applications" key="applications">
          <Tabs defaultActiveKey="pending">
            <Tabs.TabPane tab="Pending" key="pending">
              <Table
                columns={columnsApplications}
                dataSource={applications.pending}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Approved" key="approved">
              <Table
                columns={columnsApplications}
                dataSource={applications.approved}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Rejected" key="rejected">
              <Table
                columns={columnsApplications}
                dataSource={applications.rejected}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HiringManagementPage;
