// #region 1. File Banner & TOC
/**
 * PasswordInputArea - 密码输入区域组件
 * 
 * 功能描述：
 * - 密码输入框（支持显示/隐藏）
 * - 眼睛图标切换
 * - 实时验证
 * - Flutter样式完全复刻
 * 
 * 迁移自: Flutter password_input_widget.dart (83行)
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
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface PasswordInputAreaProps {
  password: string;
  onPasswordChange: (password: string) => void;
  passwordValid?: boolean;
  hintText?: string;
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  PRIMARY: '#9C27B0',        // 紫色（Flutter Color(0xFF9C27B0)）
  BORDER_DEFAULT: '#E0E0E0', // 灰色（Flutter Colors.grey[300]）
  BORDER_FOCUSED: '#9C27B0', // 聚焦紫色
  TEXT_PRIMARY: '#000000',   // 黑色文本
  TEXT_HINT: '#9E9E9E',      // 提示文本（Flutter Color(0xFF9E9E9E)）
  ICON_DEFAULT: '#9E9E9E',   // 图标灰色
};

const CONFIG = {
  DEFAULT_HINT: '请输入6-20位密码',
  DEFAULT_MAX_LENGTH: 20,
  MIN_LENGTH: 6,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 无需工具函数
// #endregion

// #region 6. State Management
/**
 * 密码输入状态管理Hook
 */
const usePasswordInputState = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  return {
    isPasswordVisible,
    isFocused,
    togglePasswordVisibility,
    handleFocus,
    handleBlur,
  };
};
// #endregion

// #region 7. Domain Logic
// 业务逻辑在父组件处理
// #endregion

// #region 8. UI Components & Rendering
/**
 * PasswordInputArea 主组件
 * 
 * 完全复刻Flutter的PasswordInputWidget样式和功能
 */
const PasswordInputArea: React.FC<PasswordInputAreaProps> = ({
  password,
  onPasswordChange,
  passwordValid,
  hintText = CONFIG.DEFAULT_HINT,
  maxLength = CONFIG.DEFAULT_MAX_LENGTH,
  style,
}) => {
  const {
    isPasswordVisible,
    isFocused,
    togglePasswordVisibility,
    handleFocus,
    handleBlur,
  } = usePasswordInputState();
  
  // 动态边框颜色（复刻Flutter的UnderlineInputBorder）
  const borderColor = isFocused ? COLORS.BORDER_FOCUSED : COLORS.BORDER_DEFAULT;
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputWrapper, { borderBottomColor: borderColor }]}>
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder={hintText}
          placeholderTextColor={COLORS.TEXT_HINT}
          secureTextEntry={!isPasswordVisible}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {/* 眼睛图标按钮（复刻Flutter的suffixIcon） */}
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconButton}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={COLORS.ICON_DEFAULT}
          />
        </TouchableOpacity>
      </View>
      
      {/* 验证提示（可选） */}
      {passwordValid === false && password.length > 0 && (
        <Text style={styles.errorText}>
          密码至少{CONFIG.MIN_LENGTH}位，不可以是纯数字
        </Text>
      )}
    </View>
  );
};
// #endregion

// #region 9. Exports
export default React.memo(PasswordInputArea);

export type { PasswordInputAreaProps };
// #endregion

// Styles - 完全复刻Flutter样式
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  // 输入框包装器（复刻Flutter的Container + decoration）
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,           // Flutter: UnderlineInputBorder
    paddingVertical: 6,
    height: 44,
  },
  
  // 输入框本身（复刻Flutter的TextField）
  input: {
    flex: 1,
    fontSize: 16,                   // Flutter: fontSize: 16
    color: COLORS.TEXT_PRIMARY,     // Flutter: Colors.black
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  
  // 眼睛图标按钮（复刻Flutter的IconButton）
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  
  // 错误提示文本
  errorText: {
    fontSize: 12,
    color: '#E53E3E',               // Flutter: errorColor
    marginTop: 4,
  },
});

