// #region 1. File Banner & TOC
/**
 * GameBannerArea - 游戏横幅区域组件
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// TODO: 导入实际的store hooks
// import { useHomepageData, useHomepageConfig } from '../../../../../stores';

// 导入共享组件
import { Card, LoadingOverlay } from '../../../../../components';
// #endregion

// #region 3. Types & Schema
interface GameBannerAreaProps {
  onBannerPress: (gameId: string) => void;
  style?: StyleProp<ViewStyle>;
}

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gameId: string;
  actionType: 'navigate' | 'external' | 'modal';
  actionUrl: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

interface BannerConfig {
  enabled: boolean;
  autoPlay: boolean;
  interval: number;
  showIndicators: boolean;
  enableSwipe: boolean;
}

interface BannerState {
  currentIndex: number;
  isAutoPlaying: boolean;
  loading: boolean;
  error: string | null;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#FFFFFF',
  OVERLAY: 'rgba(0, 0, 0, 0.4)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.2)',
  WHITE: '#FFFFFF',
  WHITE_ALPHA_90: 'rgba(255, 255, 255, 0.9)',
  PRIMARY: '#6366F1',
  TEXT_SHADOW: 'rgba(0, 0, 0, 0.5)',
} as const;

const SIZES = {
  HEIGHT: Math.min(SCREEN_HEIGHT * 0.22, 200),
  MIN_HEIGHT: 160,
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  BORDER_RADIUS: 16,
  INDICATOR_SIZE: 8,
  INDICATOR_SPACING: 12,
  CONTENT_PADDING: 20,
} as const;

const TYPOGRAPHY = {
  TITLE: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  SUBTITLE: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  ACTION_TEXT: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
} as const;

const ANIMATION_CONFIG = {
  SLIDE_DURATION: 300,
  FADE_DURATION: 200,
  AUTO_PLAY_INTERVAL: 5000,
  INDICATOR_ANIMATION_DURATION: 150,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 检查横幅是否在有效时间内
 */
const isBannerActive = (banner: BannerData): boolean => {
  const now = new Date();
  const startTime = new Date(banner.startTime);
  const endTime = new Date(banner.endTime);
  
  return now >= startTime && now <= endTime && banner.enabled;
};

/**
 * 过滤有效的横幅数据
 */
const filterActiveBanners = (banners: BannerData[]): BannerData[] => {
  return banners.filter(isBannerActive);
};

/**
 * 生成横幅图片URI
 */
const getBannerImageUri = (banner: BannerData): { uri: string } | number => {
  // 如果是本地图片资源
  if (banner.image.startsWith('file://') || !banner.image.startsWith('http')) {
    // TODO: 处理本地图片资源
    return { uri: banner.image };
  }
  
  // 网络图片
  return { uri: banner.image };
};

/**
 * 计算下一个横幅索引
 */
const getNextBannerIndex = (currentIndex: number, totalCount: number): number => {
  return (currentIndex + 1) % totalCount;
};

/**
 * 创建滑动动画
 */
const createSlideAnimation = (
  animatedValue: Animated.Value,
  targetValue: number,
  duration: number
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: targetValue,
    duration,
    useNativeDriver: true,
  });
};

/**
 * 创建指示器动画
 */
const createIndicatorAnimation = (
  animatedValue: Animated.Value,
  isActive: boolean
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: isActive ? 1 : 0.5,
    duration: ANIMATION_CONFIG.INDICATOR_ANIMATION_DURATION,
    useNativeDriver: true,
  });
};
// #endregion

// #region 6. State Management
/**
 * 横幅数据状态管理Hook
 */
