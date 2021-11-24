import { Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.dark.css';

import { AuthProvider } from './hooks/useAuth';
import { AuthRoute } from './routes/AuthRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Events } from './screens/Events';
import { Inscriptions } from './screens/Inscriptions';
import { SignUp } from './screens/SignUp';
import { SignIn } from './screens/SignIn';

const { Header, Content } = Layout;

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inscriptions"
          element={
            <ProtectedRoute>
              <Inscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <AuthRoute>
              <SignIn />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          }
        />
      </Routes>
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
