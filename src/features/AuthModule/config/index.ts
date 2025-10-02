/**
 * AuthModule Config - 配置统一导出
 * 
 * 导出所有认证模块相关的配置
 */

// 路由白名单配置
export {
    GUEST_MODE_CONFIG, HOMEPAGE_PROTECTED_ROUTES, LOGIN_REDIRECT_CONFIG, PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTE_WHITELIST_CONFIG, SEMI_PUBLIC_ROUTES, TAB_ACCESS_CONTROL, canAccessAnonymously, getActionLoginPrompt, getLoginRedirectPath, getTabLoginPrompt, guestCanPerformAction, isProtectedRoute,
    // 白名单检查函数
    isPublicRoute,
    isSemiPublicRoute, requiresAuthForAction, routeGuard, tabRequiresAuth
} from './routeWhitelist';

