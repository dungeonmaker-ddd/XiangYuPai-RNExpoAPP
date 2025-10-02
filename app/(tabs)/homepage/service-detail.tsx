/**
 * Service Detail Screen - 服务详情页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import ServiceDetailPage from '@/src/features/Homepage/ServiceFlow/ServiceDetailPage';
import type { ServiceType } from '@/src/features/Homepage/ServiceFlow/ServiceDetailPage/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ServiceDetailScreen() {
  const { serviceType } = useLocalSearchParams<{ serviceType: string }>();
  
  return (
    <ErrorBoundary>
      <ServiceDetailPage serviceType={serviceType as ServiceType} />
    </ErrorBoundary>
  );
}