import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from './AuthProvider';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center p-8 rounded-xl border-2 border-dashed border-destructive/50 bg-destructive/5 text-destructive">
        <ShieldAlert className="w-12 h-12 mb-4 opacity-80" />
        <h2 className="text-xl font-bold tracking-tight">Access Denied</h2>
        <p className="max-w-sm mt-2 text-sm text-center opacity-90">
          Your current role (<span className="font-semibold capitalize">{user.role}</span>) does not have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
