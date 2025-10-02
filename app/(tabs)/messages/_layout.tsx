/**
 * Messages Layout - 消息模块布局配置
 * 
 * 配置消息模块的Stack导航
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="likes" />
      <Stack.Screen name="comments" />
      <Stack.Screen name="followers" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="chat/[conversationId]" />
    </Stack>
  );
}
