// #region 1. File Banner & TOC
/**
 * ServiceDetailPage - 服务详情页面
 * 
 * 功能描述：通用服务详情页面，支持游戏陪玩和生活服务两大类
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Zustand状态管理
import { useConfigStore, useUserStore } from '../../../../../stores';

// 共享组件
import { Card, ErrorBoundary, LoadingOverlay } from '../../../../components';

// 类型和常量
import { GAME_SERVICE_TAGS, LIFESTYLE_SERVICE_TAGS, SERVICE_DETAIL_CONSTANTS, SERVICE_DETAIL_ROUTES, SERVICE_THEME_MAP, SERVICE_TYPE_MAP } from './constants';
import type { FilterState, ServiceCategory, ServiceDetailPageProps, ServiceType } from './types';
// #endregion

// #region 3. Types & Schema
interface LocalPageState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastRefreshTime: number;
}

interface ServiceInfo {
  serviceType: ServiceType;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceConfig: any;
}
// #endregion

// #region 4. Constants & Config
const { COLORS, SIZES, PAGINATION } = SERVICE_DETAIL_CONSTANTS;
// #endregion

// #region 5. Utils & Helpers
/**
 * 获取服务类别
 */
const getServiceCategory = (serviceType: ServiceType): ServiceCategory => {
  return SERVICE_TYPE_MAP[serviceType]?.category || 'game';
};

/**
 * 获取服务配置
 */
const getServiceInfo = (serviceType: ServiceType): ServiceInfo => {
  const typeInfo = SERVICE_TYPE_MAP[serviceType];
  const themeInfo = SERVICE_THEME_MAP[serviceType];
  
  return {
    serviceType,
    serviceName: typeInfo?.name || '未知服务',
    serviceCategory: typeInfo?.category || 'game',
    serviceConfig: {
      theme: themeInfo,
      tags: typeInfo.category === 'game' 
        ? GAME_SERVICE_TAGS[serviceType as keyof typeof GAME_SERVICE_TAGS] || []
        : LIFESTYLE_SERVICE_TAGS[serviceType as keyof typeof LIFESTYLE_SERVICE_TAGS] || [],
    },
  };
};

/**
 * 格式化价格显示
 */
const formatPrice = (price: number): string => {
  return `¥${price}`;
};

/**
 * 格式化距离显示
 */
const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
};

/**
 * 格式化评分显示
 */
const formatRating = (rating: number, count: number): string => {
  return `${rating.toFixed(1)} (${count > 999 ? `${(count / 1000).toFixed(1)}k` : count})`;
};
// #endregion

// #region 6. State Management
/**
 * 服务详情页面状态管理Hook
 */
