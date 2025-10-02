// #region 1. File Banner & TOC
/**
 * ContentArea - 内容区域组件
 * 
 * 功能：
 * - 动态列表展示
 * - 下拉刷新
 * - 无限滚动加载
 * - 动态卡片交互
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 类型
import type { Feed } from '../../../types';
import type { ContentAreaProps } from '../../types';
// #endregion

// #region 3. Types & Schema
// (使用ContentAreaProps from types.ts)
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  DIVIDER: '#F0F0F0',
  PRIMARY: '#8A2BE2',
  LIKE_ACTIVE: '#FF4444',
} as const;

const SIZES = {
  CARD_PADDING: 16,
  CARD_MARGIN: 8,
  AVATAR_SIZE: 40,
  IMAGE_HEIGHT: (SCREEN_WIDTH - 32) * 0.6,
  SPACING: 12,
} as const;

const TYPOGRAPHY = {
  NICKNAME: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  TIME: {
    fontSize: 12,
    lineHeight: 16,
  },
  CONTENT: {
    fontSize: 15,
    lineHeight: 22,
  },
  TOPIC: {
    fontSize: 14,
    lineHeight: 20,
  },
  STAT: {
    fontSize: 13,
    lineHeight: 18,
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};

/**
 * 格式化数字（1000+ → 1k）
 */
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};
// #endregion

// #region 6. State Management
// (简单组件，状态由父组件管理)
// #endregion

// #region 7. Domain Logic
/**
 * ContentArea业务逻辑Hook
 */
const useContentLogic = (props: ContentAreaProps) => {
  const {
    feeds,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    onLoadMore,
    onFeedPress,
    onUserPress,
    onTopicPress,
    onLike,
    onComment,
    onShare,
    onCollect,
  } = props;
  
  /**
   * 渲染动态卡片
   */
  const renderFeedCard = useCallback(({ item }: { item: Feed }) => {
    return (
      <View style={styles.card}>
        {/* 用户信息 */}
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(item.userId)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: item.userInfo.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userTextInfo}>
            <Text style={styles.nickname}>{item.userInfo.nickname}</Text>
            <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        
        {/* 动态内容 */}
        <TouchableOpacity
          onPress={() => onFeedPress(item.id)}
          activeOpacity={0.95}
        >
          {item.title && (
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
          )}
          <Text style={styles.content} numberOfLines={4}>
            {item.content}
          </Text>
          
          {/* 话题标签 */}
          {item.topicList.length > 0 && (
            <View style={styles.topicContainer}>
              {item.topicList.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onTopicPress(topic.name)}
                  style={styles.topicTag}
                >
                  <Text style={styles.topicText}>#{topic.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* 图片 */}
          {item.mediaList.length > 0 && (
            <Image
              source={{ uri: item.mediaList[0].url }}
              style={styles.feedImage}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        
        {/* 互动栏 */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>
              {item.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionText}>
              {formatNumber(item.likeCount)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {formatNumber(item.commentCount)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onCollect(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>
              {item.isCollected ? '⭐' : '☆'}
            </Text>
            <Text style={styles.actionText}>
              {formatNumber(item.collectCount)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [onFeedPress, onUserPress, onTopicPress, onLike, onComment, onShare, onCollect]);
  
  /**
   * 渲染列表底部
   */
  const renderFooter = useCallback(() => {
    if (loading && feeds.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          <Text style={styles.footerText}>加载中...</Text>
        </View>
      );
    }
    
    if (!hasMore && feeds.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多了</Text>
        </View>
      );
    }
    
    return null;
  }, [loading, hasMore, feeds.length]);
  
  /**
   * 渲染空状态
   */
  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.emptyText}>加载中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>暂无动态</Text>
      </View>
    );
  }, [loading]);
  
  /**
   * 键提取
   */
  const keyExtractor = useCallback((item: Feed) => item.id, []);
  
  /**
   * 到达底部处理
   */
  const handleEndReached = useCallback(() => {
    if (hasMore && !loading && !refreshing) {
      onLoadMore();
    }
  }, [hasMore, loading, refreshing, onLoadMore]);
  
  return {
    feeds,
    refreshing,
    renderFeedCard,
    renderFooter,
    renderEmpty,
    keyExtractor,
    handleEndReached,
    onRefresh,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * ContentArea主组件
 */
const ContentArea: React.FC<ContentAreaProps> = (props) => {
  const {
    feeds,
    refreshing,
    renderFeedCard,
    renderFooter,
    renderEmpty,
    keyExtractor,
    handleEndReached,
    onRefresh,
  } = useContentLogic(props);
  
  return (
    <FlatList
      data={feeds}
      renderItem={renderFeedCard}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.PRIMARY}
          colors={[COLORS.PRIMARY]}
        />
      }
      contentContainerStyle={
        feeds.length === 0 ? styles.emptyList : styles.list
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  list: {
    paddingVertical: SIZES.SPACING,
  },
  emptyList: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginBottom: SIZES.CARD_MARGIN,
    paddingHorizontal: SIZES.CARD_PADDING,
    paddingVertical: SIZES.SPACING,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.SPACING,
  },
  avatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.AVATAR_SIZE / 2,
    backgroundColor: COLORS.DIVIDER,
  },
  userTextInfo: {
    flex: 1,
    marginLeft: SIZES.SPACING,
  },
  nickname: {
    ...TYPOGRAPHY.NICKNAME,
    color: COLORS.TEXT_PRIMARY,
  },
  time: {
    ...TYPOGRAPHY.TIME,
    color: COLORS.TEXT_TERTIARY,
    marginTop: 2,
  },
  title: {
    ...TYPOGRAPHY.NICKNAME,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING / 2,
  },
  content: {
    ...TYPOGRAPHY.CONTENT,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING,
  },
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.SPACING,
  },
  topicTag: {
    marginRight: SIZES.SPACING / 2,
    marginBottom: SIZES.SPACING / 2,
  },
  topicText: {
    ...TYPOGRAPHY.TOPIC,
    color: COLORS.PRIMARY,
  },
  feedImage: {
    width: '100%',
    height: SIZES.IMAGE_HEIGHT,
    borderRadius: 8,
    backgroundColor: COLORS.DIVIDER,
    marginBottom: SIZES.SPACING,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: SIZES.SPACING / 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  actionText: {
    ...TYPOGRAPHY.STAT,
    color: COLORS.TEXT_SECONDARY,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.CARD_PADDING,
  },
  footerText: {
    ...TYPOGRAPHY.STAT,
    color: COLORS.TEXT_TERTIARY,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.CARD_PADDING,
  },
  emptyText: {
    ...TYPOGRAPHY.CONTENT,
    color: COLORS.TEXT_TERTIARY,
  },
});

export default ContentArea;
export type { ContentAreaProps } from '../../types';
// #endregion
