import { Form, Radio, Select, DatePicker, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

const VisaInfoForm = () => {
  const [isUSCitizen, setIsUSCitizen] = useState(null);
  const [visaType, setVisaType] = useState('');

  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isPDF && !isImage) {
        message.error('You can only upload PDF or image files!');
        return Upload.LIST_IGNORE;
      }
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: ({ file, onSuccess }) => setTimeout(() => onSuccess('ok'), 0),
  };

  return (
    <>
      <h2>Visa / Work Authorization Information</h2>

      <Form.Item label="Are you a permanent resident or citizen of the U.S.?" name="usCitizen" rules={[{ required: true, message: 'Please select an option' }]}>
        <Radio.Group onChange={(e) => setIsUSCitizen(e.target.value)}>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>

      {isUSCitizen === 'yes' && (
        <Form.Item label="Status" name="usStatus" rules={[{ required: true, message: 'Please select status' }]}>
          <Select placeholder="Select status">
            <Option value="citizen">Citizen</Option>
            <Option value="green_card">Green Card Holder</Option>
          </Select>
        </Form.Item>
      )}

      {isUSCitizen === 'no' && (
        <>
          <Form.Item label="What is your work authorization?" name="visaType" rules={[{ required: true, message: 'Please select your visa type' }]}>
            <Select placeholder="Select Visa Type" onChange={(value) => setVisaType(value)}>
              <Option value="H1B">H1-B</Option>
              <Option value="L2">L2</Option>
              <Option value="F1">F1 (CPT/OPT)</Option>
              <Option value="H4">H4</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {visaType === 'F1' && (
            <Form.Item label="Upload OPT Receipt" name="optReceipt" valuePropName="file" getValueFromEvent={(e) => e.file} rules={[{ required: true, message: 'OPT Receipt is required' }]}>
              <Upload {...uploadProps} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload OPT Receipt</Button>
              </Upload>
            </Form.Item>
          )}

          {visaType && visaType !== 'F1' && (
            <Form.Item label="Work Authorization Document" name="workAuthorization" valuePropName="file" getValueFromEvent={(e) => e.file} rules={[{ required: true, message: 'Work authorization document is required' }]}>
              <Upload {...uploadProps} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Work Authorization Document</Button>
              </Upload>
            </Form.Item>
          )}

          {visaType === 'Other' && (
            <Form.Item label="Please specify your visa title" name="otherVisaTitle" rules={[{ required: true, message: 'Please specify your visa' }]}>
              <Input />
            </Form.Item>
          )}

          <Form.Item label="Visa Start Date" name="visaStartDate" rules={[{ required: true, message: 'Please select start date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Visa End Date" name="visaEndDate" rules={[{ required: true, message: 'Please select end date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default VisaInfoForm;
