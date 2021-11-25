import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

export function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const onFinish = useCallback(
    async data => {
      try {
        await signup(data);
      } catch (err) {
        message.error('Email or CPF already taken');
      }
    },
    [signup]
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
        <h1 style={{ textAlign: 'center' }}> Create new account</h1>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input prefix={<UserOutlined />} />
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
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input type="password" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
        <Divider>or</Divider>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            type="default"
            htmlType="button"
            style={{ width: '100%' }}
            onClick={() => navigate('/signin')}
          >
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
