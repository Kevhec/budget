import {
  Navigate, Outlet, useMatch,
} from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function AuthLayout() {
  const { state } = useAuth();
  const isVerifyRoute = useMatch('/verify/:token');

  if (state.user && state.user?.id && !isVerifyRoute) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen px-4 grid place-content-center font-inter">
      <Outlet />
    </div>
  );
}
