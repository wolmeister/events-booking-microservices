import { Card, Form, Select } from 'antd';

const { Option } = Select;

export function CheckIn() {
  return (
    <>
      <h2 style={{ margin: '24px 0' }}>Certificates</h2>
      <Card>
        <Form.Item label="Evento">
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a person"
            optionFilterProp="children"
            // onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
        </Form.Item>
      </Card>
    </>
  );
}
