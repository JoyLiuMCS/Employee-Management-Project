import { Form, Input } from 'antd';

const AddressForm = () => {
  return (
    <>
      <h2>Address Information</h2>

      <Form.Item
        label="Building/Apt #"
        name="building"
        rules={[{ required: true, message: 'Building or Apartment number is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Street Name"
        name="street"
        rules={[{ required: true, message: 'Street Name is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: 'City is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[{ required: true, message: 'State is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="ZIP Code"
        name="zip"
        rules={[{ required: true, message: 'ZIP Code is required' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default AddressForm;
