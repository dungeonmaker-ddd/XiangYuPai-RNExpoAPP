// #region 1. File Banner & TOC
/**
 * LoginMainPage - 登录模块主页面（重构版）
 * 
 * 功能描述：
 * - 整合所有子组件构建完整登录页面
 * - 支持密码登录和验证码登录模式切换
 * - 集成真实后端API
 * - 完整的表单验证和错误处理
 * - 地区选择功能
 * - Flutter样式完全复刻
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';

// 🆕 新组件导入
import {
  ActionButtonArea,
  AgreementArea,
  AuthInputArea,
  AuxiliaryArea,
  RegionSelectModal,
  TopWelcomeArea,
  type Country,
} from './components';

// Shared components
import { AuthSafeArea } from '../SharedComponents/Layout/AuthSafeArea';

// Store imports
import { useAuthStore } from '../stores/authStore';

// 🆕 真实后端API
import { authApi as backendAuthApi } from '../../../../services/api/authApi';
// #endregion

// #region 3. Types & Schema
type LoginMode = 'password' | 'code';

interface LoginFormData {
  phoneNumber: string;
  countryCode: string;
  password: string;
  verificationCode: string;
}

interface LoginMainPageProps {
  // 可选的初始模式
  initialMode?: LoginMode;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  BACKGROUND: '#FFFFFF',
} as const;

const CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20,
  PHONE_LENGTH: 11,
  CODE_LENGTH: 6,
  COUNTDOWN_SECONDS: 60,
} as const;
// #endregion

// #region 5. State Management
/**
 * 表单验证Hook
 */
const useFormValidation = (formData: LoginFormData, loginMode: LoginMode) => {
  // 手机号验证（11位）
  const phoneValid = formData.phoneNumber.length === CONFIG.PHONE_LENGTH;
  
  // 密码验证（6-20位，非纯数字）
  const passwordValid = 
    formData.password.length >= CONFIG.PASSWORD_MIN_LENGTH &&
    formData.password.length <= CONFIG.PASSWORD_MAX_LENGTH &&
    !/^\d+$/.test(formData.password);
  
  // 验证码验证（6位数字）
  const codeValid = formData.verificationCode.length === CONFIG.CODE_LENGTH;
  
  // 登录按钮是否可用
  const loginDisabled = loginMode === 'password' 
    ? !phoneValid || !passwordValid
    : !phoneValid || !codeValid;
  
  // 发送验证码按钮是否可用
  const sendCodeDisabled = !phoneValid;
  
  return {
    phoneValid,
    passwordValid,
    codeValid,
    loginDisabled,
    sendCodeDisabled,
  };
};

/**
 * 倒计时Hook
 */
const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  
  const startCountdown = useCallback((seconds: number = CONFIG.COUNTDOWN_SECONDS) => {
    setCountdown(seconds);
    
    const newTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
  }, []);
  
  const stopCountdown = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setCountdown(0);
  }, [timer]);
  
  return {
    countdown,
    isCountingDown: countdown > 0,
    startCountdown,
    stopCountdown,
  };
};
// #endregion

// #region 6. Domain Logic
/**
 * LoginMainPage 主组件
 */
