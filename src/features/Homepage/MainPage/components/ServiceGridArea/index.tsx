// #region 1. File Banner & TOC
/**
 * ServiceGridArea - 服务网格区域组件
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
import React, { useCallback } from 'react';
import {
    Dimensions,
    FlatList,
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
import { Card } from '../../../../../components';
// #endregion

// #region 3. Types & Schema
interface ServiceGridAreaProps {
  onServicePress: (serviceType: string) => void;
  style?: StyleProp<ViewStyle>;
}

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  type: string;
  enabled: boolean;
  sortOrder: number;
  config: {
    displayName: string;
    description: string;
    iconUrl: string;
    backgroundColor: string;
  };
}

interface GridConfig {
  enabled: boolean;
  columns: number;
  rows: number;
  showLabels: boolean;
  iconSize: 'small' | 'medium' | 'large';
}

interface GridLayoutInfo {
  itemWidth: number;
  itemHeight: number;
  spacing: number;
  maxItems: number;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#F8FAFC',
  ICON_BACKGROUND: '#E5E7EB',
  TEXT: '#374151',
  TEXT_SECONDARY: '#6B7280',
  DISABLED: '#9CA3AF',
  DISABLED_BACKGROUND: '#F3F4F6',
  PRIMARY: '#6366F1',
  SHADOW: '#000000',
} as const;

const GRID_CONFIG = {
  DEFAULT_COLUMNS: 5,
  DEFAULT_ROWS: 2,
  MIN_COLUMNS: 3,
  MAX_COLUMNS: 6,
  MIN_ITEM_WIDTH: 60,
  MAX_ITEM_WIDTH: 100,
  ASPECT_RATIO: 1, // 正方形
} as const;

const SIZES = {
  CONTAINER_PADDING: 16,
  ITEM_SPACING: 16,
  ITEM_PADDING: 12,
  BORDER_RADIUS: 12,
  ICON_SIZE: {
    small: 24,
    medium: 32,
    large: 40,
  },
  LABEL_HEIGHT: 20,
} as const;

const TYPOGRAPHY = {
  LABEL: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  SECTION_TITLE: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
} as const;

// 默认服务图标映射
const SERVICE_ICONS = {
  honor_of_kings: '👑',
  league_of_legends: '⚔️',
  peace_elite: '🔫',
  brawl_stars: '⭐',
  explore_shop: '🏪',
  private_cinema: '🎬',
  billiards: '🎱',
  ktv: '🎤',
  drinking: '🍻',
  massage: '💆',
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 计算网格布局信息
 */
const calculateGridLayout = (
  columns: number,
  rows: number,
  containerWidth: number = SCREEN_WIDTH - (SIZES.CONTAINER_PADDING * 2)
): GridLayoutInfo => {
  const totalSpacing = (columns - 1) * SIZES.ITEM_SPACING;
  const itemWidth = Math.max(
    GRID_CONFIG.MIN_ITEM_WIDTH,
    Math.min(
      GRID_CONFIG.MAX_ITEM_WIDTH,
      (containerWidth - totalSpacing) / columns
    )
  );
  
  const itemHeight = itemWidth * GRID_CONFIG.ASPECT_RATIO + 
    (SIZES.LABEL_HEIGHT + SIZES.ITEM_PADDING);
  
  return {
    itemWidth,
    itemHeight,
    spacing: SIZES.ITEM_SPACING,
    maxItems: columns * rows,
  };
};

/**
 * 获取服务图标
 */
const getServiceIcon = (serviceType: string, iconUrl?: string): string => {
  if (iconUrl) {
    // TODO: 处理网络图标URL
    return iconUrl;
  }
  
  return SERVICE_ICONS[serviceType as keyof typeof SERVICE_ICONS] || '🎯';
};

/**
 * 格式化服务名称
 */
const formatServiceName = (service: ServiceItem): string => {
  return service.config?.displayName || service.name;
};

/**
 * 生成网格项目key
 */
const generateGridItemKey = (item: ServiceItem, index: number): string => {
  return `${item.id}_${index}`;
};

/**
 * 检查服务是否可用
 */
const isServiceEnabled = (service: ServiceItem): boolean => {
  return service.enabled && service.config;
};
// #endregion

// #region 6. State Management
/**
 * 服务网格数据状态管理Hook
 */
