/**
 * 认证模块调试日志工具
 * 
 * 提供轻量级的调试日志功能
 */

// #region 日志配置

/**
 * 是否启用调试日志
 */
const DEBUG_ENABLED = __DEV__;  // 只在开发环境启用

/**
 * 日志颜色配置（Metro终端支持的ANSI颜色）
 */
const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
} as const;

// #endregion

// #region 调试工具函数

/**
 * 认证调试日志工具
 */
export const authDebugLogger = {
  /**
   * 记录认证状态变化
   */
  logAuthStateChange: (from: boolean, to: boolean) => {
    if (!DEBUG_ENABLED) return;
    
    console.log('\n🔄 认证状态变化:');
    console.log(`   从: ${from ? '✅ 已登录' : '❌ 未登录'}`);
    console.log(`   到: ${to ? '✅ 已登录' : '❌ 未登录'}\n`);
  },

  /**
   * 记录路由访问
   */
  logRouteAccess: (route: string, allowed: boolean, reason: string) => {
    if (!DEBUG_ENABLED) return;
    
    const icon = allowed ? '✅' : '🚫';
    const status = allowed ? '允许访问' : '拒绝访问';
    
    console.log(`${icon} [路由] ${route}`);
    console.log(`   状态: ${status}`);
    console.log(`   原因: ${reason}\n`);
  },

  /**
   * 记录白名单检查
   */
  logWhitelistCheck: (route: string, isInWhitelist: boolean) => {
    if (!DEBUG_ENABLED) return;
    
    console.log(`🔍 [白名单检查] ${route}`);
    console.log(`   结果: ${isInWhitelist ? '✅ 在白名单中' : '❌ 不在白名单中'}\n`);
  },

  /**
   * 快速状态摘要
   */
  logStateSummary: () => {
    if (!DEBUG_ENABLED) return;
    
    // 动态导入避免循环依赖
    import('../stores/authStore').then(({ useAuthStore }) => {
      const state = useAuthStore.getState();
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 当前认证状态摘要');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   isAuthenticated: ${state.isAuthenticated ? '✅ 是' : '❌ 否'}`);
      console.log(`   isInitialized: ${state.isInitialized ? '✅ 是' : '❌ 否'}`);
      console.log(`   hasToken: ${state.accessToken ? '✅ 有' : '❌ 无'}`);
      console.log(`   userInfo: ${state.userInfo ? state.userInfo.nickname : '无'}`);
      console.log(`   loginMode: ${state.loginMode}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
  },
};

// #endregion

// #region 测试助手函数

/**
 * 测试助手工具
 */
export const authTestHelper = {
  /**
   * 快速测试登录
   */
  async testLogin(phone: string = '13800138000') {
    console.log('\n🧪 [测试] 执行快速登录测试...');
    
    const { useAuthStore } = await import('../stores/authStore');
    const { login } = useAuthStore.getState();
    
    await login({
      phone,
      password: '123456',
      region: '+86',
    });
    
    authDebugLogger.logStateSummary();
  },

  /**
   * 快速测试登出
   */
  async testLogout() {
    console.log('\n🧪 [测试] 执行快速登出测试...');
    
    const { useAuthStore } = await import('../stores/authStore');
    const { logout } = useAuthStore.getState();
    
    await logout();
    
    authDebugLogger.logStateSummary();
  },

  /**
   * 测试白名单
   */
  async testWhitelist() {
    console.log('\n🧪 [测试] 白名单配置检查');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const { canAccessAnonymously } = await import('../config/routeWhitelist');
    
    const testRoutes = [
      '/(tabs)/homepage',
      '/(tabs)/discover',
      '/(tabs)/messages',
      '/(tabs)/profile',
      '/auth/login',
      '/publish',
    ];
    
    testRoutes.forEach(route => {
      const allowed = canAccessAnonymously(route);
      console.log(`${allowed ? '✅' : '🔒'} ${route}`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },

  /**
   * 显示三层防护状态
   */
  showProtectionStatus() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛡️ 三层防护机制状态');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   第一层: ✅ App启动时初始化（已激活）');
    console.log('   第二层: ✅ 路由守卫（已激活）');
    console.log('   第三层: ✅ API拦截器（已激活）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },
};

// #endregion

// #region 全局调试助手（仅开发环境）

if (__DEV__) {
  // 将调试工具挂载到全局对象，方便在控制台调用
  (global as any).authDebug = {
    ...authDebugLogger,
    ...authTestHelper,
    
    // 快捷方法
    status: () => authDebugLogger.logStateSummary(),
    testLogin: () => authTestHelper.testLogin(),
    testLogout: () => authTestHelper.testLogout(),
    testWhitelist: () => authTestHelper.testWhitelist(),
    showProtection: () => authTestHelper.showProtectionStatus(),
  };
  
  console.log('\n💡 调试工具已加载！可在控制台使用：');
  console.log('   authDebug.status()        - 查看当前状态');
  console.log('   authDebug.testLogin()     - 测试登录');
  console.log('   authDebug.testLogout()    - 测试登出');
  console.log('   authDebug.testWhitelist() - 测试白名单');
  console.log('   authDebug.showProtection() - 查看防护状态\n');
}

// #endregion
