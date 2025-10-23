/**
 * Profile Store - 个人主页状态管理
 * 
 * 管理：
 * - 用户资料数据
 * - 动态列表数据
 * - Tab状态
 * - 加载和错误状态
 */

import { create } from 'zustand';
import type { Post, TabType, UserProfile } from '../src/features/Profile/types';

// #region 类型定义

export interface ProfileState {
  // 用户信息
  currentProfile: UserProfile | null;
  
  // Tab状态
  activeTab: TabType;
  
  // 动态列表
  posts: {
    dynamic: Post[];
    collection: Post[];
    likes: Post[];
  };
  
  // 分页状态
  page: {
    dynamic: number;
    collection: number;
    likes: number;
  };
  
  hasMore: {
    dynamic: boolean;
    collection: boolean;
    likes: boolean;
  };
  
  // UI状态
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export interface ProfileActions {
  // 用户信息
  loadUserProfile: (userId?: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Tab操作
  setActiveTab: (tab: TabType) => void;
  
  // 动态列表
  loadPosts: (tab: TabType, page: number) => Promise<void>;
  loadMorePosts: (tab: TabType) => Promise<void>;
  refreshPosts: (tab: TabType) => Promise<void>;
  
  // 互动操作
  toggleLike: (postId: string, tab: TabType) => Promise<void>;
  toggleCollect: (postId: string, tab: TabType) => Promise<void>;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export type ProfileStore = ProfileState & ProfileActions;

// #endregion

// #region 初始状态

const initialState: ProfileState = {
  currentProfile: null,
  activeTab: 'dynamic',
  posts: {
    dynamic: [],
    collection: [],
    likes: [],
  },
  page: {
    dynamic: 1,
    collection: 1,
    likes: 1,
  },
  hasMore: {
    dynamic: true,
    collection: true,
    likes: true,
  },
  loading: false,
  refreshing: false,
  error: null,
};

// #endregion

// #region Store创建

export const useProfileStore = create<ProfileStore>((set, get) => ({
  // 初始状态
  ...initialState,
  
  // 加载用户资料
  loadUserProfile: async (userId?: string) => {
    try {
      set({ loading: true, error: null });
      
      // TODO: 调用API获取用户资料
      console.log('加载用户资料:', userId || 'current-user');
      
      // Mock数据
      const mockProfile: UserProfile = {
        id: userId || 'current-user',
        nickname: '门前游过一群鸭',
        avatar: 'https://picsum.photos/200',
        backgroundImage: 'https://picsum.photos/800/600',
        gender: 'female',
        age: 18,
        bio: '人皮话多不高冷的真实写照',
        location: '广东 深圳',
        city: '深圳',
        ipLocation: '广东 深圳',
        distance: 4.6,
        isRealVerified: true,
        isGodVerified: true,
        isOnline: true,
        followingCount: 201,
        followerCount: 201,
        likeCount: 999,
        collectCount: 150,
        createdAt: Date.now(),
      };
      
      set({ currentProfile: mockProfile, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '加载失败',
      });
    }
  },
  
  // 更新用户资料
  updateUserProfile: (updates) => {
    set((state) => ({
      currentProfile: state.currentProfile
        ? { ...state.currentProfile, ...updates }
        : null,
    }));
  },
  
  // 设置活动Tab
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  // 加载动态列表
  loadPosts: async (tab, page) => {
    try {
      set({ loading: true, error: null });
      
      // TODO: 调用API加载动态
      console.log('加载动态列表:', tab, page);
      
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '加载失败',
      });
    }
  },
  
  // 加载更多
  loadMorePosts: async (tab) => {
    const { page, hasMore } = get();
    if (!hasMore[tab]) return;
    
    await get().loadPosts(tab, page[tab] + 1);
  },
  
  // 刷新
  refreshPosts: async (tab) => {
    set({ refreshing: true });
    await get().loadPosts(tab, 1);
    set({ refreshing: false });
  },
  
  // 点赞
  toggleLike: async (postId, tab) => {
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tab]: state.posts[tab].map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post
        ),
      },
    }));
    
    try {
      // TODO: 调用API
      console.log('点赞动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tab]: state.posts[tab].map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likeCount: post.isLiked ? post.likeCount + 1 : post.likeCount - 1,
                }
              : post
          ),
        },
      }));
    }
  },
  
  // 收藏
  toggleCollect: async (postId, tab) => {
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tab]: state.posts[tab].map((post) =>
          post.id === postId
            ? {
                ...post,
                isCollected: !post.isCollected,
              }
            : post
        ),
      },
    }));
    
    try {
      // TODO: 调用API
      console.log('收藏动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tab]: state.posts[tab].map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isCollected: !post.isCollected,
                }
              : post
          ),
        },
      }));
    }
  },
  
  // 设置加载状态
  setLoading: (loading) => {
    set({ loading });
  },
  
  // 设置错误
  setError: (error) => {
    set({ error });
  },
  
  // 重置状态
  resetState: () => {
    set(initialState);
  },
}));

// #endregion

// #region 选择器

export const useCurrentProfile = () => useProfileStore((state) => state.currentProfile);
export const useActiveTab = () => useProfileStore((state) => state.activeTab);
export const usePosts = (tab: TabType) => useProfileStore((state) => state.posts[tab]);
export const useProfileLoading = () => useProfileStore((state) => state.loading);
export const useProfileError = () => useProfileStore((state) => state.error);

// #endregion

