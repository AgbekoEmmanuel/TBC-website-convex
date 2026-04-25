import React, { createContext, useContext, ReactNode } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const signOut = async () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  const login = () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const user: User | null = isAuthenticated ? {
    id: 'current-user',
    name: 'Administrator',
    email: 'admin@thebalancechurch.org',
    role: 'admin'
  } : null;

  const setRole = (role: Role) => {
    console.log('Role change blocked in bypass mode:', role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, signOut, setRole, login } as any}>
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
