// #region 1. File Banner & TOC
/**
 * EventCenterArea - 组队聚会区域组件
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
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

// TODO: 导入实际的store hooks
// import { useHomepageConfig } from '../../../../../stores';

// 导入共享组件
// #endregion

// #region 3. Types & Schema
interface EventCenterAreaProps {
  onEventPress: () => void;
  style?: StyleProp<ViewStyle>;
}

interface EventPromoData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  actionText: string;
  features: string[];
  statistics: {
    activeEvents: number;
    participants: number;
    successRate: number;
  };
  gradient: {
    colors: string[];
    locations: number[];
  };
}

interface EventCenterConfig {
  enabled: boolean;
  showPromo: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#FFFFFF',
  GRADIENT_START: '#667EEA',
  GRADIENT_END: '#764BA2',
  WHITE: '#FFFFFF',
  WHITE_ALPHA_90: 'rgba(255, 255, 255, 0.9)',
  WHITE_ALPHA_80: 'rgba(255, 255, 255, 0.8)',
  WHITE_ALPHA_60: 'rgba(255, 255, 255, 0.6)',
  PRIMARY: '#6366F1',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  TEXT_SHADOW: 'rgba(0, 0, 0, 0.3)',
  OVERLAY: 'rgba(0, 0, 0, 0.2)',
} as const;

const SIZES = {
  CONTAINER_PADDING: 16,
  HEIGHT: 140,
  BORDER_RADIUS: 16,
  CONTENT_PADDING: 20,
  FEATURE_SPACING: 8,
  STATS_SPACING: 16,
  ICON_SIZE: 20,
} as const;

const TYPOGRAPHY = {
  TITLE: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
  SUBTITLE: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  DESCRIPTION: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  ACTION_TEXT: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  FEATURE: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  STAT_NUMBER: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  STAT_LABEL: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 15,
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化统计数字
 */
const formatStatNumber = (number: number): string => {
  if (number >= 10000) {
    return `${(number / 10000).toFixed(1)}万`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  }
  return number.toString();
};

/**
 * 生成渐变背景
 */
const generateGradientBackground = (gradient: EventPromoData['gradient']) => {
  // TODO: 实现实际渐变背景
  // 这里可以使用 react-native-linear-gradient 或其他渐变库
  return {
    backgroundColor: gradient.colors[0],
  };
};

/**
 * 获取特性图标
 */
const getFeatureIcon = (feature: string): string => {
  const iconMap: Record<string, string> = {
    '实时匹配': '⚡',
    '语音聊天': '🎙️',
    '安全保障': '🛡️',
    '快速组队': '👥',
    '专业指导': '🎯',
    '奖励丰富': '🎁',
  };
  
  return iconMap[feature] || '✨';
};

/**
 * 检查活动是否可用
 */
const isEventCenterAvailable = (config: EventCenterConfig): boolean => {
  return config.enabled && config.showPromo;
};

/**
 * 生成随机背景图片
 */
const getEventBackgroundImage = (imageUrl?: string): { uri: string } | number => {
  if (imageUrl && imageUrl.startsWith('http')) {
    return { uri: imageUrl };
  }
  
  // 使用默认背景
  return { uri: 'https://example.com/event-background.jpg' };
};
// #endregion

// #region 6. State Management
/**
 * 活动中心数据状态管理Hook
 */
