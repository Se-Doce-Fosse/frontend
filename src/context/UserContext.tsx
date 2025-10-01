import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  saveUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) setUser({ email, token });
    setLoading(false);
  }, []);

  const saveUser = (user: User) => {
    setUser(user);
    localStorage.setItem('token', user.token);
    localStorage.setItem('email', user.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  return (
    <UserContext.Provider
      value={{ user, saveUser, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
