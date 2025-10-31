/**
 * PostCard - 动态卡片组件
 * 
 * 显示内容：
 * - 封面图（圆角12px）
 * - 用户信息（头像24x24 + 昵称 + 时间）
 * - 统计信息（点赞数 + 评论数）
 * 
 * UI规范：
 * - 卡片圆角：12px
 * - 卡片阴影：轻微阴影
 * - 间距：内边距12px
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import type { Post } from '../../types';

// #region Types
interface PostCardProps {
  post: Post;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}
// #endregion

// #region Constants
const AVATAR_SIZE = 24;
const CARD_RADIUS = 12;
const CARD_PADDING = 12;
// #endregion

// #region Utils
// 格式化时间显示
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
};

// 格式化数字显示
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};
// #endregion

const PostCard: React.FC<PostCardProps> = ({ post, onPress, style }) => {
  // 计算图片宽高比
  const imageAspectRatio = post.coverImage ? 1 : undefined;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 封面图 */}
      {post.coverImage && (
        <Image
          source={{ uri: post.coverImage }}
          style={[
            styles.coverImage,
            imageAspectRatio && { aspectRatio: imageAspectRatio },
          ]}
          resizeMode="cover"
        />
      )}

      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 文字内容（如果没有封面图） */}
        {!post.coverImage && post.content && (
          <Text style={styles.contentText} numberOfLines={4}>
            {post.content}
          </Text>
        )}

        {/* 用户信息 */}
        <View style={styles.userInfo}>
          <Image
            source={{ uri: post.userInfo.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.nickname} numberOfLines={1}>
              {post.userInfo.nickname}
            </Text>
            <Text style={styles.timeAgo}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* 统计信息 */}
        <View style={styles.stats}>
          {/* 点赞 */}
          <View style={styles.statItem}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={post.isLiked ? '#FF4081' : '#757575'}
            />
            <Text style={[
              styles.statText,
              post.isLiked && styles.statTextLiked
            ]}>
              {formatCount(post.likeCount)}
            </Text>
          </View>

          {/* 评论 */}
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color="#757575"
            />
            <Text style={styles.statText}>
              {formatCount(post.commentCount)}
            </Text>
          </View>

          {/* 收藏 */}
          {post.isCollected && (
            <View style={styles.statItem}>
              <Ionicons
                name="star"
                size={16}
                color="#FFC107"
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: {
    width: '100%',
    minHeight: 120,
  },
  content: {
    padding: CARD_PADDING,
  },
  contentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  nickname: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: '#999999',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#757575',
  },
  statTextLiked: {
    color: '#FF4081',
  },
});

export default PostCard;

