/**
 * MessageItem Constants - 消息列表项常量配置
 */

/**
 * 颜色配置 (统一现有Button组件配色)
 */
export const COLORS = {
  background: '#FFFFFF',
  backgroundPressed: '#F9FAFB',
  border: '#F3F4F6',
  
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTime: '#9CA3AF',
  
  unreadBadge: '#EF4444',
  unreadBadgeText: '#FFFFFF',
  
  onlineStatus: '#10B981',
} as const;

/**
 * 尺寸配置
 */
export const SIZES = {
  containerHeight: 80,
  avatarSize: 48,
  unreadBadgeSize: 20,
  unreadBadgeMinWidth: 20,
  onlineStatusSize: 12,
} as const;

/**
 * 字体配置
 */
export const TYPOGRAPHY = {
  titleSize: 16,
  subtitleSize: 14,
  timeSize: 12,
  badgeSize: 10,
} as const;

/**
 * 间距配置
 */
export const SPACING = {
  containerPadding: 16,
  avatarMarginRight: 12,
  titleMarginBottom: 4,
  timeMarginBottom: 4,
  badgePaddingHorizontal: 6,
} as const;

/**
 * 动画配置
 */
export const ANIMATION = {
  pressScale: 0.98,
  pressDuration: 100,
  releaseSpringTension: 300,
  releaseSpringFriction: 10,
} as const;
