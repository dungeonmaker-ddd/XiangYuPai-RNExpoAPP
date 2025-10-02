/**
 * FollowersScreen - 粉丝消息页面路由
 * 
 * 路由: /(tabs)/messages/followers
 */

import { ErrorBoundary } from '@/src/components';
import { FollowersPage } from '@/src/features/Messages';
import React from 'react';

export default function FollowersScreen() {
  return (
    <ErrorBoundary>
      <FollowersPage />
    </ErrorBoundary>
  );
}
