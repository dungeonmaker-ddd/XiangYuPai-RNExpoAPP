/**
 * Discovery API Service - 发现页面API服务
 * 
 * 功能：
 * - 动态流获取（关注/热门/同城）
 * - 动态详情查询
 * - 评论管理
 * - 互动操作（点赞/收藏/分享）
 * - 话题管理
 * 
 * 后端对接：
 * - xypai-content模块（ContentController）
 * - xypai-content模块（CommentController）
 * - xypai-content模块（ContentActionController）
 */

import type { ApiResponse } from './client';
import { apiClient } from './client';
import { API_ENDPOINTS, buildQueryParams, buildURL } from './config';

// ==================== 类型定义 ====================

/**
 * 动态列表查询参数
 */
export interface FeedListParams {
  tab: 'follow' | 'hot' | 'local';  // Tab类型
  page?: number;                     // 页码
  pageSize?: number;                 // 每页数量
  type?: number;                     // 内容类型(1=动态,2=活动,3=技能)
  refresh?: boolean;                 // 是否刷新
  
  // 同城Tab专用参数
  longitude?: number;                // 经度
  latitude?: number;                 // 纬度
  radius?: number;                   // 半径(米)
  cityId?: number;                   // 城市ID
}

/**
 * 动态详情响应
 */
export interface FeedDetail {
  id: string;
  userId: string;
  type: number;
  typeDesc: string;
  title: string;
  content: string;
  coverUrl?: string;
  
  // 地理位置信息
  locationName?: string;
  locationAddress?: string;
  longitude?: number;
  latitude?: number;
  cityId?: number;
  
  // 用户信息（冗余字段）
  userNickname: string;
  userAvatar?: string;
  
  // 统计数据
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  
  // 用户互动状态
  isLiked: boolean;
  isCollected: boolean;
  
  // 时间信息
  createdAt: string;
  updatedAt: string;
}

/**
 * 动态列表项
 */
export interface FeedListItem {
  id: string;
  userId: string;
  type: number;
  typeDesc: string;
  title: string;
  summary?: string;
  coverImage?: string;
  
  // 地理位置
  locationName?: string;
  locationAddress?: string;
  longitude?: number;
  latitude?: number;
  distance?: number;  // 距离(km)
  
  // 用户信息
  userNickname: string;
  userAvatar?: string;
  
  // 统计数据
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  viewCount: number;
  
  // 用户状态
  isLiked: boolean;
  isCollected: boolean;
  
  createdAt: string;
}

/**
 * 动态列表响应
 */
export interface FeedListResponse {
  list: FeedListItem[];
  total: number;
  hasMore: boolean;
}

/**
 * 评论列表参数
 */
export interface CommentListParams {
  contentId: number;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 评论项
 */
export interface CommentItem {
  id: string;
  contentId: string;
  userId: string;
  userNickname: string;
  userAvatar?: string;
  parentId?: string;
  replyToId?: string;
  replyToUserId?: string;
  replyToUserNickname?: string;
  commentText: string;
  likeCount: number;
  replyCount: number;
  isTop: boolean;
  liked: boolean;
  createdAt: string;
  
  // 二级回复
  replies?: CommentItem[];
  totalReplies?: number;
  hasMoreReplies?: boolean;
}

/**
 * 添加评论请求
 */
export interface AddCommentRequest {
  contentId: number;
  parentId?: number;
  replyToId?: number;
  replyToUserId?: number;
  commentText: string;
}

/**
 * 互动操作请求
 */
export interface InteractionRequest {
  action: 'like' | 'unlike' | 'collect' | 'uncollect' | 'share';
  contentId: number;
}

// ==================== API方法 ====================

/**
 * 获取动态流列表
 */
export const getFeedList = async (
  params: FeedListParams
): Promise<ApiResponse<FeedListResponse>> => {
  const { tab, page = 1, pageSize = 20, type, refresh, longitude, latitude, radius, cityId } = params;
  
  // 根据Tab类型选择不同的接口
  if (tab === 'local' && longitude && latitude) {
    // 同城Tab：使用附近内容查询（空间索引）
    const queryParams = buildQueryParams({
      longitude,
      latitude,
      radius: radius || 5000,  // 默认5km
      type,
      limit: pageSize,
    });
    
    const endpoint = `${API_ENDPOINTS.CONTENT.NEARBY}?${queryParams}`;
    return apiClient.get<FeedListResponse>(endpoint, {
      cache: !refresh,
      cacheTTL: 3 * 60 * 1000, // 3分钟缓存
    });
  }
  
  if (tab === 'local' && cityId) {
    // 同城Tab：使用城市内容查询
    const queryParams = buildQueryParams({
      type,
      limit: pageSize,
    });
    
    const endpoint = buildURL(API_ENDPOINTS.CONTENT.BY_CITY, { cityId: String(cityId) });
    return apiClient.get<FeedListResponse>(`${endpoint}?${queryParams}`, {
      cache: !refresh,
      cacheTTL: 3 * 60 * 1000,
    });
  }
  
  if (tab === 'hot') {
    // 热门Tab：使用热门内容接口
    const queryParams = buildQueryParams({
      type,
      limit: pageSize,
    });
    
    return apiClient.get<FeedListResponse>(`${API_ENDPOINTS.CONTENT.HOT}?${queryParams}`, {
      cache: !refresh,
      cacheTTL: 5 * 60 * 1000, // 5分钟缓存
    });
  }
  
  if (tab === 'follow') {
    // 关注Tab：使用推荐内容接口（TODO：后续需要后端提供专门的关注流接口）
    const queryParams = buildQueryParams({
      type,
      limit: pageSize,
    });
    
    return apiClient.get<FeedListResponse>(`${API_ENDPOINTS.CONTENT.RECOMMENDED}?${queryParams}`, {
      cache: !refresh,
      cacheTTL: 2 * 60 * 1000,
    });
  }
  
  // 默认：使用通用列表接口
  const queryParams = buildQueryParams({
    type,
    page,
    pageSize,
  });
  
  return apiClient.get<FeedListResponse>(`${API_ENDPOINTS.CONTENT.LIST}?${queryParams}`, {
    cache: !refresh,
  });
};

/**
 * 获取动态详情
 */
export const getFeedDetail = async (
  contentId: number
): Promise<ApiResponse<FeedDetail>> => {
  const endpoint = buildURL(API_ENDPOINTS.CONTENT.DETAIL, { contentId: String(contentId) });
  
  return apiClient.get<FeedDetail>(endpoint, {
    cache: true,
    cacheTTL: 5 * 60 * 1000,
  });
};

/**
 * 获取评论列表
 */
export const getCommentList = async (
  params: CommentListParams
): Promise<ApiResponse<CommentItem[]>> => {
  const { contentId, pageNum = 1, pageSize = 20 } = params;
  
  const queryParams = buildQueryParams({ pageNum, pageSize });
  const endpoint = buildURL(API_ENDPOINTS.COMMENT.LIST, { contentId: String(contentId) });
  
  return apiClient.get<CommentItem[]>(`${endpoint}?${queryParams}`, {
    cache: true,
    cacheTTL: 1 * 60 * 1000, // 1分钟缓存
  });
};

/**
 * 添加评论
 */
export const addComment = async (
  request: AddCommentRequest
): Promise<ApiResponse<number>> => {
  return apiClient.post<number>(API_ENDPOINTS.COMMENT.ADD, request);
};

/**
 * 点赞动态
 */
export const likeFeed = async (
  contentId: number
): Promise<ApiResponse<void>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.LIKE, { contentId: String(contentId) });
  return apiClient.post<void>(endpoint, {});
};

