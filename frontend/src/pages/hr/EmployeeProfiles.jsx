// src/pages/hr/EmployeeProfiles.jsx
import { useEffect, useState } from 'react';
import { Table, Input, Typography } from 'antd';
import api from '../../utils/api';

const { Search } = Input;
const { Link } = Typography;

const EmployeeProfiles = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/users');
        const hrFiltered = res.data.filter(user => user.role !== 'hr'); // 不显示 HR
        const sorted = hrFiltered.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
        setEmployees(sorted);
        setFilteredEmployees(sorted);
      } catch (err) {
        console.error('Error fetching employees', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    const filtered = employees.filter(emp =>
      (emp.firstName && emp.firstName.toLowerCase().includes(lowerValue)) ||
      (emp.lastName && emp.lastName.toLowerCase().includes(lowerValue)) ||
      (emp.preferredName && emp.preferredName.toLowerCase().includes(lowerValue))
    );
    setFilteredEmployees(filtered);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => (
        <Link href={`/profile/${record._id}`} target="_blank">
          {`${record.firstName || ''} ${record.lastName || ''}`}
        </Link>
      ),
    },
    {
      title: 'SSN',
      dataIndex: 'ssn',
      key: 'ssn',
    },
    {
      title: 'Work Authorization',
      dataIndex: 'workAuthorizationTitle',
      key: 'workAuthorizationTitle',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Employee Profiles</h1>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by first name, last name, or preferred name"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default EmployeeProfiles;
