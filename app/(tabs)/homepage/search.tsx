/**
 * Search Screen - 搜索页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import SearchMainPage from '@/src/features/Homepage/SearchFlow/SearchMainPage';
import React from 'react';

export default function SearchScreen() {
  return (
    <ErrorBoundary>
      <SearchMainPage />
    </ErrorBoundary>
  );
}