const LoginMainPage: React.FC<LoginMainPageProps> = ({
  initialMode = 'password',
}) => {
  const router = useRouter();
  const { login } = useAuthStore();
  
  // 表单状态
  const [loginMode, setLoginMode] = useState<LoginMode>(initialMode);
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: '',
    countryCode: '+86',
    password: '',
    verificationCode: '',
  });
  
  // UI状态
  const [loading, setLoading] = useState({
    login: false,
    sendCode: false,
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  
  // 倒计时
  const { countdown, isCountingDown, startCountdown } = useCountdown();
  
  // 表单验证
  const validation = useFormValidation(formData, loginMode);
  
  // ============ 事件处理 ============
  
  /**
   * 切换登录模式
   */
  const handleSwitchMode = useCallback(() => {
    setLoginMode(prev => prev === 'password' ? 'code' : 'password');
  }, []);
  
  /**
   * 打开地区选择器
   */
  const handleOpenRegionSelector = useCallback(() => {
    setRegionModalVisible(true);
  }, []);
  
  /**
   * 选择地区
   */
  const handleSelectRegion = useCallback((country: Country) => {
    setFormData(prev => ({
      ...prev,
      countryCode: country.code,
    }));
  }, []);
  
  /**
   * 发送验证码
   */
  const handleSendCode = useCallback(async () => {
    if (validation.sendCodeDisabled || isCountingDown) return;
    
    try {
      setLoading(prev => ({ ...prev, sendCode: true }));
      
      // 调用真实API
      await backendAuthApi.sendSmsCode({
        mobile: formData.phoneNumber,
        type: 'login',
        clientType: 'app',
      });
      
      Alert.alert('成功', '验证码已发送，请查收短信');
      startCountdown();
    } catch (error: any) {
      Alert.alert('发送失败', error.message || '验证码发送失败，请稍后重试');
    } finally {
      setLoading(prev => ({ ...prev, sendCode: false }));
    }
  }, [
    validation.sendCodeDisabled,
    isCountingDown,
    formData.phoneNumber,
    startCountdown,
  ]);
  
  /**
   * 登录
   */
  const handleLogin = useCallback(async () => {
    if (validation.loginDisabled) {
      Alert.alert('提示', '请完整填写登录信息');
      return;
    }
    
    // 按照UI设计图，登陆即表明同意协议，无需勾选
    try {
      setLoading(prev => ({ ...prev, login: true }));
      
      // 构建登录参数
      const credentials = loginMode === 'password'
        ? {
            type: 'password' as const,
            phone: formData.phoneNumber,
            password: formData.password,
          }
        : {
            type: 'sms' as const,
            phone: formData.phoneNumber,
            code: formData.verificationCode,
          };
      
      // 调用真实登录API
      await login(credentials);
      
      // 登录成功，跳转到首页
      router.replace('/home' as any);
    } catch (error: any) {
      Alert.alert('登录失败', error.message || '登录失败，请检查您的登录信息');
    } finally {
      setLoading(prev => ({ ...prev, login: false }));
    }
  }, [
    validation.loginDisabled,
    agreementAccepted,
    loginMode,
    formData,
    login,
    router,
  ]);
  
  /**
   * 忘记密码
   */
  const handleForgotPassword = useCallback(() => {
    Alert.alert('忘记密码', '请联系客服或使用验证码登录');
  }, []);
  
  /**
   * 快速注册
   */
  const handleQuickRegister = useCallback(() => {
    Alert.alert('快速注册', '注册功能开发中...');
  }, []);
  
  /**
   * 查看协议
   */
  const handleViewAgreement = useCallback((type: 'user' | 'privacy') => {
    const title = type === 'user' ? '用户协议' : '隐私政策';
    Alert.alert(title, `${title}内容...`);
  }, []);
  
  return (
    <AuthSafeArea>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部欢迎区域 */}
          <TopWelcomeArea style={styles.welcomeArea} />
          
          {/* 认证输入区域 */}
          <AuthInputArea
            loginMode={loginMode}
            phoneNumber={formData.phoneNumber}
            onPhoneNumberChange={(phone) => 
              setFormData(prev => ({ ...prev, phoneNumber: phone }))
            }
            countryCode={formData.countryCode}
            onCountryCodePress={handleOpenRegionSelector}
            phoneValid={validation.phoneValid}
            password={formData.password}
            onPasswordChange={(password) => 
              setFormData(prev => ({ ...prev, password }))
            }
            passwordValid={validation.passwordValid}
            code={formData.verificationCode}
            onCodeChange={(code) => 
              setFormData(prev => ({ ...prev, verificationCode: code }))
            }
            codeValid={validation.codeValid}
            style={styles.authInputArea}
          />
          
          {/* 操作按钮区域 */}
          <ActionButtonArea
            loginMode={loginMode}
            onLogin={handleLogin}
            onSendCode={loginMode === 'code' ? handleSendCode : undefined}
            loginDisabled={validation.loginDisabled}
            sendCodeDisabled={validation.sendCodeDisabled || isCountingDown}
            loginLoading={loading.login}
            sendCodeLoading={loading.sendCode}
            countdown={countdown}
            style={styles.actionButtonArea}
          />
          
          {/* 辅助功能区域 */}
          <AuxiliaryArea
            onForgotPassword={handleForgotPassword}
            onRegister={handleQuickRegister}
            onSwitchLoginMode={handleSwitchMode}
            loginMode={loginMode}
            style={styles.auxiliaryArea}
          />
          
          {/* 协议区域 - 按照UI设计图，无需checkbox */}
          <AgreementArea
            agreed={true}
            onAgreementChange={() => {}}
            onViewUserAgreement={() => handleViewAgreement('user')}
            onViewPrivacyPolicy={() => handleViewAgreement('privacy')}
            style={styles.agreementArea}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* 地区选择模态框 */}
      <RegionSelectModal
        visible={regionModalVisible}
        onClose={() => setRegionModalVisible(false)}
        onSelect={handleSelectRegion}
        selectedCode={formData.countryCode}
      />
    </AuthSafeArea>
  );
};
// #endregion

// #region 8. Exports
export default LoginMainPage;

export type { LoginFormData, LoginMainPageProps, LoginMode };
// #endregion

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  welcomeArea: {
    marginTop: 0,
    marginBottom: 20,
  },
  
  authInputArea: {
    marginBottom: 18,
  },
  
  actionButtonArea: {
    marginBottom: 14,
  },
  
  auxiliaryArea: {
    marginBottom: 16,
  },
  
  agreementArea: {
    marginTop: 'auto',
    paddingTop: 8,
  },
});
