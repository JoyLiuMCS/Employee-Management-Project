import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message, Modal } from 'antd';
import api from '../../utils/api';

const HiringManagementPage = () => {
  const [name, setName] = useState('');
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
    try {
      const res = await api.get('/email/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load email history');
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');  
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

  const sendRegistrationEmail = async (data) => {
    const payload = data ? { name: data.name, email: data.email } : { name, email };
    if (!payload.email || !payload.name) {
      message.warning('Please enter both name and email');
      return;
    }

    try {
      await api.post('/email/send-registration-email', payload);
      message.success(`Registration email sent to ${payload.name}`);
      if (!data) {
        setEmail('');
        setName('');
      }
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
          await api.post(`/applications/${id}/reject`, { reason }); 
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
      render: (_, record) => {
        const name = record.fullName || record.userId?.name || '';
        const email = record.email || record.userId?.email || '';

        return (
          <>
            {record.status === 'pending' && (
              <>
                <Button type="primary" onClick={() => handleApprove(record._id)} style={{ marginRight: 8 }}>
                  Approve
                </Button>
                <Button danger onClick={() => handleReject(record._id)} style={{ marginRight: 8 }}>
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={() => sendRegistrationEmail({ name, email })}
              disabled={!email}
              style={{ marginRight: 8 }}
            >
              Send Email
            </Button>
            <Button type="link" href={`/view-application/${record._id}`} target="_blank">
              View Application
            </Button>
          </>
        );
      }
    },
  ];

  const columnsHistory = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Registration Link',
      dataIndex: 'token',
      render: (token) => {
        const base = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
        return (
          <a href={`${base}/register/${token}`} target="_blank" rel="noreferrer">
            {`${base}/register/${token}`}
          </a>
        );
      },
    },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Created At', dataIndex: 'createdAt', render: (v) => new Date(v).toLocaleString() },
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: 200, marginRight: 8 }}
              />
              <Input
                placeholder="Enter new employee email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 300, marginRight: 8 }}
              />
              <Button type="primary" onClick={() => sendRegistrationEmail()}>
                Generate Token and Send Email
              </Button>

              <h3 style={{ marginTop: 24 }}>Token Send History</h3>
              <Table
                rowKey="_id"
                dataSource={history}
                columns={columnsHistory}
                pagination={{ pageSize: 5 }}
              />
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
