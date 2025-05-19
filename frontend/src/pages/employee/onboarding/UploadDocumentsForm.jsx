import { Form, Upload, Button, message, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const UploadDocumentsForm = () => {
  const [profilePreview, setProfilePreview] = useState(null);

  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      if (!isPDF && !isImage) {
        message.error('You can only upload PDF or image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: ({ file, onSuccess }) => setTimeout(() => onSuccess('ok'), 0),
  };

  const handleProfileChange = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  return (
    <>
      <h2>Upload Optional Documents</h2>

      <Form.Item label="Profile Picture (Optional)" name="profilePicture" valuePropName="file" getValueFromEvent={(e) => e.file}>
        <Upload {...uploadProps} maxCount={1} showUploadList={false} onChange={handleProfileChange}>
          <Avatar src={profilePreview || '/default-avatar.png'} size={100} style={{ border: '1px solid #d9d9d9' }} />
          <div style={{ marginTop: '8px' }}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item label="Driver's License (Optional)" name="driversLicense" valuePropName="file" getValueFromEvent={(e) => e.file}>
        <Upload {...uploadProps} maxCount={1}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default UploadDocumentsForm;
