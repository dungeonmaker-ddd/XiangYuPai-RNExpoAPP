// #region 1. File Banner & TOC
/**
 * Card - 通用卡片组件
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
import React from 'react';
import {
    Dimensions,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  // 内容属性
  children: React.ReactNode;
  
  // 样式属性
  variant?: CardVariant;
  size?: CardSize;
  style?: StyleProp<ViewStyle>;
  
  // 交互属性
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  
  // 布局属性
  padding?: number;
  margin?: number;
  borderRadius?: number;
  
  // 阴影属性
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
  
  // 可访问性
  accessibilityLabel?: string;
  testID?: string;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  background: {
    default: '#FFFFFF',
    filled: '#F8FAFC',
  },
  border: {
    outlined: '#E5E7EB',
  },
  shadow: '#000000',
} as const;

const SIZES = {
  sm: { padding: 12, borderRadius: 8 },
  md: { padding: 16, borderRadius: 12 },
  lg: { padding: 20, borderRadius: 16 },
} as const;

const SHADOWS = {
  default: {
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  },
  elevated: {
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 获取卡片背景色
 */
const getBackgroundColor = (variant: CardVariant): string => {
  switch (variant) {
    case 'filled':
      return COLORS.background.filled;
    case 'outlined':
    case 'default':
    case 'elevated':
    default:
      return COLORS.background.default;
  }
};

/**
 * 获取边框样式
 */
const getBorderStyle = (variant: CardVariant) => {
  if (variant === 'outlined') {
    return {
      borderWidth: 1,
      borderColor: COLORS.border.outlined,
    };
  }
  return {};
};

/**
 * 获取阴影样式
 */
const getShadowStyle = (variant: CardVariant, customShadow?: Partial<CardProps>) => {
  if (customShadow?.shadowColor || customShadow?.shadowOpacity || customShadow?.shadowRadius) {
    return Platform.select({
      ios: {
        shadowColor: customShadow.shadowColor || COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: customShadow.shadowOpacity || 0.1,
        shadowRadius: customShadow.shadowRadius || 4,
      },
      android: {
        elevation: customShadow.elevation || 4,
      },
    });
  }
  
  switch (variant) {
    case 'elevated':
      return Platform.select(SHADOWS.elevated);
    case 'default':
      return Platform.select(SHADOWS.default);
    case 'outlined':
    case 'filled':
    default:
      return {};
  }
};

/**
 * 获取尺寸样式
 */
const getSizeStyle = (size: CardSize, customPadding?: number, customBorderRadius?: number) => {
  const sizeConfig = SIZES[size];
  return {
    padding: customPadding ?? sizeConfig.padding,
    borderRadius: customBorderRadius ?? sizeConfig.borderRadius,
  };
};
// #endregion

// #region 6. State Management
/**
 * 卡片状态管理Hook
 */
const useCardState = (props: CardProps) => {
  const [pressed, setPressed] = React.useState(false);
  
  const handlePressIn = React.useCallback(() => {
    if (props.onPress && !props.disabled) {
      setPressed(true);
    }
  }, [props.onPress, props.disabled]);
  
  const handlePressOut = React.useCallback(() => {
    setPressed(false);
  }, []);
  
  const handlePress = React.useCallback(() => {
    if (!props.disabled && props.onPress) {
      props.onPress();
    }
  }, [props.disabled, props.onPress]);
  
  const handleLongPress = React.useCallback(() => {
    if (!props.disabled && props.onLongPress) {
      props.onLongPress();
    }
  }, [props.disabled, props.onLongPress]);
  
  return {
    pressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    handleLongPress,
  };
};
// #endregion

// #region 7. Domain Logic & UI Components
/**
 * Card 主组件
 */
const Card: React.FC<CardProps> = (props) => {
  const {
    children,
    variant = 'default',
    size = 'md',
    style,
    disabled = false,
    padding,
    margin,
    borderRadius,
    shadowColor,
    shadowOpacity,
    shadowRadius,
    elevation,
    accessibilityLabel,
    testID,
  } = props;
  
  const {
    pressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    handleLongPress,
  } = useCardState(props);
  
  const isInteractive = !!(props.onPress || props.onLongPress) && !disabled;
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(variant),
      opacity: disabled ? 0.6 : pressed ? 0.95 : 1,
    },
    getBorderStyle(variant),
    getShadowStyle(variant, { shadowColor, shadowOpacity, shadowRadius, elevation }),
    getSizeStyle(size, padding, borderRadius),
    margin && { margin },
    style,
  ];
  
  if (isInteractive) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        activeOpacity={0.95}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View
      style={cardStyle}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </View>
  );
};
// #endregion

// #region 8. Exports & Styles
const styles = StyleSheet.create({
  card: {
    // 基础卡片样式由props动态生成
  },
});

export default Card;

// 便捷的卡片变体组件
export const DefaultCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="default" />
);

export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="elevated" />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="outlined" />
);

export const FilledCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="filled" />
);

// 常用的卡片布局组件
export const CardHeader: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>
    {children}
  </View>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.cardBody, style]}>
    {children}
  </View>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>
    {children}
  </View>
);

// 添加布局样式
const layoutStyles = StyleSheet.create({
  cardHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardBody: {
    flex: 1,
    paddingVertical: 12,
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

// 合并样式
Object.assign(styles, layoutStyles);

// 导出类型
export type { CardProps, CardSize, CardVariant };
// #endregion
