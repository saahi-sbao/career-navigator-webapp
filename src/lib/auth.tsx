'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  interests: string[];
};

type UserContextType = {
  user: User | null;
  login: () => void;
  logout: () => void;
  addInterest: (interest: string) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ id: 'user-123', name: 'Alex', interests: [] });
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  const logout = () => {
    setUser(null);
  };
  
  const addInterest = (interest: string) => {
    if (!user) return;
    setIsLoading(true);
    setTimeout(() => {
      setUser(prev => prev ? { ...prev, interests: [...new Set([...prev.interests, interest])] } : null);
      setIsLoading(false);
    }, 500); // Simulate saving delay
  };

  const value = { user, login, logout, addInterest, isLoading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
