/**
 * Filter Online Screen - 线上筛选页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import FilterMainPage from '@/src/features/Homepage/FilterFlow/FilterMainPage';
import React from 'react';

export default function FilterOnlineScreen() {
  return (
    <ErrorBoundary>
      <FilterMainPage filterType="online" />
    </ErrorBoundary>
  );
}