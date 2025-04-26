import { Form, Radio, Select, DatePicker, Input } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const VisaInfoForm = () => {
  const [isUSCitizen, setIsUSCitizen] = useState(null);
  const [visaType, setVisaType] = useState('');

  return (
    <>
      <h2>Visa / Work Authorization Information</h2>

      {/* 问是否是美国公民或绿卡持有者 */}
      <Form.Item
        label="Are you a permanent resident or citizen of the U.S.?"
        name="usCitizen"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Radio.Group
          onChange={(e) => setIsUSCitizen(e.target.value)}
        >
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 如果是美国人 */}
      {isUSCitizen === "yes" && (
        <Form.Item
          label="Status"
          name="usStatus"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="citizen">Citizen</Option>
            <Option value="green_card">Green Card Holder</Option>
          </Select>
        </Form.Item>
      )}

      {/* 如果不是美国人 */}
      {isUSCitizen === "no" && (
        <>
          <Form.Item
            label="What is your work authorization?"
            name="visaType"
            rules={[{ required: true, message: 'Please select your visa type' }]}
          >
            <Select
              placeholder="Select Visa Type"
              onChange={(value) => setVisaType(value)}
            >
              <Option value="H1B">H1-B</Option>
              <Option value="L2">L2</Option>
              <Option value="F1">F1 (CPT/OPT)</Option>
              <Option value="H4">H4</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {/* 如果是 F1 签证，还要上传 OPT Receipt */}
          {visaType === "F1" && (
            <Form.Item
              label="Upload OPT Receipt"
              name="optReceipt"
              valuePropName="file"
              getValueFromEvent={(e) => e.file}
            >
              <Input placeholder="(Upload handled separately)" disabled />
            </Form.Item>
          )}

          {/* 如果选择 Other 签证，弹出输入框 */}
          {visaType === "Other" && (
            <Form.Item
              label="Please specify your visa title"
              name="otherVisaTitle"
              rules={[{ required: true, message: 'Please specify your visa' }]}
            >
              <Input />
            </Form.Item>
          )}

          {/* 无论哪种 Visa 类型，都要求填写起止日期 */}
          <Form.Item
            label="Visa Start Date"
            name="visaStartDate"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Visa End Date"
            name="visaEndDate"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default VisaInfoForm;
