/**
 * AuthSafeArea - 认证安全区域组件
 */

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthSafeAreaProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AuthSafeArea: React.FC<AuthSafeAreaProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]}>
      {children}
    </SafeAreaView>
  );
};

export default AuthSafeArea;