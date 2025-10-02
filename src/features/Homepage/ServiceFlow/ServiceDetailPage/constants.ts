/**
 * ServiceDetailPage 常量配置
 */

import { Dimensions } from 'react-native';
import type { ServiceCategory, ServiceType } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 服务详情页面常量
export const SERVICE_DETAIL_CONSTANTS = {
  // 颜色配置
  COLORS: {
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F8FAFC',
    PRIMARY: '#6366F1',
    TEXT: '#1F2937',
    TEXT_SECONDARY: '#6B7280',
    TEXT_LIGHT: '#9CA3AF',
    BORDER: '#E5E7EB',
    ONLINE: '#10B981',
    BUSY: '#F59E0B',
    OFFLINE: '#9CA3AF',
  },

  // 尺寸配置
  SIZES: {
    NAVIGATION_HEIGHT: 56,
    FILTER_BAR_HEIGHT: 48,
    SERVICE_TAG_BAR_HEIGHT: 48,
    GAME_BANNER_HEIGHT: 100,
    CARD_PADDING: 16,
    CARD_SPACING: 12,
    BORDER_RADIUS: 12,
    
    // 卡片尺寸
    GAME_PROVIDER_CARD_HEIGHT: 160,
    LIFESTYLE_PROVIDER_CARD_HEIGHT: 180,
    
    // 头像尺寸
    AVATAR_SIZE: 48,
    STATUS_DOT_SIZE: 12,
  },

  // 分页配置
  PAGINATION: {
    PAGE_SIZE: 20,
    LOAD_MORE_THRESHOLD: 3,
  },
};

// 服务类型映射
export const SERVICE_TYPE_MAP: Record<ServiceType, { name: string; category: ServiceCategory; icon: string }> = {
  // 游戏类服务
  honor_of_kings: {
    name: '王者荣耀',
    category: 'game',
    icon: '👑',
  },
  league_of_legends: {
    name: '英雄联盟',
    category: 'game',
    icon: '⚔️',
  },
  pubg_mobile: {
    name: '和平精英',
    category: 'game',
    icon: '🔫',
  },
  brawl_stars: {
    name: '荒野乱斗',
    category: 'game',
    icon: '⭐',
  },
  
  // 生活服务类
  explore_shop: {
    name: '探店',
    category: 'lifestyle',
    icon: '🏪',
  },
  private_cinema: {
    name: '私影',
    category: 'lifestyle',
    icon: '🎬',
  },
  billiards: {
    name: '台球',
    category: 'lifestyle',
    icon: '🎱',
  },
  ktv: {
    name: 'K歌',
    category: 'lifestyle',
    icon: '🎤',
  },
  drinking: {
    name: '喝酒',
    category: 'lifestyle',
    icon: '🍻',
  },
  massage: {
    name: '按摩',
    category: 'lifestyle',
    icon: '💆',
  },
};

// 服务主题配置
export const SERVICE_THEME_MAP: Record<ServiceType, { primaryColor: string; gradient: string[] }> = {
  // 游戏类主题
  honor_of_kings: {
    primaryColor: '#DAA520',
    gradient: ['#DAA520', '#FFD700'],
  },
  league_of_legends: {
    primaryColor: '#1E3A8A',
    gradient: ['#1E3A8A', '#3B82F6'],
  },
  pubg_mobile: {
    primaryColor: '#166534',
    gradient: ['#166534', '#22C55E'],
  },
  brawl_stars: {
    primaryColor: '#EA580C',
    gradient: ['#EA580C', '#FB923C'],
  },
  
  // 生活服务类主题
  explore_shop: {
    primaryColor: '#1976D2',
    gradient: ['#1976D2', '#42A5F5'],
  },
  private_cinema: {
    primaryColor: '#1565C0',
    gradient: ['#1565C0', '#1E88E5'],
  },
  billiards: {
    primaryColor: '#388E3C',
    gradient: ['#388E3C', '#66BB6A'],
  },
  ktv: {
    primaryColor: '#E91E63',
    gradient: ['#E91E63', '#F06292'],
  },
  drinking: {
    primaryColor: '#F57C00',
    gradient: ['#F57C00', '#FFA726'],
  },
  massage: {
    primaryColor: '#7B1FA2',
    gradient: ['#7B1FA2', '#AB47BC'],
  },
};

// 筛选选项
export const FILTER_OPTIONS = {
  SORT_BY: {
    SMART: { id: 'smart', label: '智能排序' },
    PRICE: { id: 'price', label: '价格最低' },
    RATING: { id: 'rating', label: '评分最高' },
    DISTANCE: { id: 'distance', label: '距离最近' },
  },
  
  GENDER: {
    ALL: { id: 'all', label: '不限' },
    MALE: { id: 'male', label: '仅男性' },
    FEMALE: { id: 'female', label: '仅女性' },
  },
};

// 游戏服务标签
export const GAME_SERVICE_TAGS: Record<string, Array<{ id: string; name: string }>> = {
  honor_of_kings: [
    { id: 'rank_up', name: '上分' },
    { id: 'companion', name: '陪玩' },
    { id: 'voice', name: '语音' },
    { id: 'coaching', name: '代练' },
    { id: 'spectate', name: '观战' },
  ],
  league_of_legends: [
    { id: 'rank_up', name: '上分' },
    { id: 'companion', name: '陪玩' },
    { id: 'coaching', name: '教学' },
  ],
  pubg_mobile: [
    { id: 'rank_up', name: '上分' },
    { id: 'companion', name: '陪玩' },
    { id: 'coaching', name: '技术指导' },
  ],
  brawl_stars: [
    { id: 'companion', name: '陪玩' },
    { id: 'coaching', name: '技术指导' },
  ],
};

// 生活服务标签
export const LIFESTYLE_SERVICE_TAGS: Record<string, Array<{ id: string; name: string }>> = {
  explore_shop: [
    { id: 'food', name: '美食探店' },
    { id: 'shopping', name: '购物陪同' },
  ],
  private_cinema: [
    { id: 'watch', name: '观影陪伴' },
    { id: 'explain', name: '电影解说' },
  ],
  billiards: [
    { id: 'teach', name: '技术指导' },
    { id: 'practice', name: '陪练对战' },
  ],
  ktv: [
    { id: 'sing', name: 'K歌陪同' },
    { id: 'vocal', name: '声乐指导' },
  ],
  drinking: [
    { id: 'gather', name: '酒友聚会' },
    { id: 'tasting', name: '品酒体验' },
  ],
  massage: [
    { id: 'massage', name: '按摩服务' },
    { id: 'health', name: '健康咨询' },
  ]
};

// 路由常量
export const SERVICE_DETAIL_ROUTES = {
  USER_DETAIL: '/modal/user-detail',
  FILTER_ONLINE: '/(tabs)/homepage/filter-online',
  FILTER_OFFLINE: '/(tabs)/homepage/filter-offline',
  SEARCH: '/(tabs)/homepage/search',
  BOOKING: '/booking',
  CHAT: '/messages/chat',
} as const;
