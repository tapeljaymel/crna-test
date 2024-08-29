// src/contexts/FakeAuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface FakeAuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const FakeAuthContext = createContext<FakeAuthContextType | undefined>(undefined);

export const FakeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <FakeAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </FakeAuthContext.Provider>
  );
};

export const useFakeAuth = () => {
  const context = useContext(FakeAuthContext);
  if (context === undefined) {
    throw new Error('useFakeAuth must be used within a FakeAuthProvider');
  }
  return context;
};
