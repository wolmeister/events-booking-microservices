import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Divider, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const navigate = useNavigate();
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
        <h1 style={{ textAlign: 'center' }}>Login</h1>
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
        <Divider>or</Divider>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            type="default"
            htmlType="button"
            style={{ width: '100%' }}
            onClick={() => navigate('/signup')}
          >
            Create new account
          </Button>
        </div>
      </Form>
    </div>
  );
}
