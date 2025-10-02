// #region 1. File Banner & TOC
/**
 * Button - 通用按钮组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
// #endregion

// #region 3. Types & Schema
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  // 内容属性
  title?: string;
  children?: React.ReactNode;
  
  // 样式属性
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  
  // 状态属性
  disabled?: boolean;
  loading?: boolean;
  
  // 行为属性
  onPress?: () => void;
  onLongPress?: () => void;
  
  // 动画属性
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  
  // 图标属性
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // 可访问性
  accessibilityLabel?: string;
  testID?: string;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#6366F1',
  primaryPressed: '#4F46E5',
  secondary: '#F8FAFC',
  secondaryPressed: '#F1F5F9',
  outline: 'transparent',
  outlinePressed: '#F8FAFC',
  ghost: 'transparent',
  ghostPressed: '#F8FAFC',
  danger: '#EF4444',
  dangerPressed: '#DC2626',
  
  text: {
    primary: '#FFFFFF',
    secondary: '#374151',
    outline: '#374151',
    ghost: '#374151',
    danger: '#FFFFFF',
  },
  
  border: {
    outline: '#D1D5DB',
    ghost: 'transparent',
  },
  
  disabled: '#9CA3AF',
  disabledText: '#6B7280',
} as const;

const SIZES = {
  xs: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12, height: 28 },
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, height: 36 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16, height: 44 },
  lg: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 18, height: 52 },
  xl: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 20, height: 60 },
} as const;

const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 获取按钮背景色
 */
const getBackgroundColor = (variant: ButtonVariant, pressed: boolean, disabled: boolean): string => {
  if (disabled) return COLORS.disabled;
  
  const colorMap = {
    primary: pressed ? COLORS.primaryPressed : COLORS.primary,
    secondary: pressed ? COLORS.secondaryPressed : COLORS.secondary,
    outline: pressed ? COLORS.outlinePressed : COLORS.outline,
    ghost: pressed ? COLORS.ghostPressed : COLORS.ghost,
    danger: pressed ? COLORS.dangerPressed : COLORS.danger,
  };
  
  return colorMap[variant];
};

/**
 * 获取文本颜色
 */
const getTextColor = (variant: ButtonVariant, disabled: boolean): string => {
  if (disabled) return COLORS.disabledText;
  return COLORS.text[variant];
};

/**
 * 获取边框样式
 */
const getBorderStyle = (variant: ButtonVariant, disabled: boolean) => {
  if (variant === 'outline') {
    return {
      borderWidth: 1,
      borderColor: disabled ? COLORS.disabled : COLORS.border.outline,
    };
  }
  
  return {};
};

/**
 * 生成触觉反馈
 */
const generateHapticFeedback = () => {
  // TODO: 实现触觉反馈
  // import { Haptics } from 'expo-haptics';
  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  console.log('触觉反馈');
};
// #endregion

// #region 6. State Management
/**
 * 按钮状态管理Hook
 */
const useButtonState = (props: ButtonProps) => {
  const [pressed, setPressed] = React.useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = React.useCallback(() => {
    setPressed(true);
    
    if (props.pressAnimation && !props.disabled) {
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    
    if (props.hapticFeedback && !props.disabled) {
      generateHapticFeedback();
    }
  }, [props.pressAnimation, props.hapticFeedback, props.disabled, animatedValue]);
  
  const handlePressOut = React.useCallback(() => {
    setPressed(false);
    
    if (props.pressAnimation && !props.disabled) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  }, [props.pressAnimation, props.disabled, animatedValue]);
  
  const handlePress = React.useCallback(() => {
    if (!props.disabled && !props.loading && props.onPress) {
      props.onPress();
    }
  }, [props.disabled, props.loading, props.onPress]);
  
  const handleLongPress = React.useCallback(() => {
    if (!props.disabled && !props.loading && props.onLongPress) {
      props.onLongPress();
    }
  }, [props.disabled, props.loading, props.onLongPress]);
  
  return {
    pressed,
    animatedValue,
    handlePressIn,
    handlePressOut,
    handlePress,
    handleLongPress,
  };
};
// #endregion

// #region 7. Domain Logic & UI Components
/**
 * 按钮内容组件
 */
const ButtonContent: React.FC<{
  title?: string;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  size: ButtonSize;
  variant: ButtonVariant;
  disabled?: boolean;
}> = ({ title, children, leftIcon, rightIcon, loading, textStyle, size, variant, disabled }) => {
  const computedTextStyle = [
    styles.text,
    {
      fontSize: SIZES[size].fontSize,
      color: getTextColor(variant, disabled || false),
    },
    textStyle,
  ];
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={getTextColor(variant, disabled || false)}
          style={styles.loadingIndicator}
        />
        {title && (
          <Text style={[computedTextStyle, styles.loadingText]}>
            {title}
          </Text>
        )}
      </View>
    );
  }
  
  return (
    <View style={styles.contentContainer}>
      {leftIcon && (
        <View style={[styles.iconContainer, styles.leftIcon]}>
          {leftIcon}
        </View>
      )}
      
      {children || (title && (
        <Text style={computedTextStyle} numberOfLines={1}>
          {title}
        </Text>
      ))}
      
      {rightIcon && (
        <View style={[styles.iconContainer, styles.rightIcon]}>
          {rightIcon}
        </View>
      )}
    </View>
  );
};

/**
 * Button 主组件
 */
const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    style,
    disabled = false,
    loading = false,
    accessibilityLabel,
    testID,
    title,
    children,
    leftIcon,
    rightIcon,
    textStyle,
  } = props;
  
  const {
    pressed,
    animatedValue,
    handlePressIn,
    handlePressOut,
    handlePress,
    handleLongPress,
  } = useButtonState(props);
  
  const isDisabled = disabled || loading;
  
  const buttonStyle = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(variant, pressed, isDisabled),
      paddingVertical: SIZES[size].paddingVertical,
      paddingHorizontal: SIZES[size].paddingHorizontal,
      height: SIZES[size].height,
      borderRadius: BORDER_RADIUS[size],
      opacity: isDisabled ? 0.6 : 1,
    },
    getBorderStyle(variant, isDisabled),
    style,
  ];
  
  const animatedStyle = props.pressAnimation ? {
    transform: [{ scale: animatedValue }],
  } : {};
  
  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      <Animated.View style={[buttonStyle, animatedStyle]}>
        <ButtonContent
          title={title}
          children={children}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          loading={loading}
          textStyle={textStyle}
          size={size}
          variant={variant}
          disabled={isDisabled}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
// #endregion

// #region 8. Exports & Styles
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: undefined, // 让系统自动计算
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingText: {
    // 加载时的文本样式
  },
});

export default Button;

// 便捷的按钮变体组件
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="danger" />
);

// 导出类型
export type { ButtonProps, ButtonSize, ButtonVariant };
// #endregion
