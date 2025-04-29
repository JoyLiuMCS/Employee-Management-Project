import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Input, message } from 'antd';
import api from '../../utils/api';

const { Search } = Input;

const VisaReviewPage = () => {
  const [inProgressData, setInProgressData] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchInProgress(),
      fetchAllEmployees(),
    ]);
  };

  const fetchInProgress = async () => {
    try {
      const res = await api.get('/documents/in-progress');
      setInProgressData(res.data);
    } catch (err) {
      console.error('Error fetching in-progress data', err);
      message.error('Failed to load in-progress data');
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const res = await api.get('/users');
      const employees = res.data
        .filter(u => u.role !== 'hr')
        .map(emp => ({
          ...emp,
          daysRemaining: emp.workAuthEndDate
            ? Math.ceil((new Date(emp.workAuthEndDate) - new Date()) / (1000 * 60 * 60 * 24))
            : '',
          workAuthStartDate: emp.workAuthStartDate ? emp.workAuthStartDate.split('T')[0] : '',
          workAuthEndDate: emp.workAuthEndDate ? emp.workAuthEndDate.split('T')[0] : '',
        }));
      setAllEmployees(employees);
    } catch (err) {
      console.error('Error fetching all employees', err);
      message.error('Failed to load employee data');
    }
  };

  const handleApprove = async (docId) => {
    try {
      console.log('🟢 Approving docId:', docId);
      await api.post(`/documents/approve/${docId}`);
      message.success('Document approved!');
      loadData();
    } catch (err) {
      console.error(err);
      message.error('Failed to approve');
    }
  };

  const handleReject = async (docId) => {
    const feedback = prompt('Please enter rejection feedback:');
    if (!feedback) return;
    try {
      console.log('🔴 Rejecting docId:', docId);
      await api.post(`/documents/reject/${docId}`, { feedback });
      message.success('Document rejected!');
      loadData();
    } catch (err) {
      console.error(err);
      message.error('Failed to reject');
    }
  };

  const handleSendReminder = async (userId) => {
    try {
      await api.post(`/notifications/send-reminder/${userId}`);
      message.success('Reminder sent!');
    } catch (err) {
      console.error(err);
      message.error('Failed to send reminder');
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredEmployees = allEmployees.filter(emp => {
    const lower = searchText.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(lower) ||
      emp.lastName?.toLowerCase().includes(lower) ||
      emp.preferredName?.toLowerCase().includes(lower)
    );
  });

  const columnsInProgress = [
    {
      title: 'Name',
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
          {record.waitingForApproval && record.documentId ? (
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
                onClick={() => handleReject(record.documentId)}
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

  return (
    <div style={{ padding: 24 }}>
      <h1>Visa Status Management</h1>

      <Tabs defaultActiveKey="inprogress" items={[
        {
          label: 'In Progress',
          key: 'inprogress',
          children: (
            <Table
              columns={columnsInProgress}
              dataSource={inProgressData}
              rowKey={record => record.documentId || record.userId}
              pagination={{ pageSize: 6 }}
            />
          ),
        },
        {
          label: 'All Employees',
          key: 'all',
          children: (
            <>
              <div style={{ marginBottom: 16 }}>
                <Search
                  placeholder="Search employees"
                  allowClear
                  onChange={handleSearchChange}
                  value={searchText}
                  style={{ width: 300 }}
                />
              </div>
              <Table
                columns={columnsAll}
                dataSource={filteredEmployees}
                rowKey={record => record._id}
                pagination={{ pageSize: 8 }}
              />
            </>
          ),
        }
      ]} />
    </div>
  );
};

export default VisaReviewPage;
