/**
 * MessagesScreen - 消息主页面路由
 * 
 * Expo Router路由适配器
 * 路由: /(tabs)/messages
 */

import { ErrorBoundary } from '@/src/components';
import { MainPage } from '@/src/features/Messages';
import React from 'react';

export default function MessagesScreen() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  );
}