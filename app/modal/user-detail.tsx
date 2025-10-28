/**
 * User Detail Modal - Enhanced 用户详情模态页面路由适配器
 * 
 * Features:
 * - Rich user profile display
 * - Real backend data
 * - Authentication-aware actions
 * - Guest mode support
 * - Better UI/UX
 */

import { ErrorBoundary } from '@/src/components';
import EnhancedUserDetailPage from '@/src/features/Homepage/UserDetailFlow/EnhancedUserDetailPage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function UserDetailModal() {
  const router = useRouter();
  const { userId, serviceType } = useLocalSearchParams<{ 
    userId: string;
    serviceType?: string;
  }>();
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <ErrorBoundary>
      <EnhancedUserDetailPage 
        userId={userId} 
        visible={true}
        onClose={handleClose}
      />
    </ErrorBoundary>
  );
}