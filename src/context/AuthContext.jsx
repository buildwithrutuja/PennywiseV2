import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from session on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('pennywise_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('pennywise_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 800); // Simulate network delay
    });
  };

  const loginWithDemo = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('pennywise_user', JSON.stringify(user));
          resolve(user);
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pennywise_user');
  };

  const signup = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isStudentEmail = userData.email.endsWith('.edu') || userData.email.endsWith('.edu.in') || userData.email.endsWith('.ac.in');
        if (!isStudentEmail) {
          reject(new Error("Please use a valid student email (.edu, .ac.in)"));
          return;
        }
        
        const newUser = {
          id: `user_new_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          university: userData.university || "Unknown University",
          branch: userData.branch || "General",
          role: "Student",
          persona: "New User",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          financials: {
            monthlyAllowance: Number(userData.allowance) || 0,
            currentSavings: Number(userData.savings) || 0,
            financialHealthScore: 70,
          },
          dreams: [],
          preferences: { theme: 'dark', notifications: true, coachTone: 'Friendly' }
        };
        
        // In a real app we'd save to DB, here we just set current
        setCurrentUser(newUser);
        localStorage.setItem('pennywise_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithDemo,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
