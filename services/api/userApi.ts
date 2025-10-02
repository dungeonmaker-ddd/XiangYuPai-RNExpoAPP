/**
 * User API - 用户相关API接口
 */

import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS, buildQueryParams, buildURL } from './config';

// 用户基础信息类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: {
    city: string;
    district: string;
    distance?: number;
  };
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  lastActiveTime: string;
  serviceTypes: string[];
  description: string;
  images: string[];
  skills: Array<{
    type: string;
    level: string;
    price: number;
    description: string;
  }>;
  certification: {
    verified: boolean;
    idVerified: boolean;
    phoneVerified: boolean;
    wechatVerified: boolean;
  };
  statistics: {
    totalOrders: number;
    completionRate: number;
    averageResponseTime: number;
    positiveRate: number;
  };
}

// 用户列表请求参数
export interface UserListParams {
  page?: number;
  limit?: number;
  location?: {
    city?: string;
    district?: string;
    maxDistance?: number;
  };
  filters?: {
    serviceType?: string;
    gender?: string;
    ageRange?: [number, number];
    priceRange?: [number, number];
    rating?: number;
    isOnline?: boolean;
    verified?: boolean;
  };
  sortBy?: 'price' | 'rating' | 'distance' | 'lastActive' | 'completionRate';
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
}

// 用户列表响应类型
export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    applied: Record<string, any>;
    available: {
      serviceTypes: Array<{ type: string; name: string; count: number }>;
      cities: Array<{ city: string; count: number }>;
      priceRanges: Array<{ range: [number, number]; count: number }>;
    };
  };
}

// 用户搜索参数
export interface UserSearchParams {
  query: string;
  filters?: UserListParams['filters'];
  location?: UserListParams['location'];
  limit?: number;
}

// 用户搜索响应类型
export interface UserSearchResponse {
  users: User[];
  suggestions: string[];
  totalCount: number;
  searchTime: number;
}

// 用户详情扩展信息
export interface UserDetailInfo extends User {
  portfolio: {
    images: string[];
    videos: string[];
    achievements: Array<{
      title: string;
      description: string;
      date: string;
      image?: string;
    }>;
  };
  availability: {
    schedule: Array<{
      dayOfWeek: number; // 0-6
      timeSlots: Array<{
        start: string; // HH:mm
        end: string; // HH:mm
        available: boolean;
      }>;
    }>;
    timezone: string;
    autoAccept: boolean;
  };
  preferences: {
    serviceTypes: string[];
    workingHours: {
      start: string;
      end: string;
    };
    maxDistance: number;
    languages: string[];
  };
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    serviceType: string;
    orderDate: string;
    images?: string[];
  }>;
  socialInfo: {
    followersCount: number;
    followingCount: number;
    likesCount: number;
    isFollowing: boolean;
    mutualFollowers: User[];
  };
}

// 用户推荐参数
export interface UserRecommendationParams {
  userId?: string;
  serviceType?: string;
  location?: {
    city: string;
    district?: string;
  };
  limit?: number;
  excludeIds?: string[];
}

// 用户关注/取消关注参数
export interface FollowUserParams {
  targetUserId: string;
  action: 'follow' | 'unfollow';
}

// 用户收藏/取消收藏参数
export interface FavoriteUserParams {
  targetUserId: string;
  action: 'favorite' | 'unfavorite';
}

// 举报用户参数
export interface ReportUserParams {
  targetUserId: string;
  reason: string;
  description?: string;
  evidence?: string[];
}

// User API类
class UserAPI {
  /**
   * 获取用户列表
   */
  async getUserList(params?: UserListParams): Promise<ApiResponse<UserListResponse>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<UserListResponse>(`${API_ENDPOINTS.USER.LIST}${queryParams}`);
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(userId: string): Promise<ApiResponse<UserDetailInfo>> {
    const url = buildURL(API_ENDPOINTS.USER.DETAIL, { id: userId });
    return apiClient.get<UserDetailInfo>(url);
  }

  /**
   * 搜索用户
   */
  async searchUsers(params: UserSearchParams): Promise<ApiResponse<UserSearchResponse>> {
    const queryParams = buildQueryParams(params);
    return apiClient.get<UserSearchResponse>(`${API_ENDPOINTS.USER.SEARCH}?${queryParams}`);
  }

  /**
   * 筛选用户
   */
  async filterUsers(filters: UserListParams['filters']): Promise<ApiResponse<UserListResponse>> {
    return apiClient.post<UserListResponse>(API_ENDPOINTS.USER.FILTER, { filters });
  }

