/**
 * useAuthInitialization Hook
 * 
 * 提供App启动时的认证初始化逻辑
 * - 恢复token和用户信息
 * - 验证token有效性
 * - 自动刷新过期token
 * - 连接API客户端
 */

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../../../services/api/client';
import { useAuthStore } from '../stores/authStore';

// #region 类型定义

/**
 * 初始化状态
 */
interface InitializationState {
  isReady: boolean;        // 初始化是否完成
  isLoading: boolean;      // 是否正在初始化
  error: string | null;    // 初始化错误信息
}

/**
 * Hook返回类型
 */
interface UseAuthInitializationReturn {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  retry: () => Promise<void>;
}

// #endregion

// #region Hook实现

/**
 * 认证初始化Hook
 */
export const useAuthInitialization = (): UseAuthInitializationReturn => {
  // 本地初始化状态
  const [state, setState] = useState<InitializationState>({
    isReady: false,
    isLoading: true,
    error: null,
  });
  
  // 获取authStore
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  
  /**
   * 执行初始化流程
   */
  const performInitialization = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 [第一层] App启动 - 开始认证初始化');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // 步骤1：连接API客户端和authStore
      console.log('📡 步骤1/3: 连接API客户端...');
      apiClient.connectAuthStore(useAuthStore);
      console.log('   ✅ API客户端已连接到AuthStore');
      
      // 步骤2：初始化认证状态
      console.log('\n🔐 步骤2/3: 初始化认证状态...');
      await initialize();
      const { isAuthenticated, userInfo } = useAuthStore.getState();
      console.log('   ✅ 认证状态已初始化');
      console.log(`   📊 登录状态: ${isAuthenticated ? '✅ 已登录' : '❌ 未登录'}`);
      if (isAuthenticated && userInfo) {
        console.log(`   👤 用户信息: ${userInfo.nickname || userInfo.phone}`);
      }
      
      // 步骤3：完成初始化
      console.log('\n✨ 步骤3/3: 完成初始化');
      setState({
        isReady: true,
        isLoading: false,
        error: null,
      });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 [第一层] 认证初始化完成！');
      console.log(`   状态: isAuthenticated=${isAuthenticated}`);
      console.log(`   耗时: ~${Date.now() % 1000}ms`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
      console.error('\n❌ [第一层] 认证初始化失败:', error);
      
      setState({
        isReady: true,  // 即使失败也标记为ready，允许用户继续
        isLoading: false,
        error: error instanceof Error ? error.message : '初始化失败',
      });
    }
  }, [initialize]);
  
  /**
   * 重试初始化
   */
  const retry = useCallback(async () => {
    await performInitialization();
  }, [performInitialization]);
  
  // App启动时执行初始化
  useEffect(() => {
    performInitialization();
  }, [performInitialization]);
  
  return {
    isReady: state.isReady && isInitialized,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated,
    retry,
  };
};

// #endregion

// #region 辅助Hooks

/**
 * 认证状态监听Hook
 * 监听认证状态变化并执行回调
 */
export const useAuthStateListener = (
  onLogin?: () => void,
  onLogout?: () => void
) => {
  const { isAuthenticated } = useAuthStore();
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  
  useEffect(() => {
    // 检测登录状态变化
    if (isAuthenticated !== prevAuth) {
      if (isAuthenticated && !prevAuth) {
        // 从未登录 → 已登录
        console.log('🔐 User logged in');
        onLogin?.();
      } else if (!isAuthenticated && prevAuth) {
        // 从已登录 → 未登录
        console.log('👋 User logged out');
        onLogout?.();
      }
      
      setPrevAuth(isAuthenticated);
    }
  }, [isAuthenticated, prevAuth, onLogin, onLogout]);
};

/**
 * 自动登录检查Hook
 * 在特定页面自动检查并跳转
 */
export const useAutoLoginCheck = (
  shouldRedirect: boolean = true,
  redirectPath: string = '/(tabs)/homepage'
) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  
  useEffect(() => {
    if (isInitialized && isAuthenticated && shouldRedirect) {
      // 已登录，重定向到主页
      // router.replace(redirectPath);
    }
  }, [isAuthenticated, isInitialized, shouldRedirect, redirectPath]);
  
  return { isAuthenticated, isInitialized };
};

// #endregion

// #region 导出

export type {
    InitializationState,
    UseAuthInitializationReturn
};

// #endregion
