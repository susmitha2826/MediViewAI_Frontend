import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { AuthState, User, RegisterRequest, LoginRequest, VerifyOTPRequest } from '@/types/auth';
import { apiService } from '@/services/api';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadStoredAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('user_data');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (data: VerifyOTPRequest) => {
    try {
      const response = await apiService.verifyOTP(data);
      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await apiService.login(data);
      // console.log(response?.data,"responseresponseresponseresponseresponseresponse")
      if (response?.data?.token) {
        await AsyncStorage.setItem('auth_token', response?.data?.token);
        
        // Fetch user profile
        const userProfile = await apiService.getProfile();
        await AsyncStorage.setItem('user_data', JSON.stringify(userProfile));
        
        setAuthState({
          user: userProfile,
          token: response?.data?.token,
          isLoading: false,
          isAuthenticated: true,
        });
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const updateUser = useCallback((user: User) => {
    setAuthState(prev => ({ ...prev, user }));
    AsyncStorage.setItem('user_data', JSON.stringify(user));
  }, []);

  return useMemo(() => ({
    ...authState,
    register,
    verifyOTP,
    login,
    logout,
    updateUser,
  }), [authState, register, verifyOTP, login, logout, updateUser]);
});