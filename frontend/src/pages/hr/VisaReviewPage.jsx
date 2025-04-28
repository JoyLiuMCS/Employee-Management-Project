import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message } from 'antd';
import api from '../../utils/api';

const { Search } = Input;

const VisaReviewPage = () => {
  const [inProgressData, setInProgressData] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchInProgress();
    fetchAllEmployees();
  }, []);

  const fetchInProgress = async () => {
    try {
      const res = await api.get('/api/documents/in-progress'); 
      setInProgressData(res.data);
    } catch (err) {
      console.error('Error fetching in-progress data', err);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const res = await api.get('/api/users');
      const employees = res.data.filter(u => u.role !== 'hr');
      setAllEmployees(employees);
    } catch (err) {
      console.error('Error fetching all employees', err);
    }
  };

  const handleApprove = async (docId) => {
    try {
      await api.post(`/api/documents/approve/${docId}`);
      message.success('Document approved!');
      fetchInProgress(); // 刷新数据
    } catch (err) {
      console.error(err);
      message.error('Failed to approve');
    }
  };

  const handleReject = async (docId, feedback) => {
    try {
      await api.post(`/api/documents/reject/${docId}`, { feedback });
      message.success('Document rejected!');
      fetchInProgress();
    } catch (err) {
      console.error(err);
      message.error('Failed to reject');
    }
  };

  const handleSendReminder = async (userId) => {
    try {
      await api.post(`/api/notifications/send-reminder/${userId}`);
      message.success('Reminder sent!');
    } catch (err) {
      console.error(err);
      message.error('Failed to send reminder');
    }
  };

  const columnsInProgress = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Work Authorization',
      dataIndex: 'workAuthorizationTitle',
    },
    {
      title: 'Start Date',
      dataIndex: 'workAuthStartDate',
    },
    {
      title: 'End Date',
      dataIndex: 'workAuthEndDate',
    },
    {
      title: 'Days Remaining',
      dataIndex: 'daysRemaining',
    },
    {
      title: 'Next Step',
      dataIndex: 'nextStep',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <>
          {record.waitingForApproval ? (
            <>
              <Button
                type="primary"
                onClick={() => handleApprove(record.documentId)}
                style={{ marginRight: 8 }}
              >
                Approve
              </Button>
              <Button
                danger
                onClick={() => {
                  const feedback = prompt('Please enter rejection feedback:');
                  if (feedback) handleReject(record.documentId, feedback);
                }}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button onClick={() => handleSendReminder(record.userId)}>
              Send Reminder
            </Button>
          )}
        </>
      ),
    },
  ];

  const columnsAll = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Work Authorization',
      dataIndex: 'workAuthorizationTitle',
    },
    {
      title: 'Start Date',
      dataIndex: 'workAuthStartDate',
    },
    {
      title: 'End Date',
      dataIndex: 'workAuthEndDate',
    },
    {
      title: 'Days Remaining',
      dataIndex: 'daysRemaining',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredAllEmployees = allEmployees.filter((emp) => {
    const lower = searchText.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(lower) ||
      emp.lastName?.toLowerCase().includes(lower) ||
      emp.preferredName?.toLowerCase().includes(lower)
    );
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Visa Status Management</h1>

      <Tabs defaultActiveKey="inprogress">
        <Tabs.TabPane tab="In Progress" key="inprogress">
          <Table
            columns={columnsInProgress}
            dataSource={inProgressData}
            rowKey="documentId"
            pagination={{ pageSize: 6 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="All Employees" key="all">
          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search employees"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <Table
            columns={columnsAll}
            dataSource={filteredAllEmployees}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default VisaReviewPage;
