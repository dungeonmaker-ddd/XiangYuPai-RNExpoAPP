/**
 * Discover Tab - 发现页面
 * 
 * 功能：
 * - 集成发现页面主组件（MainPage）
 * - 提供三Tab切换（关注/热门/同城）
 * - 支持动态流展示、下拉刷新和无限滚动
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

// 导入发现页面主组件
import MainPage from '@/src/features/Discovery/MainPage';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <MainPage 
        initialTab="hot" // 默认显示热门Tab
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
