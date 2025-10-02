/**
 * 主题设计系统
 * 统一管理颜色、尺寸、字体等设计token
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 颜色系统
export const COLORS = {
  // 主色调
  PRIMARY: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // 主色
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // 辅助色
  SECONDARY: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },
  
  // 语义化颜色
  SUCCESS: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  WARNING: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  ERROR: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // 中性色
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 特殊颜色
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // 渐变色
  GRADIENTS: {
    PRIMARY: ['#6366F1', '#8B5CF6'],
    SECONDARY: ['#8B5CF6', '#A855F7'],
    SUCCESS: ['#10B981', '#34D399'],
    WARNING: ['#F59E0B', '#FBBF24'],
    ERROR: ['#EF4444', '#F87171'],
    SUNSET: ['#FF6B6B', '#FFE66D'],
    OCEAN: ['#667EEA', '#764BA2'],
    FOREST: ['#134E5E', '#71B280'],
  },
  
  // 透明度变体
  ALPHA: {
    WHITE_10: 'rgba(255, 255, 255, 0.1)',
    WHITE_20: 'rgba(255, 255, 255, 0.2)',
    WHITE_30: 'rgba(255, 255, 255, 0.3)',
    WHITE_40: 'rgba(255, 255, 255, 0.4)',
    WHITE_50: 'rgba(255, 255, 255, 0.5)',
    WHITE_60: 'rgba(255, 255, 255, 0.6)',
    WHITE_70: 'rgba(255, 255, 255, 0.7)',
    WHITE_80: 'rgba(255, 255, 255, 0.8)',
    WHITE_90: 'rgba(255, 255, 255, 0.9)',
    
    BLACK_10: 'rgba(0, 0, 0, 0.1)',
    BLACK_20: 'rgba(0, 0, 0, 0.2)',
    BLACK_30: 'rgba(0, 0, 0, 0.3)',
    BLACK_40: 'rgba(0, 0, 0, 0.4)',
    BLACK_50: 'rgba(0, 0, 0, 0.5)',
    BLACK_60: 'rgba(0, 0, 0, 0.6)',
    BLACK_70: 'rgba(0, 0, 0, 0.7)',
    BLACK_80: 'rgba(0, 0, 0, 0.8)',
    BLACK_90: 'rgba(0, 0, 0, 0.9)',
  },
} as const;

// 间距系统（基于8px网格）
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
} as const;

// 字体系统
export const TYPOGRAPHY = {
  // 字体大小
  FONT_SIZE: {
    XS: 10,
    SM: 12,
    BASE: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 28,
    DISPLAY_SM: 32,
    DISPLAY_MD: 36,
    DISPLAY_LG: 40,
    DISPLAY_XL: 48,
  },
  
  // 字重
  FONT_WEIGHT: {
    LIGHT: '300',
    REGULAR: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
  },
  
  // 行高
  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
  
  // 字体族
  FONT_FAMILY: {
    SYSTEM: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    MONO: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
} as const;

// 圆角系统
export const BORDER_RADIUS = {
  NONE: 0,
  XS: 2,
  SM: 4,
  BASE: 6,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 20,
  FULL: 9999,
} as const;

// 阴影系统
export const SHADOWS = {
  XS: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    android: {
      elevation: 1,
    },
  }),
  
  SM: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  
  BASE: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 3,
    },
  }),
  
  MD: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
  }),
  
  LG: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
    },
    android: {
      elevation: 8,
    },
  }),
  
  XL: Platform.select({
    ios: {
      shadowColor: COLORS.BLACK,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
    },
    android: {
      elevation: 12,
    },
  }),
} as const;

// 尺寸系统
export const SIZES = {
  // 屏幕尺寸
  SCREEN: {
    WIDTH: SCREEN_WIDTH,
    HEIGHT: SCREEN_HEIGHT,
  },
  
  // 安全区域
  SAFE_AREA: {
    TOP: Platform.OS === 'ios' ? 44 : 0,
    BOTTOM: Platform.OS === 'ios' ? 34 : 0,
  },
  
  // 常用组件尺寸
  BUTTON: {
    HEIGHT: {
      SM: 32,
      BASE: 40,
      MD: 44,
      LG: 48,
      XL: 56,
    },
  },
  
  INPUT: {
    HEIGHT: {
      SM: 32,
      BASE: 40,
      MD: 44,
      LG: 48,
    },
  },
  
  ICON: {
    XS: 12,
    SM: 16,
    BASE: 20,
    MD: 24,
    LG: 28,
    XL: 32,
    XXL: 40,
  },
  
  AVATAR: {
    XS: 24,
    SM: 32,
    BASE: 40,
    MD: 48,
    LG: 56,
    XL: 64,
    XXL: 80,
  },
} as const;

// 断点系统（响应式）
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
} as const;

// Z-index系统
export const Z_INDEX = {
  HIDE: -1,
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  SYSTEM: 1090,
} as const;

// 动画系统
export const ANIMATIONS = {
  DURATION: {
    INSTANT: 0,
    FAST: 150,
    BASE: 200,
    SLOW: 300,
    SLOWER: 500,
    SLOWEST: 1000,
  },
  
  EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
  
  SPRING: {
    BOUNCY: { tension: 300, friction: 8 },
    SMOOTH: { tension: 280, friction: 10 },
    GENTLE: { tension: 250, friction: 12 },
  },
} as const;

// 布局系统
export const LAYOUT = {
  CONTAINER: {
    MAX_WIDTH: 1200,
    PADDING: SPACING.MD,
  },
  
  GRID: {
    COLUMNS: 12,
    GUTTER: SPACING.MD,
  },
  
  HEADER: {
    HEIGHT: Platform.OS === 'ios' ? 88 : 64,
  },
  
  TAB_BAR: {
    HEIGHT: Platform.OS === 'ios' ? 84 : 60,
  },
  
  BOTTOM_SHEET: {
    MIN_HEIGHT: 200,
    MAX_HEIGHT: SCREEN_HEIGHT * 0.9,
  },
} as const;

// 主题模式
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 亮色主题
export const LIGHT_THEME = {
  colors: {
    primary: COLORS.PRIMARY[500],
    primaryLight: COLORS.PRIMARY[400],
    primaryDark: COLORS.PRIMARY[600],
    
    secondary: COLORS.SECONDARY[500],
    secondaryLight: COLORS.SECONDARY[400],
    secondaryDark: COLORS.SECONDARY[600],
    
    success: COLORS.SUCCESS[500],
    warning: COLORS.WARNING[500],
    error: COLORS.ERROR[500],
    
    background: COLORS.WHITE,
    surface: COLORS.GRAY[50],
    card: COLORS.WHITE,
    
    text: COLORS.GRAY[800],
    textSecondary: COLORS.GRAY[600],
    textLight: COLORS.GRAY[500],
    textInverse: COLORS.WHITE,
    
    border: COLORS.GRAY[200],
    borderLight: COLORS.GRAY[100],
    
    overlay: COLORS.ALPHA.BLACK_50,
    overlayLight: COLORS.ALPHA.BLACK_20,
    
    // Tab相关
    tabBackground: COLORS.WHITE,
    tabActiveText: COLORS.PRIMARY[500],
    tabInactiveText: COLORS.GRAY[500],
    
    // 状态栏
    statusBar: COLORS.PRIMARY[500],
  },
  
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  sizes: SIZES,
  layout: LAYOUT,
  animations: ANIMATIONS,
} as const;

// 暗色主题
export const DARK_THEME = {
  colors: {
    primary: COLORS.PRIMARY[400],
    primaryLight: COLORS.PRIMARY[300],
    primaryDark: COLORS.PRIMARY[500],
    
    secondary: COLORS.SECONDARY[400],
    secondaryLight: COLORS.SECONDARY[300],
    secondaryDark: COLORS.SECONDARY[500],
    
    success: COLORS.SUCCESS[400],
    warning: COLORS.WARNING[400],
    error: COLORS.ERROR[400],
    
    background: COLORS.GRAY[900],
    surface: COLORS.GRAY[800],
    card: COLORS.GRAY[700],
    
    text: COLORS.GRAY[100],
    textSecondary: COLORS.GRAY[300],
    textLight: COLORS.GRAY[400],
    textInverse: COLORS.GRAY[900],
    
    border: COLORS.GRAY[600],
    borderLight: COLORS.GRAY[700],
    
    overlay: COLORS.ALPHA.BLACK_70,
    overlayLight: COLORS.ALPHA.BLACK_50,
    
    // Tab相关
    tabBackground: COLORS.GRAY[800],
    tabActiveText: COLORS.PRIMARY[400],
    tabInactiveText: COLORS.GRAY[400],
    
    // 状态栏
    statusBar: COLORS.GRAY[900],
  },
  
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  sizes: SIZES,
  layout: LAYOUT,
  animations: ANIMATIONS,
} as const;

// 主题类型
export type Theme = typeof LIGHT_THEME;
export type ThemeColors = Theme['colors'];
export type ThemeMode = keyof typeof THEME_MODES;

// 默认主题
export const DEFAULT_THEME = LIGHT_THEME;

// 导出主题
export const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
} as const;
