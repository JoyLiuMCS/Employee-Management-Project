import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message, Modal } from 'antd';
import api from '../../utils/api';

const { Search } = Input;

const HiringManagementPage = () => {
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [applications, setApplications] = useState({ pending: [], approved: [], rejected: [] });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await fetchEmailHistory();
    await fetchApplications();
  };

  const fetchEmailHistory = async () => {
    // ✅ 如果你后端还没实现 history，可以保持为空
    setHistory([]);
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');  // ✅ baseURL 已包含 /api
      const apps = res.data?.applications || [];

      const pending = apps.filter(app => app.status === 'pending');
      const approved = apps.filter(app => app.status === 'approved');
      const rejected = apps.filter(app => app.status === 'rejected');

      setApplications({ pending, approved, rejected });
    } catch (err) {
      console.error(err);
      message.error('Failed to load applications');
    }
  };

  const sendRegistrationEmail = async () => {
    try {
      await api.post('/email/send-registration-email', { email });
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
      await api.post(`/applications/${id}/approve`);
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
          await api.post(`/applications/${id}/reject`, { reason }); // ✅ 参数名要和后端一致
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
      render: (_, record) => `${record.fullName || record.userId?.name || 'Unknown'}`,
    },
    {
      title: 'Email',
      render: (_, record) => record.email || record.userId?.email || 'N/A',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <>
          {record.status === 'pending' && (
            <>
              <Button type="primary" onClick={() => handleApprove(record._id)} style={{ marginRight: 8 }}>
                Approve
              </Button>
              <Button danger onClick={() => handleReject(record._id)}>
                Reject
              </Button>
            </>
          )}
          <Button type="link" href={`/view-application/${record._id}`} target="_blank">
            View Application
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Hiring Management</h1>
      <Tabs defaultActiveKey="registration" items={[
        {
          label: 'Registration Tokens',
          key: 'registration',
          children: (
            <>
              <Input
                placeholder="Enter new employee email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 300, marginRight: 8 }}
              />
              <Button type="primary" onClick={sendRegistrationEmail}>Generate Token and Send Email</Button>
              <h3 style={{ marginTop: 24 }}>History (TODO)</h3>
            </>
          )
        },
        {
          label: 'Onboarding Applications',
          key: 'applications',
          children: (
            <Tabs defaultActiveKey="pending" items={[
              {
                label: 'Pending',
                key: 'pending',
                children: (
                  <Table
                    columns={columnsApplications}
                    dataSource={applications.pending}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                  />
                )
              },
              {
                label: 'Approved',
                key: 'approved',
                children: (
                  <Table
                    columns={columnsApplications}
                    dataSource={applications.approved}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                  />
                )
              },
              {
                label: 'Rejected',
                key: 'rejected',
                children: (
                  <Table
                    columns={columnsApplications}
                    dataSource={applications.rejected}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                  />
                )
              }
            ]} />
          )
        }
      ]} />
    </div>
  );
};

export default HiringManagementPage;
