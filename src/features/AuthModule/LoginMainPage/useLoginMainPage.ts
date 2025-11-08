/**
 * LoginMainPage 状态管理 Hooks
 * 
 * 从 index.tsx 提取的状态管理逻辑
 * 保持原有实现不变，仅做模块化拆分
 */

import { useCallback, useState } from 'react';

// #region Types
type LoginMode = 'password' | 'code';

interface LoginFormData {
  phoneNumber: string;
  countryCode: string;
  password: string;
  verificationCode: string;
}

const CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20,
  PHONE_LENGTH: 11,
  CODE_LENGTH: 6,
  COUNTDOWN_SECONDS: 60,
} as const;
// #endregion

// #region Hooks

/**
 * 表单验证Hook
 */
export const useFormValidation = (formData: LoginFormData, loginMode: LoginMode) => {
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
export const useCountdown = () => {
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


