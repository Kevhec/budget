import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function AuthLayout() {
  const { auth } = useAuth();

  if (auth && auth?.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid place-content-center">
      <Outlet />
    </div>
  );
}
