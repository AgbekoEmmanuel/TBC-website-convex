import React, { createContext, useContext, ReactNode } from 'react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export type Role = 'admin' | 'editor';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading: convexLoading, isAuthenticated: convexAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  const isAuthenticated = true;
  const isLoading = false;

  const user: User | null = {
    id: 'current-user',
    name: 'Administrator',
    email: 'admin@thebalancechurch.org',
    role: 'admin'
  };

  const setRole = (role: Role) => {
    console.log('Role change blocked in bypass mode:', role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, signOut, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
