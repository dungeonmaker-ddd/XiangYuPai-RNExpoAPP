/**
 * Config Store - 配置信息状态管理
 * 使用Zustand实现组件配置、主题设置等状态管理
 */

import React from 'react';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSafeStorage } from './storage-config';

// 主题色彩配置类型
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// 主题尺寸配置类型
interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// 主题字体配置类型
interface ThemeTypography {
  h1: { fontSize: number; fontWeight: string; lineHeight: number };
  h2: { fontSize: number; fontWeight: string; lineHeight: number };
  h3: { fontSize: number; fontWeight: string; lineHeight: number };
  h4: { fontSize: number; fontWeight: string; lineHeight: number };
  body1: { fontSize: number; fontWeight: string; lineHeight: number };
  body2: { fontSize: number; fontWeight: string; lineHeight: number };
  caption: { fontSize: number; fontWeight: string; lineHeight: number };
  button: { fontSize: number; fontWeight: string; lineHeight: number };
}

// 主题配置类型
export interface ThemeConfig {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: any;
    md: any;
    lg: any;
  };
}

// 组件配置类型
export interface ComponentConfig {
  id: string;
  name: string;
  enabled: boolean;
  version: string;
  config: Record<string, any>;
  lastUpdated: number;
}

// 系统配置类型
export interface SystemConfig {
  appVersion: string;
  apiVersion: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxImageSize: number;
    maxVideoSize: number;
    maxCacheSize: number;
    sessionTimeout: number;
  };
}

// 用户偏好设置类型
export interface UserPreferences {
  language: string;
  colorScheme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    types: {
      messages: boolean;
      follows: boolean;
      likes: boolean;
      comments: boolean;
      system: boolean;
    };
  };
  privacy: {
    showOnlineStatus: boolean;
    allowLocationTracking: boolean;
    showInSearch: boolean;
    allowDirectMessages: boolean;
  };
  performance: {
    enableAnimations: boolean;
    enableHapticFeedback: boolean;
    autoPlayVideos: boolean;
    dataUsageMode: 'normal' | 'saving' | 'unlimited';
  };
}

// Config Store状态类型
interface ConfigState {
  // 主题配置
  theme: {
    current: 'light' | 'dark';
    config: ThemeConfig;
    loading: boolean;
    error: string | null;
  };
  
  // 组件配置
  componentConfigs: {
    [componentId: string]: ComponentConfig;
  };
  
  // 系统配置
  system: SystemConfig;
  
  // 用户偏好
  userPreferences: UserPreferences;
  
  // 网络状态
  networkStatus: 'online' | 'offline' | 'slow';
  
  // 设备信息
  deviceInfo: {
    platform: string;
    version: string;
    model: string;
    screenSize: { width: number; height: number };
  };
  
  // Actions
  loadThemeConfig: (theme?: 'light' | 'dark') => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => void;
  
  loadComponentConfig: (componentId: string) => Promise<ComponentConfig | null>;
  updateComponentConfig: (componentId: string, config: Partial<ComponentConfig>) => void;
  
  loadSystemConfig: () => Promise<void>;
  
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  
  updateNetworkStatus: (status: 'online' | 'offline' | 'slow') => void;
  initializeDeviceInfo: () => void;
  
  clearConfigCache: () => void;
  resetConfigState: () => void;
}

// 默认主题配置
const defaultThemes = {
  light: {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      card: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      notification: '#EF4444',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
      h2: { fontSize: 28, fontWeight: '600', lineHeight: 36 },
      h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      h4: { fontSize: 20, fontWeight: '500', lineHeight: 28 },
      body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
      body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
      button: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  },
  dark: {
    colors: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#111827',
      surface: '#1F2937',
      card: '#374151',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#4B5563',
      notification: '#F87171',
      error: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
      info: '#60A5FA',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
      h2: { fontSize: 28, fontWeight: '600', lineHeight: 36 },
      h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      h4: { fontSize: 20, fontWeight: '500', lineHeight: 28 },
      body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
      body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
      button: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  },
} as const;

