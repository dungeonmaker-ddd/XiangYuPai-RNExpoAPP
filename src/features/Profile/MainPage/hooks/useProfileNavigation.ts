// #region 1. File Banner & TOC
/**
 * useProfileNavigation - Profile导航逻辑Hook
 * 
 * 功能：
 * - 处理所有页面跳转逻辑
 * - 统一管理导航路由
 * - 提供类型安全的导航接口
 * 
 * 设计原则：
 * - 单一职责：只负责导航，不处理业务逻辑
 * - 集中管理：所有路由路径集中定义
 * - 类型安全：使用TypeScript确保路由正确
 * 
 * 参考：WaterfallList的Hook设计模式
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Routes
 * [4] Hook Implementation
 * [5] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
// #endregion

// #region 3. Types & Routes
/**
 * Profile相关路由配置
 * 集中管理所有路由路径，避免硬编码
 */
const PROFILE_ROUTES = {
  EDIT: '/profile/edit',
  FOLLOWING: '/profile/following',
  FOLLOWERS: '/profile/followers',
  LIKE_COLLECT: '/profile/like-collect',
  SETTINGS: '/profile/settings',
  AVATAR_VIEWER: '/profile/avatar-viewer',
} as const;

/**
 * Hook返回值类型
 */
export interface UseProfileNavigationReturn {
  // 资料编辑
  navigateToEdit: () => void;
  
  // 社交列表
  navigateToFollowing: () => void;
  navigateToFollowers: () => void;
  navigateToLikeCollect: () => void;
  
  // 设置
  navigateToSettings: () => void;
  
  // 查看器
  navigateToAvatarViewer: (avatarUrl: string) => void;
  
  // 导航控制
  navigateBack: () => void;
  canGoBack: () => boolean;
}
// #endregion

// #region 4. Hook Implementation
/**
 * useProfileNavigation - Profile导航Hook
 * 
 * 算法：
 * 1. 获取expo-router的router实例
 * 2. 封装导航函数，统一错误处理
 * 3. 使用useCallback优化性能
 * 
 * 性能优化：
 * - useCallback避免函数重建
 * - 依赖项只包含router（稳定引用）
 * 
 * @returns Profile导航函数集合
 * 
 * @example
 * ```tsx
 * const { navigateToEdit, navigateToFollowing } = useProfileNavigation();
 * 
 * <Button onPress={navigateToEdit}>编辑资料</Button>
 * <Button onPress={navigateToFollowing}>查看关注</Button>
 * ```
 */
export const useProfileNavigation = (): UseProfileNavigationReturn => {
  const router = useRouter();
  
  // ===== 资料编辑 =====
  /**
   * 跳转到编辑资料页面
   * 
   * 功能：允许用户编辑个人信息
   */
  const navigateToEdit = useCallback(() => {
    console.log('🧭 导航: 编辑资料');
    try {
      router.push(PROFILE_ROUTES.EDIT);
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  // ===== 社交列表 =====
  /**
   * 跳转到关注列表页面
   * 
   * 功能：显示用户关注的所有人
   */
  const navigateToFollowing = useCallback(() => {
    console.log('🧭 导航: 查看关注列表');
    try {
      router.push(PROFILE_ROUTES.FOLLOWING);
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  /**
   * 跳转到粉丝列表页面
   * 
   * 功能：显示关注该用户的所有人
   */
  const navigateToFollowers = useCallback(() => {
    console.log('🧭 导航: 查看粉丝列表');
    try {
      router.push(PROFILE_ROUTES.FOLLOWERS);
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  /**
   * 跳转到获赞与收藏页面
   * 
   * 功能：显示用户的获赞和收藏统计
   */
  const navigateToLikeCollect = useCallback(() => {
    console.log('🧭 导航: 查看获赞与收藏');
    try {
      router.push(PROFILE_ROUTES.LIKE_COLLECT);
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  // ===== 设置 =====
  /**
   * 跳转到设置页面
   * 
   * 功能：账号设置、隐私设置等
   */
  const navigateToSettings = useCallback(() => {
    console.log('🧭 导航: 打开设置');
    try {
      router.push(PROFILE_ROUTES.SETTINGS);
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  // ===== 查看器 =====
  /**
   * 打开头像查看器
   * 
   * 算法：
   * 1. 接收头像URL作为参数
   * 2. 通过路由参数传递URL
   * 3. 打开全屏查看器页面
   * 
   * @param avatarUrl - 头像图片URL
   */
  const navigateToAvatarViewer = useCallback((avatarUrl: string) => {
    console.log('🧭 导航: 查看头像大图');
    try {
      // 使用路由参数传递URL
      router.push({
        pathname: PROFILE_ROUTES.AVATAR_VIEWER,
        params: { url: avatarUrl },
      });
    } catch (error) {
      console.error('❌ 导航失败:', error);
    }
  }, [router]);
  
  // ===== 导航控制 =====
  /**
   * 返回上一页
   * 
   * 算法：
   * 1. 检查是否可以返回
   * 2. 如果可以，执行返回
   * 3. 如果不可以，打印警告
   * 
   * 安全性：
   * - 总是先检查canGoBack()
   * - 避免在栈底时调用back()导致崩溃
   */
  const navigateBack = useCallback(() => {
    if (router.canGoBack()) {
      console.log('🧭 导航: 返回上一页');
      router.back();
    } else {
      console.warn('⚠️ 无法返回，已在根页面');
    }
  }, [router]);
  
  /**
   * 检查是否可以返回
   * 
   * @returns 是否可以返回上一页
   */
  const canGoBack = useCallback(() => {
    return router.canGoBack();
  }, [router]);
  
  return {
    // 资料编辑
    navigateToEdit,
    
    // 社交列表
    navigateToFollowing,
    navigateToFollowers,
    navigateToLikeCollect,
    
    // 设置
    navigateToSettings,
    
    // 查看器
    navigateToAvatarViewer,
    
    // 导航控制
    navigateBack,
    canGoBack,
  };
};
// #endregion

// #region 5. Exports
export default useProfileNavigation;
export { PROFILE_ROUTES };
// #endregion

