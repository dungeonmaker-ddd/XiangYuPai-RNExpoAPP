/**
 * Profile模块 - 常量配置
 * 
 * 包含：
 * - UI尺寸常量
 * - 颜色常量
 * - Tab类型常量
 * - 路由常量
 */

import type { TabType } from './types';

// ==================== UI尺寸常量 ====================

export const UI_SIZES = {
  // 系统栏高度
  STATUS_BAR_HEIGHT: 44,
  NAVIGATION_BAR_HEIGHT: 56,
  
  // 背景头图
  BACKGROUND_IMAGE_HEIGHT: 320,
  
  // 用户头像
  AVATAR_SIZE: 96,
  AVATAR_BORDER_WIDTH: 4,
  
  // 按钮尺寸
  EDIT_BUTTON_WIDTH: 80,
  EDIT_BUTTON_HEIGHT: 36,
  
  // Tab标签栏
  TAB_BAR_HEIGHT: 48,
  TAB_INDICATOR_HEIGHT: 2,
  
  // 社交数据区域
  SOCIAL_STATS_HEIGHT: 60,
  
  // 内边距
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  
  // 卡片
  CARD_BORDER_RADIUS: 12,
  CARD_PADDING: 20,
  
  // 技能项
  SKILL_ITEM_WIDTH: 80,
  SKILL_ITEM_HEIGHT: 100,
  SKILL_ICON_SIZE: 48,
} as const;

// ==================== 颜色常量 ====================

export const COLORS = {
  // 主题色
  PRIMARY: '#8A2BE2',
  PRIMARY_LIGHT: '#A855F7',
  PRIMARY_DARK: '#6B21A8',
  
  // 文字颜色
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#757575',
  TEXT_TERTIARY: '#BDBDBD',
  TEXT_WHITE: '#FFFFFF',
  
  // 背景颜色
  BACKGROUND_WHITE: '#FFFFFF',
  BACKGROUND_GRAY: '#F5F5F5',
  BACKGROUND_MASK: 'rgba(0, 0, 0, 0.6)',
  
  // 认证标签
  VERIFIED_BLUE: '#2196F3',
  GOD_PURPLE_START: '#9C27B0',
  GOD_PURPLE_END: '#E040FB',
  
  // 性别颜色
  GENDER_MALE: '#2196F3',
  GENDER_FEMALE: '#FF4081',
  
  // 在线状态
  ONLINE_GREEN: '#00C853',
  OFFLINE_GRAY: '#9E9E9E',
  
  // 边框颜色
  BORDER: '#E0E0E0',
  DIVIDER: '#F0F0F0',
  
  // 状态颜色
  SUCCESS: '#00C853',
  ERROR: '#FF3B30',
  WARNING: '#FF9500',
  
  // 半透明背景
  SEMI_TRANSPARENT_BLACK: 'rgba(0, 0, 0, 0.4)',
} as const;

// ==================== Tab常量 ====================

/**
 * Tab配置列表
 */
export const TABS: Array<{ key: TabType; label: string }> = [
  { key: 'dynamic', label: '动态' },
  { key: 'collection', label: '收藏' },
  { key: 'likes', label: '点赞' },
  { key: 'profile', label: '资料' },
];

/**
 * Tab标签映射
 */
export const TAB_LABELS: Record<TabType, string> = {
  dynamic: '动态',
  collection: '收藏',
  likes: '点赞',
  profile: '资料',
} as const;

// ==================== 路由常量 ====================

export const ROUTES = {
  PROFILE: {
    MAIN: '/(tabs)/profile',
    DYNAMIC: '/(tabs)/profile/dynamic',
    COLLECTION: '/(tabs)/profile/collection',
    LIKES: '/(tabs)/profile/likes',
    INFO: '/(tabs)/profile/info',
    EDIT: '/(tabs)/profile/edit',
    POST_DETAIL: '/(tabs)/profile/post-detail',
    FOLLOWING_LIST: '/(tabs)/profile/following',
    FOLLOWER_LIST: '/(tabs)/profile/followers',
    LIKE_COLLECT_LIST: '/(tabs)/profile/like-collect',
  },
  MODAL: {
    SKILL_DETAIL: '/modal/skill-detail',
    ADD_SKILL: '/modal/add-skill',
    AVATAR_VIEWER: '/modal/avatar-viewer',
    EDIT_NICKNAME: '/modal/edit-nickname',
    EDIT_BIO: '/modal/edit-bio',
    EDIT_WECHAT: '/modal/edit-wechat',
    EDIT_OCCUPATION: '/modal/edit-occupation',
    SELECT_GENDER: '/modal/select-gender',
    SELECT_BIRTHDAY: '/modal/select-birthday',
    SELECT_HEIGHT: '/modal/select-height',
    SELECT_WEIGHT: '/modal/select-weight',
    SELECT_LOCATION: '/modal/select-location',
    AVATAR_MENU: '/modal/avatar-menu',
  },
} as const;

// ==================== 认证标签常量 ====================

/**
 * 认证标签配置
 */
export const VERIFICATION_BADGES = {
  REAL_NAME: {
    label: '实名认证',
    color: COLORS.VERIFIED_BLUE,
    icon: '✓',
  },
  GOD: {
    label: '大神',
    gradient: [COLORS.GOD_PURPLE_START, COLORS.GOD_PURPLE_END],
    icon: '👑',
  },
  VIP: {
    label: 'VIP',
    color: COLORS.PRIMARY,
    icon: '💎',
  },
} as const;

// ==================== 性别配置 ====================

/**
 * 性别配置
 */
export const GENDER_CONFIG = {
  male: {
    label: '♂',
    color: COLORS.GENDER_MALE,
  },
  female: {
    label: '♀',
    color: COLORS.GENDER_FEMALE,
  },
} as const;

// ==================== 在线状态配置 ====================

/**
 * 在线状态配置
 */
export const ONLINE_STATUS = {
  offline: {
    label: '离线',
    color: COLORS.OFFLINE_GRAY,
  },
  online: {
    label: '在线',
    color: COLORS.ONLINE_GREEN,
  },
  busy: {
    label: '忙碌',
    color: COLORS.WARNING,
  },
} as const;

// ==================== 瀑布流配置 ====================

/**
 * 瀑布流布局配置
 */
export const MASONRY_CONFIG = {
  COLUMNS: 2,
  COLUMN_GAP: 8,
  ROW_GAP: 8,
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 16,
  ESTIMATED_ITEM_HEIGHT: 250,
} as const;

// ==================== API配置 ====================

export const API_CONFIG = {
  PAGE_SIZE: 20,
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  CACHE_TTL: 5 * 60 * 1000,  // 5分钟
} as const;

