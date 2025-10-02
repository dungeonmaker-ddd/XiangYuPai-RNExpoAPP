/**
 * 路由白名单配置
 * 
 * 定义哪些路由可以在未登录状态下访问
 * 采用白名单机制：只有在白名单中的路由才能匿名访问
 */

// #region 白名单路由定义

/**
 * 公共路由白名单
 * 这些路由不需要登录即可访问
 */
export const PUBLIC_ROUTES = [
  // 认证相关路由（登录、注册、密码重置）
  '/auth/login',
  '/auth/register',
  '/auth/reset-entry',
  '/auth/code-send',
  '/auth/code-verify',
  '/auth/password-reset',
  '/auth/reset-success',
  
  // 公开的模态框
  '/modal/agreement',
  '/modal/user-terms',
  '/modal/privacy-policy',
  '/modal/region-select',
] as const;

/**
 * 半公开路由白名单
 * 这些Tab页面可以部分内容匿名访问，但某些功能需要登录
 */
export const SEMI_PUBLIC_ROUTES = [
  '/(tabs)/homepage',      // 首页 - 可以浏览，但互动需要登录
  '/(tabs)/discover',      // 发现 - 可以浏览，但互动需要登录
] as const;

/**
 * 受保护路由（页面内显示登录提示）
 * 注意：Tab栏始终显示这些Tab，但页面内容会根据登录状态不同
 * - 未登录：显示登录引导页面
 * - 已登录：显示完整功能
 */
export const PROTECTED_ROUTES = [
  '/(tabs)/messages',      // 消息 - Tab可见，页面内需登录
  '/(tabs)/profile',       // 我的 - Tab可见，页面内需登录
  '/publish',              // 发布 - 必须登录
  '/modal/user-detail',    // 用户详情 - 必须登录
  '/modal/filter-panel',   // 筛选面板 - 必须登录
] as const;

/**
 * 首页子路由保护配置
 * 定义首页下哪些功能需要登录
 */
export const HOMEPAGE_PROTECTED_ROUTES = [
  '/(tabs)/homepage/search',          // 搜索 - 必须登录
  '/(tabs)/homepage/service-detail',  // 服务详情 - 可以浏览
  '/(tabs)/homepage/location',        // 位置选择 - 可以浏览
  '/(tabs)/homepage/filter-online',   // 筛选 - 必须登录
  '/(tabs)/homepage/event-center',    // 活动中心 - 必须登录
  '/(tabs)/homepage/featured',        // 精选 - 可以浏览
] as const;

// #endregion

// #region 白名单检查函数

/**
 * 检查路由是否在公共白名单中
 */
export const isPublicRoute = (route: string): boolean => {
  return PUBLIC_ROUTES.some(publicRoute => route.startsWith(publicRoute));
};

/**
 * 检查路由是否在半公开白名单中
 */
export const isSemiPublicRoute = (route: string): boolean => {
  return SEMI_PUBLIC_ROUTES.some(semiPublicRoute => route.startsWith(semiPublicRoute));
};

/**
 * 检查路由是否受保护（需要登录）
 */
export const isProtectedRoute = (route: string): boolean => {
  return PROTECTED_ROUTES.some(protectedRoute => route.startsWith(protectedRoute));
};

/**
 * 检查路由是否允许匿名访问
 * @param route - 当前路由路径
 * @returns true表示允许匿名访问，false表示需要登录
 */
export const canAccessAnonymously = (route: string): boolean => {
  // 1. 在公共白名单中 → 允许访问
  if (isPublicRoute(route)) {
    return true;
  }
  
  // 2. 在半公开白名单中 → 允许访问（但功能受限）
  if (isSemiPublicRoute(route)) {
    return true;
  }
  
  // 3. 不在任何白名单中 → 需要登录
  return false;
};

/**
 * 检查特定功能是否需要登录
 * @param route - 当前路由
 * @param action - 用户操作（如：'like', 'comment', 'follow'）
 * @returns true表示需要登录，false表示不需要
 */
export const requiresAuthForAction = (route: string, action: string): boolean => {
  // 半公开路由中的某些操作需要登录
  if (isSemiPublicRoute(route)) {
    const PROTECTED_ACTIONS = [
      'like',           // 点赞
      'comment',        // 评论
      'follow',         // 关注
      'favorite',       // 收藏
      'share',          // 分享
      'message',        // 发消息
      'book',           // 预约
      'publish',        // 发布
      'edit',           // 编辑
      'delete',         // 删除
    ];
    
    return PROTECTED_ACTIONS.includes(action);
  }
  
  // 受保护路由的所有操作都需要登录
  return isProtectedRoute(route);
};

// #endregion

// #region Tab访问控制

/**
 * Tab访问权限配置
 */
