import { CalendarOutlined, IdcardOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { gql, useQuery } from 'urql';

const { Option } = Select;

export type FastSignupCheckingValues = {
  email: string;
  cpf: string;
  eventId: string;
};

type FastSignupCheckingProps = {
  visible: boolean;
  onSave: (values: FastSignupCheckingValues) => Promise<void>;
  onCancel: () => void;
};

const EVENTS_QUERY = gql(/* GraphQL */ `
  query events {
    events {
      id
      name
      date
      location
    }
  }
`);

export function FastSignupChecking({
  visible,
  onSave,
  onCancel,
}: FastSignupCheckingProps) {
  const [loading, setLoading] = useState(false);
  const [eventsQuery] = useQuery({ query: EVENTS_QUERY });

  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Fast Signup and Checking"
      okText="Signup and Checkin"
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            setLoading(true);

            onSave(values)
              .then(() => {
                form.resetFields();
              })
              .finally(() => {
                setLoading(false);
              });
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="eventId"
          label="Event"
          rules={[{ required: true, message: 'Please select the Event!' }]}
        >
          <Select<string>
            showSearch
            optionFilterProp="children"
            loading={eventsQuery.fetching}
            allowClear
            clearIcon
          >
            {eventsQuery.data?.events.map(event => (
              <Option key={event.id} value={event.id}>
                {event.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please input a valid email!' },
          ]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          name="cpf"
          label="CPF"
          rules={[{ required: true, message: 'Please input your CPF!' }]}
        >
          <Input prefix={<IdcardOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
