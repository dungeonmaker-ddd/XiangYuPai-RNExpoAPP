/**
 * LoginMainPage 常量配置文件
 * 
 * 定义登录主页面相关的所有常量、配置项和静态数据
 */

import type {
    AuthMode,
    ErrorMessages,
    LoginConfig,
    RegionInfo,
    ValidationRules
} from './types';

// #region 业务常量

/**
 * 认证模式配置
 */
export const AUTH_MODES: Record<AuthMode, { label: string; description: string }> = {
  password: {
    label: '密码登录',
    description: '使用手机号和密码登录',
  },
  sms: {
    label: '验证码登录',
    description: '使用手机号和短信验证码登录',
  },
} as const;

/**
 * 默认地区配置
 */
export const DEFAULT_REGION: RegionInfo = {
  code: '+86',
  name: '中国',
  flag: '🇨🇳',
  phoneLength: 11,
} as const;

/**
 * 常用地区列表
 */
export const COMMON_REGIONS: RegionInfo[] = [
  { code: '+86', name: '中国', flag: '🇨🇳', phoneLength: 11 },
  { code: '+1', name: '美国', flag: '🇺🇸', phoneLength: 10 },
  { code: '+44', name: '英国', flag: '🇬🇧', phoneLength: 10 },
  { code: '+81', name: '日本', flag: '🇯🇵', phoneLength: 10 },
  { code: '+82', name: '韩国', flag: '🇰🇷', phoneLength: 10 },
  { code: '+852', name: '香港', flag: '🇭🇰', phoneLength: 8 },
  { code: '+853', name: '澳门', flag: '🇲🇴', phoneLength: 8 },
  { code: '+886', name: '台湾', flag: '🇹🇼', phoneLength: 9 },
] as const;

// #endregion

// #region 验证规则

/**
 * 表单验证规则
 */
export const VALIDATION_RULES: ValidationRules = {
  PHONE_MIN_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 6,
  CODE_LENGTH: 6,
} as const;

/**
 * 手机号正则表达式映射
 */
export const PHONE_REGEX_MAP: Record<string, RegExp> = {
  '+86': /^1[3-9]\d{9}$/,        // 中国手机号
  '+1': /^\d{10}$/,              // 美国手机号
  '+44': /^\d{10}$/,             // 英国手机号
  '+81': /^\d{10}$/,             // 日本手机号
  '+82': /^\d{10}$/,             // 韩国手机号
  '+852': /^\d{8}$/,             // 香港手机号
  '+853': /^\d{8}$/,             // 澳门手机号
  '+886': /^\d{9}$/,             // 台湾手机号
} as const;

/**
 * 密码强度规则
 */
export const PASSWORD_RULES = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 20,
  REQUIRE_UPPER: false,           // 是否要求大写字母
  REQUIRE_LOWER: false,           // 是否要求小写字母
  REQUIRE_NUMBER: false,          // 是否要求数字
  REQUIRE_SPECIAL: false,         // 是否要求特殊字符
} as const;

/**
 * 验证码规则
 */
export const CODE_RULES = {
  LENGTH: 6,
  TYPE: 'numeric' as 'numeric' | 'alphanumeric',
  CASE_SENSITIVE: false,
} as const;

// #endregion

// #region 错误消息

/**
 * 错误消息配置
 */
export const ERROR_MESSAGES: ErrorMessages = {
  PHONE_INVALID: '请输入正确的手机号',
  PASSWORD_TOO_SHORT: '密码至少6位',
  CODE_INVALID: '验证码格式错误',
  AGREEMENT_REQUIRED: '请同意用户协议',
  NETWORK_ERROR: '网络连接失败，请重试',
} as const;

/**
 * API错误消息映射
 */
export const API_ERROR_MESSAGES: Record<string, string> = {
  'USER_NOT_FOUND': '用户不存在',
  'WRONG_PASSWORD': '密码错误',
  'CODE_EXPIRED': '验证码已过期',
  'CODE_INVALID': '验证码错误',
  'TOO_MANY_ATTEMPTS': '尝试次数过多，请稍后再试',
  'PHONE_NOT_REGISTERED': '手机号未注册',
  'PHONE_ALREADY_EXISTS': '手机号已注册',
  'SMS_SEND_FAILED': '短信发送失败',
  'NETWORK_ERROR': '网络错误，请检查网络连接',
  'SERVER_ERROR': '服务器错误，请稍后重试',
} as const;

// #endregion

// #region UI配置

/**
 * 登录配置
 */
export const LOGIN_CONFIG: LoginConfig = {
  AUTO_LOGIN: true,               // 是否自动登录
  REMEMBER_PHONE: true,           // 是否记住手机号
  SMS_CODE_LENGTH: 6,             // 验证码长度
  SMS_COUNTDOWN_SECONDS: 60,      // 验证码倒计时秒数
  MAX_LOGIN_ATTEMPTS: 5,          // 最大登录尝试次数
} as const;

