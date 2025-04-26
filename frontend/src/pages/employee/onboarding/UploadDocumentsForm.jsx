import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadDocumentsForm = () => {
  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      if (!isPDF && !isImage) {
        message.error('You can only upload PDF or image files!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must smaller than 10MB!');
      }
      return (isPDF || isImage) && isLt10M;
    },
    multiple: false,
    maxCount: 1,
    showUploadList: true,
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok"); // 假上传，用来绕开AntD的默认上传流程
      }, 0);
    },
  };

  return (
    <>
      <h2>Upload Required Documents</h2>

      <Form.Item
        label="Profile Picture"
        name="profilePicture"
        valuePropName="file"
        getValueFromEvent={(e) => e.file}
        rules={[{ required: true, message: 'Profile picture is required' }]}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Driver's License"
        name="driversLicense"
        valuePropName="file"
        getValueFromEvent={(e) => e.file}
        rules={[{ required: true, message: 'Driver\'s license is required' }]}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Work Authorization Document"
        name="workAuthorization"
        valuePropName="file"
        getValueFromEvent={(e) => e.file}
        rules={[{ required: true, message: 'Work authorization document is required' }]}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default UploadDocumentsForm;
