/**
 * LoginScreen - 登录路由适配器
 * 
 * Expo Router路由层，适配LoginMainPage业务组件
 */

import { LoginMainPage } from '@/src/features/AuthModule';
import React from 'react';

/**
 * 登录屏幕组件（路由适配器）
 */
export default function LoginScreen() {
  return <LoginMainPage />;
}
