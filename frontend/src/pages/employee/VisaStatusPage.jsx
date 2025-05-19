import { Card, Upload, Button, Table, Typography, message, Spin, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const { Title } = Typography;

const stepsF1 = ['opt_receipt', 'opt_ead', 'i_983', 'i_20'];
const stepLabels = {
  opt_receipt: 'OPT Receipt',
  opt_ead: 'OPT EAD',
  i_983: 'I-983 Form',
  i_20: 'I-20 Document',
};

const VisaStatusPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [onboardingApp, setOnboardingApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!auth.token) {
      navigate('/login?redirect=visa-status');
    } else {
      loadOnboardingApp();
      loadMyDocuments();
    }
  }, [auth.token]);

  const loadOnboardingApp = async () => {
    const res = await api.get('/onboarding/status');
    setOnboardingApp(res.data);
  };

  const loadMyDocuments = async () => {
    const res = await api.get('/documents/my');
    setRecords(res.data || []);
  };

  const getDocumentByType = (type) => records.find(doc => doc.type === type);

  const getFeedbackMessage = (step, status, feedback) => {
    if (status === 'pending') return `Waiting for HR to approve your ${stepLabels[step]}.`;
    if (status === 'rejected') return `Rejected: ${feedback || 'Please re-upload.'}`;
    if (status === 'approved') {
      if (step === 'opt_receipt') return 'Please upload a copy of your OPT EAD.';
      if (step === 'opt_ead') return 'Please download and fill out the I-983 form.';
      if (step === 'i_983') return 'Please send the I-983 to your school and upload your I-20.';
      if (step === 'i_20') return 'All documents have been approved.';
    }
    return '';
  };

  const getNextStep = () => {
    for (const step of stepsF1) {
      const doc = getDocumentByType(step);
      if (!doc || doc.status === 'rejected') return step;
      if (doc.status === 'pending') return null;
    }
    return null;
  };

  const currentStep = getNextStep();

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', currentStep);

    try {
      message.loading('Uploading...');
      await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      message.success('Uploaded successfully!');
      setFileList([]);
      loadMyDocuments();
    } catch {
      message.error('Upload failed.');
    }
  };

  if (!onboardingApp) return <Spin size="large" style={{ marginTop: '2rem' }} />;

  if (onboardingApp.visaType !== 'F1') {
    return (
      <Alert
        message="Not Applicable"
        description="Visa status tracking is only available for F1 visa holders."
        type="info"
        showIcon
        style={{ maxWidth: 600, margin: '2rem auto' }}
      />
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Visa Document Center</Title>

      {stepsF1.map((step, index) => {
        const doc = getDocumentByType(step);
        const isCurrent = currentStep === step;
        const messageText = getFeedbackMessage(step, doc?.status, doc?.feedback);

        return (
          <Card key={step} title={stepLabels[step]} style={{ marginBottom: '1rem' }}>
            <Alert message={messageText} type={doc?.status === 'rejected' ? 'error' : 'info'} showIcon style={{ marginBottom: '1rem' }} />
            {step === 'i_983' && doc?.status === 'approved' && (
              <div style={{ marginBottom: '1rem' }}>
                <Button href="http://localhost:3000/public/templates/i983-empty.pdf" target="_blank" style={{ marginRight: 10 }}>
                  Download Empty Template
                </Button>
                <Button href="http://localhost:3000/public/templates/i983-sample.pdf" target="_blank">
                  Download Sample
                </Button>

              </div>
            )}
            <Upload
              customRequest={handleUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              showUploadList={false}
              disabled={!isCurrent}
              accept=".pdf,.jpg,.jpeg,.png"
            >
              <Button type="primary" icon={<UploadOutlined />} disabled={!isCurrent}>
                Upload {stepLabels[step]}
              </Button>
            </Upload>
          </Card>
        );
      })}

      <Card title="Document Submission Records" style={{ marginTop: '2rem' }}>
        <Table
          dataSource={records}
          rowKey="_id"
          pagination={false}
          columns={[
            { title: 'Document Type', dataIndex: 'type', key: 'type', render: (type) => stepLabels[type] || type },
            { title: 'Submitted Time', dataIndex: 'createdAt', key: 'createdAt', render: (t) => new Date(t).toLocaleString() },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            { title: 'Feedback', dataIndex: 'feedback', key: 'feedback', render: (f) => f || '--' },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <>
                  <a href={`http://localhost:3000/uploads/${record.filename}`} target="_blank" style={{ marginRight: 10 }}>Preview</a>
                  <a href={`http://localhost:3000/uploads/${record.filename}`} download>Download</a>
                </>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default VisaStatusPage;
