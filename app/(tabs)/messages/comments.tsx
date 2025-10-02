/**
 * CommentsScreen - 评论消息页面路由
 * 
 * 路由: /(tabs)/messages/comments
 */

import { ErrorBoundary } from '@/src/components';
import { CommentsPage } from '@/src/features/Messages';
import React from 'react';

export default function CommentsScreen() {
  return (
    <ErrorBoundary>
      <CommentsPage />
    </ErrorBoundary>
  );
}
