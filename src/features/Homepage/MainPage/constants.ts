/**
 * MainPage 常量配置
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// 主页面常量
export const MAIN_PAGE_CONSTANTS = {
  // 颜色配置
  COLORS: {
    PRIMARY: '#6366F1',
    SECONDARY: '#8B5CF6',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F8FAFC',
    TEXT: '#1F2937',
    TEXT_SECONDARY: '#6B7280',
    ERROR: '#EF4444',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    BORDER: '#E5E7EB',
    OVERLAY: 'rgba(0, 0, 0, 0.5)',
  },

  // 尺寸配置
  SIZES: {
    // 屏幕尺寸
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
    
    // 头部区域
    HEADER_HEIGHT: Platform.OS === 'ios' ? 44 : 56,
    STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 44 : 24,
    
    // 区域尺寸
    TOP_FUNCTION_HEIGHT: 60,
    BANNER_HEIGHT: Math.min(height * 0.22, 200),
    SERVICE_GRID_HEIGHT: 160,
    SECTION_SPACING: 20,
    
    // 边距和内边距
    PADDING_HORIZONTAL: 16,
    PADDING_VERTICAL: 12,
    MARGIN_BOTTOM: 20,
    BORDER_RADIUS: 8,
  },

  // 动画配置
  ANIMATION: {
    DURATION: {
      SHORT: 150,
      MEDIUM: 300,
      LONG: 500,
    },
    EASING: {
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out',
    },
  },

  // 分页配置
  PAGINATION: {
    PAGE_SIZE: 20,
    INITIAL_PAGE: 1,
    LOAD_MORE_THRESHOLD: 3,
  },

  // 缓存配置
  CACHE: {
    TTL: 5 * 60 * 1000, // 5分钟
    MAX_SIZE: 100,
    STRATEGY: 'lru',
  },

  // 网络配置
  NETWORK: {
    TIMEOUT: 10000, // 10秒
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
  },
};

// 页面区域配置
export const PAGE_SECTIONS = {
  TOP_FUNCTION: 'topFunction',
  GAME_BANNER: 'gameBanner',
  SERVICE_GRID: 'serviceGrid',
  FEATURED_USERS: 'featuredUsers',
  EVENT_CENTER: 'eventCenter',
  USER_LIST: 'userList',
} as const;

// 页面状态常量
export const PAGE_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  REFRESHING: 'refreshing',
  EMPTY: 'empty',
} as const;

// 路由常量
export const ROUTES = {
  HOMEPAGE: {
    MAIN: '/(tabs)/homepage',
    SEARCH: '/(tabs)/homepage/search',
    LOCATION: '/(tabs)/homepage/location',
    REGION: '/(tabs)/homepage/region',
    SERVICE_DETAIL: '/(tabs)/homepage/service-detail',
    FILTER_ONLINE: '/(tabs)/homepage/filter-online',
    FILTER_OFFLINE: '/(tabs)/homepage/filter-offline',
    EVENT_CENTER: '/(tabs)/homepage/event-center',
    FEATURED: '/(tabs)/homepage/featured',
  },
  MODAL: {
    USER_DETAIL: '/modal/user-detail',
    FILTER_PANEL: '/modal/filter-panel',
    IMAGE_PREVIEW: '/modal/image-preview',
  },
  TABS: {
    HOMEPAGE: '/(tabs)/homepage',
    DISCOVER: '/(tabs)/discover',
    MESSAGES: '/(tabs)/messages',
    PROFILE: '/(tabs)/profile',
  },
} as const;

// 服务类型常量
export const SERVICE_TYPES = {
  GAMES: {
    HONOR_OF_KINGS: 'honor_of_kings',
    LEAGUE_OF_LEGENDS: 'league_of_legends',
    PEACE_ELITE: 'peace_elite',
    BRAWL_STARS: 'brawl_stars',
  },
  LIFESTYLE: {
    EXPLORE_SHOP: 'explore_shop',
    PRIVATE_CINEMA: 'private_cinema',
    BILLIARDS: 'billiards',
    KTV: 'ktv',
    DRINKING: 'drinking',
    MASSAGE: 'massage',
  },
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器异常，请稍后重试',
  DATA_ERROR: '数据加载失败，请重试',
  PERMISSION_ERROR: '权限不足，无法访问',
  UNKNOWN_ERROR: '未知错误，请联系客服',
} as const;

// 成功消息常量
export const SUCCESS_MESSAGES = {
  DATA_LOADED: '数据加载成功',
  REFRESH_SUCCESS: '刷新成功',
  OPERATION_SUCCESS: '操作成功',
} as const;
