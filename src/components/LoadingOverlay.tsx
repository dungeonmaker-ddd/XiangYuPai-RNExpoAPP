// #region 1. File Banner & TOC
/**
 * LoadingOverlay - 加载覆盖层组件
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
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Modal,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface LoadingOverlayProps {
  // 基础属性
  loading: boolean;
  text?: string;
  subText?: string;
  
  // 样式属性
  style?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  
  // 行为属性
  modal?: boolean; // 是否使用Modal模式
  transparent?: boolean; // 背景是否透明
  cancelable?: boolean; // 是否可以取消
  
  // 动画属性
  animationType?: 'fade' | 'slide' | 'scale';
  animationDuration?: number;
  
  // 指示器属性
  indicatorType?: 'default' | 'spinner' | 'dots' | 'pulse';
  indicatorSize?: 'small' | 'large';
  indicatorColor?: string;
  
  // 事件回调
  onCancel?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

interface LoadingState {
  visible: boolean;
  animatedValue: Animated.Value;
  scaleValue: Animated.Value;
  rotateValue: Animated.Value;
  dotValues: Animated.Value[];
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ANIMATION_CONFIG = {
  FADE_DURATION: 300,
  SCALE_DURATION: 250,
  SLIDE_DURATION: 350,
  PULSE_DURATION: 1000,
  ROTATE_DURATION: 1000,
  DOT_DURATION: 600,
} as const;

const COLORS = {
  OVERLAY: 'rgba(0, 0, 0, 0.6)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
  WHITE: '#FFFFFF',
  PRIMARY: '#6366F1',
  TEXT: '#374151',
  TEXT_SECONDARY: '#6B7280',
} as const;

const SIZES = {
  CONTAINER_WIDTH: 120,
  CONTAINER_HEIGHT: 120,
  BORDER_RADIUS: 12,
  INDICATOR_SIZE: 32,
  DOT_SIZE: 8,
  DOT_SPACING: 12,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 创建脉冲动画
 */
const createPulseAnimation = (animatedValue: Animated.Value): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: ANIMATION_CONFIG.PULSE_DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_CONFIG.PULSE_DURATION / 2,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * 创建旋转动画
 */
const createRotateAnimation = (animatedValue: Animated.Value): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: ANIMATION_CONFIG.ROTATE_DURATION,
      useNativeDriver: true,
    })
  );
};

/**
 * 创建点阵动画
 */
const createDotsAnimation = (dotValues: Animated.Value[]): Animated.CompositeAnimation => {
  const animations = dotValues.map((dotValue, index) => 
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 150),
        Animated.timing(dotValue, {
          toValue: 1,
          duration: ANIMATION_CONFIG.DOT_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(dotValue, {
          toValue: 0.3,
          duration: ANIMATION_CONFIG.DOT_DURATION / 2,
          useNativeDriver: true,
        }),
      ])
    )
  );
  
  return Animated.parallel(animations);
};

/**
 * 创建入场动画
 */
const createEnterAnimation = (
  type: LoadingOverlayProps['animationType'],
  animatedValue: Animated.Value,
  scaleValue: Animated.Value,
  duration: number
): Animated.CompositeAnimation => {
  switch (type) {
    case 'fade':
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });
    
    case 'scale':
      return Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]);
    
    case 'slide':
    default:
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });
  }
};

/**
 * 创建退场动画
 */
const createExitAnimation = (
  type: LoadingOverlayProps['animationType'],
  animatedValue: Animated.Value,
  scaleValue: Animated.Value,
  duration: number
): Animated.CompositeAnimation => {
  switch (type) {
    case 'scale':
      return Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration,
          useNativeDriver: true,
        }),
      ]);
    
    case 'fade':
    case 'slide':
    default:
      return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      });
  }
};
// #endregion

// #region 6. State Management
/**
 * 加载状态管理Hook
 */
const useLoadingState = (props: LoadingOverlayProps): LoadingState & {
  showLoading: () => void;
  hideLoading: () => void;
  startIndicatorAnimation: () => void;
  stopIndicatorAnimation: () => void;
} => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const dotValues = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;
  
  const [visible, setVisible] = React.useState(props.loading);
  const indicatorAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  const startIndicatorAnimation = React.useCallback(() => {
    // 停止之前的动画
    if (indicatorAnimationRef.current) {
      indicatorAnimationRef.current.stop();
    }
    
    // 重置动画值
    rotateValue.setValue(0);
    dotValues.forEach(value => value.setValue(0.3));
    
    // 开始对应的指示器动画
    switch (props.indicatorType) {
      case 'pulse':
        indicatorAnimationRef.current = createPulseAnimation(scaleValue);
        break;
      case 'spinner':
        indicatorAnimationRef.current = createRotateAnimation(rotateValue);
        break;
      case 'dots':
        indicatorAnimationRef.current = createDotsAnimation(dotValues);
        break;
      default:
        break;
    }
    
    if (indicatorAnimationRef.current) {
      indicatorAnimationRef.current.start();
    }
  }, [props.indicatorType, scaleValue, rotateValue, dotValues]);
  
  const stopIndicatorAnimation = React.useCallback(() => {
    if (indicatorAnimationRef.current) {
      indicatorAnimationRef.current.stop();
      indicatorAnimationRef.current = null;
    }
  }, []);
  
  const showLoading = React.useCallback(() => {
    setVisible(true);
    const duration = props.animationDuration || ANIMATION_CONFIG.FADE_DURATION;
    
    const animation = createEnterAnimation(
      props.animationType || 'fade',
      animatedValue,
      scaleValue,
      duration
    );
    
    animation.start(() => {
      props.onShow?.();
      startIndicatorAnimation();
    });
  }, [props, animatedValue, scaleValue, startIndicatorAnimation]);
  
  const hideLoading = React.useCallback(() => {
    stopIndicatorAnimation();
    
    const duration = props.animationDuration || ANIMATION_CONFIG.FADE_DURATION;
    
    const animation = createExitAnimation(
      props.animationType || 'fade',
      animatedValue,
      scaleValue,
      duration
    );
    
    animation.start(() => {
      setVisible(false);
      props.onHide?.();
    });
  }, [props, animatedValue, scaleValue, stopIndicatorAnimation]);
  
  return {
    visible,
    animatedValue,
    scaleValue,
    rotateValue,
    dotValues,
    showLoading,
    hideLoading,
    startIndicatorAnimation,
    stopIndicatorAnimation,
  };
};
// #endregion

