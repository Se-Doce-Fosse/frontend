import { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchAdminUsers,
  type AdminUser,
} from '../services/admin-users/admin-users';

interface User {
  email: string;
  token: string;
  name?: string;
  role?: string;
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
    const name = localStorage.getItem('name') || undefined;
    const role = localStorage.getItem('role') || undefined;

    if (!token || !email) {
      setLoading(false);
      return;
    }

    const initialUser: User = { email, token, name, role };
    setUser(initialUser);

    const needsEnrichment = !name || !role;

    if (!needsEnrichment) {
      setLoading(false);
      return;
    }

    const enrichUser = async () => {
      try {
        const adminUsers = await fetchAdminUsers(token);
        const currentUser = adminUsers.find(
          (admin: AdminUser) => admin.email === email
        );
        if (currentUser) {
          const enrichedUser: User = {
            email,
            token,
            name: currentUser.username,
            role: currentUser.role,
          };
          setUser(enrichedUser);
          if (enrichedUser.name) {
            localStorage.setItem('name', enrichedUser.name);
          }
          if (enrichedUser.role) {
            localStorage.setItem('role', enrichedUser.role);
          }
        }
      } catch (error) {
        console.error('Failed to enrich user profile', error);
      } finally {
        setLoading(false);
      }
    };

    void enrichUser();
  }, []);

  const saveUser = (user: User) => {
    setUser(user);
    localStorage.setItem('token', user.token);
    localStorage.setItem('email', user.email);
    if (user.name) {
      localStorage.setItem('name', user.name);
    } else {
      localStorage.removeItem('name');
    }
    if (user.role) {
      localStorage.setItem('role', user.role);
    } else {
      localStorage.removeItem('role');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
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