const useBannerData = () => {
  // TODO: 集成实际的Zustand stores
  // const homepageData = useHomepageData();
  // const homepageConfig = useHomepageConfig();
  
  // 模拟横幅数据
  const [mockBanners] = useState<BannerData[]>([
    {
      id: '1',
      title: '王者荣耀',
      subtitle: '新赛季震撼开启',
      image: 'https://example.com/banner-king-glory.jpg',
      gameId: 'honor_of_kings',
      actionType: 'navigate',
      actionUrl: '/homepage/service-detail',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      enabled: true,
    },
    {
      id: '2',
      title: '英雄联盟',
      subtitle: '高端局代练服务',
      image: 'https://example.com/banner-lol.jpg',
      gameId: 'league_of_legends',
      actionType: 'navigate',
      actionUrl: '/homepage/service-detail',
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      enabled: true,
    },
  ]);
  
  const [mockConfig] = useState<BannerConfig>({
    enabled: true,
    autoPlay: true,
    interval: ANIMATION_CONFIG.AUTO_PLAY_INTERVAL,
    showIndicators: true,
    enableSwipe: true,
  });
  
  // 过滤有效横幅
  const activeBanners = React.useMemo(() => {
    return filterActiveBanners(mockBanners);
  }, [mockBanners]);
  
  return {
    banners: activeBanners,
    config: mockConfig,
    loading: false,
    error: null,
  };
};

/**
 * 横幅轮播状态管理Hook
 */
