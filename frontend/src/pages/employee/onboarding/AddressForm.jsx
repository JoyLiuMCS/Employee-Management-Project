import { Form, Input, Select } from 'antd';

const CITIES = ['New York', 'San Francisco', 'Los Angeles', 'Austin', 'Seattle'];
const STATES = ['NY', 'CA', 'TX', 'WA', 'FL'];

const AddressForm = () => {
  return (
    <>
      <h2>Address Information</h2>

      <Form.Item
        label="Building/Apt #"
        name={['address', 'building']}
        rules={[{ required: true, message: 'Building or Apartment number is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Street Name"
        name={['address', 'street']}
        rules={[{ required: true, message: 'Street Name is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="City"
        name={['address', 'city']}
        rules={[{ required: true, message: 'City is required' }]}
      >
        <Select
          options={CITIES.map(city => ({ label: city, value: city }))}
          showSearch
          placeholder="Select a city"
        />
      </Form.Item>

      <Form.Item
        label="State"
        name={['address', 'state']}
        rules={[{ required: true, message: 'State is required' }]}
      >
        <Select
          options={STATES.map(state => ({ label: state, value: state }))}
          showSearch
          placeholder="Select a state"
        />
      </Form.Item>

      <Form.Item
        label="ZIP Code"
        name={['address', 'zip']}
        rules={[
          { required: true, message: 'ZIP Code is required' },
          { pattern: /^\d{5}$/, message: 'ZIP must be exactly 5 digits' }
        ]}
      >
        <Input maxLength={5} />
      </Form.Item>
    </>
  );
};

export default AddressForm;