/**
 * UI尺寸配置
 */
export const UI_SIZES = {
  INPUT_HEIGHT: 48,               // 输入框高度
  BUTTON_HEIGHT: 48,              // 按钮高度
  LOGO_SIZE: 80,                  // Logo尺寸
  BORDER_RADIUS: 8,               // 圆角半径
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
} as const;

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// #endregion

// #region 颜色配置

/**
 * 认证主题颜色
 */
export const AUTH_COLORS = {
  // 主色调
  PRIMARY: '#6366F1',
  PRIMARY_LIGHT: '#818CF8',
  PRIMARY_DARK: '#4F46E5',
  
  // 辅助色
  SECONDARY: '#8B5CF6',
  SECONDARY_LIGHT: '#A78BFA',
  SECONDARY_DARK: '#7C3AED',
  
  // 状态色
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  
  // 中性色
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  
  // 背景色
  BACKGROUND: '#F8FAFC',
  SURFACE: '#FFFFFF',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  
  // 边框色
  BORDER: '#E5E7EB',
  BORDER_FOCUS: '#6366F1',
  BORDER_ERROR: '#EF4444',
  
  // 文本色
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_TERTIARY: '#9CA3AF',
  TEXT_DISABLED: '#D1D5DB',
  TEXT_LINK: '#6366F1',
} as const;

/**
 * 渐变色配置
 */
export const GRADIENTS = {
  PRIMARY: ['#6366F1', '#8B5CF6'],
  SECONDARY: ['#8B5CF6', '#EC4899'],
  SUCCESS: ['#10B981', '#059669'],
  WARNING: ['#F59E0B', '#D97706'],
  ERROR: ['#EF4444', '#DC2626'],
} as const;

// #endregion

// #region 路由配置

/**
 * 认证相关路由
 */
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  RESET_ENTRY: '/auth/reset-entry',
  CODE_SEND: '/auth/code-send',
  CODE_VERIFY: '/auth/code-verify',
  PASSWORD_RESET: '/auth/password-reset',
  RESET_SUCCESS: '/auth/reset-success',
  HOME: '/(tabs)/homepage',
} as const;

/**
 * 模态框路由
 */
export const MODAL_ROUTES = {
  REGION_SELECT: '/modal/region-select',
  AGREEMENT: '/modal/agreement',
  USER_TERMS: '/modal/user-terms',
  PRIVACY_POLICY: '/modal/privacy-policy',
} as const;

// #endregion

// #region 本地存储Key

/**
 * AsyncStorage存储Key
 */
export const STORAGE_KEYS = {
  // 用户偏好
  LAST_PHONE: '@auth/last_phone',
  LAST_REGION: '@auth/last_region',
  LOGIN_MODE: '@auth/login_mode',
  REMEMBER_PHONE: '@auth/remember_phone',
  
  // 应用配置
  AGREEMENT_ACCEPTED: '@auth/agreement_accepted',
  FIRST_LAUNCH: '@auth/first_launch',
  APP_VERSION: '@auth/app_version',
} as const;

/**
 * SecureStore存储Key
 */
export const SECURE_KEYS = {
  // 敏感数据
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_CREDENTIALS: 'user_credentials',
  BIOMETRIC_DATA: 'biometric_data',
} as const;

// #endregion

// #region 第三方服务配置

/**
 * 第三方登录配置
 */
export const THIRD_PARTY_CONFIG = {
  WECHAT: {
    APP_ID: 'wx_app_id',
    ENABLED: true,
  },
  WEIBO: {
    APP_ID: 'wb_app_id', 
    ENABLED: true,
  },
  QQ: {
    APP_ID: 'qq_app_id',
    ENABLED: true,
  },
  APPLE: {
    ENABLED: true,
  },
  GOOGLE: {
    ENABLED: false,
  },
} as const;

// #endregion

// #region 默认值

/**
 * 表单默认值
 */
export const DEFAULT_FORM_VALUES = {
  phone: '',
  password: '',
  smsCode: '',
  region: DEFAULT_REGION,
} as const;

/**
 * 状态默认值
 */
export const DEFAULT_STATE_VALUES = {
  isAuthenticated: false,
  loginMode: 'password' as AuthMode,
  loading: {
    login: false,
    sendCode: false,
    verify: false,
  },
  error: {
    message: '',
    type: 'network' as const,
    visible: false,
  },
  countdown: {
    value: 0,
    active: false,
    type: 'sms' as const,
  },
} as const;

// #endregion

// #region 统一导出

/**
 * 主要常量导出
 */
export const LOGIN_CONSTANTS = {
  AUTH_MODES,
  DEFAULT_REGION,
  COMMON_REGIONS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  LOGIN_CONFIG,
  AUTH_COLORS,
  AUTH_ROUTES,
  MODAL_ROUTES,
  UI_SIZES,
  ANIMATION_CONFIG,
} as const;

// #endregion
