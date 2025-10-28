/**
 * UnauthenticatedArea - 未登录状态区域
 * 
 * 功能：
 * - 检测到未登录时，自动重定向到现有登录页面
 * - 避免重复实现登录UI，统一使用 app/auth/login.tsx
 * - 保持登录逻辑的单一入口，便于维护和更新
 */

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
 */
const UnauthenticatedArea: React.FC = () => {
  const router = useRouter();
  
  useEffect(() => {
    // 自动跳转到现有登录页面
    // 使用 replace 而不是 push，这样用户登录后直接返回 Profile 页面
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);
  
  // 显示简短的过渡提示
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.text}>正在跳转到登录...</Text>
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
