/**
 * AuthModule Hooks - 统一导出
 * 
 * 导出所有认证相关的自定义Hooks
 */

// 认证初始化Hook
export {
    useAuthInitialization,
    useAuthStateListener,
    useAutoLoginCheck
} from './useAuthInitialization';

export type {
    InitializationState,
    UseAuthInitializationReturn
} from './useAuthInitialization';

// 路由守卫Hook
export {
    useRouteGuard
} from './useRouteGuard';

export type {
    RouteGuardState,
    UseRouteGuardReturn
} from './useRouteGuard';

