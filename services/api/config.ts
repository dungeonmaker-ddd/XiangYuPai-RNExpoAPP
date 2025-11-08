/**
 * API配置文件
 * 统一管理API基础配置、环境变量、请求配置等
 */

import { Platform } from 'react-native';

/**
 * 🤖 自动检测环境并返回正确的API地址
 * 
 * 关键：Android模拟器访问主机需要使用特殊IP
 * - Android Studio模拟器: 10.0.2.2
 * - iOS模拟器: localhost
 * - 真实设备: 主机局域网IP
 */
const getDevApiUrl = (): string => {
  // 优先使用环境变量（可以覆盖自动检测）
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log('[API Config] 📌 使用环境变量配置:', process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // 根据平台自动选择
  if (Platform.OS === 'android') {
    // 🔧 使用主机实际IP（10.0.2.2映射不稳定）
    console.log('[API Config] 🤖 检测到Android环境，使用主机实际IP: 192.168.1.108:8080');
    // return 'http://192.168.1.108:8080';
    return 'http://10.0.2.2:8080';  // ❌ 映射不稳定，已禁用
  } else if (Platform.OS === 'ios') {
    // iOS模拟器可以直接使用localhost
    console.log('[API Config] 🍎 检测到iOS环境，使用 localhost:8080');
    return 'http://localhost:8080';
  } else {
    // Web环境
    console.log('[API Config] 🌐 检测到Web环境，使用 localhost:8080');
    return 'http://localhost:8080';
  }
};

// API环境配置
export const API_CONFIG = {
  // 基础URL配置
  BASE_URL: {
    development: getDevApiUrl(),  // 🆕 自动检测平台并使用正确IP
    staging: 'https://staging-api.xiangyupai.com',
    production: 'https://api.xiangyupai.com',
    mock: 'http://localhost:3000',
  },
  
  // 当前环境（支持环境变量覆盖）
  ENVIRONMENT: process.env.EXPO_PUBLIC_API_ENV || (__DEV__ ? 'development' : 'production'),
  
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

// API端点配置（基于RuoYi-Cloud-Plus后端实际路径）
export const API_ENDPOINTS = {
  // 首页相关（待后端实现的专用接口 - xypai-user模块）
  // ⚠️ 注意：通过网关访问需要加 /xypai-user 前缀
  HOMEPAGE: {
    CONFIG: '/xypai-user/api/v1/homepage/config',
    DATA: '/xypai-user/api/v1/homepage/data',
    FEATURED_USERS: '/xypai-user/api/v1/homepage/featured-users',
    BANNER: '/xypai-user/api/v1/homepage/banner',
    SERVICES: '/xypai-user/api/v1/homepage/services',
    STATISTICS: '/xypai-user/api/v1/homepage/statistics',
    HOT_KEYWORDS: '/xypai-user/api/v1/homepage/hot-keywords',
    
    // 首页用户查询（集成筛选）
    USER_LIST: '/xypai-user/api/v1/homepage/users/list',
    NEARBY_USERS: '/xypai-user/api/v1/homepage/nearby-users',       // ✅ 后端已实现
    RECOMMENDED_USERS: '/xypai-user/api/v1/homepage/recommended-users', // ✅ 后端已实现
    NEW_USERS: '/xypai-user/api/v1/homepage/new-users',            // ✅ 后端已实现
    RECOMMEND_USERS: '/xypai-user/api/v1/homepage/users/recommend', // 兼容旧代码
    LATEST_USERS: '/xypai-user/api/v1/homepage/users/latest',      // 兼容旧代码
  },
  
  // 用户资料相关（已有接口 - xypai-user模块）
  // ⚠️ 注意：通过网关访问需要加 /xypai-user 前缀
  PROFILE: {
    // 用户资料查询
    USER_PROFILE: '/xypai-user/api/v1/user/profile',           // GET/PUT /{userId}
    CURRENT_PROFILE: '/xypai-user/api/v1/user/profile/current', // GET/PUT
    
    // 在线状态
    ONLINE_STATUS: '/xypai-user/api/v2/user/profile/:userId/online-status', // PUT
    IS_ONLINE: '/xypai-user/api/v2/user/profile/:userId/is-online',         // GET
    GO_ONLINE: '/xypai-user/api/v2/user/profile/current/go-online',         // PUT
    GO_OFFLINE: '/xypai-user/api/v2/user/profile/current/go-offline',       // PUT
    GO_INVISIBLE: '/xypai-user/api/v2/user/profile/current/go-invisible',   // PUT
    
    // 资料完整度
    COMPLETENESS: '/xypai-user/api/v2/user/profile/:userId/completeness',    // GET
    CURRENT_COMPLETENESS: '/xypai-user/api/v2/user/profile/current/completeness', // GET
  },
  
  // 用户统计相关（已有接口 - xypai-user模块）
  USER_STATS: {
    STATS: '/xypai-user/api/v1/users/stats',                  // GET /{userId}
    CURRENT: '/xypai-user/api/v1/users/stats/current',        // GET
    BATCH: '/xypai-user/api/v1/users/stats/batch',            // POST
    POPULAR: '/xypai-user/api/v1/users/stats/popular',        // GET
    QUALITY_ORGANIZERS: '/xypai-user/api/v1/users/stats/quality-organizers', // GET
    
    // 统计增减（内部服务）
    INCREMENT_LIKE: '/xypai-user/api/v1/users/stats/:userId/like/increment',
    INCREMENT_FOLLOWER: '/xypai-user/api/v1/users/stats/:userId/follower/increment',
    DECREMENT_FOLLOWER: '/xypai-user/api/v1/users/stats/:userId/follower/decrement',
    INCREMENT_CONTENT: '/xypai-user/api/v1/users/stats/:userId/content/increment',
    REFRESH_CACHE: '/xypai-user/api/v1/users/stats/:userId/refresh',
  },
  
  // 职业标签相关（已有接口 - xypai-user模块）
  OCCUPATION: {
    USER: '/xypai-user/api/v1/occupation/user',               // GET/PUT /{userId}
    CURRENT: '/xypai-user/api/v1/occupation/current',          // GET/PUT
    LIST: '/xypai-user/api/v1/occupation/list',                // GET 所有职业
    CATEGORY: '/xypai-user/api/v1/occupation/category',        // GET /{category}
    CATEGORIES: '/xypai-user/api/v1/occupation/categories',    // GET 所有分类
    ADD: '/xypai-user/api/v1/occupation/user/:userId/add',     // POST
    REMOVE: '/xypai-user/api/v1/occupation/user/:userId/remove', // DELETE
    CLEAR: '/xypai-user/api/v1/occupation/user/:userId/clear',  // DELETE
    HAS: '/xypai-user/api/v1/occupation/user/:userId/has',      // GET
    BY_CODE: '/xypai-user/api/v1/occupation/:occupationCode/users', // GET
    COUNT_BY_CODE: '/xypai-user/api/v1/occupation/:occupationCode/count', // GET
  },
  
  // 用户管理相关（已有接口 - xypai-user模块）
  USER: {
    LIST: '/xypai-user/api/v1/users/list',                    // UserController
    DETAIL: '/xypai-user/api/v1/users',                        // GET /{userId}
    PROFILE: '/xypai-user/api/v1/users/profile',               // GET/PUT 当前用户
    ADD: '/xypai-user/api/v1/users',                           // POST
    UPDATE: '/xypai-user/api/v1/users',                        // PUT
    DELETE: '/xypai-user/api/v1/users/:userIds',               // DELETE
    CHANGE_STATUS: '/xypai-user/api/v1/users/:userId/status',  // PUT
    RESET_PASSWORD: '/xypai-user/api/v1/users/:userId/reset-password', // PUT
    CHECK_USERNAME: '/xypai-user/api/v1/users/check-username',  // GET
    CHECK_MOBILE: '/xypai-user/api/v1/users/check-mobile',      // GET
  },
  
  // 内容相关（已有接口 - xypai-content模块）
  // ⚠️ 注意：通过网关访问需要加 /xypai-content 前缀
  CONTENT: {
    LIST: '/xypai-content/api/v1/contents/list',                // ContentController
    DETAIL: '/xypai-content/api/v1/contents/:contentId',
    HOT: '/xypai-content/api/v1/contents/hot',
    RECOMMENDED: '/xypai-content/api/v1/contents/recommended',
    NEARBY: '/xypai-content/api/v1/contents/nearby',             // v7.1空间索引查询
    BY_CITY: '/xypai-content/api/v1/contents/city/:cityId',     // v7.1城市内容
    SEARCH: '/xypai-content/api/v1/contents/search',
    USER_CONTENTS: '/xypai-content/api/v1/contents/user/:userId',
    MY_CONTENTS: '/xypai-content/api/v1/contents/my',
  },
  
  // 评论相关（v7.1新增 - xypai-content模块）
  COMMENT: {
    ADD: '/xypai-content/api/v1/comments',                       // CommentController
    DELETE: '/xypai-content/api/v1/comments/:commentId',
    LIST: '/xypai-content/api/v1/comments/content/:contentId',   // 评论列表
    REPLIES: '/xypai-content/api/v1/comments/:parentId/replies', // 评论回复
    LIKE: '/xypai-content/api/v1/comments/:commentId/like',      // 评论点赞
    TOP: '/xypai-content/api/v1/comments/:commentId/top',        // 置顶评论
    COUNT: '/xypai-content/api/v1/comments/count/:contentId',    // 统计评论
  },
  
  // 内容互动（已有 - xypai-content模块）
  INTERACTION: {
    LIKE: '/xypai-content/api/v1/content-actions/like/:contentId',
    UNLIKE: '/xypai-content/api/v1/content-actions/like/:contentId',  // DELETE
    COLLECT: '/xypai-content/api/v1/content-actions/collect/:contentId',
    UNCOLLECT: '/xypai-content/api/v1/content-actions/collect/:contentId', // DELETE
    SHARE: '/xypai-content/api/v1/content-actions/share/:contentId',
    STATUS: '/xypai-content/api/v1/content-actions/:contentId/status',      // 用户互动状态
    STATISTICS: '/xypai-content/api/v1/content-actions/:contentId/statistics', // 统计数据
  },
  
  // 草稿相关（v7.1新增 - xypai-content模块）
  DRAFT: {
    SAVE: '/xypai-content/api/v1/drafts/save',
    GET: '/xypai-content/api/v1/drafts/:draftId',
    MY_DRAFTS: '/xypai-content/api/v1/drafts/my',
    DELETE: '/xypai-content/api/v1/drafts/:draftId',
    PUBLISH: '/xypai-content/api/v1/drafts/:draftId/publish',
    COUNT: '/xypai-content/api/v1/drafts/count',
  },
  
  // 位置相关（待实现 - xypai-user模块）
  LOCATION: {
    CITIES: '/xypai-user/api/v1/location/cities',
    CITY_DETAIL: '/xypai-user/api/v1/location/cities/:cityId',
    DISTRICTS: '/xypai-user/api/v1/location/cities/:cityId/districts',
    HOT_CITIES: '/xypai-user/api/v1/location/cities/hot',
    SEARCH_CITIES: '/xypai-user/api/v1/location/cities/search',
    CURRENT: '/xypai-user/api/v1/location/current',
    GEOCODE: '/xypai-user/api/v1/location/geocode',
    REVERSE_GEOCODE: '/xypai-user/api/v1/location/reverse-geocode',
  },
  
  // 服务相关（待实现 - xypai-user模块）
  SERVICE: {
    TYPES: '/xypai-user/api/v1/services/types',
    CONFIG: '/xypai-user/api/v1/services/:type/config',
    USERS: '/xypai-user/api/v1/services/:type/users',
    DETAIL: '/xypai-user/api/v1/services/:type/:serviceId',
    GAME_SERVICE: '/xypai-user/api/v1/services/game/:serviceId',
    LIFE_SERVICE: '/xypai-user/api/v1/services/life/:serviceId',
  },
  
  // 用户关系相关（已有接口 - xypai-user模块）
  RELATION: {
    // 关注相关
    FOLLOW: '/xypai-user/api/v1/relations/follow',             // POST/DELETE /{targetUserId}
    FOLLOWING: '/xypai-user/api/v1/relations/following',        // GET 当前用户关注列表
    FOLLOWERS: '/xypai-user/api/v1/relations/followers',        // GET 当前用户粉丝列表
    USER_RELATIONS: '/xypai-user/api/v1/relations',             // GET /{userId}/following|followers
    CHECK: '/xypai-user/api/v1/relations/check',                // GET /{targetUserId}
    STATISTICS: '/xypai-user/api/v1/relations/statistics',      // GET
    USER_STATISTICS: '/xypai-user/api/v1/relations/:userId/statistics', // GET
    
    // 拉黑相关
    BLOCK: '/xypai-user/api/v1/relations/block',                // POST/DELETE /{targetUserId}
    BLOCKED: '/xypai-user/api/v1/relations/blocked',            // GET 拉黑列表
    
    // 批量操作
    BATCH_FOLLOW: '/xypai-user/api/v1/relations/batch-follow',  // POST
    BATCH_UNFOLLOW: '/xypai-user/api/v1/relations/batch-unfollow', // POST
  },
  
  // 配置相关（系统配置 - ruoyi-system模块）
  CONFIG: {
    COMPONENT: '/system/api/v1/config/components/:id',
    THEME: '/system/api/v1/config/theme',
    SYSTEM: '/system/api/v1/config/system',
    FEATURES: '/system/api/v1/config/features',
  },
  
  // 认证相关（xypai-auth模块）- 完全对接后端API
  AUTH: {
    // 登录相关
    LOGIN: '/xypai-auth/api/v1/auth/login',                     // 密码登录
    LOGIN_SMS: '/xypai-auth/api/v1/auth/login/sms',            // 短信登录
    LOGOUT: '/xypai-auth/api/v1/auth/logout',                   // 登出
    REFRESH: '/xypai-auth/api/v1/auth/refresh',                 // 刷新令牌
    
    // 验证相关
    VERIFY: '/xypai-auth/api/v1/auth/verify',                   // 验证令牌
    HEARTBEAT: '/xypai-auth/api/v1/auth/heartbeat',            // 心跳保活
    HEALTH: '/xypai-auth/api/v1/auth/health',                   // 健康检查
    
    // 短信相关
    SMS_SEND: '/xypai-auth/api/v1/auth/sms/send',              // 发送短信验证码
    SMS_VERIFY: '/xypai-auth/api/v1/auth/sms/verify',          // 验证短信验证码
    
    // 会话管理
    SESSIONS: '/xypai-auth/api/v1/auth/sessions',               // 查询会话列表
    SESSION_CURRENT: '/xypai-auth/api/v1/auth/session/current', // 查询当前会话
    SESSION_COUNT: '/xypai-auth/api/v1/auth/sessions/count',    // 统计会话数量
    SESSION_REVOKE: '/xypai-auth/api/v1/auth/session/:sessionId', // 注销会话
    SESSION_REVOKE_OTHERS: '/xypai-auth/api/v1/auth/sessions/revoke-others', // 注销其他会话
    
    // 设备管理
    DEVICES: '/xypai-auth/api/v1/auth/devices',                 // 查询设备列表
    DEVICES_TRUSTED: '/xypai-auth/api/v1/auth/devices/trusted', // 查询信任设备
    DEVICE_TRUST: '/xypai-auth/api/v1/auth/device/:deviceId/trust', // 信任设备
    DEVICE_REVOKE: '/xypai-auth/api/v1/auth/device/:deviceId',  // 注销设备
    DEVICE_DELETE: '/xypai-auth/api/v1/auth/device/:deviceId/delete', // 删除设备
  },
  
  // 上传相关（resource模块）
  UPLOAD: {
    IMAGE: '/resource/api/v1/upload/image',
    VIDEO: '/resource/api/v1/upload/video',
    AVATAR: '/resource/api/v1/upload/avatar',
    FILE: '/resource/api/v1/upload/file',
  },
  
  // 分析相关（待实现 - xypai-user模块）
  ANALYTICS: {
    EVENTS: '/xypai-user/api/v1/analytics/events',
    BATCH_EVENTS: '/xypai-user/api/v1/analytics/events/batch',
    PAGE_VIEW: '/xypai-user/api/v1/analytics/page-view',
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
