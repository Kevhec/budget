import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function AuthLayout() {
  const { state } = useAuth();

  if (state.user && state.user?.id) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid place-content-center font-inter">
      <Outlet />
    </div>
  );
}
