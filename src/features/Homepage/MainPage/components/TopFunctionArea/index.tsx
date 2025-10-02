// #region 1. File Banner & TOC
/**
 * TopFunctionArea - 顶部功能区域组件
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
import React, { useCallback, useMemo } from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: 导入实际的store hooks
// import { useCurrentLocation, useLocationPermission } from '../../../../../stores';
// import { useUserInteraction } from '../../../../../stores';

// 导入共享组件
// #endregion

// #region 3. Types & Schema
interface TopFunctionAreaProps {
  onLocationPress: () => void;
  onSearchPress: () => void;
  style?: StyleProp<ViewStyle>;
}

interface LocationDisplayData {
  cityName: string;
  districtName?: string;
  isLocating: boolean;
  hasPermission: boolean;
}

interface SearchBarState {
  placeholder: string;
  recentSearches: string[];
  hotKeywords: string[];
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#6366F1',
  BACKGROUND_GRADIENT: ['#6366F1', '#8B5CF6'],
  WHITE: '#FFFFFF',
  WHITE_ALPHA_80: 'rgba(255, 255, 255, 0.8)',
  WHITE_ALPHA_60: 'rgba(255, 255, 255, 0.6)',
  WHITE_ALPHA_40: 'rgba(255, 255, 255, 0.4)',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const;

const SIZES = {
  HEIGHT: 120,
  SAFE_AREA_HEIGHT: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  BORDER_RADIUS: 12,
  ICON_SIZE: 24,
  LOCATION_HEIGHT: 36,
  SEARCH_HEIGHT: 40,
} as const;

const TYPOGRAPHY = {
  LOCATION_TITLE: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  LOCATION_SUBTITLE: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  SEARCH_PLACEHOLDER: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
} as const;

const ANIMATION_DURATION = 200;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化位置显示文本
 */
const formatLocationText = (location: LocationDisplayData): { title: string; subtitle: string } => {
  if (location.isLocating) {
    return {
      title: '定位中...',
      subtitle: '正在获取位置信息',
    };
  }
  
  if (!location.hasPermission) {
    return {
      title: '点击选择位置',
      subtitle: '未开启定位权限',
    };
  }
  
  if (!location.cityName) {
    return {
      title: '选择城市',
      subtitle: '请选择您的城市',
    };
  }
  
  return {
    title: location.cityName,
    subtitle: location.districtName || '点击切换区域',
  };
};

/**
 * 生成搜索框占位符
 */
const generateSearchPlaceholder = (hotKeywords: string[]): string => {
  if (hotKeywords.length === 0) {
    return '搜索用户、服务或地点';
  }
  
  const randomKeyword = hotKeywords[Math.floor(Math.random() * hotKeywords.length)];
  return `搜索"${randomKeyword}"试试`;
};

/**
 * 获取状态栏高度
 */
const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
};

/**
 * 生成触觉反馈
 */
const triggerHapticFeedback = () => {
  // TODO: 实现触觉反馈
  // import { Haptics } from 'expo-haptics';
  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  console.log('触觉反馈触发');
};
// #endregion

// #region 6. State Management
/**
 * 顶部功能区域状态管理Hook
 */