const useEventCenterData = () => {
  // TODO: 集成实际的Zustand stores
  // const homepageConfig = useHomepageConfig();
  
  // 模拟活动中心数据
  const [mockEventData] = useState<EventPromoData>({
    id: 'event_center_001',
    title: '组队聚会',
    subtitle: '一键组队，快乐加倍',
    description: '找到志同道合的小伙伴，开启精彩聚会',
    backgroundImage: 'https://example.com/event-bg.jpg',
    actionText: '立即组队',
    features: ['实时匹配', '语音聊天', '安全保障'],
    statistics: {
      activeEvents: 1250,
      participants: 8940,
      successRate: 96,
    },
    gradient: {
      colors: [COLORS.GRADIENT_START, COLORS.GRADIENT_END],
      locations: [0, 1],
    },
  });
  
  const [mockConfig] = useState<EventCenterConfig>({
    enabled: true,
    showPromo: true,
    autoRefresh: true,
    refreshInterval: 60000, // 1分钟
  });
  
  return {
    eventData: mockEventData,
    config: mockConfig,
    loading: false,
    error: null,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 组队聚会区域业务逻辑Hook
 */
const useEventCenterAreaLogic = (props: EventCenterAreaProps) => {
  const { onEventPress } = props;
  const { eventData, config } = useEventCenterData();
  
  /**
   * 活动点击处理
   */
  const handleEventPress = useCallback(() => {
    onEventPress();
    
    // TODO: 埋点上报
    console.log('组队聚会点击事件', {
      eventId: eventData.id,
      title: eventData.title,
      activeEvents: eventData.statistics.activeEvents,
    });
  }, [onEventPress, eventData]);
  
  /**
   * 检查组件是否应该显示
   */
  const shouldShowComponent = useCallback(() => {
    return isEventCenterAvailable(config);
  }, [config]);
  
  return {
    eventData,
    config,
    handleEventPress,
    shouldShowComponent,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 活动特性列表组件
 */
const EventFeatures: React.FC<{
  features: string[];
}> = ({ features }) => (
  <View style={styles.featuresContainer}>
    {features.map((feature, index) => (
      <View key={index} style={styles.featureItem}>
        <Text style={styles.featureIcon}>
          {getFeatureIcon(feature)}
        </Text>
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ))}
  </View>
);

/**
 * 活动统计组件
 */
const EventStatistics: React.FC<{
  statistics: EventPromoData['statistics'];
}> = ({ statistics }) => (
  <View style={styles.statisticsContainer}>
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>
        {formatStatNumber(statistics.activeEvents)}
      </Text>
      <Text style={styles.statLabel}>活跃活动</Text>
    </View>
    
    <View style={styles.statDivider} />
    
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>
        {formatStatNumber(statistics.participants)}
      </Text>
      <Text style={styles.statLabel}>参与用户</Text>
    </View>
    
    <View style={styles.statDivider} />
    
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>
        {statistics.successRate}%
      </Text>
      <Text style={styles.statLabel}>成功匹配</Text>
    </View>
  </View>
);

/**
 * 活动宣传横幅组件
 */
const EventPromoBanner: React.FC<{
  eventData: EventPromoData;
  onPress: () => void;
}> = ({ eventData, onPress }) => (
  <TouchableOpacity
    style={styles.promoContainer}
    onPress={onPress}
    activeOpacity={0.95}
    accessibilityRole="button"
    accessibilityLabel={`${eventData.title} - ${eventData.subtitle}`}
  >
    <ImageBackground
      source={getEventBackgroundImage(eventData.backgroundImage)}
      style={styles.promoBackground}
      imageStyle={styles.promoBackgroundImage}
    >
      {/* 渐变覆盖层 */}
      <View 
        style={[
          styles.promoOverlay,
          generateGradientBackground(eventData.gradient)
        ]} 
      />
      
      {/* 内容区域 */}
      <View style={styles.promoContent}>
        {/* 左侧文本内容 */}
        <View style={styles.promoTextSection}>
          <Text style={styles.promoTitle} numberOfLines={1}>
            {eventData.title}
          </Text>
          <Text style={styles.promoSubtitle} numberOfLines={1}>
            {eventData.subtitle}
          </Text>
          <Text style={styles.promoDescription} numberOfLines={2}>
            {eventData.description}
          </Text>
          
          {/* 特性列表 */}
          <EventFeatures features={eventData.features} />
        </View>
        
        {/* 右侧统计和操作 */}
        <View style={styles.promoActionSection}>
          <EventStatistics statistics={eventData.statistics} />
          
          {/* 行动按钮 */}
          <View style={styles.actionButtonContainer}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>
                {eventData.actionText}
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

/**
 * EventCenterArea 主组件
 */
const EventCenterArea: React.FC<EventCenterAreaProps> = (props) => {
  const {
    eventData,
    config,
    handleEventPress,
    shouldShowComponent,
  } = useEventCenterAreaLogic(props);
  
  // 检查是否应该显示组件
  if (!shouldShowComponent()) {
    return null;
  }
  
  return (
    <View style={[styles.container, props.style]}>
      <EventPromoBanner
        eventData={eventData}
        onPress={handleEventPress}
      />
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.CONTAINER_PADDING,
    paddingVertical: SIZES.CONTAINER_PADDING,
  },
  
  // 宣传横幅样式
  promoContainer: {
    height: SIZES.HEIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.TEXT_SHADOW,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  
  promoBackground: {
    flex: 1,
  },
  
  promoBackgroundImage: {
    borderRadius: SIZES.BORDER_RADIUS,
  },
  
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  
  promoContent: {
    flex: 1,
    flexDirection: 'row',
    padding: SIZES.CONTENT_PADDING,
  },
  
  // 文本区域样式
  promoTextSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  
  promoTitle: {
    ...TYPOGRAPHY.TITLE,
    color: COLORS.WHITE,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  promoSubtitle: {
    ...TYPOGRAPHY.SUBTITLE,
    color: COLORS.WHITE_ALPHA_90,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  
  promoDescription: {
    ...TYPOGRAPHY.DESCRIPTION,
    color: COLORS.WHITE_ALPHA_80,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 8,
  },
  
  // 特性列表样式
  featuresContainer: {
    marginTop: 12,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.FEATURE_SPACING,
  },
  
  featureIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  
  featureText: {
    ...TYPOGRAPHY.FEATURE,
    color: COLORS.WHITE_ALPHA_90,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // 操作区域样式
  promoActionSection: {
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  // 统计数据样式
  statisticsContainer: {
    alignItems: 'flex-end',
  },
  
  statItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  
  statNumber: {
    ...TYPOGRAPHY.STAT_NUMBER,
    color: COLORS.WHITE,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  statLabel: {
    ...TYPOGRAPHY.STAT_LABEL,
    color: COLORS.WHITE_ALPHA_80,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.WHITE_ALPHA_60,
    marginVertical: 4,
  },
  
  // 行动按钮样式
  actionButtonContainer: {
    marginTop: 8,
  },
  
  actionButton: {
    backgroundColor: COLORS.WHITE_ALPHA_90,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.TEXT_SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  actionButtonText: {
    ...TYPOGRAPHY.ACTION_TEXT,
    color: COLORS.PRIMARY,
  },
  
  actionArrow: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default EventCenterArea;
export type { EventCenterAreaProps };
// #endregion
