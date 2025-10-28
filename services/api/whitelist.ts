/**
 * API白名单配置
 * 
 * 定义哪些API允许匿名访问，即使返回401也不触发登录流程
 */

/**
 * 白名单类型
 */
export enum WhitelistType {
  /** 完全匿名访问 - 401时使用降级方案 */
  ANONYMOUS = 'anonymous',
  /** 可选认证 - 有token更好，没有也能访问 */
  OPTIONAL_AUTH = 'optional_auth',
  /** 必须认证 - 401时引导登录 */
  REQUIRED_AUTH = 'required_auth',
}

/**
 * 白名单配置项
 */
interface WhitelistRule {
  /** 路径匹配规则（支持通配符 *） */
  pattern: string | RegExp;
  /** 白名单类型 */
  type: WhitelistType;
  /** 描述 */
  description: string;
}

/**
 * API白名单规则
 */
export const API_WHITELIST: WhitelistRule[] = [
  // ================================
  // 首页模块 - 允许匿名访问
  // ================================
  {
    pattern: /^\/xypai-user\/api\/v1\/users\/list/,
    type: WhitelistType.ANONYMOUS,
    description: '首页用户列表（访客可浏览）',
  },
  {
    pattern: /^\/xypai-user\/api\/v1\/homepage\/featured-users/,
    type: WhitelistType.ANONYMOUS,
    description: '精选用户列表（访客可浏览）',
  },
  {
    pattern: /^\/xypai-user\/api\/v1\/users\/\d+\/public-profile/,
    type: WhitelistType.ANONYMOUS,
    description: '用户公开主页（访客可查看）',
  },
  
  // ================================
  // 发现模块 - 允许匿名访问
  // ================================
  {
    pattern: /^\/xypai-content\/api\/v1\/contents\/public/,
    type: WhitelistType.ANONYMOUS,
    description: '发现页公开内容（访客可浏览）',
  },
  {
    pattern: /^\/xypai-content\/api\/v1\/contents\/\d+\/detail/,
    type: WhitelistType.OPTIONAL_AUTH,
    description: '内容详情（登录后可互动）',
  },
  
  // ================================
  // 认证模块 - 完全公开
  // ================================
  {
    pattern: /^\/xypai-auth\/api\/v1\/auth\/(login|register|sms-code)/,
    type: WhitelistType.ANONYMOUS,
    description: '认证接口（登录、注册、验证码）',
  },
  
  // ================================
  // 受保护模块 - 必须登录
  // ================================
  {
    pattern: /^\/xypai-chat\/api\/v1\//,
    type: WhitelistType.REQUIRED_AUTH,
    description: '聊天模块（需要登录）',
  },
  {
    pattern: /^\/xypai-trade\/api\/v1\//,
    type: WhitelistType.REQUIRED_AUTH,
    description: '交易模块（需要登录）',
  },
  {
    pattern: /^\/xypai-user\/api\/v1\/profile\//,
    type: WhitelistType.REQUIRED_AUTH,
    description: '个人资料管理（需要登录）',
  },
];

/**
 * 检查URL是否在白名单中
 */
export function checkWhitelist(url: string): {
  isWhitelisted: boolean;
  type: WhitelistType;
  rule?: WhitelistRule;
} {
  for (const rule of API_WHITELIST) {
    const matched = typeof rule.pattern === 'string' 
      ? url.includes(rule.pattern)
      : rule.pattern.test(url);
    
    if (matched) {
      return {
        isWhitelisted: true,
        type: rule.type,
        rule,
      };
    }
  }
  
  // 默认：需要认证
  return {
    isWhitelisted: false,
    type: WhitelistType.REQUIRED_AUTH,
  };
}

/**
 * 判断401错误是否应该触发登录流程
 */
export function shouldRedirectToLogin(url: string): boolean {
  const { type } = checkWhitelist(url);
  return type === WhitelistType.REQUIRED_AUTH;
}

/**
 * 判断是否可以使用降级方案（模拟数据）
 */
export function canUseFallback(url: string): boolean {
  const { type } = checkWhitelist(url);
  return type === WhitelistType.ANONYMOUS || type === WhitelistType.OPTIONAL_AUTH;
}

