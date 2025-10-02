/**
 * Location Screen - 位置服务页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import LocationMainPage from '@/src/features/Homepage/LocationFlow/LocationMainPage';
import React from 'react';

export default function LocationScreen() {
  return (
    <ErrorBoundary>
      <LocationMainPage />
    </ErrorBoundary>
  );
}