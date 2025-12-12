import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Initializing auth...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      if (token) {
        try {
          console.log('📡 Calling getMe API...');
          const response = await authAPI.getMe();
          console.log('✅ Auth successful:', response.data.data.user.name);
          setUser(response.data.data.user);
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('❌ No token found');
      }

      console.log('🏁 Setting loading to false');
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast.success(`Welcome to Home Pharmacy, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await authAPI.adminLogin(credentials);
      const { admin, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(admin));
      setUser(admin);

      toast.success('Admin login successful');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.data.user;

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    adminLogin,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