const useTopFunctionAreaState = () => {
  // TODO: 集成实际的Zustand stores
  // const currentLocation = useCurrentLocation();
  // const locationPermission = useLocationPermission();
  // const userInteraction = useUserInteraction();
  
  // 模拟状态数据
  const [mockLocationData] = React.useState<LocationDisplayData>({
    cityName: '北京',
    districtName: '朝阳区',
    isLocating: false,
    hasPermission: true,
  });
  
  const [mockSearchState] = React.useState<SearchBarState>({
    placeholder: '搜索用户、服务或地点',
    recentSearches: ['王者荣耀', '探店', 'K歌'],
    hotKeywords: ['王者荣耀', '英雄联盟', '探店', 'K歌', '台球'],
  });
  
  // 计算位置显示数据
  const locationDisplay = useMemo(() => {
    return formatLocationText(mockLocationData);
  }, [mockLocationData]);
  
  // 计算搜索框占位符
  const searchPlaceholder = useMemo(() => {
    return generateSearchPlaceholder(mockSearchState.hotKeywords);
  }, [mockSearchState.hotKeywords]);
  
  return {
    locationData: mockLocationData,
    locationDisplay,
    searchState: mockSearchState,
    searchPlaceholder,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 顶部功能区域业务逻辑Hook
 */
const useTopFunctionAreaLogic = (props: TopFunctionAreaProps) => {
  const { onLocationPress, onSearchPress } = props;
  const { locationData, locationDisplay, searchPlaceholder } = useTopFunctionAreaState();
  
  /**
   * 位置点击处理
   */
  const handleLocationPress = useCallback(() => {
    triggerHapticFeedback();
    onLocationPress();
    
    // TODO: 埋点上报
    console.log('位置点击事件', {
      currentLocation: locationData.cityName,
      hasPermission: locationData.hasPermission,
    });
  }, [onLocationPress, locationData]);
  
  /**
   * 搜索点击处理
   */
  const handleSearchPress = useCallback(() => {
    triggerHapticFeedback();
    onSearchPress();
    
    // TODO: 埋点上报
    console.log('搜索点击事件', {
      placeholder: searchPlaceholder,
    });
  }, [onSearchPress, searchPlaceholder]);
  
  /**
   * 获取位置图标名称
   */
  const getLocationIcon = useCallback(() => {
    if (locationData.isLocating) return '🔄';
    if (!locationData.hasPermission) return '📍';
    return '📍';
  }, [locationData]);
  
  /**
   * 获取搜索图标
   */
  const getSearchIcon = useCallback(() => {
    return '🔍';
  }, []);
  
  return {
    locationDisplay,
    searchPlaceholder,
    handleLocationPress,
    handleSearchPress,
    getLocationIcon,
    getSearchIcon,
    isLocationLoading: locationData.isLocating,
    hasLocationPermission: locationData.hasPermission,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 位置选择器组件
 */
const LocationSelector: React.FC<{
  locationDisplay: { title: string; subtitle: string };
  onPress: () => void;
  isLoading: boolean;
  hasPermission: boolean;
  icon: string;
}> = ({ locationDisplay, onPress, isLoading, hasPermission, icon }) => {
  const iconOpacity = isLoading ? 0.6 : 1;
  const textOpacity = hasPermission ? 1 : 0.8;
  
  return (
    <TouchableOpacity 
      style={styles.locationContainer}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`当前位置: ${locationDisplay.title}`}
      accessibilityHint="点击选择或更改位置"
    >
      <View style={styles.locationIconContainer}>
        <Text style={[styles.locationIcon, { opacity: iconOpacity }]}>
          {icon}
        </Text>
      </View>
      
      <View style={styles.locationTextContainer}>
        <Text 
          style={[styles.locationTitle, { opacity: textOpacity }]}
          numberOfLines={1}
        >
          {locationDisplay.title}
        </Text>
        <Text 
          style={[styles.locationSubtitle, { opacity: textOpacity * 0.8 }]}
          numberOfLines={1}
        >
          {locationDisplay.subtitle}
        </Text>
      </View>
      
      <View style={styles.locationArrowContainer}>
        <Text style={styles.locationArrow}>▼</Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * 搜索栏组件
 */
const SearchBarContainer: React.FC<{
  placeholder: string;
  onPress: () => void;
  icon: string;
}> = ({ placeholder, onPress, icon }) => {
  return (
    <TouchableOpacity 
      style={styles.searchContainer}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="search"
      accessibilityLabel="搜索"
      accessibilityHint="点击打开搜索页面"
    >
      <View style={styles.searchIconContainer}>
        <Text style={styles.searchIcon}>{icon}</Text>
      </View>
      
      <View style={styles.searchTextContainer}>
        <Text style={styles.searchPlaceholder} numberOfLines={1}>
          {placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * TopFunctionArea 主组件
 */
const TopFunctionArea: React.FC<TopFunctionAreaProps> = (props) => {
  const insets = useSafeAreaInsets();
  const {
    locationDisplay,
    searchPlaceholder,
    handleLocationPress,
    handleSearchPress,
    getLocationIcon,
    getSearchIcon,
    isLocationLoading,
    hasLocationPermission,
  } = useTopFunctionAreaLogic(props);
  
  const containerStyle = [
    styles.container,
    {
      paddingTop: Math.max(insets.top, SIZES.SAFE_AREA_HEIGHT),
    },
    props.style,
  ];
  
  return (
    <View style={containerStyle}>
      {/* 状态栏背景 */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.BACKGROUND}
        translucent
      />
      
      {/* 主要功能区域 */}
      <View style={styles.contentContainer}>
        {/* 位置选择器 */}
        <LocationSelector
          locationDisplay={locationDisplay}
          onPress={handleLocationPress}
          isLoading={isLocationLoading}
          hasPermission={hasLocationPermission}
          icon={getLocationIcon()}
        />
        
        {/* 搜索栏 */}
        <SearchBarContainer
          placeholder={searchPlaceholder}
          onPress={handleSearchPress}
          icon={getSearchIcon()}
        />
      </View>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SIZES.PADDING_HORIZONTAL,
    paddingBottom: SIZES.PADDING_VERTICAL,
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SIZES.PADDING_VERTICAL,
  },
  
  // 位置选择器样式
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_ALPHA_40,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: SIZES.LOCATION_HEIGHT,
    flex: 1,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.SHADOW,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  locationIconContainer: {
    marginRight: 8,
  },
  
  locationIcon: {
    fontSize: 16,
  },
  
  locationTextContainer: {
    flex: 1,
  },
  
  locationTitle: {
    ...TYPOGRAPHY.LOCATION_TITLE,
    color: COLORS.WHITE,
  },
  
  locationSubtitle: {
    ...TYPOGRAPHY.LOCATION_SUBTITLE,
    color: COLORS.WHITE_ALPHA_80,
  },
  
  locationArrowContainer: {
    marginLeft: 8,
  },
  
  locationArrow: {
    fontSize: 10,
    color: COLORS.WHITE_ALPHA_80,
  },
  
  // 搜索栏样式
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: SIZES.SEARCH_HEIGHT,
    width: SCREEN_WIDTH * 0.35,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.SHADOW,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  searchIconContainer: {
    marginRight: 8,
  },
  
  searchIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  searchTextContainer: {
    flex: 1,
  },
  
  searchPlaceholder: {
    ...TYPOGRAPHY.SEARCH_PLACEHOLDER,
    color: '#9CA3AF',
  },
});

export default TopFunctionArea;
export type { TopFunctionAreaProps };
// #endregion
