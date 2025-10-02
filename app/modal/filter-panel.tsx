/**
 * Filter Panel Modal - 筛选面板模态页面
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FilterPanelModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>筛选面板</Text>
      <Text style={styles.subtitle}>筛选面板开发中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});
