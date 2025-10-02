/**
 * Homepage API - 首页相关API接口
 */

import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS, buildQueryParams } from './config';

// 首页配置数据类型
export interface HomepageConfig {
  topFunction: {
    enabled: boolean;
    showLocation: boolean;
    showSearch: boolean;
  };
  gameBanner: {
    enabled: boolean;
    autoPlay: boolean;
    interval: number;
  };
  serviceGrid: {
    enabled: boolean;
    columns: number;
    rows: number;
  };
  featuredUsers: {
    enabled: boolean;
    maxCount: number;
    refreshInterval: number;
  };
  eventCenter: {
    enabled: boolean;
    showPromo: boolean;
  };
  userList: {
    enabled: boolean;
    pageSize: number;
    infiniteScroll: boolean;
  };
}

// 精选用户数据类型
export interface FeaturedUser {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  serviceTypes: string[];
}

// 服务项目数据类型
export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  type: string;
  enabled: boolean;
  sortOrder: number;
  config: {
    displayName: string;
    description: string;
    iconUrl: string;
    backgroundColor: string;
  };
}

// 横幅数据类型
export interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gameId: string;
  actionType: 'navigate' | 'external' | 'modal';
  actionUrl: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

// 首页数据类型
export interface HomepageData {
  featuredUsers: FeaturedUser[];
  serviceItems: ServiceItem[];
  bannerData: BannerData;
  statistics: {
    totalUsers: number;
    onlineUsers: number;
    totalServices: number;
  };
}

// 首页数据请求参数
export interface HomepageDataParams {
  userId?: string;
  location?: {
    city: string;
    district?: string;
  };
  includeStatistics?: boolean;
}

// 精选用户请求参数
export interface FeaturedUsersParams {
  limit?: number;
  serviceType?: string;
  location?: string;
  refresh?: boolean;
}

// 服务配置请求参数
export interface ServiceConfigParams {
  platform?: 'ios' | 'android' | 'web';
  version?: string;
}

// 埋点事件数据类型
export interface TrackingEvent {
  page: string;
  section: string;
  action: string;
  elementId?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  extra?: Record<string, any>;
}

// Homepage API类
class HomepageAPI {
  /**
   * 获取首页配置
   */
  async getHomepageConfig(params?: ServiceConfigParams): Promise<ApiResponse<HomepageConfig>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<HomepageConfig>(`${API_ENDPOINTS.HOMEPAGE.CONFIG}${queryParams}`);
  }

  /**
   * 获取首页数据
   */
  async getHomepageData(params?: HomepageDataParams): Promise<ApiResponse<HomepageData>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<HomepageData>(`${API_ENDPOINTS.HOMEPAGE.DATA}${queryParams}`);
  }

  /**
   * 获取精选用户列表
   */
  async getFeaturedUsers(params?: FeaturedUsersParams): Promise<ApiResponse<FeaturedUser[]>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<FeaturedUser[]>(`${API_ENDPOINTS.HOMEPAGE.FEATURED_USERS}${queryParams}`);
  }

  /**
   * 获取横幅数据
   */
  async getBannerData(): Promise<ApiResponse<BannerData[]>> {
    return apiClient.get<BannerData[]>(API_ENDPOINTS.HOMEPAGE.BANNER);
  }

  /**
   * 获取服务配置列表
   */
  async getServiceItems(params?: ServiceConfigParams): Promise<ApiResponse<ServiceItem[]>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get<ServiceItem[]>(`${API_ENDPOINTS.HOMEPAGE.SERVICES}${queryParams}`);
  }

  /**
   * 刷新首页数据
   */
  async refreshHomepageData(params?: HomepageDataParams): Promise<ApiResponse<HomepageData>> {
    return apiClient.post<HomepageData>(API_ENDPOINTS.HOMEPAGE.DATA, params, {
      cache: false, // 刷新时不使用缓存
    });
  }

  /**
   * 上报页面事件
   */
  async reportPageEvent(event: TrackingEvent): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/analytics/events', event, {
      retry: false, // 埋点失败不重试
    });
  }

  /**
   * 批量上报页面事件
   */
  async reportPageEvents(events: TrackingEvent[]): Promise<ApiResponse<{ success: boolean; failed: number }>> {
    return apiClient.post<{ success: boolean; failed: number }>('/analytics/events/batch', { events }, {
      retry: false,
    });
  }

  /**
   * 获取用户个性化推荐
   */
  async getPersonalizedRecommendations(userId: string): Promise<ApiResponse<{
    featuredUsers: FeaturedUser[];
    recommendedServices: ServiceItem[];
  }>> {
    return apiClient.get<{
      featuredUsers: FeaturedUser[];
      recommendedServices: ServiceItem[];
    }>(`/homepage/recommendations/${userId}`);
  }

  /**
   * 获取热门搜索关键词
   */
  async getHotSearchKeywords(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/homepage/hot-keywords');
  }

  /**
   * 获取系统公告
   */
  async getSystemAnnouncements(): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    startTime: string;
    endTime: string;
    priority: number;
  }>>> {
    return apiClient.get('/homepage/announcements');
  }

  /**
   * 预加载首页关键资源
   */
  async preloadHomepageResources(): Promise<ApiResponse<{
    images: string[];
    config: HomepageConfig;
    criticalData: Partial<HomepageData>;
  }>> {
    return apiClient.get('/homepage/preload');
  }

  /**
   * 获取首页统计数据
   */
  async getHomepageStatistics(): Promise<ApiResponse<{
    totalUsers: number;
    onlineUsers: number;
    totalOrders: number;
    totalServices: number;
    averageRating: number;
    popularServices: Array<{
      serviceType: string;
      userCount: number;
      orderCount: number;
    }>;
  }>> {
    return apiClient.get('/homepage/statistics');
  }

  /**
   * 搜索建议
   */
  async getSearchSuggestions(query: string): Promise<ApiResponse<{
    users: Array<{ id: string; name: string; avatar: string }>;
    services: Array<{ type: string; name: string; count: number }>;
    keywords: string[];
  }>> {
    const queryParams = buildQueryParams({ q: query });
    return apiClient.get(`/homepage/search/suggestions?${queryParams}`);
  }

  /**
   * 清除首页相关缓存
   */
  clearHomepageCache(): void {
    // 清除首页相关的API缓存
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.CONFIG);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.DATA);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.FEATURED_USERS);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.BANNER);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.SERVICES);
  }
}

// 创建并导出Homepage API实例
export const homepageApi = new HomepageAPI();

// 导出类型
export type {
    BannerData, FeaturedUser, FeaturedUsersParams, HomepageConfig, HomepageData,
    HomepageDataParams, ServiceConfigParams, ServiceItem, TrackingEvent
};

