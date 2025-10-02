/**
 * ChatScreen - 私聊对话页面路由
 * 
 * 路由: /(tabs)/messages/chat/:conversationId (动态路由)
 */

import { ErrorBoundary } from '@/src/components';
import { ChatPage } from '@/src/features/Messages';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ conversationId: string }>();

  return (
    <ErrorBoundary>
      <ChatPage conversationId={params.conversationId} />
    </ErrorBoundary>
  );
}