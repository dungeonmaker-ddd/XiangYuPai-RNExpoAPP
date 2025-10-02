/**
 * SearchMainPage 类型定义
 */

import { StyleProp, ViewStyle } from 'react-native';

// 搜索主页面Props
export interface SearchMainPageProps {
  initialQuery?: string;
  style?: StyleProp<ViewStyle>;
}

// 搜索分类
export type SearchCategory = 'all' | 'users' | 'services' | 'content';

// 搜索历史项
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
  category: SearchCategory;
}

// 搜索建议
export interface SearchSuggestion {
  id: string;
  text: string;
  highlightText: string;
  category: 'user' | 'service' | 'game' | 'keyword';
  icon: string;
  resultCount?: number;
  priority: number;
}

// 热门搜索项
export interface HotSearchItem {
  id: string;
  query: string;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

// 搜索结果（用户）
export interface UserSearchResult {
  userId: string;
  nickname: string;
  avatar: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  price: number;
  isOnline: boolean;
  location: {
    city: string;
    distance: number;
  };
}

// 搜索结果（服务）
export interface ServiceSearchResult {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  icon: string;
  providerCount: number;
  averagePrice: number;
  averageRating: number;
}

// 搜索结果（内容）
export interface ContentSearchResult {
  contentId: string;
  title: string;
  type: 'post' | 'topic' | 'announcement';
  excerpt: string;
  author: {
    userId: string;
    nickname: string;
    avatar: string;
  };
  createdAt: string;
  viewCount: number;
}

// 搜索结果集合
export interface SearchResults {
  users: {
    data: UserSearchResult[];
    totalCount: number;
    hasMore: boolean;
  };
  services: {
    data: ServiceSearchResult[];
    totalCount: number;
    hasMore: boolean;
  };
  content: {
    data: ContentSearchResult[];
    totalCount: number;
    hasMore: boolean;
  };
  totalResults: number;
}

// 搜索视图状态
export type SearchViewState = 'empty' | 'suggestions' | 'results' | 'loading' | 'error';
