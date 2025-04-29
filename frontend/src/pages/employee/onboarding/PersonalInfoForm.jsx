import { Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const PersonalInfoForm = () => {
  // 禁止选择未来日期（比如 Date of Birth）
  const disableFutureDates = (current) => {
    return current && current > moment().endOf('day');
  };

  return (
    <>
      <h2>Personal Information</h2>

      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          { required: true, message: 'First Name is required' },
          { type: 'string', message: 'First Name must be a string' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          { required: true, message: 'Last Name is required' },
          { type: 'string', message: 'Last Name must be a string' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Middle Name"
        name="middleName"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Preferred Name"
        name="preferredName"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select gender' }]}
      >
        <Select placeholder="Select Gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">I do not wish to answer</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true, message: 'Please select date of birth' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          disabledDate={disableFutureDates}
          placeholder="Select Date"
        />
      </Form.Item>

      <Form.Item
        label="SSN"
        name="ssn"
        rules={[
          { required: true, message: 'SSN is required' },
          { pattern: /^\d{9}$/, message: 'SSN must be exactly 9 digits (no dashes)' }
        ]}
      >
        <Input placeholder="e.g., 123456789" maxLength={9} inputMode="numeric" />
      </Form.Item>
    </>
  );
};

export default PersonalInfoForm;
