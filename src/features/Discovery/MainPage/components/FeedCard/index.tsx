// #region 1. File Banner & TOC
/**
 * FeedCard - 动态卡片组件
 * 
 * 功能：
 * - 双列瀑布流卡片样式
 * - 图片优先显示
 * - 用户信息和互动栏
 * - 点赞收藏动画效果
 * 
 * 设计规格（基于UI设计图）：
 * - 卡片圆角：12px
 * - 图片圆角：12px（顶部）
 * - 用户头像：32x32px圆形
 * - 互动图标：18px
 * - 间距：12px标准间距
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
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// 类型
import type { Feed } from '../../../types';
// #endregion

// #region 3. Types & Schema
export interface FeedCardProps {
  feed: Feed;
  onPress?: (feedId: string) => void;
  onUserPress?: (userId: string) => void;
  onLike: (feedId: string) => void;
  onCollect: (feedId: string) => void;
  onComment?: (feedId: string) => void;
  onShare?: (feedId: string) => void;
  cardWidth: number;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  DIVIDER: '#F0F0F0',
  LIKE_ACTIVE: '#FF4444',
  COLLECT_ACTIVE: '#FFB800',
} as const;

const TYPOGRAPHY = {
  TITLE: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  CONTENT: {
    fontSize: 14,
    lineHeight: 20,
  },
  NICKNAME: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  STAT: {
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
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

// #region 6. State Management & 7. Domain Logic
/**
 * FeedCard业务逻辑Hook
 */
const useFeedCardLogic = (props: FeedCardProps) => {
  const { feed, onPress, onUserPress, onLike, onCollect, cardWidth } = props;
  const router = useRouter();
  
  // 处理卡片点击
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(feed.id);
    } else {
      router.push(`/feed/${feed.id}` as any);
    }
  }, [onPress, feed.id, router]);
  
  // 处理用户点击
  const handleUserPress = useCallback(() => {
    if (onUserPress) {
      onUserPress(feed.userId);
    }
    // TODO: 跳转到用户页面
  }, [onUserPress, feed.userId]);
  
  // 点赞动画状态
  const [likeScale] = useState(new Animated.Value(1));
  const [collectScale] = useState(new Animated.Value(1));
  
  /**
   * 计算图片高度（保持宽高比 + 随机性）
   */
  const imageHeight = useMemo(() => {
    if (feed.mediaList.length > 0) {
      const media = feed.mediaList[0];
      if (media.width && media.height) {
        return (cardWidth * media.height) / media.width;
      }
    }
    
    // 🎨 随机高度：生成4种比例（4:3, 3:4, 1:1, 16:9）
    // 使用feedId作为种子，保证同一卡片高度一致
    // 防御性编程：确保feed.id存在且是字符串
    const seedStr = String(feed.id || feed.feedId || Math.random());
    const seed = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratios = [
      1.33,  // 4:3 (横图)
      1.5,   // 3:2
      1.0,   // 1:1 (正方形)
      1.78,  // 16:9 (宽屏)
      1.25,  // 5:4
      0.75,  // 3:4 (竖图)
    ];
    const selectedRatio = ratios[seed % ratios.length];
    
    return cardWidth * selectedRatio;
  }, [feed.id, feed.mediaList, cardWidth]);
  
  /**
   * 处理点赞（带动画）
   */
  const handleLike = useCallback(() => {
    // 点赞动画
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    
    onLike(feed.id);
  }, [feed.id, onLike, likeScale]);
  
  /**
   * 处理收藏（带动画）
   */
  const handleCollect = useCallback(() => {
    // 收藏动画
    Animated.sequence([
      Animated.spring(collectScale, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(collectScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    
    onCollect(feed.id);
  }, [feed.id, onCollect, collectScale]);
  
  /**
   * 处理评论
   */
  const handleComment = useCallback(() => {
    if (onComment) {
      onComment(feed.id);
    } else {
      router.push(`/feed/${feed.id}` as any);
    }
  }, [feed.id, onComment, router]);
  
  /**
   * 处理分享
   */
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(feed.id);
    }
    // TODO: 实现分享功能
  }, [feed.id, onShare]);
  
  return {
    feed,
    imageHeight,
    cardWidth,
    likeScale,
    collectScale,
    handleLike,
    handleCollect,
    handleComment,
    handleShare,
    handlePress,
    handleUserPress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * FeedCard主组件
 */
const FeedCard: React.FC<FeedCardProps> = (props) => {
  const {
    feed,
    imageHeight,
    cardWidth,
    likeScale,
    collectScale,
    handleLike,
    handleCollect,
    handleComment,
    handleShare,
    handlePress,
    handleUserPress,
  } = useFeedCardLogic(props);
  
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* 卡片内容点击区域 */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
      >
        {/* 封面图片 */}
        {feed.mediaList?.length > 0 && feed.mediaList[0]?.url && (
          <Image
            source={{ uri: feed.mediaList[0].url }}
            style={[styles.coverImage, { height: imageHeight }]}
            resizeMode="cover"
          />
        )}
        {(!feed.mediaList?.length || !feed.mediaList[0]?.url) && (
          <View style={[styles.coverImage, styles.placeholderImage, { height: imageHeight }]}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
        
        {/* 文字内容 */}
        <View style={styles.contentSection}>
          {feed.title && (
            <Text style={styles.title} numberOfLines={2}>
              {feed.title}
            </Text>
          )}
          <Text style={styles.content} numberOfLines={3}>
            {feed.content}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* 底部信息栏 */}
      <View style={styles.bottomSection}>
      {/* 用户信息 */}
      <TouchableOpacity
        style={styles.userInfo}
        onPress={handleUserPress}
        activeOpacity={0.7}
      >
        {feed.userInfo?.avatar ? (
          <Image
            source={{ uri: feed.userInfo.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>👤</Text>
          </View>
        )}
        <Text style={styles.nickname} numberOfLines={1}>
          {feed.userInfo.nickname}
        </Text>
      </TouchableOpacity>
        
        {/* 互动栏 */}
        <View style={styles.actionBar}>
          {/* 点赞 */}
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>
                {feed.isLiked ? '❤️' : '🤍'}
              </Text>
              <Text
                style={[
                  styles.actionText,
                  feed.isLiked && styles.actionTextActive,
                ]}
              >
                {formatNumber(feed.likeCount)}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* 评论 */}
          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 12 }]}
            onPress={handleComment}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {feed.commentCount > 0 ? formatNumber(feed.commentCount) : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    // 添加阴影（iOS）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // 添加阴影（Android）
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    backgroundColor: COLORS.DIVIDER,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.3,
  },
  contentSection: {
    padding: 12,
  },
  title: {
    ...TYPOGRAPHY.TITLE,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  content: {
    ...TYPOGRAPHY.CONTENT,
    color: COLORS.TEXT_SECONDARY,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.DIVIDER,
    marginRight: 6,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 12,
  },
  nickname: {
    ...TYPOGRAPHY.NICKNAME,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  actionText: {
    ...TYPOGRAPHY.STAT,
    color: COLORS.TEXT_SECONDARY,
  },
  actionTextActive: {
    color: COLORS.LIKE_ACTIVE,
  },
});

export default FeedCard;
// #endregion

