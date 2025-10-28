// #region 1. File Banner & TOC
/**
 * Profile MainPage 配置文件
 * 
 * 功能：
 * - 集中管理所有配置项
 * - 统一颜色、排版、尺寸等常量
 * - 避免魔法数字和硬编码
 * 
 * 设计原则：
 * - 使用 as const 保证类型推断
 * - 分类管理（UI、动画、数据等）
 * - 提供类型导出，方便类型检查
 * 
 * 参考：WaterfallList的配置设计模式
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] UI Configuration
 * [3] Animation Configuration
 * [4] Data Configuration
 * [5] Type Exports
 */
// #endregion

// #region 2. UI Configuration
/**
 * 颜色配置
 * 统一管理所有颜色值，方便主题切换
 */
export const PROFILE_COLORS = {
  // 背景色
  BACKGROUND: '#FFFFFF',
  BACKGROUND_HEADER: '#F5F5F5',
  BACKGROUND_SKELETON: '#E8E8E8',
  
  // 文字色
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  TEXT_PLACEHOLDER: '#CCCCCC',
  
  // 功能色
  PRIMARY: '#8A2BE2',
  SUCCESS: '#52C41A',
  WARNING: '#FAAD14',
  ERROR: '#FF4D4F',
  
  // 按钮色
  FOLLOW_BUTTON: '#8A2BE2',
  FOLLOW_BUTTON_TEXT: '#FFFFFF',
  UNFOLLOW_BUTTON: '#F5F5F5',
  UNFOLLOW_BUTTON_TEXT: '#666666',
  EDIT_BUTTON: '#F5F5F5',
  EDIT_BUTTON_TEXT: '#000000',
  
  // 分割线
  DIVIDER: '#F0F0F0',
  BORDER: '#E8E8E8',
  
  // 骨架屏
  SKELETON_BASE: '#E8E8E8',
  SKELETON_HIGHLIGHT: '#F5F5F5',
  
  // 遮罩
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
} as const;

/**
 * 排版配置
 * 统一管理字体大小、行高、字重
 */
