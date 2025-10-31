/**
 * Profile Store - 个人主页状态管理
 * 
 * 管理：
 * - 用户资料数据
 * - 动态列表数据
 * - Tab状态
 * - 加载和错误状态
 * 
 * 🔗 数据源集成：
 * - authStore.userInfo: 基础身份信息（登录时保存）
 * - profileStore.currentProfile: 完整资料信息（从API加载）
 * - 使用 authStore.userInfo.id 确定当前用户
 */

import { create } from 'zustand';
import type { Post, TabType, UserProfile } from '../src/features/Profile/types';

// API服务
import { profileApi } from '../services/api/profileApi';

// 数据转换工具
import { profileDataTransform } from '../src/features/Profile/utils/dataTransform';

// 🆕 导入authStore以获取当前用户信息
import { useAuthStore } from '../src/features/AuthModule/stores/authStore';

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
  
  // 🆕 从authStore初始化基础信息
  initializeFromAuth: () => void;
  
  // Tab操作
  setActiveTab: (tab: TabType) => void;
  
  // 动态列表
  loadPosts: (tab: TabType, page: number) => Promise<void>;
  loadMorePosts: (tab: TabType) => Promise<void>;
  refreshPosts: (tab: TabType) => Promise<void>;
  
  // 用户关系
  followUser: (targetUserId: number) => Promise<void>;
  unfollowUser: (targetUserId: number) => Promise<void>;
  
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
    // 🔥 第一个日志 - 确保函数被调用
    console.log('\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
    console.log('🔥 [PROFILE STORE] loadUserProfile 被调用！');
    console.log('🔥 传入参数 userId:', userId || '(未传入)');
    console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n');
    
    try {
      set({ loading: true, error: null });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 加载用户资料开始');
      
      // 🆕 智能用户ID解析
      const authState = useAuthStore.getState();
      const targetUserId = userId || authState.userInfo?.id;
      
      console.log('   传入userId:', userId || '未传入');
      console.log('   authStore用户ID:', authState.userInfo?.id || '未登录');
      console.log('   最终使用:', targetUserId || 'current-user');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // 🎯 使用真实后端API（获取测试账号数据）
      console.log('🔥 准备调用 API...');
      const api = profileApi;
      
      console.log('🔥 开始执行 API 请求:', targetUserId ? `getUserProfile(${targetUserId})` : 'getCurrentUserProfile()');
      
      const profileData = targetUserId 
        ? await api.getUserProfile(Number(targetUserId))
        : await api.getCurrentUserProfile();
      
      console.log('🔥 API请求完成！');
      console.log('✅ API调用成功，获取到资料数据');
      console.log('   昵称:', profileData.nickname);
      console.log('   粉丝数:', profileData.stats?.followerCount);
      
      // 🔄 转换后端数据为前端格式
      const profile = profileDataTransform.transformUserProfileVOToProfile(profileData);
      
      console.log('✅ 数据转换完成');
      console.log('   前端ID:', profile.id);
      console.log('   关注数:', profile.followingCount);
      
      // 🆕 与authStore数据同步
      if (!userId && authState.userInfo) {
        console.log('🔗 同步基础信息到profile');
        console.log('   手机号:', authState.userInfo.phone);
        console.log('   认证状态:', authState.userInfo.verified);
      }
      
      set({ currentProfile: profile, loading: false });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 用户资料加载完成！');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
      console.error('\n❌ 加载用户资料失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '加载失败',
      });
    }
  },
  
  // 🆕 从authStore初始化基础信息
  initializeFromAuth: () => {
    const authState = useAuthStore.getState();
    
    if (!authState.isAuthenticated || !authState.userInfo) {
      console.log('⚠️ 未登录，跳过profile初始化');
      return;
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 从authStore初始化profile基础信息');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const { userInfo } = authState;
    
    // 创建基础profile（只包含authStore已有的信息）
    const basicProfile: UserProfile = {
      id: userInfo.id,
      nickname: userInfo.nickname || '用户',
      avatar: userInfo.avatar || 'https://via.placeholder.com/96',
      // 其他字段从API加载时填充
    };
    
    console.log('   用户ID:', basicProfile.id);
    console.log('   昵称:', basicProfile.nickname);
    console.log('   手机号:', userInfo.phone);
    console.log('   认证状态:', userInfo.verified);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    set({ currentProfile: basicProfile });
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
    // 只为dynamic/collection/likes三个tab加载数据
    if (tab === 'profile') {
      console.log('资料Tab不需要加载动态列表');
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      // TODO: 调用内容模块API加载动态
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
    if (tab === 'profile') return;
    
    const { page, hasMore } = get();
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    if (!hasMore[tabKey]) return;
    
    await get().loadPosts(tab, page[tabKey] + 1);
  },
  
  // 刷新
  refreshPosts: async (tab) => {
    if (tab === 'profile') return;
    
    set({ refreshing: true });
    await get().loadPosts(tab, 1);
    set({ refreshing: false });
  },
  
  // 关注用户
  followUser: async (targetUserId: number) => {
    try {
      console.log('🔄 关注用户:', targetUserId);
      
      const api = profileApi;
      await api.followUser(targetUserId);
      
      // 更新关系状态
      set((state) => ({
        currentProfile: state.currentProfile ? {
          ...state.currentProfile,
          followingCount: (state.currentProfile.followingCount || 0) + 1,
        } : null,
      }));
      
      console.log('✅ 关注成功');
    } catch (error) {
      console.error('❌ 关注失败:', error);
      throw error;
    }
  },
  
  // 取消关注
  unfollowUser: async (targetUserId: number) => {
    try {
      console.log('🔄 取消关注:', targetUserId);
      
      const api = profileApi;
      await api.unfollowUser(targetUserId);
      
      // 更新关系状态
      set((state) => ({
        currentProfile: state.currentProfile ? {
          ...state.currentProfile,
          followingCount: Math.max((state.currentProfile.followingCount || 0) - 1, 0),
        } : null,
      }));
      
      console.log('✅ 取消关注成功');
    } catch (error) {
      console.error('❌ 取消关注失败:', error);
      throw error;
    }
  },
  
  // 点赞
  toggleLike: async (postId, tab) => {
    if (tab === 'profile') return;
    
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tabKey]: state.posts[tabKey].map((post: Post) =>
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
      // TODO: 调用内容模块的点赞API
      console.log('点赞动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tabKey]: state.posts[tabKey].map((post: Post) =>
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
    if (tab === 'profile') return;
    
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tabKey]: state.posts[tabKey].map((post: Post) =>
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
      // TODO: 调用内容模块的收藏API
      console.log('收藏动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tabKey]: state.posts[tabKey].map((post: Post) =>
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
export const usePosts = (tab: 'dynamic' | 'collection' | 'likes') => useProfileStore((state) => state.posts[tab]);
export const useProfileLoading = () => useProfileStore((state) => state.loading);
export const useProfileError = () => useProfileStore((state) => state.error);

// #endregion

