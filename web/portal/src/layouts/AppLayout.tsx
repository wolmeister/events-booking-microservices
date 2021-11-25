import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Layout, Menu } from 'antd';
import { useAuth } from '../hooks/useAuth';

export function AppLayout({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const avatar = useMemo(() => {
    return auth?.user.name
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('');
  }, [auth]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedKeys(['events']);
    } else {
      setSelectedKeys([location.pathname.substring(1)]);
    }
  }, [location]);

  return (
    <Layout>
      <Layout.Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys}>
            <Menu.Item key="events" onClick={() => navigate('/')}>
              Events
            </Menu.Item>
            <Menu.Item key="inscriptions" onClick={() => navigate('/inscriptions')}>
              My inscriptions
            </Menu.Item>
            <Menu.Item key="certificates" onClick={() => navigate('/certificates')}>
              Certificates
            </Menu.Item>
          </Menu>
          <Avatar style={{ marginLeft: 'auto' }}>{avatar}</Avatar>
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: '0 50px' }}>{children}</Layout.Content>
    </Layout>
  );
}
