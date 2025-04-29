import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const EmergencyContactForm = () => {
  return (
    <>
      <h2>Emergency Contact Information</h2>

      <Form.List name="emergencyContacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start" wrap>
                <Form.Item
                  {...restField}
                  name={[name, 'firstName']}
                  rules={[{ required: true, message: 'First Name required' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'lastName']}
                  rules={[{ required: true, message: 'Last Name required' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'relationship']}
                  rules={[{ required: true, message: 'Relationship required' }]}
                >
                  <Input placeholder="Relationship" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'phone']}
                  rules={[
                    { required: true, message: 'Phone required' },
                    { pattern: /^[0-9]{10,15}$/, message: 'Enter a valid phone number' }
                  ]}
                >
                  <Input placeholder="Phone" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'email']}
                  rules={[
                    { required: true, message: 'Email required' },
                    { type: 'email', message: 'Invalid email address' }
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8 }} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Emergency Contact
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

export default EmergencyContactForm;
