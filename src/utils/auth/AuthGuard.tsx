/**
 * AuthGuard - Authentication Guard Component
 * 
 * Features:
 * - Guest browsing allowed for public content
 * - Login required for sensitive actions
 * - Smart login prompts
 * - Seamless user experience
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../features/AuthModule/stores/authStore';

// #region Types

export interface AuthGuardOptions {
  /** Action description for login prompt */
  action?: string;
  /** Whether to show alert or silent redirect */
  silent?: boolean;
  /** Callback after successful login */
  onSuccess?: () => void;
  /** Callback if user cancels */
  onCancel?: () => void;
}

export interface AuthCheckResult {
  isAuthenticated: boolean;
  userId?: string;
  token?: string;
}

// #endregion

// #region Hooks

/**
 * Hook for authentication checks
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const { isAuthenticated, userInfo, accessToken } = useAuthStore();
  
  /**
   * Check if user is authenticated
   */
  const checkAuth = useCallback((): AuthCheckResult => {
    return {
      isAuthenticated,
      userId: userInfo?.id,
      token: accessToken || undefined,
    };
  }, [isAuthenticated, userInfo, accessToken]);
  
  /**
   * Require authentication with custom prompt
   */
  const requireAuth = useCallback((options: AuthGuardOptions = {}): boolean => {
    const {
      action = '此操作',
      silent = false,
      onSuccess,
      onCancel,
    } = options;
    
    if (isAuthenticated) {
      onSuccess?.();
      return true;
    }
    
    if (silent) {
      router.push('/auth/login');
      return false;
    }
    
    Alert.alert(
      '需要登录',
      `${action}需要登录后才能使用`,
      [
        {
          text: '取消',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: '去登录',
          onPress: () => {
            router.push('/auth/login');
            onSuccess?.();
          },
        },
      ]
    );
    
    return false;
  }, [isAuthenticated, router]);
  
  /**
   * Protected action wrapper
   */
  const withAuth = useCallback(<T extends any[]>(
    action: (...args: T) => void | Promise<void>,
    options?: AuthGuardOptions
  ) => {
    return (...args: T) => {
      if (requireAuth(options)) {
        return action(...args);
      }
    };
  }, [requireAuth]);
  
  return {
    checkAuth,
    requireAuth,
    withAuth,
    isAuthenticated,
    user: userInfo,
  };
};

// #endregion

// #region Auth Guard Component

interface AuthGuardProps {
  /** Content to render when authenticated */
  children: React.ReactNode;
  /** Content to render when not authenticated (optional) */
  fallback?: React.ReactNode;
  /** Whether to redirect to login */
  redirectToLogin?: boolean;
  /** Action description for redirect */
  action?: string;
}

/**
 * AuthGuard Component - Conditionally render based on auth status
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  redirectToLogin = false,
  action = '访问此内容',
}) => {
  const { isAuthenticated, requireAuth } = useAuthGuard();
  
  React.useEffect(() => {
    if (!isAuthenticated && redirectToLogin) {
      requireAuth({ action });
    }
  }, [isAuthenticated, redirectToLogin, action, requireAuth]);
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// #endregion

export default AuthGuard;

