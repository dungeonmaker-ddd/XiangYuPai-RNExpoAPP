/**
 * Homepage Store - 首页状态管理
 * 使用Zustand实现首页相关状态管理
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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

        // 加载页面配置
        loadPageConfig: async () => {
          const { setLoading, setError } = get();
          
          try {
            setLoading('pageConfig', true);
            setError('pageConfig', null);
            
            // TODO: 替换为实际API调用
            const mockConfig: PageConfig = {
              topFunction: {
                enabled: true,
                config: {
                  showLocation: true,
                  showSearch: true,
                },
              },
              gameBanner: {
                enabled: true,
                config: {
                  autoPlay: true,
                  interval: 5000,
                },
              },
              serviceGrid: {
                enabled: true,
                config: {
                  columns: 5,
                  rows: 2,
                },
              },
              featuredUsers: {
                enabled: true,
                config: {
                  maxCount: 10,
                  refreshInterval: 30000,
                },
              },
              eventCenter: {
                enabled: true,
                config: {
                  showPromo: true,
                },
              },
              userList: {
                enabled: true,
                config: {
                  pageSize: 20,
                  infiniteScroll: true,
                },
              },
            };
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set({ pageConfig: mockConfig });
          } catch (error) {
            setError('pageConfig', error instanceof Error ? error.message : '配置加载失败');
          } finally {
            setLoading('pageConfig', false);
          }
        },

        // 加载页面数据
        loadPageData: async () => {
          const { setLoading, setError } = get();
          
          try {
            setLoading('pageData', true);
            setError('pageData', null);
            
            // TODO: 替换为实际API调用
            const mockData: PageData = {
              featuredUsers: [
                {
                  id: '1',
                  name: '游戏大神',
                  avatar: 'https://example.com/avatar1.jpg',
                  tags: ['王者荣耀', '高端局'],
                  price: 50,
                  rating: 4.8,
                },
                {
                  id: '2',
                  name: '陪玩小姐姐',
                  avatar: 'https://example.com/avatar2.jpg',
                  tags: ['英雄联盟', '温柔'],
                  price: 30,
                  rating: 4.9,
                },
              ],
              serviceItems: [
                { id: '1', name: '王者荣耀', icon: 'game-controller', type: 'honor_of_kings', enabled: true },
                { id: '2', name: '英雄联盟', icon: 'sword', type: 'league_of_legends', enabled: true },
                { id: '3', name: '探店', icon: 'store', type: 'explore_shop', enabled: true },
                { id: '4', name: 'K歌', icon: 'music', type: 'ktv', enabled: true },
                { id: '5', name: '台球', icon: 'pool', type: 'billiards', enabled: true },
              ],
              bannerData: {
                id: '1',
                image: 'https://example.com/banner.jpg',
                title: '王者荣耀',
                subtitle: '新赛季开启',
                gameId: 'honor_of_kings',
              },
            };
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set({ pageData: mockData });
          } catch (error) {
            setError('pageData', error instanceof Error ? error.message : '数据加载失败');
          } finally {
            setLoading('pageData', false);
          }
        },

        // 加载精选用户
        loadFeaturedUsers: async () => {
          const { setLoading, setError } = get();
          
          try {
            setLoading('featuredUsers', true);
            setError('featuredUsers', null);
            
            // TODO: 替换为实际API调用
            const mockUsers = [
              {
                id: '3',
                name: '技术大佬',
                avatar: 'https://example.com/avatar3.jpg',
                tags: ['和平精英', '专业'],
                price: 80,
                rating: 5.0,
              },
            ];
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 600));
            
            set(state => ({
              pageData: state.pageData ? {
                ...state.pageData,
                featuredUsers: [...state.pageData.featuredUsers, ...mockUsers],
              } : null,
            }));
          } catch (error) {
            setError('featuredUsers', error instanceof Error ? error.message : '精选用户加载失败');
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
            console.log('[HomepageStore] 存储恢复成功');
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
