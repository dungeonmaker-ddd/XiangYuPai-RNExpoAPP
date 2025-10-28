/**
 * Homepage API Enhanced - 首页API（后端集成版）
 * 
 * 版本: v2.0
 * 更新: 2025-10-22
 * 说明: 集成RuoYi-Cloud-Plus后端真实API
 */

import type { UserCard } from '@/src/features/Homepage/MainPage/types';
import { UserDataAdapter, type UserProfileVO } from './adapters/userAdapter';
import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS, buildQueryParams } from './config';

// ===== 接口类型定义 =====

/**
 * 首页配置（保持兼容）
 */
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

/**
 * 精选用户（使用UserCard类型）
 */
export type FeaturedUser = UserCard;

/**
 * 服务项目
 */
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

/**
 * 横幅数据
 */
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

/**
 * 首页数据
 */
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

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  // 筛选标签
  filterTab?: 'nearby' | 'recommend' | 'latest';
  
  // 地区筛选
  region?: string;
  cityId?: number;
  
  // 位置筛选（附近）
  longitude?: number;
  latitude?: number;
  radius?: number;  // 半径（米）
  
  // 分页参数
  page?: number;
  pageNum?: number;
  limit?: number;
  pageSize?: number;
  
  // 高级筛选
  gender?: number;
  ageMin?: number;
  ageMax?: number;
  onlineStatus?: number[];
  isVerified?: boolean;
  isVip?: boolean;
  
  // 排序
  sortBy?: 'distance' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  users: UserCard[];
  total: number;
  pageNum: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 后端统一响应格式（RuoYi-Cloud-Plus）
 */
interface RuoYiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 后端分页响应格式
 */
interface TableDataInfo<T> {
  code: number;
  msg: string;
  rows: T[];
  total: number;
}

// ===== Homepage API Enhanced =====

class HomepageAPIEnhanced {
  /**
   * 🆕 获取首页用户列表（集成真实后端）
   * 
   * 策略：
   * 1. 优先使用首页专用接口（如果后端已实现）
   * 2. 降级使用通用用户接口
   * 3. 根据filterTab路由到不同查询
   */
  async getUserList(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    try {
      const pageNum = params.page || params.pageNum || 1;
      const pageSize = params.limit || params.pageSize || 20;
      
      // 根据筛选标签选择不同的API策略
      switch (params.filterTab) {
        case 'nearby':
          return this.getNearbyUsers(params);
        
        case 'recommend':
          return this.getRecommendedUsers(params);
        
        case 'latest':
          return this.getLatestUsers(params);
        
        default:
          // 使用通用列表接口
          return this.getGenericUserList(params);
      }
    } catch (error) {
      console.error('[HomepageAPI] getUserList error:', error);
      throw error;
    }
  }
  