export const PROFILE_TYPOGRAPHY = {
  // 昵称
  NICKNAME: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  
  // 简介
  BIO: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // 统计数字
  STAT_NUMBER: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // 统计标签
  STAT_LABEL: {
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Tab标签
  TAB_LABEL: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // 按钮文字
  BUTTON_TEXT: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
} as const;

/**
 * 尺寸配置
 * 统一管理各种UI元素的尺寸
 */
export const PROFILE_SIZES = {
  // 背景头图
  BACKGROUND_HEIGHT: 200,
  BACKGROUND_MIN_HEIGHT: 150,
  BACKGROUND_MAX_HEIGHT: 300,
  
  // 头像
  AVATAR_SIZE: 80,
  AVATAR_BORDER_WIDTH: 3,
  AVATAR_BORDER_RADIUS: 40,
  
  // 按钮
  BUTTON_HEIGHT: 32,
  BUTTON_MIN_WIDTH: 80,
  BUTTON_BORDER_RADIUS: 16,
  
  // 间距
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 12,
  MARGIN_LARGE: 16,
  
  // Tab
  TAB_HEIGHT: 44,
  TAB_INDICATOR_HEIGHT: 3,
  TAB_INDICATOR_WIDTH: 20,
  
  // 圆角
  BORDER_RADIUS_SMALL: 4,
  BORDER_RADIUS_MEDIUM: 8,
  BORDER_RADIUS_LARGE: 12,
} as const;

/**
 * 布局配置
 * 页面布局相关的配置
 */
export const PROFILE_LAYOUT = {
  // ScrollView吸顶配置
  TAB_STICKY_INDEX: 2,  // Tab栏在第3个位置（从0开始）
  
  // 内容区域
  CONTENT_MIN_HEIGHT: 400,
  
  // 社交数据区域
  SOCIAL_STATS_COLUMNS: 3,  // 3列布局（关注/粉丝/获赞）
} as const;
// #endregion

// #region 3. Animation Configuration
/**
 * 动画配置
 * 统一管理动画时长和缓动函数
 */
export const PROFILE_ANIMATIONS = {
  // 骨架屏动画
  SKELETON_DURATION: 1500,  // 毫秒
  SKELETON_MIN_OPACITY: 0.3,
  SKELETON_MAX_OPACITY: 1.0,
  
  // Tab切换动画
  TAB_SWITCH_DURATION: 300,
  TAB_INDICATOR_DURATION: 250,
  
  // 按钮交互
  BUTTON_PRESS_SCALE: 0.95,
  BUTTON_PRESS_DURATION: 150,
  
  // 下拉刷新
  REFRESH_INDICATOR_DURATION: 400,
  
  // 关注按钮动画
  FOLLOW_BUTTON_SCALE: 0.9,
  FOLLOW_BUTTON_DURATION: 200,
} as const;
// #endregion

// #region 4. Data Configuration
/**
 * 数据配置
 * 数据加载、缓存等相关配置
 */
export const PROFILE_DATA_CONFIG = {
  // 加载配置
  INITIAL_LOAD_DELAY: 300,      // 初始加载延迟（毫秒）
  REFRESH_DEBOUNCE: 1000,       // 刷新防抖时间
  RETRY_TIMES: 3,               // 失败重试次数
  RETRY_DELAY: 2000,            // 重试延迟（毫秒）
  
  // 分页配置
  FEED_PAGE_SIZE: 20,           // 动态列表每页数量
  COLLECT_PAGE_SIZE: 20,        // 收藏列表每页数量
  LIKE_PAGE_SIZE: 20,           // 点赞列表每页数量
  
  // 缓存配置
  CACHE_DURATION: 5 * 60 * 1000,  // 缓存时长（5分钟）
  MAX_CACHE_SIZE: 50,               // 最大缓存数量
  
  // 加载阈值
  LOAD_MORE_THRESHOLD: 0.8,     // 滚动到80%时加载更多
  REFRESH_THRESHOLD: 100,       // 下拉100px触发刷新
} as const;

/**
 * 功能开关
 * 控制功能的开启/关闭
 */
export const PROFILE_FEATURES = {
  // 功能开关
  ENABLE_BACKGROUND_PARALLAX: true,   // 启用背景视差效果
  ENABLE_TAB_ANIMATION: true,         // 启用Tab切换动画
  ENABLE_SKELETON: true,              // 启用骨架屏
  ENABLE_PULL_TO_REFRESH: true,       // 启用下拉刷新
  ENABLE_INFINITE_SCROLL: true,       // 启用无限滚动
  
  // 实验性功能
  ENABLE_AVATAR_GESTURE: false,       // 启用头像手势（捏合放大等）
  ENABLE_BACKGROUND_VIDEO: false,     // 启用背景视频
  ENABLE_3D_AVATAR: false,            // 启用3D头像
} as const;

/**
 * 默认值配置
 * 各种默认值的集合
 */
export const PROFILE_DEFAULTS = {
  // 默认头像
  DEFAULT_AVATAR: 'https://via.placeholder.com/80.png?text=Avatar',
  
  // 默认背景
  DEFAULT_BACKGROUND: 'https://via.placeholder.com/375x200.png?text=Background',
  
  // 默认昵称
  DEFAULT_NICKNAME: '用户',
  
  // 默认简介
  DEFAULT_BIO: '这个人很懒，什么都没有写...',
  
  // 默认Tab
  DEFAULT_TAB: 'posts' as const,
  
  // 默认统计数据
  DEFAULT_STATS: {
    followingCount: 0,
    followerCount: 0,
    likeCount: 0,
    collectCount: 0,
  },
} as const;
// #endregion

// #region 5. Type Exports
/**
 * 配置类型导出
 * 方便其他文件进行类型检查
 */
export type ProfileColors = typeof PROFILE_COLORS;
export type ProfileTypography = typeof PROFILE_TYPOGRAPHY;
export type ProfileSizes = typeof PROFILE_SIZES;
export type ProfileLayout = typeof PROFILE_LAYOUT;
export type ProfileAnimations = typeof PROFILE_ANIMATIONS;
export type ProfileDataConfig = typeof PROFILE_DATA_CONFIG;
export type ProfileFeatures = typeof PROFILE_FEATURES;
export type ProfileDefaults = typeof PROFILE_DEFAULTS;

/**
 * 完整配置类型
 */
export interface ProfileConfig {
  colors: ProfileColors;
  typography: ProfileTypography;
  sizes: ProfileSizes;
  layout: ProfileLayout;
  animations: ProfileAnimations;
  data: ProfileDataConfig;
  features: ProfileFeatures;
  defaults: ProfileDefaults;
}

/**
 * 获取完整配置对象
 * 用于需要完整配置的场景
 */
export const getProfileConfig = (): ProfileConfig => ({
  colors: PROFILE_COLORS,
  typography: PROFILE_TYPOGRAPHY,
  sizes: PROFILE_SIZES,
  layout: PROFILE_LAYOUT,
  animations: PROFILE_ANIMATIONS,
  data: PROFILE_DATA_CONFIG,
  features: PROFILE_FEATURES,
  defaults: PROFILE_DEFAULTS,
});
// #endregion

