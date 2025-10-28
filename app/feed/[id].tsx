/**
 * Feed Detail Screen - 动态详情页面
 * 
 * Route: /feed/[id]
 * 
 * Features:
 * - Full post content display
 * - Comments section
 * - Like/collect/share actions
 * - Author information
 * - Guest browsing allowed
 */

import { ErrorBoundary } from '@/src/components';
import DetailPage from '@/src/features/Discovery/DetailPage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FeedDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>无效的动态ID</Text>
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <DetailPage feedId={id} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
