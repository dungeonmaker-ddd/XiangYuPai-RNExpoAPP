/**
 * DetailPage - 动态详情页面
 * 
 * 功能：
 * - 完整内容展示
 * - 评论系统
 * - 点赞/收藏/分享
 * - 用户信息
 * - 举报功能
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import type { CommentItem, Feed } from '../types';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E5E5E5',
  LIKE_ACTIVE: '#FF4444',
  DIVIDER: '#F0F0F0',
} as const;

export default function DetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const feedId = params.id as string;

  // 状态
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // 加载详情
  useEffect(() => {
    loadDetail();
  }, [feedId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取详情
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      setFeed({
        id: feedId,
        title: '探店分享：这家咖啡店太绝了！',
        content: '今天打卡了市中心这家新开的咖啡店，环境超棒！咖啡味道也很正宗，特别推荐他们家的手冲咖啡。店里的装修走的是简约北欧风，非常适合拍照。服务员小姐姐也很热情，还送了小饼干。价格也很亲民，人均30-40就能喝到很不错的咖啡。强烈推荐给喜欢喝咖啡的朋友们！',
        userId: '1',
        userInfo: {
          id: '1',
          nickname: '咖啡爱好者',
          avatar: 'https://i.pravatar.cc/150?u=user1',
          isFollowed: false,
          tags: ['咖啡达人', '探店博主'],
        },
        mediaList: [
          {
            type: 'image',
            url: 'https://picsum.photos/400/300?random=1',
            thumbnailUrl: 'https://picsum.photos/200/150?random=1',
          },
          {
            type: 'image',
            url: 'https://picsum.photos/400/300?random=2',
            thumbnailUrl: 'https://picsum.photos/200/150?random=2',
          },
        ],
        topicList: [
          { name: '探店分享', id: '1' },
          { name: '咖啡', id: '2' },
        ],
        location: '深圳市南山区',
        likeCount: 128,
        commentCount: 45,
        collectCount: 32,
        shareCount: 15,
        viewCount: 1250,
        isLiked: false,
        isCollected: false,
        createdAt: Date.now() - 2 * 60 * 60 * 1000,
        updatedAt: Date.now() - 2 * 60 * 60 * 1000,
      });

      setComments([
        {
          id: '1',
          userId: '2',
          userName: '小明',
          userAvatar: 'https://i.pravatar.cc/150?u=user2',
          content: '看起来不错哦，周末去试试！',
          likeCount: 12,
          isLiked: false,
          createdAt: Date.now() - 1 * 60 * 60 * 1000,
          replyCount: 2,
        },
        {
          id: '2',
          userId: '3',
          userName: '小红',
          userAvatar: 'https://i.pravatar.cc/150?u=user3',
          content: '地址在哪里啊？',
          likeCount: 5,
          isLiked: false,
          createdAt: Date.now() - 30 * 60 * 1000,
          replyCount: 0,
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 点赞
  const handleLike = async () => {
    if (!feed) return;
    
    try {
      // TODO: 调用点赞API
      setFeed({
        ...feed,
        isLiked: !feed.isLiked,
        likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
      });
    } catch (error) {
      Alert.alert('错误', '操作失败');
    }
  };

  // 收藏
  const handleCollect = async () => {
    if (!feed) return;
    
    try {
      // TODO: 调用收藏API
      setFeed({
        ...feed,
        isCollected: !feed.isCollected,
        collectCount: feed.isCollected ? feed.collectCount - 1 : feed.collectCount + 1,
      });
    } catch (error) {
      Alert.alert('错误', '操作失败');
    }
  };

  // 分享
  const handleShare = () => {
    Alert.alert('分享', '分享功能开发中...');
  };

  // 关注用户
  const handleFollow = async () => {
    if (!feed) return;
    
    try {
      // TODO: 调用关注API
      setFeed({
        ...feed,
        userInfo: {
          ...feed.userInfo,
          isFollowed: !feed.userInfo.isFollowed,
        },
      });
    } catch (error) {
      Alert.alert('错误', '操作失败');
    }
  };

  // 发送评论
  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    
    setIsCommenting(true);
    try {
      // TODO: 调用评论API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment: CommentItem = {
        id: String(Date.now()),
        userId: 'current_user',
        userName: '我',
        userAvatar: 'https://i.pravatar.cc/150?u=current',
        content: commentText,
        likeCount: 0,
        isLiked: false,
        createdAt: Date.now(),
        replyCount: 0,
      };
      
      setComments([newComment, ...comments]);
      setCommentText('');
      
      if (feed) {
        setFeed({
          ...feed,
          commentCount: feed.commentCount + 1,
        });
      }
    } catch (error) {
      Alert.alert('错误', '发送失败');
    } finally {
      setIsCommenting(false);
    }
  };

  // 点赞评论
  const handleCommentLike = async (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
            }
          : comment
      )
    );
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
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

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}w`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (!feed) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>内容加载失败</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDetail}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>动态详情</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 用户信息 */}
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.userInfo}>
            <Image source={{ uri: feed.userInfo.avatar }} style={styles.avatar} />
            <View style={styles.userTextInfo}>
              <Text style={styles.nickname}>{feed.userInfo.nickname}</Text>
              <Text style={styles.timeText}>{formatTime(feed.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.followButton,
              feed.userInfo.isFollowed && styles.followButtonActive
            ]}
            onPress={handleFollow}
          >
            <Text style={[
              styles.followButtonText,
              feed.userInfo.isFollowed && styles.followButtonTextActive
            ]}>
              {feed.userInfo.isFollowed ? '已关注' : '+ 关注'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 标题 */}
        {feed.title && (
          <Text style={styles.title}>{feed.title}</Text>
        )}

        {/* 正文 */}
        <Text style={styles.contentText}>{feed.content}</Text>

        {/* 话题 */}
        {feed.topicList.length > 0 && (
          <View style={styles.topicList}>
            {feed.topicList.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicTag}>
                <Text style={styles.topicText}>#{topic.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 图片 */}
        {feed.mediaList.length > 0 && (
          <View style={styles.imageList}>
            {feed.mediaList.map((media, index) => (
              <Image
                key={index}
                source={{ uri: media.url }}
                style={styles.feedImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        {/* 地点 */}
        {feed.location && (
          <TouchableOpacity style={styles.locationTag}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{feed.location}</Text>
          </TouchableOpacity>
        )}

        {/* 互动数据 */}
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>{formatNumber(feed.viewCount)} 次浏览</Text>
          <Text style={styles.statsText}>·</Text>
          <Text style={styles.statsText}>{formatNumber(feed.likeCount)} 个赞</Text>
          <Text style={styles.statsText}>·</Text>
          <Text style={styles.statsText}>{formatNumber(feed.commentCount)} 条评论</Text>
        </View>

        <View style={styles.divider} />

        {/* 评论区标题 */}
        <View style={styles.commentHeader}>
          <Text style={styles.commentTitle}>全部评论 ({feed.commentCount})</Text>
        </View>

        {/* 评论列表 */}
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUserName}>{comment.userName}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
              <View style={styles.commentFooter}>
                <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
                <TouchableOpacity 
                  style={styles.commentLikeButton}
                  onPress={() => handleCommentLike(comment.id)}
                >
                  <Text style={styles.commentLikeIcon}>
                    {comment.isLiked ? '❤️' : '🤍'}
                  </Text>
                  {comment.likeCount > 0 && (
                    <Text style={styles.commentLikeText}>
                      {formatNumber(comment.likeCount)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 底部互动栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="说点什么..."
            placeholderTextColor={COLORS.TEXT_TERTIARY}
            value={commentText}
            onChangeText={setCommentText}
            onSubmitEditing={handleSendComment}
            returnKeyType="send"
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Text style={styles.actionIcon}>
              {feed.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionCount}>
              {formatNumber(feed.likeCount)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCollect}
          >
            <Text style={styles.actionIcon}>
              {feed.isCollected ? '⭐' : '☆'}
            </Text>
            <Text style={styles.actionCount}>
              {formatNumber(feed.collectCount)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionCount}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  moreButton: {
    padding: 4,
  },
  moreButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.BORDER,
  },
  userTextInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.TEXT_TERTIARY,
    marginTop: 4,
  },
  followButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonActive: {
    backgroundColor: COLORS.BORDER,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followButtonTextActive: {
    color: COLORS.TEXT_SECONDARY,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  topicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    gap: 8,
  },
  topicTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  topicText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  imageList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  feedImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
    marginBottom: 8,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
    gap: 8,
  },
  statsText: {
    fontSize: 13,
    color: COLORS.TEXT_TERTIARY,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.BACKGROUND,
  },
  commentHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.BORDER,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentTime: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeIcon: {
    fontSize: 16,
  },
  commentLikeText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  commentInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  commentInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionCount: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
});