const useServiceDetailState = (serviceType: ServiceType) => {
  // Zustand stores
  const { userList, loadUserList } = useUserStore();
  const { componentConfigs, loadComponentConfig } = useConfigStore();
  
  // 本地状态
  const [localState, setLocalState] = useState<LocalPageState>({
    loading: false,
    refreshing: false,
    error: null,
    lastRefreshTime: 0,
  });
  
  // 筛选状态
  const [filterState, setFilterState] = useState<FilterState>({
    sortBy: 'smart',
    gender: 'all',
    selectedTags: [],
    advancedFilters: {
      priceRange: [0, 1000],
      distanceRange: 10,
      ratingMin: 0,
      onlineOnly: false,
      features: [],
    },
  });
  
  // 服务信息
  const serviceInfo = useMemo(() => getServiceInfo(serviceType), [serviceType]);
  
  // 过滤和排序后的服务提供者
  const filteredProviders = useMemo(() => {
    let providers = userList.data;
    
    // 性别筛选
    if (filterState.gender !== 'all') {
      providers = providers.filter(p => p.gender === filterState.gender);
    }
    
    // 在线状态筛选
    if (filterState.advancedFilters.onlineOnly) {
      providers = providers.filter(p => p.isOnline);
    }
    
    // 评分筛选
    if (filterState.advancedFilters.ratingMin > 0) {
      providers = providers.filter(p => p.rating >= filterState.advancedFilters.ratingMin);
    }
    
    // 价格筛选
    const [minPrice, maxPrice] = filterState.advancedFilters.priceRange;
    providers = providers.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // 排序
    switch (filterState.sortBy) {
      case 'price':
        providers = [...providers].sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        providers = [...providers].sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        providers = [...providers].sort((a, b) => 
          (a.location.distance || 0) - (b.location.distance || 0)
        );
        break;
      default: // smart
        break;
    }
    
    return providers;
  }, [userList.data, filterState]);
  
  return {
    // 状态
    localState,
    setLocalState,
    filterState,
    setFilterState,
    serviceInfo,
    userList,
    filteredProviders,
    componentConfigs,
    
    // 操作方法
    loadUserList,
    loadComponentConfig,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 服务详情页面业务逻辑Hook
 */
const useServiceDetailLogic = (serviceType: ServiceType) => {
  const router = useRouter();
  const {
    localState,
    setLocalState,
    filterState,
    setFilterState,
    serviceInfo,
    filteredProviders,
    loadUserList,
    loadComponentConfig,
  } = useServiceDetailState(serviceType);
  
  /**
   * 初始化页面数据
   */
  const initializePageData = useCallback(async () => {
    try {
      setLocalState(prev => ({ ...prev, loading: true, error: null }));
      
      await Promise.all([
        loadComponentConfig('service-detail-page'),
        loadUserList({ 
          page: 1, 
          limit: PAGINATION.PAGE_SIZE,
          filters: {
            serviceType: serviceType,
          }
        }),
      ]);
      
      setLocalState(prev => ({ 
        ...prev, 
        loading: false,
        lastRefreshTime: Date.now()
      }));
      
    } catch (error) {
      setLocalState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : '加载失败'
      }));
    }
  }, [serviceType, loadComponentConfig, loadUserList]);
  
  /**
   * 下拉刷新
   */
  const handleRefresh = useCallback(async () => {
    setLocalState(prev => ({ ...prev, refreshing: true }));
    try {
      await initializePageData();
    } finally {
      setLocalState(prev => ({ ...prev, refreshing: false }));
    }
  }, [initializePageData]);
  
  /**
   * 筛选变更
   */
  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  }, []);
  
  /**
   * 点击服务提供者
   */
  const handleProviderPress = useCallback((providerId: string) => {
    router.push({
      pathname: SERVICE_DETAIL_ROUTES.USER_DETAIL as any,
      params: { userId: providerId, serviceType }
    });
  }, [router, serviceType]);
  
  /**
   * 点击筛选
   */
  const handleFilterPress = useCallback(() => {
    const filterRoute = serviceInfo.serviceCategory === 'game' 
      ? SERVICE_DETAIL_ROUTES.FILTER_ONLINE 
      : SERVICE_DETAIL_ROUTES.FILTER_OFFLINE;
    
    router.push(filterRoute as any);
  }, [router, serviceInfo.serviceCategory]);
  
  /**
   * 返回
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  return {
    // 状态
    localState,
    serviceInfo,
    filterState,
    filteredProviders,
    
    // 方法
    initializePageData,
    handleRefresh,
    handleFilterChange,
    handleProviderPress,
    handleFilterPress,
    handleBack,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 导航区域组件
 */
const ServiceNavigationArea: React.FC<{
  serviceName: string;
  onBack: () => void;
  onSearch?: () => void;
}> = ({ serviceName, onBack, onSearch }) => (
  <View style={styles.navigationArea}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
    <Text style={styles.navigationTitle}>{serviceName}</Text>
    {onSearch && (
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>🔍</Text>
      </TouchableOpacity>
    )}
  </View>
);

/**
 * 筛选工具栏组件
 */
const ServiceFilterToolbar: React.FC<{
  filterState: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onAdvancedFilter: () => void;
}> = ({ filterState, onFilterChange, onAdvancedFilter }) => (
  <View style={styles.filterToolbar}>
    <TouchableOpacity
      style={[styles.filterButton, filterState.sortBy === 'smart' && styles.filterButtonActive]}
      onPress={() => onFilterChange('sortBy', 'smart')}
    >
      <Text style={styles.filterButtonText}>智能排序</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={[styles.filterButton, filterState.sortBy === 'price' && styles.filterButtonActive]}
      onPress={() => onFilterChange('sortBy', 'price')}
    >
      <Text style={styles.filterButtonText}>价格</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={[styles.filterButton, filterState.sortBy === 'rating' && styles.filterButtonActive]}
      onPress={() => onFilterChange('sortBy', 'rating')}
    >
      <Text style={styles.filterButtonText}>评分</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={[styles.filterButton, filterState.sortBy === 'distance' && styles.filterButtonActive]}
      onPress={() => onFilterChange('sortBy', 'distance')}
    >
      <Text style={styles.filterButtonText}>距离</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.advancedFilterButton} onPress={onAdvancedFilter}>
      <Text style={styles.advancedFilterText}>筛选</Text>
    </TouchableOpacity>
  </View>
);