// #region 7. Domain Logic & UI Components
/**
 * 指示器组件
 */
const LoadingIndicator: React.FC<{
  type: LoadingOverlayProps['indicatorType'];
  size: LoadingOverlayProps['indicatorSize'];
  color: string;
  scaleValue: Animated.Value;
  rotateValue: Animated.Value;
  dotValues: Animated.Value[];
}> = ({ type, size, color, scaleValue, rotateValue, dotValues }) => {
  const indicatorSize = size === 'large' ? SIZES.INDICATOR_SIZE * 1.5 : SIZES.INDICATOR_SIZE;
  
  switch (type) {
    case 'spinner':
      const spin = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
      
      return (
        <Animated.View style={[
          styles.spinnerContainer,
          { transform: [{ rotate: spin }] }
        ]}>
          <View style={[
            styles.spinner,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderColor: `${color}20`,
              borderTopColor: color,
            }
          ]} />
        </Animated.View>
      );
    
    case 'dots':
      return (
        <View style={styles.dotsContainer}>
          {dotValues.map((dotValue, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: color,
                  width: SIZES.DOT_SIZE,
                  height: SIZES.DOT_SIZE,
                  marginHorizontal: SIZES.DOT_SPACING / 2,
                  opacity: dotValue,
                  transform: [{ scale: dotValue }],
                }
              ]}
            />
          ))}
        </View>
      );
    
    case 'pulse':
      return (
        <Animated.View style={[
          styles.pulseContainer,
          { transform: [{ scale: scaleValue }] }
        ]}>
          <View style={[
            styles.pulse,
            {
              width: indicatorSize,
              height: indicatorSize,
              backgroundColor: color,
            }
          ]} />
        </Animated.View>
      );
    
    case 'default':
    default:
      return (
        <ActivityIndicator
          size={size}
          color={color}
          style={styles.defaultIndicator}
        />
      );
  }
};

/**
 * LoadingOverlay 主组件
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = (props) => {
  const {
    loading,
    text = '加载中...',
    subText,
    style,
    overlayStyle,
    textStyle,
    modal = true,
    transparent = false,
    cancelable = false,
    indicatorType = 'default',
    indicatorSize = 'large',
    indicatorColor = COLORS.PRIMARY,
    onCancel,
  } = props;
  
  const {
    visible,
    animatedValue,
    scaleValue,
    rotateValue,
    dotValues,
    showLoading,
    hideLoading,
  } = useLoadingState(props);
  
  // 监听loading属性变化
  useEffect(() => {
    if (loading && !visible) {
      showLoading();
    } else if (!loading && visible) {
      hideLoading();
    }
  }, [loading, visible, showLoading, hideLoading]);
  
  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (visible) {
        hideLoading();
      }
    };
  }, []);
  
  if (!visible) {
    return null;
  }
  
  const overlayOpacity = animatedValue;
  const containerTransform = props.animationType === 'scale' 
    ? [{ scale: scaleValue }]
    : props.animationType === 'slide'
    ? [{ translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      })}]
    : [];
  
  const content = (
    <Animated.View 
      style={[
        styles.overlay,
        overlayStyle,
        {
          backgroundColor: transparent ? 'transparent' : COLORS.OVERLAY,
          opacity: overlayOpacity,
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.container,
          style,
          {
            transform: containerTransform,
          }
        ]}
      >
        <LoadingIndicator
          type={indicatorType}
          size={indicatorSize}
          color={indicatorColor}
          scaleValue={scaleValue}
          rotateValue={rotateValue}
          dotValues={dotValues}
        />
        
        {text && (
          <Text style={[styles.text, textStyle]}>
            {text}
          </Text>
        )}
        
        {subText && (
          <Text style={[styles.subText, textStyle]}>
            {subText}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
  
  if (modal) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={cancelable ? onCancel : undefined}
        statusBarTranslucent
      >
        {content}
      </Modal>
    );
  }
  
  return content;
};
// #endregion

// #region 8. Exports & Styles
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: SIZES.CONTAINER_WIDTH,
    minHeight: SIZES.CONTAINER_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  text: {
    fontSize: 16,
    color: COLORS.TEXT,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  // 指示器样式
  defaultIndicator: {
    // ActivityIndicator的默认样式
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: SIZES.DOT_SIZE / 2,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    borderRadius: 50,
  },
});

export default LoadingOverlay;

// 便捷的Hook
export const useLoading = () => {
  const [loading, setLoading] = React.useState(false);
  
  const showLoading = React.useCallback(() => setLoading(true), []);
  const hideLoading = React.useCallback(() => setLoading(false), []);
  const toggleLoading = React.useCallback(() => setLoading(prev => !prev), []);
  
  return {
    loading,
    showLoading,
    hideLoading,
    toggleLoading,
  };
};

// 导出类型
export type { LoadingOverlayProps };
// #endregion
