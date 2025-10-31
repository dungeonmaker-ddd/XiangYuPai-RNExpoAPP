// #region 1. File Banner & TOC
/**
 * useProfileData - Profile数据状态管理Hook
 * 
 * 功能：
 * - 从Store获取Profile相关数据
 * - 计算派生状态（isOwnProfile等）
 * - 提供只读数据接口
 * 
 * 设计原则：
 * - 单一职责：只负责数据获取和派生计算
 * - 无副作用：不包含任何操作逻辑
 * - 性能优化：使用useMemo避免重复计算
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
import { useMemo } from 'react';

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
// #endregion

// #region 3. Types
/**
 * Hook参数类型
 */
export interface UseProfileDataParams {
  userId?: string;
}

/**
 * Hook返回值类型
 */
export interface UseProfileDataReturn {
  // Store数据（原始）
  currentProfile: ReturnType<typeof useProfileStore>['currentProfile'];
  activeTab: ReturnType<typeof useProfileStore>['activeTab'];
  loading: boolean;
  error: Error | null;
  
  // 认证状态
  isAuthenticated: boolean;
  isInitialized: boolean;
  authUserInfo: ReturnType<typeof useAuthStore>['userInfo'];  // 🆕 基础用户信息
  
  // 派生状态（计算得出）
  isOwnProfile: boolean;
  hasProfile: boolean;
  isProfileReady: boolean;
}
// #endregion

// #region 4. Hook Implementation
/**
 * useProfileData - Profile数据管理Hook
 * 
 * 算法：
 * 1. 从ProfileStore获取原始数据
 * 2. 从AuthStore获取认证状态
 * 3. 计算派生状态（使用useMemo优化）
 * 
 * 性能优化：
 * - useMemo缓存派生计算结果
 * - 只在依赖项变化时重新计算
 * 
 * @param params - Hook参数
 * @returns Profile数据和派生状态
 * 
 * @example
 * ```tsx
 * const { currentProfile, isOwnProfile, isProfileReady } = useProfileData({ 
 *   userId: '123' 
 * });
 * 
 * if (!isProfileReady) return <Skeleton />;
 * return <ProfileContent profile={currentProfile} />;
 * ```
 */
export const useProfileData = (params: UseProfileDataParams = {}): UseProfileDataReturn => {
  const { userId } = params;
  
  // ===== 原始数据获取 =====
  // 从ProfileStore获取数据（自动订阅，数据变化时触发重渲染）
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const activeTab = useProfileStore((state) => state.activeTab);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  
  // 从AuthStore获取认证状态和用户信息
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const authUserInfo = useAuthStore((state) => state.userInfo);
  
  // ===== 派生状态计算 =====
  /**
   * 判断是否是当前用户的主页
   * 算法：
   * 1. 没有传userId → 本人主页
   * 2. userId是'current-user' → 本人主页
   * 3. userId === authStore.userInfo.id → 本人主页
   * 4. 其他情况 → 他人主页
   */
  const isOwnProfile = useMemo(
    () => {
      if (!userId || userId === 'current-user') {
        return true;
      }
      return authUserInfo?.id === userId;
    },
    [userId, authUserInfo?.id]
  );
  
  /**
   * 判断是否有Profile数据
   * 算法：currentProfile存在且有id → 有数据
   */
  const hasProfile = useMemo(
    () => !!currentProfile && !!currentProfile.id,
    [currentProfile]
  );
  
  /**
   * 判断Profile是否就绪（可以显示）
   * 算法：已初始化 + 已认证 + 有数据 + 不在加载中 → 就绪
   */
  const isProfileReady = useMemo(
    () => isInitialized && isAuthenticated && hasProfile && !loading,
    [isInitialized, isAuthenticated, hasProfile, loading]
  );
  
  return {
    // 原始数据
    currentProfile,
    activeTab,
    loading,
    error,
    
    // 认证状态
    isAuthenticated,
    isInitialized,
    authUserInfo,  // 🆕 基础用户信息（来自authStore）
    
    // 派生状态
    isOwnProfile,
    hasProfile,
    isProfileReady,
  };
};
// #endregion

// #region 5. Exports
export default useProfileData;
// #endregion