/**
 * 服务提供者卡片组件
 */
const ProviderCard: React.FC<{
  provider: any;
  serviceCategory: ServiceCategory;
  onPress: () => void;
}> = ({ provider, serviceCategory, onPress }) => (
  <TouchableOpacity style={styles.providerCard} onPress={onPress} activeOpacity={0.9}>
    <Card style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        {/* 头像区域 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarPlaceholder}>👤</Text>
            </View>
            <View style={[
              styles.statusDot,
              { backgroundColor: provider.isOnline ? COLORS.ONLINE : COLORS.OFFLINE }
            ]} />
          </View>
        </View>
        
        {/* 用户信息区域 */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{provider.name}</Text>
          <Text style={styles.userLocation}>
            📍 {provider.location.city} · {formatDistance(provider.location.distance || 0)}
          </Text>
          <Text style={styles.userRating}>
            ⭐ {formatRating(provider.rating, provider.reviewCount)}
          </Text>
        </View>
        
        {/* 价格区域 */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(provider.price)}</Text>
          <Text style={styles.priceUnit}>/小时</Text>
        </View>
      </View>
      
      {/* 标签区域 */}
      <View style={styles.tagsSection}>
        {provider.tags.slice(0, 3).map((tag: string, index: number) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      {/* 描述区域 */}
      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>
    </Card>
  </TouchableOpacity>
);

/**
 * ServiceDetailPage 主组件
 */
const ServiceDetailPage: React.FC<ServiceDetailPageProps> = (props) => {
  // 从路由参数获取服务类型（如果是路由调用）
  const params = useLocalSearchParams<{ serviceType: string }>();
  const serviceType = (props.serviceType || params.serviceType || 'honor_of_kings') as ServiceType;
  
  const {
    localState,
    serviceInfo,
    filterState,
    filteredProviders,
    initializePageData,
    handleRefresh,
    handleFilterChange,
    handleProviderPress,
    handleFilterPress,
    handleBack,
  } = useServiceDetailLogic(serviceType);
  
  // 页面初始化
  useEffect(() => {
    initializePageData();
  }, [initializePageData]);
  
  // 加载状态
  if (localState.loading && filteredProviders.length === 0) {
    return (
      <LoadingOverlay
        loading={localState.loading}
        text="加载服务信息..."
      />
    );
  }
  
  // 错误状态
  if (localState.error && filteredProviders.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{localState.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializePageData}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* 导航区域 */}
        <ServiceNavigationArea
          serviceName={serviceInfo.serviceName}
          onBack={handleBack}
        />
        
        {/* 筛选工具栏 */}
        <ServiceFilterToolbar
          filterState={filterState}
          onFilterChange={handleFilterChange}
          onAdvancedFilter={handleFilterPress}
        />
        
        {/* 服务提供者列表 */}
        <FlatList
          data={filteredProviders}
          renderItem={({ item }) => (
            <ProviderCard
              provider={item}
              serviceCategory={serviceInfo.serviceCategory}
              onPress={() => handleProviderPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={localState.refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.PRIMARY}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>暂无服务提供者</Text>
              <Text style={styles.emptySubtitle}>试试调整筛选条件</Text>
            </View>
          }
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
    </ErrorBoundary>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 导航区域样式
  navigationArea: {
    height: SIZES.NAVIGATION_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT,
  },
  navigationTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  
  // 筛选工具栏样式
  filterToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.FILTER_BAR_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.SURFACE,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  advancedFilterButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.SURFACE,
  },
  advancedFilterText: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  
  // 列表样式
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  
  // 提供者卡片样式
  providerCard: {
    marginBottom: SIZES.CARD_SPACING,
  },
  cardContainer: {
    padding: SIZES.CARD_PADDING,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  
  // 头像样式
  avatarSection: {
    marginRight: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.AVATAR_SIZE / 2,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    fontSize: 24,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: SIZES.STATUS_DOT_SIZE,
    height: SIZES.STATUS_DOT_SIZE,
    borderRadius: SIZES.STATUS_DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
  },
  
  // 用户信息样式
  userInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  userLocation: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  userRating: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 价格样式
  priceSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 标签样式
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.BACKGROUND,
  },
  
  // 描述样式
  description: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  
  // 空状态样式
  emptyState: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 错误状态样式
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
  },
});

export default ServiceDetailPage;
export type { ServiceDetailPageProps };
// #endregion
