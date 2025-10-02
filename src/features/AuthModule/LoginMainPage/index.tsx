// #region 1. File Banner & TOC
/**
 * LoginMainPage - 登录模块主页面组件
 * 
 * 功能描述：
 * - 集成6个区域组件构建完整登录页面
 * - 管理登录流程状态和业务逻辑
 * - 处理用户交互和导航跳转
 * - 统一错误处理和加载状态
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';

// Store imports
import { useAuthDataStore } from '../stores/authDataStore';
import { useAuthFlowStore } from '../stores/authFlowStore';
import { useAuthStore } from '../stores/authStore';
import { useAuthUIStore } from '../stores/authUIStore';

// Area components
import ActionButtonArea from './components/ActionButtonArea';
import AgreementArea from './components/AgreementArea';
import AuthInputArea from './components/AuthInputArea';
import AuxiliaryArea from './components/AuxiliaryArea';
import PhoneInputArea from './components/PhoneInputArea';
import TopWelcomeArea from './components/TopWelcomeArea';

// Shared components
import { AuthKeyboardAvoid } from '../SharedComponents/Layout/AuthKeyboardAvoid';
import { AuthSafeArea } from '../SharedComponents/Layout/AuthSafeArea';

// Utils and constants
import type { AuthMode, LoginFormData, LoginMainPageProps } from './types';
// #endregion

// #region 3. Types & Schema
interface UseLoginPageStateReturn {
  // Auth states
  isAuthenticated: boolean;
  loginMode: AuthMode;
  
  // Form data
  loginForm: LoginFormData;
  validationState: {
    phoneValid: boolean;
    passwordValid: boolean;
    codeValid: boolean;
    agreementAccepted: boolean;
  };
  
  // UI states
  loading: {
    login: boolean;
    sendCode: boolean;
  };
  error: {
    message: string;
    visible: boolean;
  };
  countdown: {
    value: number;
    active: boolean;
  };
}

interface UseLoginPageLogicReturn {
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

// #region 4. Constants & Config
const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';
const KEYBOARD_OFFSET = Platform.OS === 'ios' ? 64 : 0;

// Form validation rules
const VALIDATION_RULES = {
  PHONE_MIN_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 6,
  CODE_LENGTH: 6,
} as const;

// Error messages
const ERROR_MESSAGES = {
  PHONE_INVALID: '请输入正确的手机号',
  PASSWORD_TOO_SHORT: '密码至少6位',
  CODE_INVALID: '验证码格式错误',
  AGREEMENT_REQUIRED: '请同意用户协议',
  NETWORK_ERROR: '网络连接失败，请重试',
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 验证手机号格式
 */
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 */
const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

/**
 * 验证验证码格式
 */
const validateCode = (code: string): boolean => {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
};

/**
 * 格式化错误消息
 */
const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return ERROR_MESSAGES.NETWORK_ERROR;
};

/**
 * 检查表单完整性
 */
const checkFormComplete = (
  loginForm: LoginFormData,
  loginMode: AuthMode,
  agreementAccepted: boolean
): boolean => {
  const phoneValid = validatePhone(loginForm.phone);
  const agreementValid = agreementAccepted;
  
  if (loginMode === 'password') {
    const passwordValid = validatePassword(loginForm.password);
    return phoneValid && passwordValid && agreementValid;
  } else {
    const codeValid = validateCode(loginForm.smsCode);
    return phoneValid && codeValid && agreementValid;
  }
};
// #endregion

// #region 6. State Management
/**
 * 登录页面状态管理Hook
 */
const useLoginPageState = (): UseLoginPageStateReturn => {
  // Auth store states
  const { isAuthenticated, loginMode } = useAuthStore();
  
  // Data store states  
  const { loginForm, validationState } = useAuthDataStore();
  
  // UI store states
  const { loading, error, countdown } = useAuthUIStore();
  
  return {
    isAuthenticated,
    loginMode,
    loginForm,
    validationState,
    loading: {
      login: loading.login,
      sendCode: loading.sendCode,
    },
    error: {
      message: error.message,
      visible: error.visible,
    },
    countdown: {
      value: countdown.value,
      active: countdown.active,
    },
  };
};

/**
 * 登录页面逻辑处理Hook
 */