  /**
   * 获取用户推荐
   */
  async getUserRecommendations(params?: UserRecommendationParams): Promise<ApiResponse<User[]>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<User[]>(`${API_ENDPOINTS.USER.RECOMMENDATIONS}${queryParams}`);
  }

  /**
   * 获取收藏的用户列表
   */
  async getFavoriteUsers(page: number = 1, limit: number = 20): Promise<ApiResponse<UserListResponse>> {
    const queryParams = buildQueryParams({ page, limit });
    return apiClient.get<UserListResponse>(`${API_ENDPOINTS.USER.FAVORITES}?${queryParams}`);
  }

  /**
   * 关注/取消关注用户
   */
  async followUser(params: FollowUserParams): Promise<ApiResponse<{ success: boolean; followersCount: number }>> {
    return apiClient.post<{ success: boolean; followersCount: number }>('/users/follow', params);
  }

  /**
   * 收藏/取消收藏用户
   */
  async favoriteUser(params: FavoriteUserParams): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/users/favorite', params);
  }

  /**
   * 获取用户评价列表
   */
  async getUserReviews(userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{
    reviews: UserDetailInfo['reviews'];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    statistics: {
      averageRating: number;
      ratingDistribution: Record<string, number>;
      totalReviews: number;
    };
  }>> {
    const queryParams = buildQueryParams({ page, limit });
    return apiClient.get(`/users/${userId}/reviews?${queryParams}`);
  }

  /**
   * 获取用户的相似推荐
   */
  async getSimilarUsers(userId: string, limit: number = 10): Promise<ApiResponse<User[]>> {
    const queryParams = buildQueryParams({ limit });
    return apiClient.get<User[]>(`/users/${userId}/similar?${queryParams}`);
  }

  /**
   * 获取用户的关注列表
   */
  async getUserFollowing(userId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }>> {
    const queryParams = buildQueryParams({ page, limit });
    return apiClient.get(`/users/${userId}/following?${queryParams}`);
  }

  /**
   * 获取用户的粉丝列表
   */
  async getUserFollowers(userId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }>> {
    const queryParams = buildQueryParams({ page, limit });
    return apiClient.get(`/users/${userId}/followers?${queryParams}`);
  }

  /**
   * 举报用户
   */
  async reportUser(params: ReportUserParams): Promise<ApiResponse<{ success: boolean; reportId: string }>> {
    return apiClient.post<{ success: boolean; reportId: string }>('/users/report', params);
  }

  /**
   * 拉黑用户
   */
  async blockUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/users/block', { userId });
  }

  /**
   * 取消拉黑用户
   */
  async unblockUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/users/unblock', { userId });
  }

  /**
   * 获取拉黑列表
   */
  async getBlockedUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users/blocked');
  }

  /**
   * 获取热门用户
   */
  async getHotUsers(params?: {
    serviceType?: string;
    location?: string;
    timeRange?: 'day' | 'week' | 'month';
    limit?: number;
  }): Promise<ApiResponse<User[]>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<User[]>(`/users/hot${queryParams}`);
  }

  /**
   * 获取新用户
   */
  async getNewUsers(params?: {
    serviceType?: string;
    location?: string;
    limit?: number;
  }): Promise<ApiResponse<User[]>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<User[]>(`/users/new${queryParams}`);
  }

  /**
   * 检查用户可用性
   */
  async checkUserAvailability(userId: string, timeSlot?: {
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<ApiResponse<{
    available: boolean;
    nextAvailableTime?: string;
    suggestedTimes?: string[];
  }>> {
    const params = timeSlot ? { timeSlot } : {};
    return apiClient.post(`/users/${userId}/availability`, params);
  }

  /**
   * 预约用户服务
   */
  async bookUserService(params: {
    userId: string;
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
    message?: string;
    requirements?: string;
  }): Promise<ApiResponse<{
    orderId: string;
    status: string;
    estimatedPrice: number;
  }>> {
    return apiClient.post('/orders/create', params);
  }

  /**
   * 清除用户相关缓存
   */
  clearUserCache(userId?: string): void {
    if (userId) {
      const detailUrl = buildURL(API_ENDPOINTS.USER.DETAIL, { id: userId });
      apiClient.deleteCache(detailUrl);
    } else {
      apiClient.deleteCache(API_ENDPOINTS.USER.LIST);
      apiClient.deleteCache(API_ENDPOINTS.USER.RECOMMENDATIONS);
      apiClient.deleteCache(API_ENDPOINTS.USER.FAVORITES);
    }
  }
}

// 创建并导出User API实例
export const userApi = new UserAPI();

// 导出类型
export type {
    FavoriteUserParams, FollowUserParams, ReportUserParams, User, UserDetailInfo, UserListParams,
    UserListResponse, UserRecommendationParams, UserSearchParams,
    UserSearchResponse
};

