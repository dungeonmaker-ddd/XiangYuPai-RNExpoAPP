// #region 1. File Banner & TOC
/**
 * OtherUserProfilePage - Constants
 * 
 * 对方用户主页的常量配置
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Tab Configuration
 * [3] Color Constants
 * [4] Size Constants
 * [5] Layout Constants
 * [6] Export All
 */
// #endregion

// #region 2. Tab Configuration

import type { TabItem } from './types';

/**
 * Tab配置列表
 * 注意：key值必须与TabType类型定义保持一致
 */
export const TAB_ITEMS: TabItem[] = [
  { key: 'dynamics', label: '动态' },
  { key: 'profile', label: '资料' },
  { key: 'skills', label: '技能' },
];

// #endregion

// #region 3. Color Constants

/**
 * 颜色配置 (基于架构文档精确定义)
 */
export const COLORS = {
  // 主色系（架构文档要求）
  primary: '#8A2BE2',        // 紫色 - 主色调（按钮、选中状态、高亮）
  secondary: '#9370DB',      // 紫色渐变终点色
  
  // 辅助色系（架构文档要求）
  pink: '#FF69B4',           // 粉色 - 年龄标识、女性特征
  blue: '#007AFF',           // 蓝色 - 实名认证、信息提示
  gold: '#FFD700',           // 金色 - 大神认证、高级标识
  red: '#FF3B30',            // 红色 - 价格、点赞、警告
  
  // 状态色
  success: '#00FF00',        // 绿色 - 在线状态（架构文档要求）
  successDark: '#10B981',    // 深绿 - 成功提示
  warning: '#F59E0B',        // 警告黄
  error: '#FF3B30',          // 错误红
  
  // 中性色系（架构文档要求）
  black: '#000000',          // 黑色 - 主要文字
  white: '#FFFFFF',          // 白色
  gray900: '#111827',        // 深灰 - 备用主文字
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  
  // 语义化颜色（架构文档要求）
  textPrimary: '#000000',      // 主要文字 (架构文档要求)
  textSecondary: '#333333',    // 次要文字 (架构文档要求)
  textTertiary: '#999999',     // 辅助信息 (架构文档要求)
  textPlaceholder: '#9CA3AF',  // 占位文字
  
  // 背景色
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  
  // 边框色（架构文档要求）
  border: '#E5E5E5',         // 分割线、边框 (架构文档要求)
  borderLight: '#F3F4F6',
} as const;

// #endregion

// #region 4. Size Constants

/**
 * 尺寸配置 (基于架构文档精确定义)
 */
export const SIZES = {
  // 头像尺寸（架构文档要求）
  avatarLarge: 80,           // 主头像 80x80px (架构文档要求)
  avatarMedium: 60,          // 中等头像
  avatarSmall: 48,           // 小头像（技能卡片）
  avatarXSmall: 40,          // 超小头像
  
  // 图标尺寸（架构文档要求）
  iconLarge: 28,
  iconMedium: 24,            // 标准图标 24x24px (架构文档要求)
  iconSmall: 20,
  iconXSmall: 16,
  iconXXSmall: 12,           // 徽章内图标
  
  // 徽章尺寸（架构文档要求）
  badgeSize: 16,             // 认证徽章 16x16px (架构文档要求)
  
  // 按钮高度（架构文档要求）
  buttonHeight: 48,          // 标准按钮高度 48px (架构文档要求)
  buttonHeightSmall: 40,
  buttonHeightCompact: 32,   // 紧凑按钮（粉丝列表等）
} as const;

/**
 * 间距配置
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// #endregion

// #region 5. Layout Constants

/**
 * 头部高度
 */
export const HEADER_HEIGHT = 200;

/**
 * Tab栏高度
 */
export const TAB_BAR_HEIGHT = 48;

/**
 * 底部操作栏高度
 */
export const BOTTOM_ACTION_HEIGHT = 72;

/**
 * 列表项最小高度
 */
export const LIST_ITEM_MIN_HEIGHT = 80;

/**
 * 默认分页大小
 */
export const DEFAULT_PAGE_SIZE = 20;

// #endregion

// #region 6. Export All

export default {
  TAB_ITEMS,
  COLORS,
  SIZES,
  SPACING,
  HEADER_HEIGHT,
  TAB_BAR_HEIGHT,
  BOTTOM_ACTION_HEIGHT,
  LIST_ITEM_MIN_HEIGHT,
  DEFAULT_PAGE_SIZE,
};

// #endregion

