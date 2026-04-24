import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Role = 'admin' | 'editor';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { role: Role } | null;
  login: (passcode: string) => boolean;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ role: Role } | null>(null);

  useEffect(() => {
    // Check session storage for existing auth
    const authSession = sessionStorage.getItem("admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
    }
    setIsLoading(false);
  }, []);

  const login = (passcode: string) => {
    if (passcode === "1234") {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
      sessionStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem("admin_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
