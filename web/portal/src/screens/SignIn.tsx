import { Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const { signin } = useAuth();

  const onFinish = useCallback(
    async data => {
      try {
        await signin(data);
      } catch (err) {
        alert(err);
      }
    },
    [signin]
  );

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please input a valid email!' },
        ]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