const useLoginPageLogic = (): UseLoginPageLogicReturn => {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();  // 🎯 获取返回路径参数
  
  // Store actions
  const { login, switchMode } = useAuthStore();
  const { updateLoginForm, validateForm } = useAuthDataStore();
  const { setStep } = useAuthFlowStore();
  const { setLoading, setError, startCountdown } = useAuthUIStore();
  
  // Event handlers
  const handlePhoneChange = useCallback((phone: string) => {
    updateLoginForm({ phone });
    validateForm();
  }, [updateLoginForm, validateForm]);
  
  const handlePasswordChange = useCallback((password: string) => {
    updateLoginForm({ password });
    validateForm();
  }, [updateLoginForm, validateForm]);
  
  const handleCodeChange = useCallback((code: string) => {
    updateLoginForm({ smsCode: code });
    validateForm();
  }, [updateLoginForm, validateForm]);
  
  const handleModeSwitch = useCallback((mode: AuthMode) => {
    switchMode(mode);
  }, [switchMode]);
  
  const handleLogin = useCallback(async () => {
    try {
      setLoading({ login: true });
      setError({ message: '', visible: false });
      
      // 这里调用登录API
      await login();
      
      // 登录成功后跳转
      navigateToHome();
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError({ message: errorMessage, visible: true });
      Alert.alert('登录失败', errorMessage);
    } finally {
      setLoading({ login: false });
    }
  }, [login, setLoading, setError]);
  
  const handleSendCode = useCallback(async () => {
    try {
      setLoading({ sendCode: true });
      setError({ message: '', visible: false });
      
      // 这里调用发送验证码API
      // await sendSMS();
      
      // 开始倒计时
      startCountdown(60, 'sms');
      
      Alert.alert('验证码已发送', '请查收短信验证码');
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError({ message: errorMessage, visible: true });
      Alert.alert('发送失败', errorMessage);
    } finally {
      setLoading({ sendCode: false });
    }
  }, [setLoading, setError, startCountdown]);
  
  const handleRegionPress = useCallback(() => {
    router.push('/modal/region-select' as any);
  }, [router]);
  
  const handleForgotPassword = useCallback(() => {
    navigateToResetFlow();
  }, []);
  
  const handleAgreementChange = useCallback((accepted: boolean) => {
    // 更新协议同意状态
    validateForm();
  }, [validateForm]);
  
  // Navigation handlers
  const navigateToHome = useCallback(() => {
    // 🎯 支持返回到原本想访问的页面
    if (params.returnTo) {
      console.log('✅ 登录成功，返回到:', params.returnTo);
      router.replace(params.returnTo as any);
    } else {
      console.log('✅ 登录成功，跳转到首页');
      router.replace('/(tabs)/homepage');
    }
  }, [router, params.returnTo]);
  
  const navigateToResetFlow = useCallback(() => {
    setStep('reset_entry');
    router.push('/auth/reset-entry' as any);
  }, [router, setStep]);
  
  return {
    handlePhoneChange,
    handlePasswordChange,
    handleCodeChange,
    handleModeSwitch,
    handleLogin,
    handleSendCode,
    handleRegionPress,
    handleForgotPassword,
    handleAgreementChange,
    navigateToHome,
    navigateToResetFlow,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 页面初始化逻辑
 */
const usePageInitialization = () => {
  const { setStep } = useAuthFlowStore();
  const { setError } = useAuthUIStore();
  
  // 页面焦点处理
  useFocusEffect(
    useCallback(() => {
      // 设置当前步骤
      setStep('login');
      
      // 清除错误状态
      setError({ message: '', visible: false });
      
      // 页面焦点时的其他处理...
      
      return () => {
        // 页面失焦时的清理工作...
      };
    }, [setStep, setError])
  );
  
  // 页面初始化
  useEffect(() => {
    // 初始化逻辑...
  }, []);
};

/**
 * 自动登录检查
 */
const useAutoLoginCheck = () => {
  const { isAuthenticated } = useAuthStore();
  const { navigateToHome } = useLoginPageLogic();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigateToHome();
    }
  }, [isAuthenticated, navigateToHome]);
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * LoginMainPage 主组件
 */
const LoginMainPage: React.FC<LoginMainPageProps> = ({ style }) => {
  // 使用自定义Hooks
  const state = useLoginPageState();
  const logic = useLoginPageLogic();
  
  // 页面生命周期处理
  usePageInitialization();
  useAutoLoginCheck();
  
  // 计算属性
  const formComplete = useMemo(() => {
    return checkFormComplete(
      state.loginForm,
      state.loginMode,
      state.validationState.agreementAccepted
    );
  }, [state.loginForm, state.loginMode, state.validationState.agreementAccepted]);
  
  const keyboardBehavior = useMemo(() => KEYBOARD_BEHAVIOR, []);
  const keyboardVerticalOffset = useMemo(() => KEYBOARD_OFFSET, []);
  
  return (
    <AuthSafeArea style={[styles.container, style]}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      
      <AuthKeyboardAvoid
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部欢迎区域 */}
          <TopWelcomeArea style={styles.topWelcomeArea} />
          
          {/* 手机号输入区域 */}
          <PhoneInputArea
            phone={state.loginForm.phone}
            region={state.loginForm.region}
            onPhoneChange={logic.handlePhoneChange}
            onRegionPress={logic.handleRegionPress}
            phoneValid={state.validationState.phoneValid}
            style={styles.phoneInputArea}
          />
          
          {/* 认证输入区域 */}
          <AuthInputArea
            mode={state.loginMode}
            password={state.loginForm.password}
            smsCode={state.loginForm.smsCode}
            onModeChange={logic.handleModeSwitch}
            onPasswordChange={logic.handlePasswordChange}
            onCodeChange={logic.handleCodeChange}
            passwordValid={state.validationState.passwordValid}
            codeValid={state.validationState.codeValid}
            style={styles.authInputArea}
          />
          
          {/* 主要操作按钮区域 */}
          <ActionButtonArea
            mode={state.loginMode}
            onLogin={logic.handleLogin}
            onSendCode={logic.handleSendCode}
            loading={state.loading}
            disabled={!formComplete}
            countdown={state.countdown}
            style={styles.actionButtonArea}
          />
          
          {/* 辅助功能区域 */}
          <AuxiliaryArea
            onForgotPassword={logic.handleForgotPassword}
            style={styles.auxiliaryArea}
          />
          
          {/* 协议同意区域 */}
          <AgreementArea
            agreed={state.validationState.agreementAccepted}
            onAgreementChange={logic.handleAgreementChange}
            style={styles.agreementArea}
          />
        </ScrollView>
      </AuthKeyboardAvoid>
    </AuthSafeArea>
  );
};
// #endregion

// #region 9. Exports
export default React.memo(LoginMainPage);

export type {
  LoginMainPageProps, UseLoginPageLogicReturn, UseLoginPageStateReturn
};
// #endregion

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topWelcomeArea: {
    marginTop: 40,
    marginBottom: 32,
  },
  phoneInputArea: {
    marginBottom: 24,
  },
  authInputArea: {
    marginBottom: 24,
  },
  actionButtonArea: {
    marginBottom: 32,
  },
  auxiliaryArea: {
    marginBottom: 24,
  },
  agreementArea: {
    marginBottom: 16,
  },
});
