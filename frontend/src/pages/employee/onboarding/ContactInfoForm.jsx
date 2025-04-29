import { Form, Input } from 'antd';

const ContactInfoForm = () => {
  return (
    <>
      <h2>Contact Information</h2>

      <Form.Item
        label="Cell Phone Number"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Cell phone number is required' },
          { pattern: /^[0-9]{10,15}$/, message: 'Enter a valid phone number (10-15 digits)' }
        ]}
      >
        <Input placeholder="e.g., 1234567890" />
      </Form.Item>

      <Form.Item
        label="Work Phone Number"
        name="workPhone"
        rules={[
          { pattern: /^[0-9]{0,15}$/, message: 'Work phone must be digits only' }
        ]}
      >
        <Input placeholder="Optional" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]}
      >
        <Input placeholder="e.g., example@example.com" disabled />
      </Form.Item>
    </>
  );
};

export default ContactInfoForm;
