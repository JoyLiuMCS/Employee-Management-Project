import React, { useEffect, useState } from 'react';
import { Button, Input, Table, message } from 'antd';
import api from '../../utils/api';

const RegistrationToken = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/email/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load email history.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!name || !email) {
      return message.warning('Please enter both name and email');
    }

    setLoading(true);
    try {
      await api.post('/email/send-registration-email', { name, email });
      message.success('Email sent successfully!');
      fetchHistory();
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      message.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Registration Link',
      dataIndex: 'token',
      render: (token) => {
        const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
        const link = `${frontendURL}/register/${token}`;
        return <a href={link} target="_blank" rel="noreferrer">{link}</a>;
      }
    },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Created At', dataIndex: 'createdAt', render: (v) => new Date(v).toLocaleString() }
  ];

  return (
    <div>
      <h2>Send Registration Token</h2>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: 250, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleSend} loading={loading}>
        Generate token and send email
      </Button>

      <h3 style={{ marginTop: '30px' }}>Email Send History</h3>
      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={history}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RegistrationToken;
