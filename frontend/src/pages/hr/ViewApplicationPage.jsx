import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Descriptions, Spin, message, Tag } from 'antd';
import api from '../../utils/api';

const ViewApplicationPage = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApp(res.data);
      } catch (err) {
        console.error(err);
        message.error('Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />;

  return (
    <div style={{ padding: 24 }}>
      <h1>Application Detail</h1>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Full Name">{app?.userId?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{app?.userId?.email}</Descriptions.Item>
        <Descriptions.Item label="Visa Type">{app?.visaType}</Descriptions.Item>
        <Descriptions.Item label="Work Authorization Start">{app?.workAuthorizationStart?.split('T')[0]}</Descriptions.Item>
        <Descriptions.Item label="Work Authorization End">{app?.workAuthorizationEnd?.split('T')[0]}</Descriptions.Item>

        <Descriptions.Item label="OPT Receipt">{app?.optReceipt ? <Tag color="green">Submitted</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>
        <Descriptions.Item label="OPT EAD">{app?.optEAD ? <Tag color="green">Submitted</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>
        <Descriptions.Item label="I-983">{app?.i983 ? <Tag color="green">Submitted</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>
        <Descriptions.Item label="I-20">{app?.i20 ? <Tag color="green">Submitted</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>

        <Descriptions.Item label="Status">
          {app?.status === 'approved' && <Tag color="green">Approved</Tag>}
          {app?.status === 'pending' && <Tag color="blue">Pending</Tag>}
          {app?.status === 'rejected' && <Tag color="red">Rejected</Tag>}
        </Descriptions.Item>

        {app?.status === 'rejected' && (
          <Descriptions.Item label="Rejection Reason">{app?.rejectionReason || 'No reason provided'}</Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
};

export default ViewApplicationPage;
