import { Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.dark.css';

import { AuthProvider } from './hooks/useAuth';
import { AuthRoute } from './routes/AuthRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { SignIn } from './screens/SignIn';
import { CheckIn } from './screens/CheckIn';
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
                <CheckIn />
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
      </Routes>
    </AuthProvider>
  );
}
