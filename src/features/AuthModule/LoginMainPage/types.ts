/**
 * LoginMainPage 类型定义文件
 * 
 * 定义登录主页面相关的所有TypeScript接口和类型
 */

import type { StyleProp, ViewStyle } from 'react-native';

// #region 基础类型定义

/**
 * 认证模式类型
 */
export type AuthMode = 'password' | 'sms';

/**
 * 地区信息接口
 */
export interface RegionInfo {
  code: string;          // 地区代码 如 '+86'
  name: string;          // 地区名称 如 '中国'
  flag: string;          // 国旗emoji
  phoneLength: number;   // 手机号长度
}

/**
 * 登录表单数据接口
 */
export interface LoginFormData {
  phone: string;         // 手机号
  password: string;      // 密码
  smsCode: string;       // 短信验证码
  region: RegionInfo;    // 地区信息
}

/**
 * 表单验证状态接口
 */
export interface ValidationState {
  phoneValid: boolean;      // 手机号验证状态
  passwordValid: boolean;   // 密码验证状态
  codeValid: boolean;       // 验证码验证状态
  agreementAccepted: boolean; // 协议同意状态
}

/**
 * 加载状态接口
 */
export interface LoadingState {
  login: boolean;           // 登录加载状态
  sendCode: boolean;        // 发送验证码加载状态
  verify: boolean;          // 验证加载状态
}

/**
 * 错误状态接口
 */
export interface ErrorState {
  message: string;          // 错误信息
  type: 'network' | 'validation' | 'business' | 'system'; // 错误类型
  visible: boolean;         // 是否显示错误
}

/**
 * 倒计时状态接口
 */
export interface CountdownState {
  value: number;            // 倒计时数值
  active: boolean;          // 是否激活倒计时
  type: 'sms' | 'redirect'; // 倒计时类型
}

// #endregion

// #region 组件Props接口

/**
 * LoginMainPage 组件Props
 */
export interface LoginMainPageProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * TopWelcomeArea 组件Props
 */
export interface TopWelcomeAreaProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * PhoneInputArea 组件Props
 */
export interface PhoneInputAreaProps {
  phone: string;
  region: RegionInfo;
  onPhoneChange: (phone: string) => void;
  onRegionPress: () => void;
  phoneValid: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * AuthInputArea 组件Props
 */
export interface AuthInputAreaProps {
  mode: AuthMode;
  password: string;
  smsCode: string;
  onModeChange: (mode: AuthMode) => void;
  onPasswordChange: (password: string) => void;
  onCodeChange: (code: string) => void;
  passwordValid: boolean;
  codeValid: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * ActionButtonArea 组件Props
 */
export interface ActionButtonAreaProps {
  mode: AuthMode;
  onLogin: () => Promise<void>;
  onSendCode: () => Promise<void>;
  loading: {
    login: boolean;
    sendCode: boolean;
  };
  disabled: boolean;
  countdown: CountdownState;
  style?: StyleProp<ViewStyle>;
}

/**
 * AuxiliaryArea 组件Props
 */
export interface AuxiliaryAreaProps {
  onForgotPassword: () => void;
  onRegister?: () => void;
  onThirdPartyLogin?: (provider: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * AgreementArea 组件Props
 */
export interface AgreementAreaProps {
  agreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

// #endregion

// #region API相关类型

/**
 * 登录请求参数
 */
export interface LoginRequest {
  phone: string;
  password?: string;
  smsCode?: string;
  region: string;
  deviceId?: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    userInfo: UserInfo;
    expiresIn: number;
  };
  message: string;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  phone: string;
  nickname?: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

/**
 * 发送验证码请求参数
 */
export interface SendCodeRequest {
  phone: string;
  region: string;
  type: 'login' | 'register' | 'reset';
}

/**
 * 发送验证码响应数据
 */
export interface SendCodeResponse {
  success: boolean;
  data: {
    codeId: string;
    expiresIn: number;
    nextSendTime: number;
  };
  message: string;
}

// #endregion

// #region Hook返回类型

/**
 * useLoginPageState Hook返回类型
 */
export interface UseLoginPageStateReturn {
  // Auth states
  isAuthenticated: boolean;
  loginMode: AuthMode;
  
  // Form data
  loginForm: LoginFormData;
  validationState: ValidationState;
  
  // UI states
  loading: LoadingState;
  error: ErrorState;
  countdown: CountdownState;
}

/**
 * useLoginPageLogic Hook返回类型
 */
export interface UseLoginPageLogicReturn {
  // Event handlers
  handlePhoneChange: (phone: string) => void;
  handlePasswordChange: (password: string) => void;
  handleCodeChange: (code: string) => void;
  handleModeSwitch: (mode: AuthMode) => void;
  handleLogin: () => Promise<void>;
  handleSendCode: () => Promise<void>;
  handleRegionPress: () => void;
  handleForgotPassword: () => void;
  handleAgreementChange: (accepted: boolean) => void;
  
  // Navigation handlers
  navigateToHome: () => void;
  navigateToResetFlow: () => void;
}

// #endregion

// #region 常量类型

/**
 * 验证规则类型
 */
export interface ValidationRules {
  readonly PHONE_MIN_LENGTH: number;
  readonly PASSWORD_MIN_LENGTH: number;
  readonly CODE_LENGTH: number;
}

/**
 * 错误消息类型
 */
export interface ErrorMessages {
  readonly PHONE_INVALID: string;
  readonly PASSWORD_TOO_SHORT: string;
  readonly CODE_INVALID: string;
  readonly AGREEMENT_REQUIRED: string;
  readonly NETWORK_ERROR: string;
}

/**
 * 登录配置类型
 */
export interface LoginConfig {
  readonly AUTO_LOGIN: boolean;
  readonly REMEMBER_PHONE: boolean;
  readonly SMS_CODE_LENGTH: number;
  readonly SMS_COUNTDOWN_SECONDS: number;
  readonly MAX_LOGIN_ATTEMPTS: number;
}

// #endregion

// #region 事件类型

/**
 * 表单验证事件类型
 */
export type ValidationEvent = {
  field: keyof LoginFormData;
  value: string;
  valid: boolean;
  error?: string;
};

/**
 * 认证事件类型
 */
export type AuthEvent = {
  type: 'login_start' | 'login_success' | 'login_error' | 'logout';
  timestamp: Date;
  data?: any;
};

/**
 * 导航事件类型
 */
export type NavigationEvent = {
  from: string;
  to: string;
  params?: Record<string, any>;
};

// #endregion