export const TAB_ACCESS_CONTROL = {
  homepage: {
    requiresAuth: false,        // Tab本身不需要登录
    name: '首页',
    icon: 'house.fill',
    guestMessage: '浏览内容无需登录，点赞、评论等操作需要登录',
  },
  discover: {
    requiresAuth: false,        // Tab本身不需要登录
    name: '发现',
    icon: 'globe',
    guestMessage: '浏览发现页无需登录，互动功能需要登录',
  },
  messages: {
    requiresAuth: true,         // 消息必须登录
    name: '消息',
    icon: 'message.fill',
    loginPrompt: '查看消息需要先登录',
  },
  profile: {
    requiresAuth: true,         // 我的必须登录
    name: '我的',
    icon: 'person.fill',
    loginPrompt: '查看个人资料需要先登录',
  },
} as const;

/**
 * 检查Tab是否需要认证
 */
export const tabRequiresAuth = (tabName: keyof typeof TAB_ACCESS_CONTROL): boolean => {
  return TAB_ACCESS_CONTROL[tabName]?.requiresAuth ?? true;
};

/**
 * 获取Tab的登录提示信息
 */
export const getTabLoginPrompt = (tabName: keyof typeof TAB_ACCESS_CONTROL): string => {
  const config = TAB_ACCESS_CONTROL[tabName];
  if ('loginPrompt' in config) {
    return config.loginPrompt;
  }
  if ('guestMessage' in config) {
    return config.guestMessage;
  }
  return '此功能需要登录';
};

// #endregion

// #region 路由重定向配置

/**
 * 登录后重定向配置
 * 定义用户登录成功后应该跳转到哪里
 */
export const LOGIN_REDIRECT_CONFIG = {
  // 默认重定向到首页
  DEFAULT: '/(tabs)/homepage',
  
  // 根据来源页面的重定向规则
  FROM_MESSAGES: '/(tabs)/messages',
  FROM_PROFILE: '/(tabs)/profile',
  FROM_PUBLISH: '/publish',
  
  // 记住用户尝试访问的页面
  REMEMBER_INTENDED: true,
  
  // 最大重定向深度（防止循环）
  MAX_REDIRECT_DEPTH: 3,
} as const;

/**
 * 获取登录后的重定向路径
 * @param intendedRoute - 用户原本想访问的路由
 * @returns 应该重定向到的路由
 */
export const getLoginRedirectPath = (intendedRoute?: string): string => {
  // 如果有记录用户想访问的页面，且该页面不是登录页
  if (intendedRoute && !intendedRoute.includes('/auth/')) {
    return intendedRoute;
  }
  
  // 否则返回默认首页
  return LOGIN_REDIRECT_CONFIG.DEFAULT;
};

// #endregion

// #region 访客模式配置

/**
 * 访客模式配置
 * 定义匿名用户可以使用哪些功能
 */
export const GUEST_MODE_CONFIG = {
  // 访客可以浏览的内容
  ALLOWED_VIEWS: [
    'homepage',              // 首页浏览
    'discover',              // 发现页浏览
    'service-list',          // 服务列表浏览
    'service-detail',        // 服务详情浏览
    'user-profile-view',     // 用户资料查看（只读）
  ],
  
  // 访客不能使用的功能
  RESTRICTED_ACTIONS: [
    'like',                  // 点赞
    'comment',               // 评论
    'follow',                // 关注
    'favorite',              // 收藏
    'message',               // 发消息
    'book',                  // 预约
    'publish',               // 发布
    'edit',                  // 编辑
    'review',                // 评价
  ],
  
  // 访客提示信息
  LOGIN_PROMPTS: {
    like: '登录后即可点赞',
    comment: '登录后即可评论',
    follow: '登录后即可关注',
    favorite: '登录后即可收藏',
    message: '登录后即可发送消息',
    book: '登录后即可预约服务',
    publish: '登录后即可发布内容',
  },
  
  // 是否显示登录提示
  SHOW_LOGIN_PROMPT: true,
  
  // 提示显示方式
  PROMPT_TYPE: 'toast' as 'toast' | 'modal' | 'inline',
} as const;

/**
 * 检查访客是否可以执行某个操作
 */
export const guestCanPerformAction = (action: string): boolean => {
  return !GUEST_MODE_CONFIG.RESTRICTED_ACTIONS.includes(action as any);
};

/**
 * 获取操作的登录提示
 */
export const getActionLoginPrompt = (action: string): string => {
  return GUEST_MODE_CONFIG.LOGIN_PROMPTS[action as keyof typeof GUEST_MODE_CONFIG.LOGIN_PROMPTS] 
    || '此操作需要先登录';
};

// #endregion

// #region 导出

/**
 * 统一导出所有配置
 */
export const ROUTE_WHITELIST_CONFIG = {
  PUBLIC_ROUTES,
  SEMI_PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  HOMEPAGE_PROTECTED_ROUTES,
  TAB_ACCESS_CONTROL,
  LOGIN_REDIRECT_CONFIG,
  GUEST_MODE_CONFIG,
} as const;

// 导出所有检查函数
export const routeGuard = {
  isPublicRoute,
  isSemiPublicRoute,
  isProtectedRoute,
  canAccessAnonymously,
  requiresAuthForAction,
  tabRequiresAuth,
  getTabLoginPrompt,
  getLoginRedirectPath,
  guestCanPerformAction,
  getActionLoginPrompt,
};

// #endregion
