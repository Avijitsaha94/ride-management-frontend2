import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import type { Driver } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // Check if account is blocked or suspended
  if (user.status === 'blocked' || user.status === 'suspended') {
    return <Navigate to="/account-blocked" />;
  }

  // Check role permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  // Check if driver is offline and trying to access ride-related features
  if (user.role === 'DRIVER') {
    const driverUser = user as Driver;
    if (driverUser.availability === 'offline') {
      const restrictedPaths = ['/driver/requests', '/driver/active-ride'];
      if (restrictedPaths.some((path) => window.location.pathname.includes(path))) {
        return <Navigate to="/driver-offline" />;
      }
    }
  }

  return <>{children}</>;
}