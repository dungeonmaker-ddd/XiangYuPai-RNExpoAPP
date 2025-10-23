/**
 * AuthSafeArea - 认证安全区域组件
 * 提供白色背景的安全区域容器
 */

import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthSafeAreaProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AuthSafeArea: React.FC<AuthSafeAreaProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 纯白背景，铺满整个屏幕
  },
});

export default AuthSafeArea;