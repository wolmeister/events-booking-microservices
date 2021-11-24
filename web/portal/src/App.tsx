import { Routes } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.dark.css';

import { AuthProvider } from './hooks/useAuth';

const { Header, Content } = Layout;

export function App() {
  return (
    <AuthProvider>
      <Routes></Routes>
    </AuthProvider>
    // <Layout>
    //   <Header>
    //     <Menu theme="dark" mode="horizontal">
    //       <Menu.Item>Eventos</Menu.Item>
    //       <Menu.Item>Eventos</Menu.Item>
    //     </Menu>
    //   </Header>
    //   <Content />
    // </Layout>
  );
}
