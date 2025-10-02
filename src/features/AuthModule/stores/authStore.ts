/**
 * Auth Store - 认证主状态管理（简化版）
 * 
 * 基于Zustand的认证状态管理
 * 暂时移除persist中间件，避免复杂的类型推断问题
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { DEFAULT_STATE_VALUES, SECURE_KEYS } from '../LoginMainPage/constants';
import type { AuthMode, UserInfo } from '../LoginMainPage/types';

// #region 类型定义

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userInfo: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginMode: AuthMode;
  deviceId: string | null;
}

export interface AuthActions {
  initialize: () => Promise<void>;
  login: (credentials?: any) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthData: () => void;
  refreshAuthToken: () => Promise<void>;  // 改名避免与refreshToken字段冲突
  setUserInfo: (userInfo: UserInfo) => void;
  setLoginMode: (mode: AuthMode) => void;
  switchMode: (mode: AuthMode) => void;
  setDeviceId: (deviceId: string) => void;
}

export type AuthStore = AuthState & AuthActions;

// #endregion

// #region 工具函数

const generateDeviceId = (): string => {
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
      await AsyncStorage.setItem(`secure_${key}`, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return await AsyncStorage.getItem(`secure_${key}`);
    }
  },
  
  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore deleteItem error:', error);
      await AsyncStorage.removeItem(`secure_${key}`);
    }
  },
};

// #endregion

// #region Store创建

export const useAuthStore = create<AuthStore>((set, get) => ({
  // 初始状态
  isAuthenticated: false,
  isInitialized: false,
  userInfo: null,
  accessToken: null,
  refreshToken: null,
  loginMode: DEFAULT_STATE_VALUES.loginMode,
  deviceId: null,
  
  // 初始化
  initialize: async () => {
    try {
      console.log('🔐 Initializing auth store...');
      
      const accessToken = await secureStorage.getItem(SECURE_KEYS.ACCESS_TOKEN);
      const refreshToken = await secureStorage.getItem(SECURE_KEYS.REFRESH_TOKEN);
      const userCredentials = await secureStorage.getItem(SECURE_KEYS.USER_CREDENTIALS);
      
      let userInfo: UserInfo | null = null;
      if (userCredentials) {
        try {
          userInfo = JSON.parse(userCredentials);
        } catch (error) {
          console.error('Parse user credentials error:', error);
        }
      }
      
      const deviceId = get().deviceId || generateDeviceId();
      
      set({
        accessToken,
        refreshToken,
        userInfo,
        isAuthenticated: !!accessToken,
        isInitialized: true,
        deviceId,
      });
      
      console.log('✅ Auth store initialized successfully');
    } catch (error) {
      console.error('❌ Auth store initialization failed:', error);
      set({
        isInitialized: true,
        isAuthenticated: false,
      });
    }
  },
  
  // 登录
  login: async (credentials) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 用户登录流程开始');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   手机号:', credentials?.phone || '未提供');
    console.log('   登录方式:', credentials?.password ? '密码登录' : '验证码登录');
    
    // Mock实现
    const mockToken = 'mock_token_' + Date.now();
    const mockUser: UserInfo = {
      id: 'user_123',
      phone: credentials?.phone || '',
      nickname: '测试用户',
      verified: true,
      createdAt: new Date().toISOString(),
    };
    
    console.log('   步骤1: 保存token到SecureStore');
    await secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, mockToken);
    await secureStorage.setItem(SECURE_KEYS.USER_CREDENTIALS, JSON.stringify(mockUser));
    
    console.log('   步骤2: 更新认证状态');
    set({
      isAuthenticated: true,
      accessToken: mockToken,
      userInfo: mockUser,
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 登录成功！');
    console.log(`   用户: ${mockUser.nickname}`);
    console.log(`   Token: ${mockToken.substring(0, 20)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },
  
  // 退出登录
  logout: async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👋 用户登出流程开始');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await get().clearAuthData();
    console.log('✅ 登出成功');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },
  
  // 清除认证数据
  clearAuthData: () => {
    console.log('   步骤1: 删除SecureStore中的token');
    secureStorage.deleteItem(SECURE_KEYS.ACCESS_TOKEN);
    secureStorage.deleteItem(SECURE_KEYS.REFRESH_TOKEN);
    secureStorage.deleteItem(SECURE_KEYS.USER_CREDENTIALS);
    
    console.log('   步骤2: 重置认证状态');
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    });
    console.log('   📊 当前状态: isAuthenticated = false');
  },
  
  // 刷新令牌
  refreshAuthToken: async () => {
    // TODO: 实现刷新令牌逻辑
    console.log('Refreshing token...');
  },
  
  // 设置用户信息
  setUserInfo: (userInfo) => {
    set({ userInfo });
    secureStorage.setItem(SECURE_KEYS.USER_CREDENTIALS, JSON.stringify(userInfo));
  },
  
  // 设置登录模式
  setLoginMode: (mode) => {
    set({ loginMode: mode });
  },
  
  // 切换登录模式
  switchMode: (mode) => {
    set({ loginMode: mode });
  },
  
  // 设置设备ID
  setDeviceId: (deviceId) => {
    set({ deviceId });
  },
}));

// #endregion

// #region 选择器

export const authSelectors = {
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,
  userInfo: (state: AuthStore) => state.userInfo,
  loginMode: (state: AuthStore) => state.loginMode,
};

// #endregion
