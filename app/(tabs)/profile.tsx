/**
 * ProfileScreen - 个人主页路由适配器
 * 
 * Features:
 * - View own profile (no userId)
 * - View other user's profile (with userId param)
 * - Authentication-aware
 */

import MainPage from '@/src/features/Profile/MainPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  
  return <MainPage userId={userId} />;
}
