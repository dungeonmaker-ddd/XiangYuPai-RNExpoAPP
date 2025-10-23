/**
 * Discovery模块 - 数据转换工具
 * 
 * 功能：
 * - 后端API数据 → 前端展示数据
 * - FeedListItem → Feed
 * - CommentItem → Comment
 * - 时间戳转换
 * - 数据格式化
 */

import type { CommentItem, FeedListItem } from '@/services/api/discoveryApi';
import type { Comment, Feed } from '../types';

// ==================== 动态数据转换 ====================

/**
 * 将后端FeedListItem转换为前端Feed
 */
export const transformFeedListItemToFeed = (item: FeedListItem): Feed => {
  return {
    id: item.id,
    userId: item.userId,
    
    // 内容信息
    type: item.type,
    typeDesc: item.typeDesc,
    title: item.title,
    summary: item.summary,
    content: item.summary || item.title, // 列表使用summary
    coverImage: item.coverImage,
    
    // 用户信息（从冗余字段构建）
    userInfo: {
      id: item.userId,
      nickname: item.userNickname,
      avatar: item.userAvatar || '',
      isFollowed: false, // TODO: 需要从用户关系服务获取
      tags: [], // TODO: 需要从用户服务获取
    },
    
    // 媒体列表（TODO: 需要从Media服务获取）
    mediaList: item.coverImage ? [{
      id: `media-${item.id}`,
      type: 'image' as const,
      url: item.coverImage,
      width: 800,
      height: 600,
    }] : [],
    
    // 话题列表（TODO: 需要从话题关联表获取）
    topicList: [],
    
    // 地理位置（v7.1新增）
    locationName: item.locationName,
    locationAddress: item.locationAddress,
    longitude: item.longitude,
    latitude: item.latitude,
    distance: item.distance,
    cityId: item.cityId,
    
    // 旧版位置信息（兼容）
    location: item.locationName ? {
      id: `loc-${item.id}`,
      name: item.locationName,
      address: item.locationAddress || '',
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      distance: item.distance ? item.distance * 1000 : undefined, // km → m
    } : undefined,
    
    // 统计数据
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    shareCount: item.shareCount,
    collectCount: item.collectCount,
    viewCount: item.viewCount,
    
    // 用户互动状态
    isLiked: item.isLiked,
    isCollected: item.isCollected,
    
    // 时间戳
    createdAt: parseBackendDateTime(item.createdAt),
    updatedAt: Date.now(),
  };
};

/**
 * 批量转换FeedListItem列表
 */
export const transformFeedList = (items: FeedListItem[]): Feed[] => {
  return items.map(transformFeedListItemToFeed);
};

// ==================== 评论数据转换 ====================

/**
 * 将后端CommentItem转换为前端Comment
 */
export const transformCommentItemToComment = (item: CommentItem): Comment => {
  return {
    id: item.id,
    feedId: item.contentId,
    userId: item.userId,
    
    // 用户信息
    userInfo: {
      id: item.userId,
      nickname: item.userNickname,
      avatar: item.userAvatar || '',
      isFollowed: false, // TODO: 需要从用户关系服务获取
      tags: [],
    },
    
    // 评论内容
    content: item.commentText,
    
    // 回复关系
    parentId: item.parentId,
    replyTo: item.replyToId,
    replyToUserId: item.replyToUserId,
    replyToUserNickname: item.replyToUserNickname,
    replyToUser: item.replyToUserId ? {
      id: item.replyToUserId,
      nickname: item.replyToUserNickname || '',
      avatar: '',
      isFollowed: false,
      tags: [],
    } : undefined,
    
    // 统计数据
    likeCount: item.likeCount,
    replyCount: item.replyCount,
    isTop: item.isTop,
    
    // 用户互动
    isLiked: item.liked,
    
    // 二级回复（递归转换）
    replies: item.replies ? item.replies.map(transformCommentItemToComment) : [],
    totalReplies: item.totalReplies,
    hasMoreReplies: item.hasMoreReplies,
    
    // 时间
    createdAt: parseBackendDateTime(item.createdAt),
  };
};

/**
 * 批量转换评论列表
 */
export const transformCommentList = (items: CommentItem[]): Comment[] => {
  return items.map(transformCommentItemToComment);
};

// ==================== 时间转换工具 ====================

/**
 * 解析后端时间字符串为时间戳
 * 
 * 后端格式："yyyy-MM-dd HH:mm:ss"
 */
export const parseBackendDateTime = (dateTimeStr: string): number => {
  // 如果已经是时间戳，直接返回
  if (typeof dateTimeStr === 'number') {
    return dateTimeStr;
  }
  
  // 解析后端时间格式
  const date = new Date(dateTimeStr.replace(' ', 'T'));
  return date.getTime();
};

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (timestamp: number): string => {
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
 * 格式化数字（1000+ → 1k, 10000+ → 1w）
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * 格式化距离（米 → 文字描述）
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.floor(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// ==================== 导出 ====================

export const dataTransformUtils = {
  transformFeedListItemToFeed,
  transformFeedList,
  transformCommentItemToComment,
  transformCommentList,
  parseBackendDateTime,
  formatRelativeTime,
  formatNumber,
  formatDistance,
};

