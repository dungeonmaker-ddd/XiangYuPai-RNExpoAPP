/**
 * Homepage Tab主页面 - Expo Router路由入口
 */

import { ErrorBoundary } from '@/src/components';
import MainPage from '@/src/features/Homepage/MainPage';
import React from 'react';

export default function HomepageScreen() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  );
}
