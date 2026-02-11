import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const STORAGE_KEY = '@job_finder_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('@job_finder_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Find user with matching email and password (case-insensitive email)
      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
        
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem('@job_finder_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists (case-insensitive)
      const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return false; // Email already registered
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(), // Store email in lowercase
        password, // In production, this should be hashed!
      };

      users.push(newUser);
      await AsyncStorage.setItem('@job_finder_users', JSON.stringify(users));

      // Auto-login after registration
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear user authentication only
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};