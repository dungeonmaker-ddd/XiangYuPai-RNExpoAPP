// #region 1. File Banner & TOC
/**
 * MainPage - 首页主页面
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
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native';

// Zustand状态管理
import {
    useConfigStore,
    useHomepageStore,
    useLocationStore,
    useUserStore,
} from '../../../../stores';

// 区域组件
import {
    EventCenterArea,
    FeaturedUsersArea,
    GameBannerArea,
    ServiceGridArea,
    TopFunctionArea,
    UserListArea,
} from './components';

// 共享组件
import { ErrorBoundary, LoadingOverlay } from '../../../components';

// 类型和常量
import { MAIN_PAGE_CONSTANTS } from './constants';
import { styles } from './styles';
import { MainPageProps } from './types';

// 调试工具（开发环境）
if (__DEV__) {
  import('../../../utils/debug-asyncstorage');
}
// #endregion

// #region 3. Types & Schema
interface MainPageState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastRefreshTime: number;
}

interface PageSection {
  id: string;
  name: string;
  component: React.ComponentType;
  enabled: boolean;
  loading: boolean;
}
// #endregion

// #region 4. Constants & Config
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分钟
const SCROLL_THRESHOLD = 100;
const PAGE_SECTIONS = [
  'topFunction',
  'gameBanner', 
  'serviceGrid',
  'featuredUsers',
  'eventCenter',
  'userList'
] as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 检查是否需要刷新数据
 */
const shouldRefreshData = (lastRefreshTime: number): boolean => {
  return Date.now() - lastRefreshTime > REFRESH_THRESHOLD;
};

/**
 * 格式化错误信息
 */
const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return '页面加载失败，请重试';
};

/**
 * 生成页面埋点数据
 */
const generateTrackingData = (section: string, action: string) => ({
  page: 'main_page',
  section,
  action,
  timestamp: Date.now()
});
// #endregion

// #region 6. State Management
/**
 * 主页面状态管理Hook
 */
