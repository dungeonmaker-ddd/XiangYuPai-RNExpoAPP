/**
 * API Services Index - 统一导出所有API服务
 */

// 导出API客户端和基础配置
export { apiClient } from './client';
export { API_CONFIG, API_ENDPOINTS, buildQueryParams, buildURL, getBaseURL } from './config';

// 导出所有API服务实例
export { homepageApi } from './homepageApi';
export { locationApi } from './locationApi';
export { serviceApi } from './serviceApi';
export { userApi } from './userApi';

// 导出API响应和错误类型
export { ERROR_TYPES, HTTP_STATUS } from './client';
export type { ApiError, ApiResponse, RequestConfig } from './client';

// 导出Homepage API类型
export type {
    BannerData, FeaturedUser, FeaturedUsersParams, HomepageConfig, HomepageData,
    HomepageDataParams, ServiceConfigParams, ServiceItem, TrackingEvent
} from './homepageApi';

// 导出User API类型
export type {
    FavoriteUserParams, FollowUserParams, ReportUserParams, User, UserDetailInfo, UserListParams,
    UserListResponse, UserRecommendationParams, UserSearchParams,
    UserSearchResponse
} from './userApi';

// 导出Location API类型
export type {
    CityInfo, Coordinates, DistrictInfo, GeocodeResponse, LocationInfo
} from './locationApi';

// 导出Service API类型
export type {
    ServiceDetail, ServiceTypeConfig,
    ServiceUserFilters
} from './serviceApi';

// API工具函数
export const clearAllCache = () => {
  apiClient.clearCache();
};

// 设置全局认证token
export const setAuthToken = (token: string) => {
  apiClient.setAuthToken(token);
};

// 清除全局认证token
export const clearAuthToken = () => {
  apiClient.clearAuthToken();
};

// 批量初始化API数据
export const initializeApiData = async () => {
  try {
    // 并行初始化基础数据
    const [homepageConfig, serviceTypes, cityList] = await Promise.allSettled([
      homepageApi.getHomepageConfig(),
      serviceApi.getServiceTypes(),
      locationApi.getCityList(),
    ]);

    console.log('API数据初始化完成');
    return {
      homepageConfig: homepageConfig.status === 'fulfilled' ? homepageConfig.value : null,
      serviceTypes: serviceTypes.status === 'fulfilled' ? serviceTypes.value : null,
      cityList: cityList.status === 'fulfilled' ? cityList.value : null,
    };
  } catch (error) {
    console.error('API数据初始化失败:', error);
    throw error;
  }
};

// API健康检查
export const checkApiHealth = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  latency: number;
}> => {
  const startTime = Date.now();
  const services = {
    homepage: false,
    user: false,
    location: false,
    service: false,
  };

  try {
    // 并行检查各个服务
    const checks = await Promise.allSettled([
      homepageApi.getHomepageConfig().then(() => { services.homepage = true; }),
      userApi.getUserList({ limit: 1 }).then(() => { services.user = true; }),
      locationApi.getCityList().then(() => { services.location = true; }),
      serviceApi.getServiceTypes().then(() => { services.service = true; }),
    ]);

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    const latency = Date.now() - startTime;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, services, latency };
  } catch (error) {
    console.error('API健康检查失败:', error);
    return {
      status: 'unhealthy',
      services,
      latency: Date.now() - startTime,
    };
  }
};

// 网络状态监听
export const createNetworkListener = (callback: (isOnline: boolean) => void) => {
  // TODO: 实现网络状态监听
  // 这里可以集成react-native-netinfo等库
  console.log('网络状态监听器已创建');
  
  return () => {
    console.log('网络状态监听器已清除');
  };
};