const useBannerCarousel = (banners: BannerData[], config: BannerConfig) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(config.autoPlay);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const indicatorAnimations = useRef(
    banners.map(() => new Animated.Value(0.5))
  ).current;
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * 更新指示器动画
   */
  const updateIndicators = useCallback((activeIndex: number) => {
    indicatorAnimations.forEach((animation, index) => {
      createIndicatorAnimation(animation, index === activeIndex).start();
    });
  }, [indicatorAnimations]);
  
  /**
   * 切换到指定横幅
   */
  const goToBanner = useCallback((index: number) => {
    if (index === currentIndex || index < 0 || index >= banners.length) return;
    
    setCurrentIndex(index);
    updateIndicators(index);
    
    // 滑动动画
    createSlideAnimation(
      slideAnimation,
      index,
      ANIMATION_CONFIG.SLIDE_DURATION
    ).start();
  }, [currentIndex, banners.length, slideAnimation, updateIndicators]);
  
  /**
   * 下一张横幅
   */
  const nextBanner = useCallback(() => {
    const nextIndex = getNextBannerIndex(currentIndex, banners.length);
    goToBanner(nextIndex);
  }, [currentIndex, banners.length, goToBanner]);
  
  /**
   * 开始自动播放
   */
  const startAutoPlay = useCallback(() => {
    if (!config.autoPlay || banners.length <= 1) return;
    
    setIsAutoPlaying(true);
    autoPlayTimer.current = setInterval(() => {
      nextBanner();
    }, config.interval);
  }, [config.autoPlay, config.interval, banners.length, nextBanner]);
  
  /**
   * 停止自动播放
   */
  const stopAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  }, []);
  
  /**
   * 重启自动播放
   */
  const restartAutoPlay = useCallback(() => {
    stopAutoPlay();
    setTimeout(() => {
      startAutoPlay();
    }, config.interval);
  }, [stopAutoPlay, startAutoPlay, config.interval]);
  
  // 自动播放生命周期
  useEffect(() => {
    startAutoPlay();
    
    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);
  
  // 初始化指示器
  useEffect(() => {
    updateIndicators(currentIndex);
  }, [currentIndex, updateIndicators]);
  
  return {
    currentIndex,
    slideAnimation,
    indicatorAnimations,
    isAutoPlaying,
    goToBanner,
    nextBanner,
    startAutoPlay,
    stopAutoPlay,
    restartAutoPlay,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 游戏横幅区域业务逻辑Hook
 */
const useGameBannerAreaLogic = (props: GameBannerAreaProps) => {
  const { onBannerPress } = props;
  const { banners, config, loading, error } = useBannerData();
  const {
    currentIndex,
    slideAnimation,
    indicatorAnimations,
    goToBanner,
    restartAutoPlay,
  } = useBannerCarousel(banners, config);
  
  /**
   * 横幅点击处理
   */
  const handleBannerPress = useCallback((banner: BannerData) => {
    onBannerPress(banner.gameId);
    restartAutoPlay(); // 重启自动播放
    
    // TODO: 埋点上报
    console.log('横幅点击事件', {
      bannerId: banner.id,
      gameId: banner.gameId,
      title: banner.title,
      actionType: banner.actionType,
    });
  }, [onBannerPress, restartAutoPlay]);
  
  /**
   * 指示器点击处理
   */
  const handleIndicatorPress = useCallback((index: number) => {
    goToBanner(index);
    restartAutoPlay(); // 重启自动播放
  }, [goToBanner, restartAutoPlay]);
  
  /**
   * 获取当前横幅
   */
  const getCurrentBanner = useCallback(() => {
    return banners[currentIndex] || null;
  }, [banners, currentIndex]);
  
  return {
    banners,
    config,
    loading,
    error,
    currentIndex,
    slideAnimation,
    indicatorAnimations,
    handleBannerPress,
    handleIndicatorPress,
    getCurrentBanner,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 横幅指示器组件
 */
const BannerIndicators: React.FC<{
  banners: BannerData[];
  currentIndex: number;
  animations: Animated.Value[];
  onPress: (index: number) => void;
  showIndicators: boolean;
}> = ({ banners, currentIndex, animations, onPress, showIndicators }) => {
  if (!showIndicators || banners.length <= 1) {
    return null;
  }
  
  return (
    <View style={styles.indicatorsContainer}>
      {banners.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={styles.indicatorTouchArea}
          onPress={() => onPress(index)}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.indicator,
              {
                opacity: animations[index] || 0.5,
                backgroundColor: index === currentIndex ? COLORS.WHITE : COLORS.WHITE_ALPHA_90,
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * 横幅内容组件
 */
const BannerContent: React.FC<{
  banner: BannerData;
  onPress: () => void;
}> = ({ banner, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={onPress}
      activeOpacity={0.95}
      accessibilityRole="button"
      accessibilityLabel={`${banner.title} - ${banner.subtitle}`}
    >
      <ImageBackground
        source={getBannerImageUri(banner)}
        style={styles.bannerImage}
        imageStyle={styles.bannerImageStyle}
        resizeMode="cover"
      >
        {/* 渐变覆盖层 */}
        <View style={styles.bannerOverlay} />
        
        {/* 文本内容 */}
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle} numberOfLines={2}>
            {banner.title}
          </Text>
          <Text style={styles.bannerSubtitle} numberOfLines={1}>
            {banner.subtitle}
          </Text>
          
          {/* 行动按钮 */}
          <View style={styles.actionButtonContainer}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>立即体验</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

/**
 * 横幅轮播组件
 */
const BannerCarousel: React.FC<{
  banners: BannerData[];
  currentIndex: number;
  slideAnimation: Animated.Value;
  indicatorAnimations: Animated.Value[];
  onBannerPress: (banner: BannerData) => void;
  onIndicatorPress: (index: number) => void;
  config: BannerConfig;
}> = ({ 
  banners, 
  currentIndex, 
  slideAnimation, 
  indicatorAnimations,
  onBannerPress, 
  onIndicatorPress, 
  config 
}) => {
  const translateX = slideAnimation.interpolate({
    inputRange: banners.map((_, index) => index),
    outputRange: banners.map((_, index) => -index * SCREEN_WIDTH),
    extrapolate: 'clamp',
  });
  
  return (
    <View style={styles.carouselContainer}>
      <Animated.View
        style={[
          styles.carouselSlider,
          {
            width: SCREEN_WIDTH * banners.length,
            transform: [{ translateX }],
          },
        ]}
      >
        {banners.map((banner, index) => (
          <View key={banner.id} style={styles.bannerSlide}>
            <BannerContent
              banner={banner}
              onPress={() => onBannerPress(banner)}
            />
          </View>
        ))}
      </Animated.View>
      
      {/* 指示器 */}
      <BannerIndicators
        banners={banners}
        currentIndex={currentIndex}
        animations={indicatorAnimations}
        onPress={onIndicatorPress}
        showIndicators={config.showIndicators}
      />
    </View>
  );
};

/**
 * 空状态组件
 */
const EmptyBannerState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>🎮</Text>
    <Text style={styles.emptyTitle}>暂无活动横幅</Text>
    <Text style={styles.emptySubtitle}>精彩内容即将上线</Text>
  </View>
);

/**
 * GameBannerArea 主组件
 */
const GameBannerArea: React.FC<GameBannerAreaProps> = (props) => {
  const {
    banners,
    config,
    loading,
    error,
    currentIndex,
    slideAnimation,
    indicatorAnimations,
    handleBannerPress,
    handleIndicatorPress,
  } = useGameBannerAreaLogic(props);
  
  // 如果配置禁用，不渲染组件
  if (!config.enabled) {
    return null;
  }
  
  // 加载状态
  if (loading) {
    return (
      <View style={[styles.container, props.style]}>
        <LoadingOverlay
          loading={loading}
          text="加载横幅中..."
          style={styles.loadingContainer}
        />
      </View>
    );
  }
  
  // 错误状态
  if (error) {
    return (
      <View style={[styles.container, props.style]}>
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>横幅加载失败</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </Card>
      </View>
    );
  }
  
  // 空状态
  if (banners.length === 0) {
    return (
      <View style={[styles.container, props.style]}>
        <EmptyBannerState />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, props.style]}>
      <BannerCarousel
        banners={banners}
        currentIndex={currentIndex}
        slideAnimation={slideAnimation}
        indicatorAnimations={indicatorAnimations}
        onBannerPress={handleBannerPress}
        onIndicatorPress={handleIndicatorPress}
        config={config}
      />
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.PADDING_HORIZONTAL,
    marginVertical: SIZES.PADDING_VERTICAL,
  },
  
  // 轮播样式
  carouselContainer: {
    height: SIZES.HEIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  
  carouselSlider: {
    flexDirection: 'row',
    height: '100%',
  },
  
  bannerSlide: {
    width: SCREEN_WIDTH - (SIZES.PADDING_HORIZONTAL * 2),
    height: '100%',
  },
  
  // 横幅样式
  bannerContainer: {
    flex: 1,
    borderRadius: SIZES.BORDER_RADIUS,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  
  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  bannerImageStyle: {
    borderRadius: SIZES.BORDER_RADIUS,
  },
  
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.OVERLAY,
  },
  
  bannerTextContainer: {
    padding: SIZES.CONTENT_PADDING,
    zIndex: 1,
  },
  
  bannerTitle: {
    ...TYPOGRAPHY.TITLE,
    color: COLORS.WHITE,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  
  bannerSubtitle: {
    ...TYPOGRAPHY.SUBTITLE,
    color: COLORS.WHITE_ALPHA_90,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 12,
  },
  
  actionButtonContainer: {
    alignItems: 'flex-start',
  },
  
  actionButton: {
    backgroundColor: COLORS.WHITE_ALPHA_90,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  actionButtonText: {
    ...TYPOGRAPHY.ACTION_TEXT,
    color: COLORS.PRIMARY,
  },
  
  // 指示器样式
  indicatorsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  indicatorTouchArea: {
    padding: 8,
  },
  
  indicator: {
    width: SIZES.INDICATOR_SIZE,
    height: SIZES.INDICATOR_SIZE,
    borderRadius: SIZES.INDICATOR_SIZE / 2,
    marginHorizontal: SIZES.INDICATOR_SPACING / 2,
  },
  
  // 加载状态样式
  loadingContainer: {
    height: SIZES.HEIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    backgroundColor: '#F3F4F6',
  },
  
  // 错误状态样式
  errorCard: {
    height: SIZES.HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },
  
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  
  errorDetail: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
  },
  
  // 空状态样式
  emptyContainer: {
    height: SIZES.HEIGHT,
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default GameBannerArea;
export type { GameBannerAreaProps };
// #endregion
