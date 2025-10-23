/**
 * Service API - 服务相关API接口
 */

import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS, buildQueryParams, buildURL } from './config';
import { User } from './userApi';

// 服务类型配置
export interface ServiceTypeConfig {
  type: string;
  displayName: string;
  description: string;
  icon: string;
  category: 'game' | 'lifestyle' | 'entertainment' | 'education';
  enabled: boolean;
  sortOrder: number;
  filterOptions: Array<{
    key: string;
    name: string;
    type: 'select' | 'range' | 'checkbox';
    options?: string[];
    range?: [number, number];
  }>;
  skillLevels: string[];
  priceRange: [number, number];
}

// 服务用户筛选参数
export interface ServiceUserFilters {
  serviceType: string;
  location?: {
    city?: string;
    district?: string;
    maxDistance?: number;
  };
  skillLevel?: string;
  priceRange?: [number, number];
  rating?: number;
  isOnline?: boolean;
  availability?: {
    date?: string;
    timeSlot?: string;
  };
}

// 服务详情信息
export interface ServiceDetail {
  id: string;
  type: string;
  provider: User;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  skillLevel: string;
  price: {
    hourly: number;
    session: number;
    package?: Array<{
      name: string;
      duration: number;
      price: number;
      description: string;
    }>;
  };
  tags: string[];
  features: string[];
  requirements: string[];
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
    images?: string[];
  }>;
  availability: {
    schedule: Array<{
      dayOfWeek: number;
      timeSlots: Array<{
        start: string;
        end: string;
        available: boolean;
        price?: number;
      }>;
    }>;
    timezone: string;
  };
  statistics: {
    totalOrders: number;
    completionRate: number;
    averageRating: number;
    responseTime: number;
  };
}

// Service API类
class ServiceAPI {
  /**
   * 获取服务类型列表
   */
  async getServiceTypes(): Promise<ApiResponse<ServiceTypeConfig[]>> {
    return apiClient.get<ServiceTypeConfig[]>(API_ENDPOINTS.SERVICE.TYPES);
  }

  /**
   * 获取特定服务类型配置
   */
  async getServiceConfig(serviceType: string): Promise<ApiResponse<ServiceTypeConfig>> {
    const url = buildURL(API_ENDPOINTS.SERVICE.CONFIG, { type: serviceType });
    return apiClient.get<ServiceTypeConfig>(url);
  }

  /**
   * 获取服务类型下的用户列表
   */
  async getServiceUsers(
    serviceType: string,
    filters?: Omit<ServiceUserFilters, 'serviceType'>,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    statistics: {
      totalProviders: number;
      onlineProviders: number;
      averagePrice: number;
      averageRating: number;
    };
  }>> {
    const params = {
      ...filters,
      page: page || 1,
      limit: limit || 20,
    };
    const queryParams = buildQueryParams(params);
    const url = buildURL(API_ENDPOINTS.SERVICE.USERS, { type: serviceType });
    return apiClient.get(`${url}?${queryParams}`);
  }

  /**
   * 获取服务详情
   */
  async getServiceDetail(serviceType: string, serviceId: string): Promise<ApiResponse<ServiceDetail>> {
    const url = buildURL(API_ENDPOINTS.SERVICE.DETAIL, { type: serviceType, id: serviceId });
    return apiClient.get<ServiceDetail>(url);
  }

  /**
   * 搜索服务
   */
  async searchServices(params: {
    query: string;
    serviceType?: string;
    location?: string;
    filters?: Partial<ServiceUserFilters>;
    limit?: number;
  }): Promise<ApiResponse<{
    services: ServiceDetail[];
    users: User[];
    totalCount: number;
  }>> {
    const queryParams = buildQueryParams(params);
    return apiClient.get(`/services/search?${queryParams}`);
  }

  /**
   * 获取热门服务
   */
  async getPopularServices(params?: {
    category?: string;
    location?: string;
    timeRange?: 'day' | 'week' | 'month';
    limit?: number;
  }): Promise<ApiResponse<Array<{
    serviceType: string;
    providerCount: number;
    orderCount: number;
    averageRating: number;
    trending: boolean;
  }>>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get(`/services/popular${queryParams}`);
  }

  /**
   * 获取服务推荐
   */
  async getServiceRecommendations(params?: {
    userId?: string;
    location?: string;
    preferences?: string[];
    limit?: number;
  }): Promise<ApiResponse<{
    recommended: ServiceDetail[];
    trending: ServiceDetail[];
    nearbyProviders: User[];
  }>> {
    const queryParams = params ? `?${buildQueryParams(params)}` : '';
    return apiClient.get(`/services/recommendations${queryParams}`);
  }

  /**
   * 获取服务分类统计
   */
  async getServiceStatistics(): Promise<ApiResponse<{
    categories: Array<{
      category: string;
      serviceCount: number;
      providerCount: number;
      orderCount: number;
      averagePrice: number;
    }>;
    trends: Array<{
      serviceType: string;
      growth: number;
      popularityScore: number;
    }>;
  }>> {
    return apiClient.get('/services/statistics');
  }

  /**
   * 获取服务价格范围
   */
  async getServicePriceRange(serviceType: string, location?: string): Promise<ApiResponse<{
    min: number;
    max: number;
    average: number;
    distribution: Array<{
      range: [number, number];
      count: number;
      percentage: number;
    }>;
  }>> {
    const params = location ? { location } : {};
    const queryParams = buildQueryParams(params);
    return apiClient.get(`/services/${serviceType}/pricing?${queryParams}`);
  }

  /**
   * 清除服务相关缓存
   */
  clearServiceCache(serviceType?: string): void {
    if (serviceType) {
      const configUrl = buildURL(API_ENDPOINTS.SERVICE.CONFIG, { type: serviceType });
      const usersUrl = buildURL(API_ENDPOINTS.SERVICE.USERS, { type: serviceType });
      apiClient.deleteCache(configUrl);
      apiClient.deleteCache(usersUrl);
    } else {
      apiClient.deleteCache(API_ENDPOINTS.SERVICE.TYPES);
    }
  }
}

// 创建并导出Service API实例
export const serviceApi = new ServiceAPI();

// 导出类型
export type {
  ServiceDetail, ServiceTypeConfig,
  ServiceUserFilters
};

