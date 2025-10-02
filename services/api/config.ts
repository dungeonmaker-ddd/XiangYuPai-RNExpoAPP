/**
 * API配置文件
 * 统一管理API基础配置、环境变量、请求配置等
 */

// API环境配置
export const API_CONFIG = {
  // 基础URL配置
  BASE_URL: {
    development: 'https://dev-api.xiangyupai.com',
    staging: 'https://staging-api.xiangyupai.com',
    production: 'https://api.xiangyupai.com',
  },
  
  // 当前环境
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
  
  // 请求超时配置
  TIMEOUT: {
    DEFAULT: 10000, // 10秒
    UPLOAD: 30000,  // 30秒
    DOWNLOAD: 60000, // 60秒
  },
  
  // 重试配置
  RETRY: {
    COUNT: 3,
    DELAY: 1000, // 1秒
    BACKOFF: 1.5, // 指数退避因子
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // 缓存配置
  CACHE: {
    TTL: 5 * 60 * 1000, // 5分钟
    MAX_SIZE: 50, // 最大缓存条数
  },
};

// API端点配置
export const API_ENDPOINTS = {
  // 首页相关
  HOMEPAGE: {
    CONFIG: '/homepage/config',
    DATA: '/homepage/data',
    FEATURED_USERS: '/homepage/featured-users',
    BANNER: '/homepage/banner',
    SERVICES: '/homepage/services',
  },
  
  // 用户相关
  USER: {
    LIST: '/users',
    DETAIL: '/users/:id',
    SEARCH: '/users/search',
    FILTER: '/users/filter',
    FAVORITES: '/users/favorites',
    RECOMMENDATIONS: '/users/recommendations',
  },
  
  // 位置相关
  LOCATION: {
    CITIES: '/location/cities',
    DISTRICTS: '/location/districts',
    CURRENT: '/location/current',
    GEOCODE: '/location/geocode',
    REVERSE_GEOCODE: '/location/reverse-geocode',
  },
  
  // 服务相关
  SERVICE: {
    TYPES: '/services/types',
    CONFIG: '/services/:type/config',
    USERS: '/services/:type/users',
    DETAIL: '/services/:type/:id',
  },
  
  // 配置相关
  CONFIG: {
    COMPONENT: '/config/components/:id',
    THEME: '/config/theme',
    SYSTEM: '/config/system',
    FEATURES: '/config/features',
  },
  
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // 上传相关
  UPLOAD: {
    IMAGE: '/upload/image',
    VIDEO: '/upload/video',
    AVATAR: '/upload/avatar',
  },
};

// HTTP状态码配置
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// 错误类型配置
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// 请求头配置
export const REQUEST_HEADERS = {
  CONTENT_TYPE: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  },
  ACCEPT: {
    JSON: 'application/json',
    TEXT: 'text/plain',
    HTML: 'text/html',
  },
} as const;

// 获取当前环境的API基础URL
export const getBaseURL = (): string => {
  return API_CONFIG.BASE_URL[API_CONFIG.ENVIRONMENT as keyof typeof API_CONFIG.BASE_URL];
};

// 构建完整的API URL
export const buildURL = (endpoint: string, params?: Record<string, string>): string => {
  let url = getBaseURL() + endpoint;
  
  // 替换URL参数
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
  }
  
  return url;
};

// 构建查询参数
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

// API版本配置
export const API_VERSION = {
  V1: 'v1',
  V2: 'v2',
  CURRENT: 'v1',
} as const;
