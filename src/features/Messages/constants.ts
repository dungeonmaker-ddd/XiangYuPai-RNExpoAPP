/**
 * Messages Module Constants - 消息模块常量配置
 * 
 * 包含所有页面、组件的常量配置
 */

// ============================================
// 路由常量
// ============================================

/**
 * 消息模块路由配置
 */
export const MESSAGES_ROUTES = {
  MAIN: '/(tabs)/messages',
  LIKES: '/(tabs)/messages/likes',
  COMMENTS: '/(tabs)/messages/comments',
  FOLLOWERS: '/(tabs)/messages/followers',
  NOTIFICATIONS: '/(tabs)/messages/notifications',
  CHAT: (conversationId: string) => `/(tabs)/messages/chat/${conversationId}`,
} as const;

// ============================================
// 消息分类配置
// ============================================

/**
 * 消息分类卡片配置
 */
export const MESSAGE_CATEGORIES = [
  {
    id: 'likes',
    title: '赞和收藏',
    icon: 'heart',
    route: MESSAGES_ROUTES.LIKES,
  },
  {
    id: 'comments',
    title: '评论',
    icon: 'comment',
    route: MESSAGES_ROUTES.COMMENTS,
  },
  {
    id: 'followers',
    title: '粉丝',
    icon: 'user-plus',
    route: MESSAGES_ROUTES.FOLLOWERS,
  },
  {
    id: 'notifications',
    title: '系统通知',
    icon: 'bell',
    route: MESSAGES_ROUTES.NOTIFICATIONS,
  },
] as const;

// ============================================
// 颜色配置 (统一现有Button组件配色)
// ============================================

/**
 * 消息模块颜色配置
 */
export const MESSAGES_COLORS = {
  // 主题色 (与现有Button组件统一)
  PRIMARY: '#6366F1',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  
  // 消息模块专用颜色
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F9FAFB',
  BORDER: '#E5E7EB',
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  TEXT_TERTIARY: '#9CA3AF',
  UNREAD_BADGE: '#EF4444',
  ONLINE_STATUS: '#10B981',
  
  // 消息气泡颜色
  BUBBLE_SELF: '#6366F1',
  BUBBLE_OTHER: '#F3F4F6',
  BUBBLE_SELF_TEXT: '#FFFFFF',
  BUBBLE_OTHER_TEXT: '#1F2937',
} as const;

// ============================================
// 尺寸配置
// ============================================

/**
 * 间距配置
 */
export const MESSAGES_SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

/**
 * 组件尺寸配置
 */
export const MESSAGES_SIZES = {
  // 头像尺寸
  AVATAR: {
    SMALL: 24,
    MEDIUM: 36,
    LARGE: 48,
    XLARGE: 64,
  },
  
  // 列表项高度
  LIST_ITEM_HEIGHT: 80,
  
  // 消息气泡最大宽度
  BUBBLE_MAX_WIDTH: 280,
  
  // 导航栏高度
  NAVIGATION_HEIGHT: 56,
} as const;

/**
 * 字体大小配置
 */
export const MESSAGES_TYPOGRAPHY = {
  TITLE: 16,
  SUBTITLE: 14,
  BODY: 14,
  CAPTION: 12,
  TIME: 12,
} as const;

// ============================================
// 时间格式化配置
// ============================================

/**
 * 时间格式化阈值 (毫秒)
 */
export const TIME_THRESHOLDS = {
  JUST_NOW: 60 * 1000,        // 1分钟
  MINUTES: 60 * 60 * 1000,    // 1小时
  HOURS: 24 * 60 * 60 * 1000, // 1天
  DAYS: 7 * 24 * 60 * 60 * 1000, // 7天
} as const;

// ============================================
// API配置
// ============================================

/**
 * API端点配置
 */
export const API_ENDPOINTS = {
  // 对话相关
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_DETAIL: (id: string) => `/api/conversations/${id}`,
  MARK_AS_READ: (id: string) => `/api/conversations/${id}/read`,
  DELETE_CONVERSATION: (id: string) => `/api/conversations/${id}`,
  UNREAD_COUNT: '/api/conversations/unread-count',
  
  // 聊天相关
  MESSAGES: (chatId: string) => `/api/chats/${chatId}/messages`,
  SEND_MESSAGE: (chatId: string) => `/api/chats/${chatId}/messages`,
  MARK_MESSAGES_READ: (chatId: string) => `/api/chats/${chatId}/messages/read`,
  
  // 通知相关
  NOTIFICATIONS: (type: string) => `/api/notifications/${type}`,
  CLEAR_NOTIFICATIONS: (type: string) => `/api/notifications/${type}`,
} as const;

// ============================================
// WebSocket配置
// ============================================

/**
 * WebSocket事件配置
 */
export const SOCKET_EVENTS = {
  // 客户端发送
  SEND_MESSAGE: 'send_message',
  TYPING_START: 'typing_start',
  TYPING_END: 'typing_end',
  
  // 服务端发送
  NEW_MESSAGE: 'new_message',
  USER_TYPING: 'user_typing',
  MESSAGE_READ: 'message_read',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
} as const;

/**
 * WebSocket配置
 */
export const WEBSOCKET_CONFIG = {
  RECONNECT_DELAY: 1000,
  RECONNECT_DELAY_MAX: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  TIMEOUT: 10000,
} as const;

// ============================================
// 分页配置
// ============================================

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
} as const;

// ============================================
// 动画配置
// ============================================

/**
 * 动画时长配置
 */
export const ANIMATION_DURATION = {
  QUICK: 100,
  NORMAL: 200,
  SLOW: 300,
} as const;

// ============================================
// 错误消息配置
// ============================================

/**
 * 错误消息配置
 */
export const ERROR_MESSAGES = {
  LOAD_CONVERSATIONS_FAILED: '加载对话列表失败',
  LOAD_MESSAGES_FAILED: '加载消息失败',
  SEND_MESSAGE_FAILED: '发送消息失败',
  DELETE_CONVERSATION_FAILED: '删除对话失败',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  WEBSOCKET_CONNECT_FAILED: 'WebSocket连接失败',
} as const;
