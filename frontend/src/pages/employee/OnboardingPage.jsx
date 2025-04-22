import { Form, Input, Button } from 'antd';

const OnboardingPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('✅ Submitted:', values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 500, margin: '0 auto' }}>
      <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Required' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Invalid email' }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default OnboardingPage;
