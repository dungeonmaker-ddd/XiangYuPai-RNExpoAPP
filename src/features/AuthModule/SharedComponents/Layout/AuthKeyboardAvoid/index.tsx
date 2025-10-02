/**
 * AuthKeyboardAvoid - 认证键盘避让组件
 */

import React from 'react';
import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native';

export const AuthKeyboardAvoid: React.FC<KeyboardAvoidingViewProps> = (props) => {
  return <KeyboardAvoidingView {...props} />;
};

export default AuthKeyboardAvoid;