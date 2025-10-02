/**
 * LikesScreen - 赞和收藏消息页面路由
 * 
 * 路由: /(tabs)/messages/likes
 */

import { ErrorBoundary } from '@/src/components';
import { LikesPage } from '@/src/features/Messages';
import React from 'react';

export default function LikesScreen() {
  return (
    <ErrorBoundary>
      <LikesPage />
    </ErrorBoundary>
  );
}
