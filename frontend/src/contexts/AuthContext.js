import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelper } from '../firebase';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 페이지 로드 시 저장된 사용자 정보 확인
    const savedUser = authHelper.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await userAPI.login(email, password);
      const userData = response.data;
      
      // 사용자 정보 저장
      authHelper.setCurrentUser(userData);
      setUser(userData);
      
      return userData;
    } catch (err) {
      console.error('로그인 오류:', err);
      let errorMessage = '로그인에 실패했습니다.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (err.response?.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await userAPI.signup(userData);
      const newUser = response.data;
      
      // 회원가입 후 자동 로그인
      authHelper.setCurrentUser(newUser);
      setUser(newUser);
      
      return newUser;
    } catch (err) {
      console.error('회원가입 오류:', err);
      let errorMessage = '회원가입에 실패했습니다.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 409) {
        errorMessage = '이미 존재하는 이메일입니다.';
      } else if (err.response?.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authHelper.removeCurrentUser();
    setUser(null);
    setError('');
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    authHelper.setCurrentUser(newUserData);
    setUser(newUserData);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};