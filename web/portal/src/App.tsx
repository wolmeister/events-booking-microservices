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
import { AppLayout } from './layouts/AppLayout';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Events />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inscriptions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Inscriptions />
              </AppLayout>
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
  );
}