// 初始状态
const initialState = {
  theme: {
    current: 'light' as const,
    config: defaultThemes.light,
    loading: false,
    error: null,
  },
  componentConfigs: {},
  system: {
    appVersion: '1.0.0',
    apiVersion: 'v1',
    environment: 'development' as const,
    features: {
      newHomepage: true,
      enhancedSearch: true,
      videoChat: false,
      liveStreaming: false,
    },
    limits: {
      maxImageSize: 10 * 1024 * 1024, // 10MB
      maxVideoSize: 100 * 1024 * 1024, // 100MB
      maxCacheSize: 500 * 1024 * 1024, // 500MB
      sessionTimeout: 30 * 60 * 1000, // 30分钟
    },
  },
  userPreferences: {
    language: 'zh-CN',
    colorScheme: 'auto' as const,
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
      types: {
        messages: true,
        follows: true,
        likes: true,
        comments: true,
        system: true,
      },
    },
    privacy: {
      showOnlineStatus: true,
      allowLocationTracking: true,
      showInSearch: true,
      allowDirectMessages: true,
    },
    performance: {
      enableAnimations: true,
      enableHapticFeedback: true,
      autoPlayVideos: true,
      dataUsageMode: 'normal' as const,
    },
  },
  networkStatus: 'online' as const,
  deviceInfo: {
    platform: '',
    version: '',
    model: '',
    screenSize: { width: 0, height: 0 },
  },
};

