/**
 * Components Index - 统一导出所有共享组件
 */

import React from 'react';

// 基础组件
export { default as ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
export { default as LoadingOverlay, useLoading } from './LoadingOverlay';

// UI组件
export { default as Button } from './ui/Button';
export { default as Card } from './ui/Card';

// 便捷的组件变体
export {
    DangerButton, GhostButton, OutlineButton, PrimaryButton,
    SecondaryButton
} from './ui/Button';

export {
    CardBody,
    CardFooter, CardHeader, DefaultCard,
    ElevatedCard, FilledCard, OutlinedCard
} from './ui/Card';

// 导出类型
export type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary';
export type { LoadingOverlayProps } from './LoadingOverlay';
export type { ButtonProps, ButtonSize, ButtonVariant } from './ui/Button';
export type { CardProps, CardSize, CardVariant } from './ui/Card';

// 组件工具函数
export const componentUtils = {
  // 错误边界工具
  createErrorBoundary: (errorHandler?: (error: Error) => void) => 
    withErrorBoundary,
  
  // 加载状态工具
  createLoadingWrapper: (Component: React.ComponentType<any>) => 
    ({ loading, ...props }: { loading: boolean } & any) => (
      React.createElement(React.Fragment, null,
        React.createElement(Component, props),
        React.createElement(LoadingOverlay, { loading })
      )
    ),
};

// 组件常量
export const COMPONENT_CONSTANTS = {
  BUTTON: {
    VARIANTS: ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const,
    SIZES: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
  },
  CARD: {
    VARIANTS: ['default', 'elevated', 'outlined', 'filled'] as const,
    SIZES: ['sm', 'md', 'lg'] as const,
  },
  LOADING: {
    TYPES: ['default', 'spinner', 'dots', 'pulse'] as const,
    SIZES: ['small', 'large'] as const,
  },
} as const;
