/**
 * Homepage Store - 首页状态管理
 * 使用Zustand实现首页相关状态管理
 * 
 * 版本: v2.0 - 集成真实后端API + 完善日志
 * 更新: 2025-10-22
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { homepageApiEnhanced } from '../services/api/homepageApiEnhanced';
import { createSafeStorage } from './storage-config';

// 页面配置类型
export interface PageConfig {
  topFunction: {
    enabled: boolean;
    config: Record<string, any>;
  };
  gameBanner: {
    enabled: boolean;
    config: Record<string, any>;
  };
  serviceGrid: {
    enabled: boolean;
    config: Record<string, any>;
  };
  featuredUsers: {
    enabled: boolean;
    config: Record<string, any>;
  };
  eventCenter: {
    enabled: boolean;
    config: Record<string, any>;
  };
  userList: {
    enabled: boolean;
    config: Record<string, any>;
  };
}

// 页面数据类型
export interface PageData {
  featuredUsers: Array<{
    id: string;
    name: string;
    avatar: string;
    tags: string[];
    price: number;
    rating: number;
  }>;
  serviceItems: Array<{
    id: string;
    name: string;
    icon: string;
    type: string;
    enabled: boolean;
  }>;
  bannerData: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    gameId: string;
  };
}

// 用户交互状态类型
export interface UserInteraction {
  selectedFilter: string;
  searchQuery: string;
  scrollPosition: number;
  activeSection: string;
}

// 首页Store状态类型
interface HomepageState {
  // 页面配置状态
  pageConfig: PageConfig | null;
  
  // 页面数据状态
  pageData: PageData | null;
  
  // 用户交互状态
  userInteraction: UserInteraction;
  
  // 加载状态
  loading: {
    pageConfig: boolean;
    pageData: boolean;
    featuredUsers: boolean;
  };
  
  // 错误状态
  error: {
    pageConfig: string | null;
    pageData: string | null;
    featuredUsers: string | null;
  };
  
  // Actions
  loadPageConfig: () => Promise<void>;
  loadPageData: () => Promise<void>;
  loadFeaturedUsers: () => Promise<void>;
  updateUserInteraction: (interaction: Partial<UserInteraction>) => void;
  updatePageConfig: (config: Partial<PageConfig>) => void;
  resetPageState: () => void;
  setLoading: (key: keyof HomepageState['loading'], value: boolean) => void;
  setError: (key: keyof HomepageState['error'], value: string | null) => void;
}

// 初始状态
const initialState = {
  pageConfig: null,
  pageData: null,
  userInteraction: {
    selectedFilter: '',
    searchQuery: '',
    scrollPosition: 0,
    activeSection: 'userList',
  },
  loading: {
    pageConfig: false,
    pageData: false,
    featuredUsers: false,
  },
  error: {
    pageConfig: null,
    pageData: null,
    featuredUsers: null,
  },
};

// Homepage Store实现
export const useHomepageStore = create<HomepageState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 加载页面配置（集成真实API）
        loadPageConfig: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载页面配置');
            setLoading('pageConfig', true);
            setError('pageConfig', null);
            
            // 🆕 调用真实API（支持降级）
            const response = await homepageApiEnhanced.getHomepageConfig();
            
            if (!response.success) {
              throw new Error(response.message || '配置加载失败');
            }
            
            // 转换API数据格式为Store格式
            const apiConfig = response.data;
            const pageConfig: PageConfig = {
              topFunction: {
                enabled: apiConfig.topFunction.enabled,
                config: {
                  showLocation: apiConfig.topFunction.showLocation,
                  showSearch: apiConfig.topFunction.showSearch,
                },
              },
              gameBanner: {
                enabled: apiConfig.gameBanner.enabled,
                config: {
                  autoPlay: apiConfig.gameBanner.autoPlay,
                  interval: apiConfig.gameBanner.interval,
                },
              },
              serviceGrid: {
                enabled: apiConfig.serviceGrid.enabled,
                config: {
                  columns: apiConfig.serviceGrid.columns,
                  rows: apiConfig.serviceGrid.rows,
                },
              },
              featuredUsers: {
                enabled: apiConfig.featuredUsers.enabled,
                config: {
                  maxCount: apiConfig.featuredUsers.maxCount,
                  refreshInterval: apiConfig.featuredUsers.refreshInterval,
                },
              },
              eventCenter: {
                enabled: apiConfig.eventCenter.enabled,
                config: {
                  showPromo: apiConfig.eventCenter.showPromo,
                },
              },
              userList: {
                enabled: apiConfig.userList.enabled,
                config: {
                  pageSize: apiConfig.userList.pageSize,
                  infiniteScroll: apiConfig.userList.infiniteScroll,
                },
              },
            };
            
            set({ pageConfig });
            console.log('[HomepageStore] ✅ 页面配置加载成功', {
              areas: Object.keys(pageConfig).length,
              duration: Date.now() - startTime + 'ms',
            });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '配置加载失败';
            setError('pageConfig', errorMsg);
            console.error('[HomepageStore] ❌ 页面配置加载失败', error);
          } finally {
            setLoading('pageConfig', false);
          }
        },

        // 加载页面数据（集成真实API）
        loadPageData: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载页面数据');
            setLoading('pageData', true);
            setError('pageData', null);
            
            // 🆕 并行加载服务配置和横幅数据
            const [servicesRes, bannerRes] = await Promise.allSettled([
              homepageApiEnhanced.getServiceItems(),
              homepageApiEnhanced.getBannerData(),
            ]);
            
            // 构建页面数据
            const pageData: PageData = {
              featuredUsers: [], // 精选用户单独加载
              serviceItems: servicesRes.status === 'fulfilled' && servicesRes.value.success
                ? servicesRes.value.data
                : [],
              bannerData: bannerRes.status === 'fulfilled' && bannerRes.value.success
                ? bannerRes.value.data[0]
                : {
                    id: '1',
                    image: '',
                    title: '游戏推广',
                    subtitle: '精彩内容',
                    gameId: 'default',
                  },
            };
            
            set({ pageData });
            console.log('[HomepageStore] ✅ 页面数据加载成功', {
              services: pageData.serviceItems.length,
              banner: pageData.bannerData.id,
              duration: Date.now() - startTime + 'ms',
            });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '数据加载失败';
            setError('pageData', errorMsg);
            console.error('[HomepageStore] ❌ 页面数据加载失败', error);
          } finally {
            setLoading('pageData', false);
          }
        },

        // 加载精选用户（集成真实API）
        loadFeaturedUsers: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载精选用户');
            setLoading('featuredUsers', true);
            setError('featuredUsers', null);
            
            // 🆕 调用真实API
            const response = await homepageApiEnhanced.getFeaturedUsers({
              limit: 10,
              refresh: false, // 使用缓存
            });
            
            if (!response.success) {
              throw new Error(response.message || '精选用户加载失败');
            }
            
            // 转换为PageData格式
            const featuredUsers = response.data.map(user => ({
              id: user.id,
              name: user.username,
              avatar: user.avatar,
              tags: user.services || [],
              price: user.price ? parseFloat(user.price.replace(/[^\d.]/g, '')) : 0,
              rating: user.rating || 0,
            }));
            
            set(state => ({
              pageData: state.pageData ? {
                ...state.pageData,
                featuredUsers,
              } : null,
            }));
            
            console.log('[HomepageStore] ✅ 精选用户加载成功', { count: featuredUsers.length, duration: Date.now() - startTime + 'ms' });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '精选用户加载失败';
            setError('featuredUsers', errorMsg);
            console.error('[HomepageStore] ❌ 精选用户加载失败', error);
            
            // 错误时保持空数组，前端会显示空状态
            set(state => ({
              pageData: state.pageData ? {
                ...state.pageData,
                featuredUsers: [],
              } : null,
            }));
          } finally {
            setLoading('featuredUsers', false);
          }
        },

        // 更新用户交互状态
        updateUserInteraction: (interaction: Partial<UserInteraction>) => {
          set(state => ({
            userInteraction: {
              ...state.userInteraction,
              ...interaction,
            },
          }));
        },

        // 更新页面配置
        updatePageConfig: (config: Partial<PageConfig>) => {
          set(state => ({
            pageConfig: state.pageConfig ? {
              ...state.pageConfig,
              ...config,
            } : null,
          }));
        },

        // 重置页面状态
        resetPageState: () => {
          console.log('[HomepageStore] 🔄 重置页面状态');
          set(initialState);
        },

        // 设置加载状态
        setLoading: (key: keyof HomepageState['loading'], value: boolean) => {
          set(state => ({
            loading: {
              ...state.loading,
              [key]: value,
            },
          }));
        },

        // 设置错误状态
        setError: (key: keyof HomepageState['error'], value: string | null) => {
          set(state => ({
            error: {
              ...state.error,
              [key]: value,
            },
          }));
        },
      }),
      {
        name: 'homepage-store',
        storage: createSafeStorage(),
        partialize: (state) => ({
          pageConfig: state.pageConfig,
          userInteraction: state.userInteraction,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('[HomepageStore] 💾 Store从持久化存储恢复成功', {
              hasConfig: !!state.pageConfig,
              interaction: state.userInteraction,
            });
          }
        },
      }
    ),
    {
      name: 'HomepageStore',
    }
  )
);

// 选择器函数
export const useHomepageConfig = () => useHomepageStore(state => state.pageConfig);
export const useHomepageData = () => useHomepageStore(state => state.pageData);
export const useHomepageLoading = () => useHomepageStore(state => state.loading);
export const useHomepageError = () => useHomepageStore(state => state.error);
export const useUserInteraction = () => useHomepageStore(state => state.userInteraction);
