/**
 * UnauthenticatedArea - 未登录状态区域
 * 
 * 功能：
 * - 检测到未登录时，延迟后自动重定向到现有登录页面
 * - 避免重复实现登录UI，统一使用 app/auth/login.tsx
 * - 保持登录逻辑的单一入口，便于维护和更新
 * - 🆕 增加延迟以避免token刷新过程中的闪烁
 */

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants';

/**
 * 未登录状态组件
 * 自动跳转到现有登录页面，避免重复实现登录UI
 * 
 * 🆕 新增延迟机制：
 * - 前1秒：等待token刷新完成
 * - 1秒后仍未认证：显示提示
 * - 2秒后：自动跳转登录
 */
const UnauthenticatedArea: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  
  useEffect(() => {
    // 🆕 延迟显示跳转提示（避免token刷新时的闪烁）
    const messageTimer = setTimeout(() => {
      if (!isAuthenticated) {
        setShowRedirectMessage(true);
      }
    }, 1000);
    
    // 🆕 延迟跳转（给token刷新留出时间）
    const redirectTimer = setTimeout(() => {
      // 再次检查是否已认证（可能在等待期间完成了token刷新）
      const currentAuthState = useAuthStore.getState().isAuthenticated;
      if (!currentAuthState) {
        console.log('⚠️ 2秒后仍未认证，跳转到登录页面');
        router.replace('/auth/login');
      } else {
        console.log('✅ Token刷新成功，保持在当前页面');
      }
    }, 2000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(redirectTimer);
    };
  }, [router, isAuthenticated]);
  
  // 🆕 如果在等待期间认证状态恢复，不渲染任何内容
  if (isAuthenticated) {
    return null;
  }
  
  // 显示过渡提示
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      {showRedirectMessage ? (
        <Text style={styles.text}>正在跳转到登录...</Text>
      ) : (
        <Text style={styles.text}>验证登录状态...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  text: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 16,
  },
});

export default UnauthenticatedArea;
