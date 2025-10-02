/**
 * User Detail Modal - 用户详情模态页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import UserDetailPage from '@/src/features/Homepage/UserDetailFlow/UserDetailPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function UserDetailModal() {
  const { userId, serviceType } = useLocalSearchParams<{ 
    userId: string;
    serviceType?: string;
  }>();
  
  return (
    <ErrorBoundary>
      <UserDetailPage userId={userId} serviceType={serviceType} />
    </ErrorBoundary>
  );
}