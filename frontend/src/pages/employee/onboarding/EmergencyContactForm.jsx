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
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                
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
                  rules={[{ required: true, message: 'Phone required' }]}
                >
                  <Input placeholder="Phone" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'email']}
                  rules={[
                    { type: 'email', message: 'Invalid email' },
                    { required: true, message: 'Email required' }
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