/**
 * 取消点赞
 */
export const unlikeFeed = async (
  contentId: number
): Promise<ApiResponse<void>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.UNLIKE, { contentId: String(contentId) });
  return apiClient.delete<void>(endpoint);
};

/**
 * 收藏动态
 */
export const collectFeed = async (
  contentId: number
): Promise<ApiResponse<void>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.COLLECT, { contentId: String(contentId) });
  return apiClient.post<void>(endpoint, {});
};

/**
 * 取消收藏
 */
export const uncollectFeed = async (
  contentId: number
): Promise<ApiResponse<void>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.UNCOLLECT, { contentId: String(contentId) });
  return apiClient.delete<void>(endpoint);
};

/**
 * 分享动态
 */
export const shareFeed = async (
  contentId: number
): Promise<ApiResponse<void>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.SHARE, { contentId: String(contentId) });
  return apiClient.post<void>(endpoint, {});
};

/**
 * 评论点赞
 */
export const likeComment = async (
  commentId: number
): Promise<ApiResponse<boolean>> => {
  const endpoint = buildURL(API_ENDPOINTS.COMMENT.LIKE, { commentId: String(commentId) });
  return apiClient.post<boolean>(endpoint, {});
};

/**
 * 搜索内容
 */
export const searchFeeds = async (
  keyword: string,
  type?: number
): Promise<ApiResponse<FeedListItem[]>> => {
  const queryParams = buildQueryParams({ keyword, type });
  
  return apiClient.get<FeedListItem[]>(`${API_ENDPOINTS.CONTENT.SEARCH}?${queryParams}`, {
    cache: true,
    cacheTTL: 2 * 60 * 1000,
  });
};

/**
 * 获取用户的动态列表
 */
export const getUserFeeds = async (
  userId: number,
  type?: number
): Promise<ApiResponse<FeedListItem[]>> => {
  const endpoint = buildURL(API_ENDPOINTS.CONTENT.USER_CONTENTS, { userId: String(userId) });
  const queryParams = buildQueryParams({ type });
  
  return apiClient.get<FeedListItem[]>(`${endpoint}?${queryParams}`, {
    cache: true,
    cacheTTL: 3 * 60 * 1000,
  });
};

/**
 * 检查用户对动态的互动状态
 */
export const checkFeedActionStatus = async (
  contentId: number
): Promise<ApiResponse<{ liked: boolean; collected: boolean }>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.STATUS, { contentId: String(contentId) });
  return apiClient.get<{ liked: boolean; collected: boolean }>(endpoint);
};

/**
 * 获取动态统计数据
 */
export const getFeedStatistics = async (
  contentId: number
): Promise<ApiResponse<{
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  viewCount: number;
}>> => {
  const endpoint = buildURL(API_ENDPOINTS.INTERACTION.STATISTICS, { contentId: String(contentId) });
  return apiClient.get(endpoint);
};

// ==================== 导出 ====================

export const discoveryApi = {
  getFeedList,
  getFeedDetail,
  getCommentList,
  addComment,
  likeFeed,
  unlikeFeed,
  collectFeed,
  uncollectFeed,
  shareFeed,
  likeComment,
  searchFeeds,
  getUserFeeds,
  checkFeedActionStatus,
  getFeedStatistics,
};

