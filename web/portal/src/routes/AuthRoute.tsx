import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthRoute({ children }: { children: JSX.Element }) {
  const { auth } = useAuth();

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return children;
}
