import { Table, Card } from 'antd';

const ApplicationReview = () => {

  const data = [
    {
      key: '1',
      name: 'John Doe',
      position: 'Software Engineer',
      status: 'Pending',
    },
    {
      key: '2',
      name: 'Jane Smith',
      position: 'Product Manager',
      status: 'Approved',
    },
  ];

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
