/**
 * Featured Screen - 限时专享页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import FeaturedPage from '@/src/features/Homepage/FeaturedFlow/FeaturedPage';
import React from 'react';

export default function FeaturedScreen() {
  return (
    <ErrorBoundary>
      <FeaturedPage />
    </ErrorBoundary>
  );
}