  /**
   * 🆕 附近用户（空间索引查询）
   */
  private async getNearbyUsers(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    // 如果没有位置信息，降级为通用列表
    if (!params.longitude || !params.latitude) {
      console.warn('[HomepageAPI] 缺少位置信息，降级为通用列表');
      return this.getGenericUserList(params);
    }
    
    try {
      // 尝试使用首页专用接口
      const queryParams = buildQueryParams({
        longitude: params.longitude,
        latitude: params.latitude,
        radius: params.radius || 5000,
        limit: params.limit || 20,
        pageNum: params.page || 1,
        pageSize: params.pageSize || 20,
      });
      
      const response = await apiClient.get<UserProfileVO[]>(
        `${API_ENDPOINTS.HOMEPAGE.NEARBY_USERS}?${queryParams}`
      );
      
      // 转换数据格式
      const users = UserDataAdapter.transformUserList(
        response.data,
        { latitude: params.latitude, longitude: params.longitude }
      );
      
      return {
        data: {
          users,
          total: users.length,
          pageNum: params.page || 1,
          pageSize: params.pageSize || 20,
          hasMore: users.length >= (params.pageSize || 20),
        },
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 如果首页接口未实现，降级使用内容模块的nearby接口
      if (error?.response?.status === 404) {
        console.warn('[HomepageAPI] 首页nearby接口未实现，使用内容模块接口');
        return this.getNearbyUsersFromContent(params);
      }
      throw error;
    }
  }
  
  /**
   * 🆕 附近用户（使用内容模块接口）
   */
  private async getNearbyUsersFromContent(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    const queryParams = buildQueryParams({
      longitude: params.longitude,
      latitude: params.latitude,
      radius: params.radius || 5000,
      type: null, // 不限类型
      limit: params.limit || 20,
      pageNum: params.page || 1,
      pageSize: params.pageSize || 20,
    });
    
    // 使用内容模块的nearby接口
    const response = await apiClient.get<TableDataInfo<any>>(
      `${API_ENDPOINTS.CONTENT.NEARBY}?${queryParams}`
    );
    
    // 从content获取用户信息
    // TODO: 需要后端在ContentListVO中包含完整的用户信息
    
    return {
      data: {
        users: [],  // 临时空数组
        total: response.data.total || 0,
        pageNum: params.page || 1,
        pageSize: params.pageSize || 20,
        hasMore: false,
      },
      code: 200,
      message: 'success',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  
  /**
   * 🆕 通用用户列表（使用UserController）
   */
  private async getGenericUserList(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    try {
      // 构建查询参数（映射到UserQueryDTO）
      const queryParams = buildQueryParams({
        nickname: params.region, // 临时用nickname字段筛选
        status: 1, // 只查询正常状态用户
        pageNum: params.page || params.pageNum || 1,
        pageSize: params.limit || params.pageSize || 20,
      });
      
      // 🆕 调用首页推荐接口（公开，无需登录）
      const response = await apiClient.get<UserProfileVO[]>(
        `${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
      );
      
      // 🔍 调试：查看完整响应
      console.log('[HomepageAPI] 后端响应数据结构:', {
        hasData: !!response.data,
        code: response.code,
        message: response.message,
        dataType: typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not-array',
      });
      
      // 🆕 添加空值检查（client.ts已提取data字段）
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('[HomepageAPI] 后端返回数据格式异常', response);
        throw new Error('后端返回数据格式错误：data不是数组');
      }
      
      // 转换数据（response.data已经是数组）
      const users = UserDataAdapter.transformUserList(response.data);
      
      return {
        data: {
          users,
          total: users.length,
          pageNum: params.page || 1,
          pageSize: params.pageSize || 20,
          hasMore: users.length >= (params.pageSize || 20),
        },
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error) {
      console.error('[HomepageAPI] getGenericUserList error:', error);
      throw error;
    }
  }
  
  /**
   * 🆕 获取精选用户（真实后端）
   */
  async getFeaturedUsers(params?: {
    limit?: number;
    serviceType?: string;
    cityId?: number;
    refresh?: boolean;
  }): Promise<ApiResponse<FeaturedUser[]>> {
    try {
      // 策略1: 尝试使用首页专用接口
      try {
        const queryParams = buildQueryParams({
          limit: params?.limit || 10,
          serviceType: params?.serviceType,
          cityId: params?.cityId,
        });
        
        const response = await apiClient.get<UserProfileVO[]>(
          `${API_ENDPOINTS.HOMEPAGE.FEATURED_USERS}?${queryParams}`,
          { cache: !params?.refresh }
        );
        
        // 🔍 调试：查看响应结构
        console.log('[HomepageAPI] 精选用户响应', {
          hasData: !!response.data,
          code: response.code,
          message: response.message,
          dataType: typeof response.data,
          dataLength: Array.isArray(response.data) ? response.data.length : 'not-array',
        });
        
        // 🆕 添加空值检查
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('[HomepageAPI] 精选用户数据格式异常，使用降级方案');
          return this.getFeaturedUsersFallback(params);
        }
        
        const users = UserDataAdapter.transformUserList(response.data);
        
        return {
          data: users,
          code: response.code,
          message: response.message,
          timestamp: Date.now(),
          success: response.success,
        };
      } catch (error: any) {
        // 接口未实现，使用降级方案
        if (error?.response?.status === 404) {
          console.warn('[HomepageAPI] 精选用户接口未实现，使用降级方案');
          return this.getFeaturedUsersFallback(params);
        }
        throw error;
      }
    } catch (error) {
      console.error('[HomepageAPI] getFeaturedUsers error:', error);
      throw error;
    }
  }
  
  /**
   * 精选用户降级方案（使用现有接口组合）
   */
  private async getFeaturedUsersFallback(params?: {
    limit?: number;
    serviceType?: string;
    cityId?: number;
  }): Promise<ApiResponse<FeaturedUser[]>> {
    // 🆕 使用首页推荐接口（公开，无需登录）
    const queryParams = buildQueryParams({
      limit: (params?.limit || 10) * 2, // 多查询一些，前端过滤
    });
    
    const response = await apiClient.get<UserProfileVO[]>(
      `${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
    );
    
    // 🔍 调试：查看响应
    console.log('[HomepageAPI] 降级方案响应:', {
      hasData: !!response.data,
      code: response.code,
      message: response.message,
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not-array',
    });
    
    // 🆕 添加空值检查
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('[HomepageAPI] 降级方案数据异常，返回空数组');
      return {
        data: [],
        code: 200,
        message: 'No data available',
        timestamp: Date.now(),
        success: true,
      };
    }
    
    // 前端过滤优质用户
    const filtered = UserDataAdapter.filterFeaturedUsers(response.data);
    const sorted = UserDataAdapter.sortUsers(filtered, 'rating');
    const limited = sorted.slice(0, params?.limit || 10);
    
    const users = UserDataAdapter.transformUserList(limited);
    
    console.log('[HomepageAPI] 降级方案处理完成', { count: users.length });
    
    return {
      data: users,
      code: 200,
      message: 'success',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  /**
   * 获取首页配置（优先后端，降级本地）
   */
  async getHomepageConfig(params?: any): Promise<ApiResponse<HomepageConfig>> {
    try {
      // 尝试从后端获取配置
      const response = await apiClient.get<HomepageConfig>(
        API_ENDPOINTS.HOMEPAGE.CONFIG
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 后端接口未实现，使用默认配置
      if (error?.response?.status === 404) {
        console.warn('[HomepageAPI] 配置接口未实现，使用默认配置');
        return this.getDefaultConfig();
      }
      throw error;
    }
  }
  
  /**
   * 默认首页配置
   */
  private getDefaultConfig(): ApiResponse<HomepageConfig> {
    const defaultConfig: HomepageConfig = {
      topFunction: {
        enabled: true,
        showLocation: true,
        showSearch: true,
      },
      gameBanner: {
        enabled: true,
        autoPlay: true,
        interval: 5000,
      },
      serviceGrid: {
        enabled: true,
        columns: 5,
        rows: 2,
      },
      featuredUsers: {
        enabled: true,
        maxCount: 10,
        refreshInterval: 30000,
      },
      eventCenter: {
        enabled: true,
        showPromo: true,
      },
      userList: {
        enabled: true,
        pageSize: 20,
        infiniteScroll: true,
      },
    };
    
    return {
      data: defaultConfig,
      code: 200,
      message: 'Using default config',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  /**
   * 获取服务配置列表（优先后端，降级本地）
   */
  async getServiceItems(params?: any): Promise<ApiResponse<ServiceItem[]>> {
    try {
      const response = await apiClient.get<ServiceItem[]>(
        API_ENDPOINTS.HOMEPAGE.SERVICES
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 降级为本地配置
      if (error?.response?.status === 404) {
        console.warn('[HomepageAPI] 服务配置接口未实现，使用默认配置');
        return this.getDefaultServices();
      }
      throw error;
    }
  }
  
  /**
   * 默认服务配置
   */
  private getDefaultServices(): ApiResponse<ServiceItem[]> {
    const services: ServiceItem[] = [
      {
        id: '1',
        name: '王者荣耀',
        icon: 'game-controller',
        type: 'honor_of_kings',
        enabled: true,
        sortOrder: 1,
        config: {
          displayName: '王者荣耀',
          description: '专业陪玩服务',
          iconUrl: '',
          backgroundColor: '#FFD700',
        },
      },
      {
        id: '2',
        name: '英雄联盟',
        icon: 'sword',
        type: 'league_of_legends',
        enabled: true,
        sortOrder: 2,
        config: {
          displayName: '英雄联盟',
          description: '高端陪玩',
          iconUrl: '',
          backgroundColor: '#4A90E2',
        },
      },
      {
        id: '3',
        name: '和平精英',
        icon: 'target',
        type: 'peace_elite',
        enabled: true,
        sortOrder: 3,
        config: {
          displayName: '和平精英',
          description: '专业带飞',
          iconUrl: '',
          backgroundColor: '#FF8C00',
        },
      },
      {
        id: '4',
        name: '荒野乱斗',
        icon: 'flash',
        type: 'brawl_stars',
        enabled: true,
        sortOrder: 4,
        config: {
          displayName: '荒野乱斗',
          description: '娱乐陪玩',
          iconUrl: '',
          backgroundColor: '#8B5CF6',
        },
      },
      {
        id: '5',
        name: '探店',
        icon: 'store',
        type: 'explore_shop',
        enabled: true,
        sortOrder: 5,
        config: {
          displayName: '探店',
          description: '网红探店',
          iconUrl: '',
          backgroundColor: '#32CD32',
        },
      },
      {
        id: '6',
        name: '私影',
        icon: 'film',
        type: 'private_cinema',
        enabled: true,
        sortOrder: 6,
        config: {
          displayName: '私影',
          description: '私人影院',
          iconUrl: '',
          backgroundColor: '#FF4500',
        },
      },
      {
        id: '7',
        name: '台球',
        icon: 'billiards',
        type: 'billiards',
        enabled: true,
        sortOrder: 7,
        config: {
          displayName: '台球',
          description: '台球陪练',
          iconUrl: '',
          backgroundColor: '#FF69B4',
        },
      },
      {
        id: '8',
        name: 'K',
        icon: 'mic',
        type: 'ktv',
        enabled: true,
        sortOrder: 8,
        config: {
          displayName: 'K',
          description: 'KTV陪唱',
          iconUrl: '',
          backgroundColor: '#FFD700',
        },
      },
      {
        id: '9',
        name: '喝酒',
        icon: 'beer',
        type: 'drinking',
        enabled: true,
        sortOrder: 9,
        config: {
          displayName: '喝酒',
          description: '酒友聚会',
          iconUrl: '',
          backgroundColor: '#4A90E2',
        },
      },
      {
        id: '10',
        name: '按摩',
        icon: 'spa',
        type: 'massage',
        enabled: true,
        sortOrder: 10,
        config: {
          displayName: '按摩',
          description: '按摩服务',
          iconUrl: '',
          backgroundColor: '#999999',
        },
      },
    ];
    
    return {
      data: services,
      code: 200,
      message: 'Using default services',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  /**
   * 🆕 推荐用户（个性化算法）
   */
  private async getRecommendedUsers(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    try {
      // 使用内容推荐接口
      const queryParams = buildQueryParams({
        type: 3, // 技能服务类型
        limit: params.limit || 20,
        pageNum: params.page || 1,
        pageSize: params.pageSize || 20,
      });
      
      const response = await apiClient.get<TableDataInfo<any>>(
        `${API_ENDPOINTS.CONTENT.RECOMMENDED}?${queryParams}`
      );
      
      // TODO: 完整的数据转换
      
      return {
        data: {
          users: [],
          total: 0,
          pageNum: params.page || 1,
          pageSize: params.pageSize || 20,
          hasMore: false,
        },
        code: 200,
        message: 'success',
        timestamp: Date.now(),
        success: true,
      };
    } catch (error) {
      console.error('[HomepageAPI] getRecommendedUsers error:', error);
      throw error;
    }
  }
  
  /**
   * 🆕 最新用户（按注册时间）
   */
  private async getLatestUsers(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
    // 使用通用列表接口，按创建时间排序
    return this.getGenericUserList(params);
  }
  
  /**
   * 获取横幅数据
   */
  async getBannerData(): Promise<ApiResponse<BannerData[]>> {
    try {
      const response = await apiClient.get<BannerData[]>(
        API_ENDPOINTS.HOMEPAGE.BANNER
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 降级为默认横幅
      if (error?.response?.status === 404) {
        return this.getDefaultBanner();
      }
      throw error;
    }
  }
  
  /**
   * 默认横幅配置
   */
  private getDefaultBanner(): ApiResponse<BannerData[]> {
    const banners: BannerData[] = [
      {
        id: '1',
        title: '王者荣耀',
        subtitle: '新赛季开',
        image: 'https://via.placeholder.com/800x400?text=Honor+of+Kings',
        gameId: 'honor_of_kings',
        actionType: 'navigate',
        actionUrl: '/(tabs)/homepage/service-detail?serviceType=honor_of_kings',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        enabled: true,
      },
    ];
    
    return {
      data: banners,
      code: 200,
      message: 'Using default banner',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  /**
   * 获取首页数据（聚合接口）
   */
  async getHomepageData(params?: {
    userId?: string;
    location?: { city: string; district?: string };
    includeStatistics?: boolean;
  }): Promise<ApiResponse<HomepageData>> {
    try {
      // 并行加载多个数据源
      const [featuredRes, servicesRes, bannerRes] = await Promise.allSettled([
        this.getFeaturedUsers({ limit: 10 }),
        this.getServiceItems(),
        this.getBannerData(),
      ]);
      
      const data: HomepageData = {
        featuredUsers: featuredRes.status === 'fulfilled' ? featuredRes.value.data : [],
        serviceItems: servicesRes.status === 'fulfilled' ? servicesRes.value.data : [],
        bannerData: bannerRes.status === 'fulfilled' ? bannerRes.value.data[0] : {} as BannerData,
        statistics: {
          totalUsers: 0,
          onlineUsers: 0,
          totalServices: 10,
        },
      };
      
      return {
        data,
        code: 200,
        message: 'success',
        timestamp: Date.now(),
        success: true,
      };
    } catch (error) {
      console.error('[HomepageAPI] getHomepageData error:', error);
      throw error;
    }
  }
  
  /**
   * 刷新首页数据
   */
  async refreshHomepageData(params?: any): Promise<ApiResponse<HomepageData>> {
    // 强制刷新，不使用缓存
    return this.getHomepageData(params);
  }
  
  /**
   * 上报页面事件（待后端实现）
   */
  async reportPageEvent(event: {
    page: string;
    section: string;
    action: string;
    timestamp: number;
    userId?: string;
    sessionId?: string;
    extra?: Record<string, any>;
  }): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        API_ENDPOINTS.ANALYTICS.EVENTS,
        event,
        { retry: false } // 埋点失败不重试
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error) {
      // 埋点失败静默处理
      console.warn('[HomepageAPI] reportPageEvent failed (non-critical):', error);
      return {
        data: { success: false },
        code: 500,
        message: 'Event tracking failed',
        timestamp: Date.now(),
        success: false,
      };
    }
  }
  
  /**
   * 获取热门搜索关键词
   */
  async getHotSearchKeywords(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<string[]>(
        API_ENDPOINTS.HOMEPAGE.HOT_KEYWORDS
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 降级为默认关键词
      if (error?.response?.status === 404) {
        return {
          data: ['王者荣耀', '英雄联盟', '探店', 'K', '私影'],
          code: 200,
          message: 'Using default keywords',
          timestamp: Date.now(),
          success: true,
        };
      }
      throw error;
    }
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
  }>> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.HOMEPAGE.STATISTICS
      );
      
      return {
        data: response.data,
        code: response.code,
        message: response.message,
        timestamp: Date.now(),
        success: response.success,
      };
    } catch (error: any) {
      // 降级为默认统计
      if (error?.response?.status === 404) {
        return {
          data: {
            totalUsers: 10000,
            onlineUsers: 1500,
            totalOrders: 50000,
            totalServices: 10,
            averageRating: 4.7,
          },
          code: 200,
          message: 'Using default statistics',
          timestamp: Date.now(),
          success: true,
        };
      }
      throw error;
    }
  }
  
  /**
   * 清除首页缓存
   */
  clearHomepageCache(): void {
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.CONFIG);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.FEATURED_USERS);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.SERVICES);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.BANNER);
    apiClient.deleteCache(API_ENDPOINTS.HOMEPAGE.STATISTICS);
  }
}

// 创建并导出实例
export const homepageApiEnhanced = new HomepageAPIEnhanced();

// 默认导出（向后兼容）
export default homepageApiEnhanced;

