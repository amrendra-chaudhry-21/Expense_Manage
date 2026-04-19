import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerGlobalRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshTrigger, triggerGlobalRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};