const useMainPageState = () => {
  // Zustand stores
  const {
    pageConfig,
    pageData,
    userInteraction,
    loading: homepageLoading,
    error: homepageError,
    loadPageConfig,
    loadPageData,
    updateUserInteraction,
    resetPageState
  } = useHomepageStore();
  
  const {
    userList,
    loadUserList,
    loadMoreUsers,
    refreshUserList,
  } = useUserStore();
  
  const {
    currentLocation,
    updateLocation,
  } = useLocationStore();
  
  const {
    componentConfigs,
    loadComponentConfig,
  } = useConfigStore();
  
  // 本地状态
  const [localState, setLocalState] = React.useState<MainPageState>({
    loading: false,
    refreshing: false,
    error: null,
    lastRefreshTime: 0
  });
  
  // 页面配置计算
  const pageConfiguration = useMemo(() => ({
    sections: PAGE_SECTIONS.map(sectionId => ({
      id: sectionId,
      enabled: pageConfig?.[sectionId]?.enabled ?? true,
      loading: homepageLoading?.pageConfig ?? false
    }))
  }), [pageConfig, homepageLoading]);
  
  // 页面数据状态
  const pageDataState = useMemo(() => ({
    hasData: !!pageData && Object.keys(pageData).length > 0,
    totalSections: PAGE_SECTIONS.length,
    loadedSections: pageData ? Object.keys(pageData).length : 0
  }), [pageData]);
  
  return {
    // Zustand状态
    pageConfig,
    pageData,
    userInteraction,
    userList,
    currentLocation,
    componentConfigs,
    homepageLoading,
    homepageError,
    
    // 本地状态
    localState,
    setLocalState,
    pageConfiguration,
    pageDataState,
    
    // Zustand操作方法
    loadPageConfig,
    loadPageData,
    updateUserInteraction,
    loadUserList,
    loadMoreUsers,
    refreshUserList,
    updateLocation,
    loadComponentConfig,
    resetPageState
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 主页面业务逻辑Hook
 */
const useMainPageLogic = () => {
  const router = useRouter();
  const {
    localState,
    setLocalState,
    pageDataState,
    loadPageConfig,
    loadPageData,
    loadUserList,
    updateLocation,
    loadComponentConfig,
  } = useMainPageState();
  
  /**
   * 初始化页面数据
   */
  const initializePageData = useCallback(async () => {
    try {
      setLocalState(prev => ({ ...prev, loading: true, error: null }));
      
      // 并行加载页面数据
      await Promise.all([
        loadComponentConfig('main-page'),
        loadPageConfig(),
        loadPageData(),
        loadUserList({ page: 1, limit: 20 }),
        updateLocation()
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
        error: formatErrorMessage(error)
      }));
    }
  }, [loadComponentConfig, loadPageConfig, loadPageData, loadUserList, updateLocation]);
  
  /**
   * 下拉刷新处理
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
   * 导航处理
   */
  const handleNavigation = useCallback((route: string, params?: Record<string, any>) => {
    if (params) {
      router.push({ pathname: route as any, params });
    } else {
      router.push(route as any);
    }
  }, [router]);
  
  /**
   * 错误重试处理
   */
  const handleRetry = useCallback(() => {
    initializePageData();
  }, [initializePageData]);
  
  /**
   * 页面焦点处理
   */
  const handlePageFocus = useCallback(() => {
    // 检查是否需要刷新数据
    if (shouldRefreshData(localState.lastRefreshTime)) {
      initializePageData();
    }
  }, [localState.lastRefreshTime, initializePageData]);
  
  return {
    // 状态
    loading: localState.loading,
    refreshing: localState.refreshing,
    error: localState.error,
    pageDataState,
    
    // 操作方法
    initializePageData,
    handleRefresh,
    handleNavigation,
    handleRetry,
    handlePageFocus
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * MainPage 主组件
 */
const MainPage: React.FC<MainPageProps> = (props) => {
  const {
    loading,
    refreshing,
    error,
    pageDataState,
    initializePageData,
    handleRefresh,
    handleNavigation,
    handleRetry,
    handlePageFocus
  } = useMainPageLogic();
  
  // 页面生命周期
  useEffect(() => {
    initializePageData();
  }, [initializePageData]);
  
  // 页面焦点处理
  useFocusEffect(
    useCallback(() => {
      handlePageFocus();
    }, [handlePageFocus])
  );
  
  // 错误状态渲染
  if (error && !pageDataState.hasData) {
    return (
      <ErrorBoundary
        onError={(error: Error, errorInfo: any) => {
          console.error('MainPage Error:', error, errorInfo);
        }}
        style={styles.errorContainer}
      >
        <LoadingOverlay
          loading={false}
          text={error}
          style={styles.errorContainer}
        />
      </ErrorBoundary>
    );
  }
  
  // 加载状态渲染
  if (loading && !pageDataState.hasData) {
    return (
      <LoadingOverlay
        loading={loading}
        text="正在加载首页..."
        style={styles.loadingContainer}
      />
    );
  }
  
  return (
    <ErrorBoundary>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={MAIN_PAGE_CONSTANTS.COLORS.PRIMARY}
        translucent
      />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={MAIN_PAGE_CONSTANTS.COLORS.PRIMARY}
            title="下拉刷新"
          />
        }
      >
        {/* 顶部功能区域 */}
        <TopFunctionArea
          onLocationPress={() => handleNavigation('/(tabs)/homepage/location')}
          onSearchPress={() => handleNavigation('/(tabs)/homepage/search')}
        />
        
        {/* 游戏横幅区域 */}
        <GameBannerArea
          onBannerPress={(gameId) => 
            handleNavigation('/(tabs)/homepage/service-detail', { serviceType: gameId })
          }
        />
        
        {/* 服务网格区域 */}
        <ServiceGridArea
          onServicePress={(serviceType) =>
            handleNavigation('/(tabs)/homepage/service-detail', { serviceType })
          }
        />
        
        {/* 限时专享区域 */}
        <FeaturedUsersArea
          onUserPress={(userId) =>
            handleNavigation('/modal/user-detail', { userId })
          }
          onMorePress={() => handleNavigation('/(tabs)/homepage/featured')}
        />
        
        {/* 组队聚会区域 */}
        <EventCenterArea
          onEventPress={() => handleNavigation('/(tabs)/homepage/event-center')}
        />
        
        {/* 用户列表区域 */}
        <UserListArea
          onUserPress={(userId) =>
            handleNavigation('/modal/user-detail', { userId })
          }
          onFilterPress={() => handleNavigation('/(tabs)/homepage/filter-online')}
        />
      </ScrollView>
      
      {/* 浮动发布按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleNavigation('/publish')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="发布内容"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </ErrorBoundary>
  );
};
// #endregion

// #region 9. Exports
export default MainPage;
export type { MainPageProps, MainPageState };
// #endregion
