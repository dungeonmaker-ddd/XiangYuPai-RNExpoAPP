// #region 1. File Banner & TOC
/**
 * TopWelcomeArea - 顶部欢迎区域组件
 * 
 * 功能描述：
 * - 展示应用Logo和品牌标识
 * - 显示欢迎文案和引导信息
 * - 管理状态栏显示效果
 * - 提供品牌展示和用户引导
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
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// LinearGradient removed - using solid background instead
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types and constants
import { ANIMATION_CONFIG, AUTH_COLORS, UI_SIZES } from '../../constants';
import { colorUtils, responsive } from '../../styles';
import type { TopWelcomeAreaProps } from '../../types';
// #endregion

// #region 3. Types & Schema
interface AnimationValues {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

interface WelcomeContent {
  title: string;
  subtitle: string;
  description: string;
}

interface StatusBarConfig {
  barStyle: 'default' | 'light-content' | 'dark-content';
  backgroundColor: string;
  translucent: boolean;
}
// #endregion

// #region 4. Constants & Config
/**
 * 欢迎内容配置 - 按照UI设计图
 */
const WELCOME_CONTENT: WelcomeContent = {
  title: '您好！',
  subtitle: '欢迎使用探店',
  description: '',
} as const;

/**
 * Logo配置
 */
const LOGO_CONFIG = {
  SIZE: responsive.scale(80),
  BORDER_RADIUS: responsive.scale(16),
  SHADOW_RADIUS: 12,
  SHADOW_OPACITY: 0.15,
} as const;

/**
 * 动画配置
 */
const ANIMATION_DELAYS = {
  LOGO: 0,
  TITLE: 200,
  SUBTITLE: 400,
  DESCRIPTION: 600,
} as const;

/**
 * 状态栏配置
 */
const STATUS_BAR_CONFIG: StatusBarConfig = {
  barStyle: 'dark-content',
  backgroundColor: 'transparent',
  translucent: true,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 获取当前时间段的问候语
 */
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
};

/**
 * 获取个性化欢迎文案
 */
const getPersonalizedWelcome = (greeting: string): string => {
  const greetings = [
    `${greeting}，欢迎使用探店派`,
    `${greeting}，准备开启新的探店之旅吗？`,
    `${greeting}，让我们一起发现精彩`,
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * 创建背景样式
 */
const createBackgroundStyle = (opacity: number = 0.05) => ({
  backgroundColor: colorUtils.alpha(AUTH_COLORS.PRIMARY, opacity),
});

/**
 * 获取安全区域顶部高度
 */
const getSafeAreaTop = (insets: any): number => {
  return Math.max(insets.top, Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0);
};
// #endregion

// #region 6. State Management
/**
 * 动画状态管理Hook
 */
const useWelcomeAnimation = (): AnimationValues => {
  // 动画值初始化
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(30), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  
  // 启动入场动画
  const startEntryAnimation = useCallback(() => {
    const animations = [
      // 淡入动画
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.DURATION.NORMAL,
        useNativeDriver: true,
      }),
      
      // 上滑动画
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_CONFIG.DURATION.NORMAL,
        useNativeDriver: true,
      }),
      
      // 缩放动画
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ];
    
    // 并行执行所有动画
    Animated.parallel(animations).start();
  }, [fadeAnim, slideAnim, scaleAnim]);
  
  // 组件挂载时启动动画
  useEffect(() => {
    const timer = setTimeout(startEntryAnimation, 100);
    return () => clearTimeout(timer);
  }, [startEntryAnimation]);
  
  return {
    fadeAnim,
    slideAnim,
    scaleAnim,
  };
};

/**
 * 欢迎内容状态管理Hook
 */
