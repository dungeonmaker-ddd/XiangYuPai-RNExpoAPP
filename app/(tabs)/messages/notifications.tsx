/**
 * NotificationsScreen - 系统通知页面路由
 * 
 * 路由: /(tabs)/messages/notifications
 */

import { ErrorBoundary } from '@/src/components';
import { NotificationsPage } from '@/src/features/Messages';
import React from 'react';

export default function NotificationsScreen() {
  return (
    <ErrorBoundary>
      <NotificationsPage />
    </ErrorBoundary>
  );
}
