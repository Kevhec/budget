import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth && !auth?.id) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