const useServiceGridData = () => {
  // TODO: 集成实际的Zustand stores
  // const homepageData = useHomepageData();
  // const homepageConfig = useHomepageConfig();
  
  // 模拟服务数据
  const [mockServices] = React.useState<ServiceItem[]>([
    {
      id: '1',
      name: '王者荣耀',
      icon: '',
      type: 'honor_of_kings',
      enabled: true,
      sortOrder: 1,
      config: {
        displayName: '王者荣耀',
        description: '专业代练陪玩',
        iconUrl: '',
        backgroundColor: '#FF6B6B',
      },
    },
    {
      id: '2',
      name: '英雄联盟',
      icon: '',
      type: 'league_of_legends',
      enabled: true,
      sortOrder: 2,
      config: {
        displayName: '英雄联盟',
        description: '高端局服务',
        iconUrl: '',
        backgroundColor: '#4ECDC4',
      },
    },
    {
      id: '3',
      name: '探店',
      icon: '',
      type: 'explore_shop',
      enabled: true,
      sortOrder: 3,
      config: {
        displayName: '探店',
        description: '美食探索',
        iconUrl: '',
        backgroundColor: '#45B7D1',
      },
    },
    {
      id: '4',
      name: 'K歌',
      icon: '',
      type: 'ktv',
      enabled: true,
      sortOrder: 4,
      config: {
        displayName: 'K歌',
        description: '唱歌娱乐',
        iconUrl: '',
        backgroundColor: '#F9CA24',
      },
    },
    {
      id: '5',
      name: '台球',
      icon: '',
      type: 'billiards',
      enabled: true,
      sortOrder: 5,
      config: {
        displayName: '台球',
        description: '台球竞技',
        iconUrl: '',
        backgroundColor: '#6C5CE7',
      },
    },
    {
      id: '6',
      name: '私影',
      icon: '',
      type: 'private_cinema',
      enabled: true,
      sortOrder: 6,
      config: {
        displayName: '私影',
        description: '观影体验',
        iconUrl: '',
        backgroundColor: '#A29BFE',
      },
    },
    {
      id: '7',
      name: '喝酒',
      icon: '',
      type: 'drinking',
      enabled: true,
      sortOrder: 7,
      config: {
        displayName: '喝酒',
        description: '酒友聚会',
        iconUrl: '',
        backgroundColor: '#FD79A8',
      },
    },
    {
      id: '8',
      name: '按摩',
      icon: '',
      type: 'massage',
      enabled: true,
      sortOrder: 8,
      config: {
        displayName: '按摩',
        description: '放松身心',
        iconUrl: '',
        backgroundColor: '#00B894',
      },
    },
    {
      id: '9',
      name: '和平精英',
      icon: '',
      type: 'peace_elite',
      enabled: true,
      sortOrder: 9,
      config: {
        displayName: '和平精英',
        description: '吃鸡游戏',
        iconUrl: '',
        backgroundColor: '#FDCB6E',
      },
    },
    {
      id: '10',
      name: '荒野乱斗',
      icon: '',
      type: 'brawl_stars',
      enabled: true,
      sortOrder: 10,
      config: {
        displayName: '荒野乱斗',
        description: '休闲竞技',
        iconUrl: '',
        backgroundColor: '#E17055',
      },
    },
  ]);
  
  const [mockConfig] = React.useState<GridConfig>({
    enabled: true,
    columns: 5,
    rows: 2,
    showLabels: true,
    iconSize: 'medium',
  });
  
  // 过滤和排序服务
  const services = React.useMemo(() => {
    return mockServices
      .filter(isServiceEnabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, mockConfig.columns * mockConfig.rows);
  }, [mockServices, mockConfig]);
  
  // 计算布局信息
  const layoutInfo = React.useMemo(() => {
    return calculateGridLayout(mockConfig.columns, mockConfig.rows);
  }, [mockConfig.columns, mockConfig.rows]);
  
  return {
    services,
    config: mockConfig,
    layoutInfo,
    loading: false,
    error: null,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 服务网格区域业务逻辑Hook
 */
const useServiceGridAreaLogic = (props: ServiceGridAreaProps) => {
  const { onServicePress } = props;
  const { services, config, layoutInfo } = useServiceGridData();
  
  /**
   * 服务点击处理
   */
  const handleServicePress = useCallback((service: ServiceItem) => {
    if (!service.enabled) return;
    
    onServicePress(service.type);
    
    // TODO: 埋点上报
    console.log('服务点击事件', {
      serviceId: service.id,
      serviceType: service.type,
      serviceName: service.name,
      sortOrder: service.sortOrder,
    });
  }, [onServicePress]);
  
  /**
   * 渲染网格项目
   */
  const renderGridItem = useCallback(({ item, index }: { item: ServiceItem; index: number }) => {
    const itemStyle = {
      width: layoutInfo.itemWidth,
      height: layoutInfo.itemHeight,
      marginRight: (index + 1) % config.columns === 0 ? 0 : layoutInfo.spacing,
      marginBottom: Math.floor(index / config.columns) < config.rows - 1 ? layoutInfo.spacing : 0,
    };
    
    return (
      <ServiceGridItem
        service={item}
        onPress={() => handleServicePress(item)}
        style={itemStyle}
        showLabel={config.showLabels}
        iconSize={config.iconSize}
      />
    );
  }, [layoutInfo, config, handleServicePress]);
  
  /**
   * 获取FlatList样式
   */
  const getFlatListStyle = useCallback(() => {
    const totalWidth = layoutInfo.itemWidth * config.columns + 
      layoutInfo.spacing * (config.columns - 1);
    
    return {
      width: totalWidth,
      alignSelf: 'center' as const,
    };
  }, [layoutInfo, config]);
  
  return {
    services,
    config,
    layoutInfo,
    renderGridItem,
    getFlatListStyle,
  };
};

/**
 * 服务网格项目组件
 */
const ServiceGridItem: React.FC<{
  service: ServiceItem;
  onPress: () => void;
  style: any;
  showLabel: boolean;
  iconSize: 'small' | 'medium' | 'large';
}> = ({ service, onPress, style, showLabel, iconSize }) => {
  const iconSizeValue = SIZES.ICON_SIZE[iconSize];
  const isDisabled = !service.enabled;
  
  return (
    <TouchableOpacity
      style={[styles.gridItem, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={formatServiceName(service)}
      accessibilityHint={`打开${formatServiceName(service)}服务`}
      accessibilityState={{ disabled: isDisabled }}
    >
      <Card
        style={[
          styles.serviceCard,
          {
            backgroundColor: isDisabled 
              ? COLORS.DISABLED_BACKGROUND 
              : service.config.backgroundColor || COLORS.CARD_BACKGROUND,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
        variant="elevated"
      >
        {/* 服务图标 */}
        <View style={styles.iconContainer}>
          <Text 
            style={[
              styles.serviceIcon,
              {
                fontSize: iconSizeValue,
                opacity: isDisabled ? 0.5 : 1,
              },
            ]}
          >
            {getServiceIcon(service.type, service.config.iconUrl)}
          </Text>
        </View>
        
        {/* 服务标签 */}
        {showLabel && (
          <View style={styles.labelContainer}>
            <Text 
              style={[
                styles.serviceLabel,
                {
                  color: isDisabled ? COLORS.DISABLED : COLORS.TEXT,
                },
              ]}
              numberOfLines={1}
            >
              {formatServiceName(service)}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

/**
 * ServiceGridArea 主组件
 */
const ServiceGridArea: React.FC<ServiceGridAreaProps> = (props) => {
  const {
    services,
    config,
    layoutInfo,
    renderGridItem,
    getFlatListStyle,
  } = useServiceGridAreaLogic(props);
  
  // 如果配置禁用，不渲染组件
  if (!config.enabled) {
    return null;
  }
  
  // 空状态
  if (services.length === 0) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>暂无服务</Text>
          <Text style={styles.emptySubtitle}>服务正在准备中</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, props.style]}>
      {/* 区域标题 */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>热门服务</Text>
      </View>
      
      {/* 服务网格 */}
      <FlatList
        data={services}
        renderItem={renderGridItem}
        numColumns={config.columns}
        keyExtractor={(item, index) => generateGridItemKey(item, index)}
        style={getFlatListStyle()}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={config.columns * 2}
        updateCellsBatchingPeriod={50}
        windowSize={2}
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
  
  headerContainer: {
    marginBottom: 16,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.SECTION_TITLE,
    color: COLORS.TEXT,
  },
  
  gridContainer: {
    // FlatList内容样式
  },
  
  gridItem: {
    // 网格项目容器
  },
  
  serviceCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.ITEM_PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    minHeight: 80,
  },
  
  iconContainer: {
    marginBottom: 8,
  },
  
  serviceIcon: {
    textAlign: 'center',
  },
  
  labelContainer: {
    alignItems: 'center',
    height: SIZES.LABEL_HEIGHT,
    justifyContent: 'center',
  },
  
  serviceLabel: {
    ...TYPOGRAPHY.LABEL,
    textAlign: 'center',
  },
  
  // 空状态样式
  emptyContainer: {
    height: 160,
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

export default ServiceGridArea;
export type { ServiceGridAreaProps };
// #endregion
