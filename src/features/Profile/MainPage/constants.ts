/**
 * MainPage - 常量配置
 */

import { Dimensions } from 'react-native';

// 屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 颜色配置
export const COLORS = {
  PRIMARY: '#8A2BE2',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_BG: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
  DIVIDER: '#F0F0F0',
  
  // 认证标签
  VERIFIED_BLUE: '#2196F3',
  GOD_PURPLE: '#9C27B0',
  
  // 性别
  GENDER_MALE: '#2196F3',
  GENDER_FEMALE: '#FF4081',
  
  // 在线状态
  ONLINE_GREEN: '#00C853',
  OFFLINE_GRAY: '#9E9E9E',
  
  // 半透明
  MASK: 'rgba(0, 0, 0, 0.4)',
} as const;

// 尺寸配置
export const SIZES = {
  BACKGROUND_HEIGHT: 320,
  AVATAR_SIZE: 96,
  AVATAR_OFFSET: 48, // 头像露出一半
  TAB_HEIGHT: 48,
  SOCIAL_STATS_HEIGHT: 60,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} as const;

// 动画配置
export const ANIMATION = {
  TAB_SWITCH_DURATION: 200,
  BUTTON_PRESS_DURATION: 150,
  SCROLL_THRESHOLD: 100,
} as const;

// 页面配置
export const PAGE_CONFIG = {
  REFRESH_COOLDOWN: 5000,
  PAGE_SIZE: 20,
  MASONRY_COLUMNS: 2,
  MASONRY_GAP: 8,
} as const;

