// #region 1. File Banner & TOC
/**
 * ActionButtonArea - 操作按钮区域组件
 * 
 * 功能描述：
 * - 登录按钮（主要操作，紫色背景）
 * - 发送验证码按钮（60秒倒计时）
 * - 动态按钮文案（根据登录模式切换）
 * - 加载状态显示
 * - Flutter样式完全复刻
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface ActionButtonAreaProps {
  // 登录按钮
  loginMode: 'password' | 'code';          // 登录模式
  onLogin: () => void;                     // 登录回调
  loginDisabled?: boolean;                 // 登录按钮禁用
  loginLoading?: boolean;                  // 登录加载中
  
  // 发送验证码按钮
  onSendCode?: () => void;                 // 发送验证码回调
  sendCodeDisabled?: boolean;              // 发送按钮禁用
  sendCodeLoading?: boolean;               // 发送加载中
  countdown?: number;                      // 倒计时（秒）
  
  style?: StyleProp<ViewStyle>;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  PRIMARY: '#9C27B0',        // 紫色（Flutter Color(0xFF9C27B0)）
  PRIMARY_DISABLED: '#E1BEE7', // 禁用紫色
  TEXT_PRIMARY: '#FFFFFF',   // 白色文本
  TEXT_SECONDARY: '#9C27B0', // 紫色文本（次要按钮）
  BORDER: '#9C27B0',         // 边框颜色
};

const CONFIG = {
  COUNTDOWN_DURATION: 60,    // 倒计时时长（秒）
  BUTTON_HEIGHT: 46,         // 按钮高度
  BUTTON_BORDER_RADIUS: 23,  // 圆角半径（Flutter: borderRadius: 24）
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化倒计时文本
 */
const formatCountdown = (seconds: number): string => {
  return `${seconds}s后重发`;
};
// #endregion

// #region 6. State Management
/**
 * 倒计时管理Hook
 */
const useCountdown = (initialCountdown: number = 0) => {
  const [countdown, setCountdown] = useState(initialCountdown);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // 启动倒计时
  const startCountdown = useCallback(() => {
    setCountdown(CONFIG.COUNTDOWN_DURATION);
  }, []);
  
  // 清理定时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return clearTimer;
  }, [countdown, clearTimer]);
  
  return {
    countdown,
    startCountdown,
    isCountingDown: countdown > 0,
  };
};
// #endregion

// #region 7. Domain Logic
// 业务逻辑在父组件处理
// #endregion

// #region 8. UI Components & Rendering

/**
 * PrimaryButton - 主要按钮（登录按钮）
 * 复刻Flutter的ElevatedButton
 */
const PrimaryButton: React.FC<{
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ text, onPress, disabled, loading }) => {
  const buttonStyle = [
    styles.primaryButton,
    disabled && styles.primaryButtonDisabled,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.TEXT_PRIMARY} size="small" />
      ) : (
        <Text style={styles.primaryButtonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * SecondaryButton - 次要按钮（发送验证码按钮）
 * 复刻Flutter的OutlinedButton
 */
const SecondaryButton: React.FC<{
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ text, onPress, disabled, loading }) => {
  const buttonStyle = [
    styles.secondaryButton,
    disabled && styles.secondaryButtonDisabled,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.TEXT_SECONDARY} size="small" />
      ) : (
        <Text style={styles.secondaryButtonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * ActionButtonArea 主组件
 * 
 * 完全复刻Flutter的按钮样式和功能
 */
const ActionButtonArea: React.FC<ActionButtonAreaProps> = ({
  loginMode,
  onLogin,
  loginDisabled = false,
  loginLoading = false,
  onSendCode,
  sendCodeDisabled = false,
  sendCodeLoading = false,
  countdown: externalCountdown,
  style,
}) => {
  const { countdown, startCountdown, isCountingDown } = useCountdown(externalCountdown);
  
  // 处理发送验证码
  const handleSendCode = useCallback(() => {
    if (onSendCode && !isCountingDown) {
      onSendCode();
      startCountdown();
    }
  }, [onSendCode, isCountingDown, startCountdown]);
  
  // 动态登录按钮文案
  const loginButtonText = loginMode === 'password' ? '登录' : '验证码登录';
  
  // 发送验证码按钮文案
  const sendCodeButtonText = isCountingDown 
    ? formatCountdown(countdown) 
    : '发送验证码';
  
  return (
    <View style={[styles.container, style]}>
      {/* 主要按钮（登录） */}
      <PrimaryButton
        text={loginButtonText}
        onPress={onLogin}
        disabled={loginDisabled}
        loading={loginLoading}
      />
      
      {/* 次要按钮（发送验证码） - 仅在验证码模式下显示 */}
      {loginMode === 'code' && onSendCode && (
        <SecondaryButton
          text={sendCodeButtonText}
          onPress={handleSendCode}
          disabled={sendCodeDisabled || isCountingDown}
          loading={sendCodeLoading}
        />
      )}
    </View>
  );
};
// #endregion

// #region 9. Exports
export default React.memo(ActionButtonArea);

export type { ActionButtonAreaProps };

  export { formatCountdown, useCountdown };
// #endregion

// Styles - 完全复刻Flutter样式
const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  
  // 主要按钮（复刻Flutter的ElevatedButton）
  primaryButton: {
    height: CONFIG.BUTTON_HEIGHT,
    backgroundColor: COLORS.PRIMARY,        // Flutter: Colors.purple
    borderRadius: CONFIG.BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    // Flutter: elevation: 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  primaryButtonDisabled: {
    backgroundColor: COLORS.PRIMARY_DISABLED,
    opacity: 0.6,
  },
  
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',                     // Flutter: FontWeight.w600
    color: COLORS.TEXT_PRIMARY,            // Flutter: Colors.white
  },
  
  // 次要按钮（复刻Flutter的OutlinedButton）
  secondaryButton: {
    height: CONFIG.BUTTON_HEIGHT,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.BORDER,            // Flutter: BorderSide(color: Colors.purple)
    borderRadius: CONFIG.BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,          // Flutter: Colors.purple
  },
});
