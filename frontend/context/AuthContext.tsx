import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMyProfile, updateUserWatchHistory as apiUpdateWatchHistory } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password_hash: string) => Promise<void>;
  register: (username: string, email: string, password_hash: string) => Promise<void>;
  logout: () => void;
  updateWatchHistory: (mediaId: string, progress: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const fetchedUser = await getMyProfile();
        setUser(fetchedUser);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email: string, password_hash: string) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password_hash }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token);
    await initializeAuth(); // Re-fetch user profile with new token
  }, [initializeAuth]);
  
  const register = async (username: string, email: string, password_hash: string) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: password_hash })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    // After successful registration, log the user in
    await login(email, password_hash);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);
  
  const updateWatchHistory = useCallback(async (mediaId: string, progress: number) => {
    try {
      await apiUpdateWatchHistory(mediaId, progress);
      // Optimistically update local state or re-fetch profile
      setUser(currentUser => {
        if (!currentUser) return null;
        const newHistory = [...currentUser.watchHistory];
        const historyIndex = newHistory.findIndex(item => item.mediaId === mediaId);
        const newHistoryItem = { mediaId, progress, lastWatched: new Date().toISOString() };
        if (historyIndex > -1) {
          newHistory[historyIndex] = newHistoryItem;
        } else {
          newHistory.unshift(newHistoryItem);
        }
        return { ...currentUser, watchHistory: newHistory };
      });
    } catch (error) {
      console.error("Failed to update watch history:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, register, logout, updateWatchHistory }}>
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