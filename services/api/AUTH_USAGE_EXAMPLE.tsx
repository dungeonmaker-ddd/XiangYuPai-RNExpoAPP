/**
 * 🔐 认证API使用示例
 * 
 * 本文件展示如何在实际项目中使用authApi
 * 包含登录、登出、刷新token等完整流程
 */

import type { PasswordLoginRequest } from '@/services/api';
import { apiClient, authApi } from '@/services/api';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

// ===== 示例1: 登录页面组件 =====

export function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 密码登录
  const handlePasswordLogin = async () => {
    setLoading(true);
    try {
      const request: PasswordLoginRequest = {
        phone,
        password,
        region: '+86',
        deviceId: 'device_123', // 实际应用中应该获取真实设备ID
      };

      const response = await authApi.loginWithPassword(request);

      if (response.success) {
        Alert.alert('登录成功', `欢迎 ${response.data.userInfo.nickname}`);
        
        // ✅ Token已自动存储
        // ✅ 后续所有API请求自动携带token
        
        // 跳转到主页
        // navigation.navigate('Home');
      } else {
        Alert.alert('登录失败', response.message);
      }
    } catch (error: any) {
      Alert.alert('登录错误', error.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>手机号</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="请输入手机号"
        keyboardType="phone-pad"
      />

      <Text>密码</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="请输入密码"
        secureTextEntry
      />

      <Button
        title={loading ? '登录中...' : '登录'}
        onPress={handlePasswordLogin}
        disabled={loading}
      />
    </View>
  );
}

// ===== 示例2: 验证码登录 =====

export function SmsLoginScreen() {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // 发送验证码
  const handleSendCode = async () => {
    if (countdown > 0) return;

    try {
      const response = await authApi.sendSmsCode({
        phone,
        region: '+86',
        type: 'login',
      });

      if (response.success) {
        Alert.alert('成功', '验证码已发送');
        
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      Alert.alert('发送失败', error.message);
    }
  };

  // 验证码登录
  const handleSmsLogin = async () => {
    setLoading(true);
    try {
      const response = await authApi.loginWithSms({
        phone,
        smsCode,
        region: '+86',
      });

      if (response.success) {
        Alert.alert('登录成功', `欢迎 ${response.data.userInfo.nickname}`);
      }
    } catch (error: any) {
      Alert.alert('登录失败', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>手机号</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="请输入手机号"
        keyboardType="phone-pad"
      />

      <Button
        title={countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
        onPress={handleSendCode}
        disabled={countdown > 0}
      />

      <Text>验证码</Text>
      <TextInput
        value={smsCode}
        onChangeText={setSmsCode}
        placeholder="请输入验证码"
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button
        title={loading ? '登录中...' : '登录'}
        onPress={handleSmsLogin}
        disabled={loading}
      />
    </View>
  );
}

// ===== 示例3: 在AuthStore中集成 =====

export const authStoreExample = {
  // 在store中使用authApi
  login: async (credentials: PasswordLoginRequest) => {
    try {
      const response = await authApi.loginWithPassword(credentials);

      if (response.success) {
        const { accessToken, refreshToken, userInfo } = response.data;

        // 保存到store状态
        // set({ isAuthenticated: true, accessToken, refreshToken, userInfo });

        // 保存到SecureStore
        // await SecureStore.setItemAsync('ACCESS_TOKEN', accessToken);
        // await SecureStore.setItemAsync('REFRESH_TOKEN', refreshToken);

        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 刷新Token
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await authApi.refreshToken({ refreshToken });

      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 更新store状态
        // set({ accessToken, refreshToken: newRefreshToken });

        // 更新SecureStore
        // await SecureStore.setItemAsync('ACCESS_TOKEN', accessToken);
        // await SecureStore.setItemAsync('REFRESH_TOKEN', newRefreshToken);

        return true;
      }
      return false;
    } catch (error) {
      console.error('刷新token失败:', error);
      // 刷新失败，清除认证数据
      // get().clearAuthData();
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try {
      await authApi.logout();
      // 清除store状态
      // set({ isAuthenticated: false, accessToken: null, refreshToken: null, userInfo: null });
      // 清除SecureStore
      // await SecureStore.deleteItemAsync('ACCESS_TOKEN');
      // await SecureStore.deleteItemAsync('REFRESH_TOKEN');
    } catch (error) {
      console.error('登出失败:', error);
      // 即使失败也清除本地数据
    }
  },
};

// ===== 示例4: 获取用户信息 =====

export async function getUserProfile() {
  try {
    const response = await authApi.getCurrentUserProfile();

    if (response.success) {
      console.log('用户信息:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// ===== 示例5: 检查Token有效性 =====

export async function checkAuth() {
  const isValid = await authApi.checkTokenValidity();
  
  if (isValid) {
    console.log('✅ Token有效');
  } else {
    console.log('❌ Token无效或已过期，需要重新登录');
    // 跳转到登录页
    // navigation.navigate('Login');
  }
  
  return isValid;
}

// ===== 示例6: 在App启动时初始化 =====

export function AppInitializer() {
  React.useEffect(() => {
    const initAuth = async () => {
      // 1. 连接API客户端与AuthStore
      // apiClient.connectAuthStore(useAuthStore);

      // 2. 从SecureStore读取token
      // const savedToken = await SecureStore.getItemAsync('ACCESS_TOKEN');
      
      // 3. 如果有token，验证是否有效
      // if (savedToken) {
      //   apiClient.setAuthToken(savedToken);
      //   const isValid = await authApi.checkTokenValidity();
      //   
      //   if (isValid) {
      //     // Token有效，自动登录
      //     const userInfo = await authApi.getCurrentUserProfile();
      //     // set({ isAuthenticated: true, userInfo: userInfo.data });
      //   } else {
      //     // Token失效，清除
      //     apiClient.clearAuthToken();
      //   }
      // }
    };

    initAuth();
  }, []);

  return null;
}

// ===== 示例7: 配置不同平台的ClientId =====

export function setupClientId() {
  // 根据平台设置不同的clientId
  const Platform = { OS: 'web' }; // 示例

  if (Platform.OS === 'android') {
    apiClient.setClientId('android_client');
  } else if (Platform.OS === 'ios') {
    apiClient.setClientId('ios_client');
  } else {
    apiClient.setClientId('web_client');
  }

  console.log('ClientId已设置:', apiClient.getClientId());
}

// ===== 示例8: 手动管理Token（不推荐） =====

export const manualTokenManagement = {
  // 手动设置token（不推荐，建议使用authApi）
  setToken: (token: string, clientId: string) => {
    apiClient.setAuthToken(token);
    apiClient.setClientId(clientId);
  },

  // 手动清除token
  clearToken: () => {
    apiClient.clearAuthToken();
  },

  // 获取当前token
  getToken: () => {
    // 注意：这个方法是私有的，不建议直接调用
    // 应该通过authStore来管理token
    console.warn('不建议直接获取token，应该通过authStore管理');
  },
};

// ===== 示例9: 处理网络错误 =====

export async function handleApiCall() {
  try {
    const response = await authApi.getCurrentUserProfile();
    
    if (response.success) {
      return response.data;
    } else {
      // 业务错误
      Alert.alert('错误', response.message);
    }
  } catch (error: any) {
    // 网络错误或其他错误
    if (error.type === 'NETWORK_ERROR') {
      Alert.alert('网络错误', '请检查网络连接');
    } else if (error.type === 'AUTHENTICATION_ERROR') {
      Alert.alert('认证失败', '请重新登录');
      // 跳转到登录页
    } else {
      Alert.alert('错误', error.message || '未知错误');
    }
  }
}

// ===== 导出示例组件 =====

export default {
  LoginScreen,
  SmsLoginScreen,
  authStoreExample,
  getUserProfile,
  checkAuth,
  AppInitializer,
  setupClientId,
  manualTokenManagement,
  handleApiCall,
};

