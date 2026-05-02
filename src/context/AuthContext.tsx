import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'vandon_users';
const SESSION_KEY = 'vandon_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      setUser(JSON.parse(session));
    }
    
    // Initialize admin if not exists
    try {
      const usersJson = localStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      if (!users.find(u => u.role === 'admin')) {
        const admin: User = {
          id: 'admin_id',
          name: 'Quản trị viên',
          email: 'admin@vandon.vn',
          password: 'admin',
          role: 'admin'
        };
        users.push(admin);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error("Failed to parse users", e);
      localStorage.removeItem(USERS_KEY);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email này đã được đăng ký');
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
