/**
 * MainPage 类型定义
 */

import { StyleProp, ViewStyle } from 'react-native';

// 主页面组件Props
export interface MainPageProps {
  style?: StyleProp<ViewStyle>;
}

// 页面状态类型
export interface MainPageState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastRefreshTime: number;
}

// 页面配置类型
export interface PageConfig {
  sections: PageSection[];
  theme: PageTheme;
  layout: PageLayout;
}

// 页面区域类型
export interface PageSection {
  id: string;
  name: string;
  enabled: boolean;
  loading: boolean;
  config: Record<string, any>;
}

// 页面主题类型
export interface PageTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
  };
  typography: {
    heading: any;
    body: any;
    caption: any;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// 页面布局类型
export interface PageLayout {
  header: {
    height: number;
    backgroundColor: string;
  };
  content: {
    paddingHorizontal: number;
    backgroundColor: string;
  };
  section: {
    marginBottom: number;
  };
}

// 用户交互状态类型
export interface UserInteraction {
  selectedFilter: string;
  searchQuery: string;
  scrollPosition: number;
  activeSection: string;
}

// 导航参数类型
export interface NavigationParams {
  route: string;
  params?: Record<string, any>;
}

// 埋点数据类型
export interface TrackingData {
  page: string;
  section: string;
  action: string;
  timestamp: number;
  extra?: Record<string, any>;
}
