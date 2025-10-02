/**
 * Event Center Screen - 组局中心页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import EventCenterPage from '@/src/features/Homepage/EventFlow/EventCenterPage';
import React from 'react';

export default function EventCenterScreen() {
  return (
    <ErrorBoundary>
      <EventCenterPage />
    </ErrorBoundary>
  );
}