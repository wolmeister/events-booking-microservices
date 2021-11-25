import { useMemo } from 'react';
import { Avatar, Layout, Menu } from 'antd';
import { useAuth } from '../hooks/useAuth';

export function AppLayout({ children }: { children: JSX.Element }) {
  const { auth } = useAuth();
  const avatar = useMemo(() => {
    return auth?.user.name
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('');
  }, [auth]);

  return (
    <Layout>
      <Layout.Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu theme="dark" mode="horizontal" selectedKeys={['checkin']}>
            <Menu.Item key="checkin">Checkin</Menu.Item>
          </Menu>
          <Avatar style={{ marginLeft: 'auto' }}>{avatar}</Avatar>
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: '0 50px' }}>{children}</Layout.Content>
    </Layout>
  );
}
