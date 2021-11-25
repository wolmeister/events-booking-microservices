import { useCallback } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const { signin } = useAuth();

  const onFinish = useCallback(
    async data => {
      try {
        await signin(data);
      } catch (err) {
        message.error('Invalid email or password');
      }
    },
    [signin]
  );

  return (
    <div
      style={{
        display: 'grid',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Form onFinish={onFinish} style={{ width: '400px' }} layout="vertical">
        <h1 style={{ textAlign: 'center' }}>Login - Checkin</h1>
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
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input type="password" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
