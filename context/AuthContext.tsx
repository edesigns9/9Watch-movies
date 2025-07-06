import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getMockUser } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateWatchHistory: (mediaId: string, progress: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // In a real app, you'd validate the token with a backend
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (username: string) => {
    setLoading(true);
    const mockUser = await getMockUser(username);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);
  
  const updateWatchHistory = useCallback((mediaId: string, progress: number) => {
    setUser((currentUser: User | null) => {
      if (!currentUser) return null;

      const newHistory = [...currentUser.watchHistory];
      const historyIndex = newHistory.findIndex(item => item.mediaId === mediaId);
      
      const newHistoryItem = { mediaId, progress, lastWatched: new Date().toISOString() };

      if (historyIndex > -1) {
        newHistory[historyIndex] = newHistoryItem;
      } else {
        newHistory.unshift(newHistoryItem);
      }
      
      const updatedUser = { ...currentUser, watchHistory: newHistory };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateWatchHistory
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 