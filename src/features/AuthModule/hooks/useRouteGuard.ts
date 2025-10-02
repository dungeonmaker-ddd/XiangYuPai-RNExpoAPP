/**
 * useRouteGuard Hook
 * 
 * 提供路由守卫功能，基于白名单机制
 * - 检查路由访问权限
 * - 处理未授权访问
 * - 记住原本想访问的路由
 * - 登录后自动返回
 */

import { usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
    canAccessAnonymously,
    routeGuard
} from '../config/routeWhitelist';
import { useAuthStore } from '../stores/authStore';

// #region 类型定义

/**
 * 路由守卫状态
 */
interface RouteGuardState {
  canAccess: boolean;           // 是否可以访问
  requiresAuth: boolean;        // 是否需要认证
  isGuestMode: boolean;         // 是否访客模式
  intendedRoute: string | null; // 原本想访问的路由
}

/**
 * Hook返回类型
 */
interface UseRouteGuardReturn {
  canAccess: boolean;
  requiresAuth: boolean;
  isGuestMode: boolean;
  checkAccess: (route?: string) => boolean;
  requireAuth: (action: string, message?: string) => boolean;
  promptLogin: (message?: string) => void;
  navigateToLogin: (intendedRoute?: string) => void;
}

// #endregion

// #region 本地存储

/**
 * 保存原本想访问的路由
 */
const INTENDED_ROUTE_KEY = '@auth/intended_route';

const saveIntendedRoute = async (route: string): Promise<void> => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.setItem(INTENDED_ROUTE_KEY, route);
  } catch (error) {
    console.error('Save intended route error:', error);
  }
};

const getIntendedRoute = async (): Promise<string | null> => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return await AsyncStorage.default.getItem(INTENDED_ROUTE_KEY);
  } catch (error) {
    console.error('Get intended route error:', error);
    return null;
  }
};

const clearIntendedRoute = async (): Promise<void> => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.removeItem(INTENDED_ROUTE_KEY);
  } catch (error) {
    console.error('Clear intended route error:', error);
  }
};

// #endregion

// #region Hook实现

/**
 * 路由守卫Hook
 */
export const useRouteGuard = (): UseRouteGuardReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAuthStore();
  
  // 守卫状态
  const [guardState, setGuardState] = useState<RouteGuardState>({
    canAccess: true,
    requiresAuth: false,
    isGuestMode: false,
    intendedRoute: null,
  });
  
  // 是否已经检查过（防止重复检查）
  const hasChecked = useRef(false);
  
  /**
   * 检查路由访问权限
   */
  const checkAccess = useCallback((route?: string): boolean => {
    const currentRoute = route || pathname;
    
    // 未初始化时，暂时允许访问（等待初始化完成）
    if (!isInitialized) {
      return true;
    }
    
    // 🎯 白名单检查
    const anonymousAllowed = canAccessAnonymously(currentRoute);
    
    // 如果在白名单中，允许访问
    if (anonymousAllowed) {
      setGuardState({
        canAccess: true,
        requiresAuth: false,
        isGuestMode: !isAuthenticated,
        intendedRoute: null,
      });
      return true;
    }
    
    // 🎯 不在白名单中，检查是否已登录
    if (!isAuthenticated) {
      setGuardState({
        canAccess: false,
        requiresAuth: true,
        isGuestMode: true,
        intendedRoute: currentRoute,
      });
      return false;
    }
    
    // 已登录，允许访问
    setGuardState({
      canAccess: true,
      requiresAuth: true,
      isGuestMode: false,
      intendedRoute: null,
    });
    return true;
  }, [pathname, isAuthenticated, isInitialized]);
  
  /**
   * 检查特定操作是否需要认证
   * @param action - 操作类型
   * @param message - 自定义提示信息
   * @returns true表示可以执行，false表示需要登录
   */
  const requireAuth = useCallback((action: string, message?: string): boolean => {
    if (!isAuthenticated) {
      const promptMessage = message || routeGuard.getActionLoginPrompt(action);
      promptLogin(promptMessage);
      return false;
    }
    return true;
  }, [isAuthenticated]);
  
  /**
   * 提示用户登录
   */
  const promptLogin = useCallback((message: string = '此功能需要登录') => {
    Alert.alert(
      '需要登录',
      message,
      [
        { text: '暂不登录', style: 'cancel' },
        { 
          text: '去登录', 
          onPress: () => navigateToLogin(pathname),
          style: 'default'
        },
      ]
    );
  }, [pathname]);
  
  /**
   * 跳转到登录页
   */
  const navigateToLogin = useCallback(async (intendedRoute?: string) => {
    const route = intendedRoute || pathname;
    
    // 🎯 保存原本想访问的路由（如果不是公共路由）
    if (route && !canAccessAnonymously(route)) {
      await saveIntendedRoute(route);
      console.log(`📍 Saved intended route: ${route}`);
    }
    
    // 跳转到登录页
    router.replace('/auth/login');
  }, [pathname, router]);
  
  /**
   * 自动路由守卫检查
   */
  useEffect(() => {
    // 只在初始化完成后检查
    if (!isInitialized) {
      return;
    }
    
    // 防止重复检查
    if (hasChecked.current && pathname === guardState.intendedRoute) {
      return;
    }
    
    const canAccess = checkAccess(pathname);
    hasChecked.current = true;
    
    // 🎯 如果不能访问，自动跳转登录
    if (!canAccess) {
      console.log(`🚫 Route ${pathname} requires authentication`);
      navigateToLogin(pathname);
    }
  }, [pathname, isInitialized, isAuthenticated, checkAccess, navigateToLogin]);
  
  /**
   * 监听登录状态变化，登录成功后返回原路由
   */
  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (isAuthenticated && isInitialized) {
        const intendedRoute = await getIntendedRoute();
        
        if (intendedRoute) {
          console.log(`✅ Login successful, redirecting to: ${intendedRoute}`);
          await clearIntendedRoute();
          router.replace(intendedRoute as any);
        }
      }
    };
    
    handleLoginSuccess();
  }, [isAuthenticated, isInitialized, router]);
  
  return {
    canAccess: guardState.canAccess,
    requiresAuth: guardState.requiresAuth,
    isGuestMode: guardState.isGuestMode,
    checkAccess,
    requireAuth,
    promptLogin,
    navigateToLogin,
  };
};

// #endregion

// #region 导出类型

export type {
    RouteGuardState,
    UseRouteGuardReturn
};

// #endregion