// Config Store实现
export const useConfigStore = create<ConfigState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 加载主题配置
        loadThemeConfig: async (theme?: 'light' | 'dark') => {
          set(prevState => ({
            theme: {
              ...prevState.theme,
              loading: true,
              error: null,
            },
          }));
          
          try {
            const targetTheme = theme || get().theme.current;
            
            // TODO: 可以从远程加载自定义主题
            await new Promise(resolve => setTimeout(resolve, 300));
            
            set(prevState => ({
              theme: {
                ...prevState.theme,
                current: targetTheme,
                config: defaultThemes[targetTheme],
                loading: false,
              },
            }));
          } catch (error) {
            set(prevState => ({
              theme: {
                ...prevState.theme,
                loading: false,
                error: error instanceof Error ? error.message : '主题加载失败',
              },
            }));
          }
        },

        // 更新主题
        updateTheme: (theme: 'light' | 'dark') => {
          set(prevState => ({
            theme: {
              ...prevState.theme,
              current: theme,
              config: defaultThemes[theme],
            },
          }));
        },

        // 加载组件配置
        loadComponentConfig: async (componentId: string): Promise<ComponentConfig | null> => {
          try {
            // TODO: 从远程API加载组件配置
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const mockConfig: ComponentConfig = {
              id: componentId,
              name: `${componentId} Component`,
              enabled: true,
              version: '1.0.0',
              config: {
                // 根据不同组件返回不同配置
                ...(componentId === 'main-page' && {
                  layout: 'vertical',
                  enableRefresh: true,
                  cacheEnabled: true,
                  maxItems: 50,
                }),
                ...(componentId === 'user-list' && {
                  itemsPerPage: 20,
                  enableInfiniteScroll: true,
                  showAvatars: true,
                  showRatings: true,
                }),
                ...(componentId === 'service-grid' && {
                  columns: 5,
                  rows: 2,
                  iconSize: 'medium',
                  showLabels: true,
                }),
              },
              lastUpdated: Date.now(),
            };
            
            // 更新本地缓存
            set(prevState => ({
              componentConfigs: {
                ...prevState.componentConfigs,
                [componentId]: mockConfig,
              },
            }));
            
            return mockConfig;
          } catch (error) {
            console.error(`加载组件配置失败 (${componentId}):`, error);
            return null;
          }
        },

        // 更新组件配置
        updateComponentConfig: (componentId: string, config: Partial<ComponentConfig>) => {
          set(prevState => {
            const existingConfig = prevState.componentConfigs[componentId];
            if (!existingConfig) return prevState;
            
            return {
              componentConfigs: {
                ...prevState.componentConfigs,
                [componentId]: {
                  ...existingConfig,
                  ...config,
                  lastUpdated: Date.now(),
                },
              },
            };
          });
        },

        // 加载系统配置
        loadSystemConfig: async () => {
          try {
            // TODO: 从远程API加载系统配置
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const mockSystemConfig = {
              appVersion: '1.0.0',
              apiVersion: 'v1',
              environment: 'development' as const,
              features: {
                newHomepage: true,
                enhancedSearch: true,
                videoChat: true, // 模拟功能开关更新
                liveStreaming: false,
                darkMode: true,
                pushNotifications: true,
              },
              limits: {
                maxImageSize: 15 * 1024 * 1024, // 更新为15MB
                maxVideoSize: 200 * 1024 * 1024, // 更新为200MB
                maxCacheSize: 1024 * 1024 * 1024, // 更新为1GB
                sessionTimeout: 60 * 60 * 1000, // 更新为60分钟
              },
            };
            
            set({ system: mockSystemConfig });
          } catch (error) {
            console.error('系统配置加载失败:', error);
          }
        },

        // 更新用户偏好
        updateUserPreferences: (preferences: Partial<UserPreferences>) => {
          set(prevState => ({
            userPreferences: {
              ...prevState.userPreferences,
              ...preferences,
            },
          }));
        },

        // 更新网络状态
        updateNetworkStatus: (status: 'online' | 'offline' | 'slow') => {
          set({ networkStatus: status });
        },

        // 初始化设备信息
        initializeDeviceInfo: () => {
          // TODO: 获取实际设备信息
          // import { Platform, Dimensions } from 'react-native';
          // import DeviceInfo from 'react-native-device-info';
          
          const { width, height } = { width: 375, height: 812 }; // 模拟屏幕尺寸
          
          set({
            deviceInfo: {
              platform: 'ios', // Platform.OS
              version: '17.0', // Platform.Version
              model: 'iPhone 14', // DeviceInfo.getModel()
              screenSize: { width, height },
            },
          });
        },

        // 清除配置缓存
        clearConfigCache: () => {
          set({
            componentConfigs: {},
          });
        },

        // 重置配置状态
        resetConfigState: () => {
          set(initialState);
        },
      }),
      {
        name: 'config-store',
        storage: createSafeStorage(),
        partialize: (state) => ({
          theme: {
            current: state.theme.current,
          },
          userPreferences: state.userPreferences,
          componentConfigs: state.componentConfigs,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('[ConfigStore] 存储恢复成功');
          }
        },
      }
    ),
    {
      name: 'ConfigStore',
    }
  )
);

// 选择器函数
export const useTheme = () => useConfigStore(state => state.theme);
export const useComponentConfigs = () => useConfigStore(state => state.componentConfigs);
export const useSystemConfig = () => useConfigStore(state => state.system);
export const useUserPreferences = () => useConfigStore(state => state.userPreferences);
export const useNetworkStatus = () => useConfigStore(state => state.networkStatus);
export const useDeviceInfo = () => useConfigStore(state => state.deviceInfo);

// 主题相关的便捷选择器
export const useColors = () => useConfigStore(state => state.theme.config.colors);
export const useSpacing = () => useConfigStore(state => state.theme.config.spacing);
export const useTypography = () => useConfigStore(state => state.theme.config.typography);

// 系统色彩方案监听Hook
export const useColorScheme = () => {
  const { userPreferences, updateTheme } = useConfigStore();
  const systemColorScheme = Appearance.getColorScheme();
  
  React.useEffect(() => {
    if (userPreferences.colorScheme === 'auto') {
      const theme = systemColorScheme === 'dark' ? 'dark' : 'light';
      updateTheme(theme);
    }
  }, [systemColorScheme, userPreferences.colorScheme, updateTheme]);
  
  return systemColorScheme;
};