const useWelcomeContent = () => {
  // 时间相关的问候语
  const timeGreeting = useMemo(() => getTimeBasedGreeting(), []);
  
  // 个性化欢迎文案
  const personalizedWelcome = useMemo(
    () => getPersonalizedWelcome(timeGreeting),
    [timeGreeting]
  );
  
  // 内容配置
  const content = useMemo(() => ({
    ...WELCOME_CONTENT,
    description: personalizedWelcome,
  }), [personalizedWelcome]);
  
  return {
    content,
    timeGreeting,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * Logo展示逻辑Hook
 */
const useLogoDisplay = () => {
  // Logo资源配置
  const logoSource = useMemo(() => {
    // 这里可以根据主题、品牌等选择不同的Logo
    return require('@/assets/images/icon.png'); // 使用现有的icon
  }, []);
  
  // Logo点击处理（可扩展）
  const handleLogoPress = useCallback(() => {
    // 可以添加Logo点击的特殊效果或彩蛋
    console.log('Logo pressed - Easter egg could be here!');
  }, []);
  
  return {
    logoSource,
    handleLogoPress,
  };
};

/**
 * 状态栏管理Hook
 */
const useStatusBarControl = () => {
  useEffect(() => {
    // 设置状态栏样式
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(STATUS_BAR_CONFIG.backgroundColor, true);
      StatusBar.setTranslucent(STATUS_BAR_CONFIG.translucent);
    }
    StatusBar.setBarStyle(STATUS_BAR_CONFIG.barStyle, true);
    
    // 清理函数
    return () => {
      // 如果需要恢复默认状态栏设置
    };
  }, []);
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * Logo组件
 */
const LogoComponent: React.FC<{
  source: any;
  onPress: () => void;
  scaleAnim: Animated.Value;
}> = React.memo(({ source, onPress, scaleAnim }) => (
  <Animated.View
    style={[
      styles.logoContainer,
      {
        transform: [{ scale: scaleAnim }],
      },
    ]}
  >
    <Image
      source={source}
      style={styles.logoImage}
      resizeMode="contain"
    />
  </Animated.View>
));

/**
 * 标题组件
 */
const TitleComponent: React.FC<{
  title: string;
  subtitle: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}> = React.memo(({ title, subtitle, fadeAnim, slideAnim }) => (
  <Animated.View
    style={[
      styles.titleContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.subtitleText}>{subtitle}</Text>
  </Animated.View>
));

/**
 * 描述组件
 */
const DescriptionComponent: React.FC<{
  description: string;
  fadeAnim: Animated.Value;
}> = React.memo(({ description, fadeAnim }) => (
  <Animated.View
    style={[
      styles.descriptionContainer,
      {
        opacity: fadeAnim,
      },
    ]}
  >
    <Text style={styles.descriptionText}>{description}</Text>
  </Animated.View>
));

/**
 * BackButton - 返回按钮组件
 */
const BackButton: React.FC<{
  onPress: () => void;
}> = React.memo(({ onPress }) => (
  <TouchableOpacity
    style={styles.backButton}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
  </TouchableOpacity>
));

/**
 * TopWelcomeArea 主组件
 */
const TopWelcomeArea: React.FC<TopWelcomeAreaProps> = ({ style }) => {
  // 路由
  const router = useRouter();
  
  // 安全区域
  const insets = useSafeAreaInsets();
  
  // 使用自定义Hooks
  const { fadeAnim, slideAnim, scaleAnim } = useWelcomeAnimation();
  const { content } = useWelcomeContent();
  const { logoSource, handleLogoPress } = useLogoDisplay();
  
  // 状态栏控制
  useStatusBarControl();
  
  // 返回处理
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // 如果无法返回，跳转到首页
      router.replace('/(tabs)' as any);
    }
  }, [router]);
  
  // 计算顶部间距
  const topSpacing = useMemo(
    () => getSafeAreaTop(insets) + UI_SIZES.SPACING.LG,
    [insets]
  );
  
  // 背景样式配置
  const backgroundStyle = useMemo(() => createBackgroundStyle(0.05), []);
  
  return (
    <View
      style={[
        styles.container,
        { paddingTop: topSpacing },
        style,
      ]}
    >
      {/* 返回按钮 - 左上角 */}
      <BackButton onPress={handleBack} />
      
      {/* 标题区域 - 按照UI设计图，不显示Logo */}
      <TitleComponent
        title={content.title}
        subtitle={content.subtitle}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />
    </View>
  );
};
// #endregion

// #region 9. Exports
export default React.memo(TopWelcomeArea);

export type { TopWelcomeAreaProps };

    export {
    getPersonalizedWelcome, getTimeBasedGreeting, LOGO_CONFIG, WELCOME_CONTENT
  };
// #endregion

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingBottom: 12,
    paddingTop: 0,
    position: 'relative',
  },
  
  // 返回按钮样式
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
    zIndex: 10,
  },
  
  logoContainer: {
    marginBottom: UI_SIZES.SPACING.LG,
    shadowColor: AUTH_COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: LOGO_CONFIG.SHADOW_RADIUS / 2,
    },
    shadowOpacity: LOGO_CONFIG.SHADOW_OPACITY,
    shadowRadius: LOGO_CONFIG.SHADOW_RADIUS,
    elevation: 8,
  },
  
  logoImage: {
    width: LOGO_CONFIG.SIZE,
    height: LOGO_CONFIG.SIZE,
    borderRadius: LOGO_CONFIG.BORDER_RADIUS,
  },
  
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingVertical: 0,
  },
  
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'left',
  },
  
  subtitleText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1F2937',
    letterSpacing: -0.5,
    textAlign: 'left',
  },
  
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: UI_SIZES.SPACING.MD,
  },
  
  descriptionText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    lineHeight: responsive.fontSize(20),
    textAlign: 'center',
    opacity: 0.8,
  },
});
