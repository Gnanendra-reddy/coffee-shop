import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('coffee_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      const newToken = res.data.access_token;
      localStorage.setItem('coffee_token', newToken);
      setToken(newToken);
      
      // Fetch user profile immediately
      const profileRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      setUser(profileRes.data);
      showToast('success', `Welcome back, ${profileRes.data.full_name || 'Coffee Lover'}!`);
      return { success: true, user: profileRes.data };
    } catch (err) {
      const msg = err.formattedMessage || 'Login failed. Please verify your credentials.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const register = async ({ fullName, email, password, phone }) => {
    try {
      await api.post('/users/register', {
        full_name: fullName,
        email,
        password,
        phone: phone || undefined,
      });
      showToast('success', 'Registration successful! Logging you in...');
      // Automatically log in after registration
      return await login(email, password);
    } catch (err) {
      const msg = err.formattedMessage || 'Registration failed. Email may already be registered.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('coffee_token');
    setToken(null);
    setUser(null);
    showToast('info', 'You have been signed out.');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/users/me', data);
      setUser(res.data);
      showToast('success', 'Profile updated successfully.');
      return { success: true, user: res.data };
    } catch (err) {
      const msg = err.formattedMessage || 'Failed to update profile.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast('success', 'Password changed successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.formattedMessage || 'Failed to change password.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/users/forgot-password', { email });
      showToast('info', res.data.message || 'Password reset link sent to your email.');
      return { success: true };
    } catch (err) {
      const msg = err.formattedMessage || 'Failed to request password reset.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        refreshProfile: fetchCurrentUser,
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
