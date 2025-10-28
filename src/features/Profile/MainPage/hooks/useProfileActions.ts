// #region 1. File Banner & TOC
/**
 * useProfileActions - Profile操作逻辑Hook
 * 
 * 功能：
 * - 处理用户操作（关注、取消关注、编辑等）
 * - Tab切换逻辑
 * - UI交互反馈
 * 
 * 设计原则：
 * - 单一职责：只负责操作逻辑，不管数据获取
 * - 副作用管理：所有异步操作集中在这里
 * - 性能优化：使用useCallback避免函数重建
 * 
 * 参考：WaterfallList的Hook设计模式
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types
 * [4] Hook Implementation
 * [5] Exports
 */
// #endregion

// #region 2. Imports
import { useCallback } from 'react';

import { useProfileStore } from '@/stores/profileStore';
import type { TabType } from '../../types';
// #endregion

// #region 3. Types
/**
 * Hook参数类型
 */
export interface UseProfileActionsParams {
  userId?: string;
  onFollowSuccess?: () => void;
  onFollowError?: (error: Error) => void;
}

/**
 * Hook返回值类型
 */
export interface UseProfileActionsReturn {
  // Tab操作
  handleTabChange: (tab: TabType) => void;
  
  // 关注操作
  handleFollow: () => Promise<void>;
  handleUnfollow: () => Promise<void>;
  handleFollowToggle: (isFollowing: boolean) => Promise<void>;
  
  // 资料操作
  handleRefreshProfile: () => Promise<void>;
  
  // 加载状态
  isFollowLoading: boolean;
}
// #endregion

// #region 4. Hook Implementation
/**
 * useProfileActions - Profile操作Hook
 * 
 * 算法：
 * 1. 从Store获取Action函数
 * 2. 封装业务逻辑（错误处理、回调等）
 * 3. 使用useCallback优化性能
 * 
 * 性能优化：
 * - useCallback避免函数重建
 * - 依赖项最小化
 * - 异步操作使用try-catch统一处理
 * 
 * @param params - Hook参数
 * @returns Profile操作函数
 * 
 * @example
 * ```tsx
 * const { handleFollow, handleTabChange } = useProfileActions({
 *   userId: '123',
 *   onFollowSuccess: () => console.log('关注成功'),
 * });
 * 
 * <Button onPress={handleFollow}>关注</Button>
 * ```
 */
export const useProfileActions = (params: UseProfileActionsParams = {}): UseProfileActionsReturn => {
  const { userId, onFollowSuccess, onFollowError } = params;
  
  // ===== Store Actions获取 =====
  const setActiveTab = useProfileStore((state) => state.setActiveTab);
  const followUser = useProfileStore((state) => state.followUser);
  const unfollowUser = useProfileStore((state) => state.unfollowUser);
  const loadUserProfile = useProfileStore((state) => state.loadUserProfile);
  
  // ===== Tab操作 =====
  /**
   * Tab切换逻辑
   * 
   * 算法：
   * 1. 调用Store的setActiveTab更新状态
   * 2. TabContentArea监听activeTab变化自动切换内容
   * 
   * 性能：
   * - useCallback缓存函数引用
   * - 依赖项只包含setActiveTab（Zustand保证稳定引用）
   */
  const handleTabChange = useCallback((tab: TabType) => {
    console.log('📑 Tab切换:', tab);
    setActiveTab(tab);
  }, [setActiveTab]);
  
  // ===== 关注操作 =====
  /**
   * 关注用户
   * 
   * 算法：
   * 1. 获取目标用户ID（从currentProfile或props）
   * 2. 调用API关注用户
   * 3. 刷新用户资料（获取最新关注状态和粉丝数）
   * 4. 触发成功/失败回调
   * 
   * 错误处理：
   * - 捕获所有异常
   * - 打印错误日志
   * - 触发onFollowError回调
   * 
   * 性能：
   * - 使用useCallback避免重建
   * - 依赖项包含所有外部引用
   */
  const handleFollow = useCallback(async () => {
    try {
      console.log('👤 执行关注操作, userId:', userId);
      
      // 获取当前Profile数据
      const currentProfile = useProfileStore.getState().currentProfile;
      if (!currentProfile) {
        throw new Error('无法获取用户信息');
      }
      
      const targetUserId = Number(currentProfile.id);
      if (isNaN(targetUserId)) {
        throw new Error('无效的用户ID');
      }
      
      // 执行关注
      await followUser(targetUserId);
      console.log('✅ 关注成功');
      
      // 刷新用户资料
      await loadUserProfile(userId);
      console.log('✅ 资料刷新完成');
      
      // 触发成功回调
      onFollowSuccess?.();
      
    } catch (error) {
      console.error('❌ 关注失败:', error);
      onFollowError?.(error as Error);
    }
  }, [userId, followUser, loadUserProfile, onFollowSuccess, onFollowError]);
  
  /**
   * 取消关注用户
   * 
   * 算法：与handleFollow类似，但调用unfollowUser
   */
  const handleUnfollow = useCallback(async () => {
    try {
      console.log('👤 执行取消关注操作, userId:', userId);
      
      const currentProfile = useProfileStore.getState().currentProfile;
      if (!currentProfile) {
        throw new Error('无法获取用户信息');
      }
      
      const targetUserId = Number(currentProfile.id);
      if (isNaN(targetUserId)) {
        throw new Error('无效的用户ID');
      }
      
      await unfollowUser(targetUserId);
      console.log('✅ 取消关注成功');
      
      await loadUserProfile(userId);
      console.log('✅ 资料刷新完成');
      
      onFollowSuccess?.();
      
    } catch (error) {
      console.error('❌ 取消关注失败:', error);
      onFollowError?.(error as Error);
    }
  }, [userId, unfollowUser, loadUserProfile, onFollowSuccess, onFollowError]);
  
  /**
   * 关注/取消关注切换
   * 
   * 算法：
   * 1. 根据当前关注状态决定调用follow还是unfollow
   * 2. 统一的错误处理
   * 
   * 使用场景：
   * - 关注按钮点击时，根据isFollowing自动切换
   */
  const handleFollowToggle = useCallback(async (isFollowing: boolean) => {
    if (isFollowing) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  }, [handleFollow, handleUnfollow]);
  
  // ===== 资料操作 =====
  /**
   * 刷新用户资料
   * 
   * 算法：
   * 1. 调用Store的loadUserProfile重新加载
   * 2. 等待加载完成
   * 
   * 使用场景：
   * - 下拉刷新
   * - 手动刷新按钮
   */
  const handleRefreshProfile = useCallback(async () => {
    try {
      console.log('🔄 刷新用户资料, userId:', userId);
      await loadUserProfile(userId);
      console.log('✅ 刷新完成');
    } catch (error) {
      console.error('❌ 刷新失败:', error);
    }
  }, [userId, loadUserProfile]);
  
  // ===== 加载状态 =====
  // TODO: 可以添加本地loading状态，避免频繁点击
  const isFollowLoading = false;
  
  return {
    // Tab操作
    handleTabChange,
    
    // 关注操作
    handleFollow,
    handleUnfollow,
    handleFollowToggle,
    
    // 资料操作
    handleRefreshProfile,
    
    // 加载状态
    isFollowLoading,
  };
};
// #endregion

// #region 5. Exports
export default useProfileActions;
// #endregion

