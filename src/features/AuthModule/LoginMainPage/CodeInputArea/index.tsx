// #region 1. File Banner & TOC
/**
 * CodeInputArea - 验证码输入区域组件
 * 
 * 功能描述：
 * - 6格分离输入（每格1位数字）
 * - 自动跳格（输入时自动跳到下一格）
 * - 删除回退（删除时回到前一格）
 * - 粘贴支持（隐藏的TextInput接收粘贴）
 * - Flutter样式完全复刻
 * 
 * 迁移自: Flutter code_input_widget.dart (143行)
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
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface CodeInputAreaProps {
  code: string;                    // 完整的6位验证码 '123456'
  onCodeChange: (code: string) => void;  // 验证码变化回调
  codeValid?: boolean;             // 验证状态
  digitCount?: number;             // 验证码位数（默认6）
  showValidation?: boolean;        // 显示验证提示
  style?: StyleProp<ViewStyle>;
}

interface DigitBoxProps {
  value: string;                   // 当前格子的值（单个字符）
  isFocused: boolean;              // 是否聚焦
  onPress: () => void;             // 点击回调
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  PRIMARY: '#9C27B0',        // 紫色（Flutter Color(0xFF9C27B0)）
  BORDER_DEFAULT: '#E0E0E0', // 灰色（Flutter Colors.grey[300]）
  BORDER_FOCUSED: '#9C27B0', // 聚焦紫色
  TEXT_PRIMARY: '#000000',   // 黑色文本
  TEXT_HINT: '#9E9E9E',      // 提示文本
  BACKGROUND: '#F9FAFB',     // 背景色
};

const CONFIG = {
  DEFAULT_DIGIT_COUNT: 6,
  DIGIT_BOX_SIZE: 48,        // 每个格子的宽高
  DIGIT_BOX_SPACING: 12,     // 格子间距
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 解析验证码字符串为数组
 * '123456' → ['1', '2', '3', '4', '5', '6']
 */
const parseCode = (code: string, digitCount: number): string[] => {
  const digits = code.split('').slice(0, digitCount);
  return [...digits, ...Array(digitCount - digits.length).fill('')];
};

/**
 * 验证是否为数字
 */
const isDigit = (char: string): boolean => {
  return /^\d$/.test(char);
};
// #endregion

// #region 6. State Management
/**
 * 验证码输入状态管理Hook
 */
const useCodeInputState = (
  code: string,
  onCodeChange: (code: string) => void,
  digitCount: number
) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  
  // 解析当前验证码
  const digits = parseCode(code, digitCount);
  
  // 聚焦隐藏的输入框
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  // 点击格子时设置焦点
  const handleDigitPress = useCallback((index: number) => {
    setFocusedIndex(index);
    focusInput();
  }, [focusInput]);
  
  // 处理文本变化（用于粘贴）
  const handleTextChange = useCallback((text: string) => {
    // 只保留数字
    const cleanedText = text.replace(/\D/g, '').slice(0, digitCount);
    onCodeChange(cleanedText);
    
    // 更新焦点位置
    if (cleanedText.length < digitCount) {
      setFocusedIndex(cleanedText.length);
    } else {
      setFocusedIndex(digitCount - 1);
    }
  }, [onCodeChange, digitCount]);
  
  // 处理按键事件（用于单个字符输入和删除）
  const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    
    if (key === 'Backspace') {
      // 删除：清除当前位或回退到前一位
      if (code.length > 0) {
        const newCode = code.slice(0, -1);
        onCodeChange(newCode);
        setFocusedIndex(Math.max(0, newCode.length));
      }
    } else if (isDigit(key)) {
      // 输入数字：添加到当前位
      if (code.length < digitCount) {
        const newCode = code + key;
        onCodeChange(newCode);
        setFocusedIndex(Math.min(digitCount - 1, newCode.length));
      }
    }
  }, [code, onCodeChange, digitCount]);
  
  // 自动聚焦第一个空格
  useEffect(() => {
    if (code.length === 0) {
      setFocusedIndex(0);
    }
  }, [code]);
  
  return {
    digits,
    focusedIndex,
    inputRef,
    focusInput,
    handleDigitPress,
    handleTextChange,
    handleKeyPress,
  };
};
// #endregion

// #region 7. Domain Logic
// 业务逻辑在父组件处理
// #endregion

// #region 8. UI Components & Rendering

/**
 * DigitBox - 单个数字格子
 * 复刻Flutter的单个TextField容器
 */
const DigitBox: React.FC<DigitBoxProps> = ({ value, isFocused, onPress }) => {
  const borderColor = isFocused ? COLORS.BORDER_FOCUSED : COLORS.BORDER_DEFAULT;
  const backgroundColor = isFocused ? '#FFFFFF' : COLORS.BACKGROUND;
  
  return (
    <TouchableOpacity
      style={[
        styles.digitBox,
        { borderColor, backgroundColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.digitText}>
        {value}
      </Text>
      
      {/* 光标指示器（仅在聚焦且为空时显示） */}
      {isFocused && !value && (
        <View style={styles.cursor} />
      )}
    </TouchableOpacity>
  );
};

/**
 * CodeInputArea 主组件
 * 
 * 完全复刻Flutter的CodeInputWidget样式和功能
 */
const CodeInputArea: React.FC<CodeInputAreaProps> = ({
  code,
  onCodeChange,
  codeValid,
  digitCount = CONFIG.DEFAULT_DIGIT_COUNT,
  showValidation = true,
  style,
}) => {
  const {
    digits,
    focusedIndex,
    inputRef,
    focusInput,
    handleDigitPress,
    handleTextChange,
    handleKeyPress,
  } = useCodeInputState(code, onCodeChange, digitCount);
  
  return (
    <View style={[styles.container, style]}>
      {/* 数字格子容器 */}
      <View style={styles.digitsContainer}>
        {digits.map((digit, index) => (
          <DigitBox
            key={index}
            value={digit}
            isFocused={focusedIndex === index}
            onPress={() => handleDigitPress(index)}
          />
        ))}
      </View>
      
      {/* 隐藏的TextInput（用于接收键盘输入和粘贴） */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleTextChange}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={digitCount}
        style={styles.hiddenInput}
        autoFocus={true}
      />
      
      {/* 验证提示（可选） */}
      {showValidation && codeValid === false && code.length > 0 && (
        <Text style={styles.errorText}>
          验证码格式不正确
        </Text>
      )}
      
      {/* 点击提示 */}
      {code.length === 0 && (
        <TouchableOpacity
          style={styles.hintContainer}
          onPress={focusInput}
          activeOpacity={0.6}
        >
          <Text style={styles.hintText}>
            点击输入{digitCount}位验证码
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
// #endregion

// #region 9. Exports
export default React.memo(CodeInputArea);

export type { CodeInputAreaProps, DigitBoxProps };

    export { isDigit, parseCode };
// #endregion

// Styles - 完全复刻Flutter样式
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  
  // 数字格子容器（复刻Flutter的Row）
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: CONFIG.DIGIT_BOX_SPACING,
  },
  
  // 单个数字格子（复刻Flutter的Container + TextField）
  digitBox: {
    width: CONFIG.DIGIT_BOX_SIZE,
    height: CONFIG.DIGIT_BOX_SIZE,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  // 数字文本（复刻Flutter的Text）
  digitText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  
  // 光标指示器
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: COLORS.PRIMARY,
    // 闪烁动画（简化版）
  },
  
  // 隐藏的输入框（用于接收键盘输入）
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  
  // 错误提示文本
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // 点击提示
  hintContainer: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.TEXT_HINT,
    textAlign: 'center',
  },
});

