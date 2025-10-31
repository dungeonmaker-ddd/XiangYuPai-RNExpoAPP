/**
 * DynamicContent - 动态Tab内容
 * 
 * 功能：
 * - 2列瀑布流布局展示用户动态
 * - 分页加载和下拉刷新
 * - 点击跳转动态详情
 * 
 * UI参考：个人主页-动态.png
 */

import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from 'react-native';

import type { Post } from '../../types';
import PostCard from './PostCard';

// #region Types
interface DynamicContentProps {
  posts: Post[];
  loading: boolean;
  refreshing?: boolean;
  onPostPress: (postId: string) => void;
  onLoadMore: () => void;
  onRefresh?: () => void;
}
// #endregion

// #region Constants
const COLUMN_GAP = 8;
const ITEM_MARGIN = 8;
// #endregion

const DynamicContent: React.FC<DynamicContentProps> = ({
  posts = [],
  loading,
  refreshing = false,
  onPostPress,
  onLoadMore,
  onRefresh,
}) => {
  // 将数据分成左右两列（交错分布）
  const { leftPosts, rightPosts } = useMemo(() => {
    const left: Post[] = [];
    const right: Post[] = [];
    
    posts.forEach((post, index) => {
      if (index % 2 === 0) {
        left.push(post);
      } else {
        right.push(post);
      }
    });
    
    return { leftPosts: left, rightPosts: right };
  }, [posts]);

  // 渲染空状态
  if (!loading && posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无动态</Text>
        <Text style={styles.emptyHint}>快去发布第一条动态吧～</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 左列 */}
      <View style={styles.column}>
        {leftPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => onPostPress(post.id)}
            style={styles.card}
          />
        ))}
      </View>

      {/* 右列 */}
      <View style={styles.column}>
        {rightPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => onPostPress(post.id)}
            style={styles.card}
          />
        ))}
      </View>

      {/* 加载更多指示器 */}
      {loading && posts.length > 0 && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#8A2BE2" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: COLUMN_GAP,
    minHeight: 400,
  },
  column: {
    flex: 1,
  },
  card: {
    marginBottom: ITEM_MARGIN,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#757575',
  },
  loadingMore: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default DynamicContent;

