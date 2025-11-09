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
// ========== ✅ 导入真实的后端API ==========
import { authApi as backendAuthApi } from '../../../../services/api/authApi';
// =========================================
// 🆕 导入凭证存储
import { clearCredentials } from '../utils/credentialStorage';

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
  clearAuthData: () => Promise<void>; // 🆕 改为异步，因为需要清除保存的凭证
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
  
  // 登录 - ✅ 使用真实后端API
  login: async (credentials) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 用户登录流程开始（连接后端API）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   手机号/用户名:', credentials?.phone || credentials?.username || '未提供');
    console.log('   登录方式:', credentials?.password ? '密码登录' : '验证码登录');
    
    try {
      let response;
      
      if (credentials?.password) {
        // 🎯 密码登录（后端需要username字段）
        console.log('   步骤1: 调用后端密码登录API');
        response = await backendAuthApi.loginWithPassword({
          username: credentials.phone,  // 🆕 后端使用username字段，前端传phone值
          password: credentials.password,
          clientType: 'app',
          deviceId: get().deviceId || generateDeviceId(),
          rememberMe: false,
        });
      } else if (credentials?.smsCode) {
        // 🎯 短信登录（后端需要mobile字段）
        console.log('   步骤1: 调用后端短信登录API');
        response = await backendAuthApi.loginWithSms({
          mobile: credentials.phone,  // 🆕 后端使用mobile字段
          smsCode: credentials.smsCode,
          clientType: 'app',
          deviceId: get().deviceId || generateDeviceId(),
          rememberMe: false,
        });
      } else {
        throw new Error('请提供密码或验证码');
      }
      
      // 🎯 检查响应
      if (!response.success || !response.data) {
        console.error('❌ 登录响应验证失败:', response.message);
        throw new Error(response.message || '登录失败');
      }
      
      const { accessToken, refreshToken, userInfo, expiresIn } = response.data;
      
      // 🆕 适配后端UserInfo到前端UserInfo
      const adaptedUserInfo: UserInfo = {
        id: String(userInfo.id),
        phone: userInfo.mobile || credentials.phone || '',
        nickname: userInfo.nickname || userInfo.username,
        avatar: userInfo.avatar,
        verified: userInfo.status === 1,
        createdAt: new Date().toISOString(),
      };
      
      console.log('   步骤2: 保存token到SecureStore');
      await secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
      await secureStorage.setItem(SECURE_KEYS.USER_CREDENTIALS, JSON.stringify(adaptedUserInfo));
      
      console.log('   步骤3: 更新认证状态');
      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        userInfo: adaptedUserInfo,
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 登录成功！（真实后端数据）');
      console.log(`   用户ID: ${adaptedUserInfo.id}`);
      console.log(`   用户名: ${adaptedUserInfo.nickname}`);
      console.log(`   Token: ${accessToken.substring(0, 20)}...`);
      console.log(`   过期时间: ${expiresIn}秒`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ 登录失败！');
      console.error('   错误:', error.message || error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      throw error;
    }
  },
  
  // 退出登录 - ✅ 使用真实后端API
  logout: async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👋 用户登出流程开始（连接后端API）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 🎯 调用后端登出API
      console.log('   步骤1: 调用后端登出接口');
      await backendAuthApi.logout();
      console.log('   ✅ 后端登出成功');
    } catch (error) {
      console.warn('   ⚠️ 后端登出失败（继续清除本地数据）:', error);
      // 即使后端登出失败，也要清除本地数据
    }
    
    console.log('   步骤2: 清除本地认证数据');
    await get().clearAuthData();
    console.log('✅ 登出成功（真实后端）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },
  
  // 清除认证数据
  clearAuthData: async () => {
    console.log('   步骤1: 删除SecureStore中的token');
    secureStorage.deleteItem(SECURE_KEYS.ACCESS_TOKEN);
    secureStorage.deleteItem(SECURE_KEYS.REFRESH_TOKEN);
    secureStorage.deleteItem(SECURE_KEYS.USER_CREDENTIALS);
    
    console.log('   步骤2: 清除保存的登录凭证');
    await clearCredentials();
    console.log('   ✅ 登录凭证已清除');
    
    console.log('   步骤3: 重置认证状态');
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    });
    console.log('   📊 当前状态: isAuthenticated = false');
  },
  
  // 刷新令牌 - ✅ 使用真实后端API
  refreshAuthToken: async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 Token刷新流程开始（连接后端API）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const currentRefreshToken = get().refreshToken;
      
      if (!currentRefreshToken) {
        throw new Error('没有refreshToken，无法刷新');
      }
      
      console.log('   步骤1: 调用后端刷新Token接口');
      const response = await backendAuthApi.refreshToken(currentRefreshToken);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token刷新失败');
      }
      
      const { accessToken, refreshToken: newRefreshToken, userInfo } = response.data;
      
      // 🆕 适配用户信息（如果后端返回了）
      let adaptedUserInfo = get().userInfo;
      if (userInfo) {
        adaptedUserInfo = {
          id: String(userInfo.id),
          phone: userInfo.mobile || get().userInfo?.phone || '',
          nickname: userInfo.nickname || userInfo.username,
          avatar: userInfo.avatar,
          verified: userInfo.status === 1,
          createdAt: new Date().toISOString(),
        };
      }
      
      console.log('   步骤2: 保存新token到SecureStore');
      await secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, newRefreshToken);
      if (adaptedUserInfo) {
        await secureStorage.setItem(SECURE_KEYS.USER_CREDENTIALS, JSON.stringify(adaptedUserInfo));
      }
      
      console.log('   步骤3: 更新认证状态');
      set({
        accessToken,
        refreshToken: newRefreshToken,
        userInfo: adaptedUserInfo,
        isAuthenticated: true,
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Token刷新成功！（真实后端数据）');
      console.log(`   新Token: ${accessToken.substring(0, 20)}...`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ Token刷新失败！');
      console.error('   错误:', error.message || error);
      console.error('   操作: 清除认证数据');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // 刷新失败，清除所有认证数据
      await get().clearAuthData();
      throw error;
    }
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
