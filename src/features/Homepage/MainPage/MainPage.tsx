// #region 1. File Banner & TOC
/**
 * MainPage - 首页主页面
 * 
 * 功能：
 * - 首页区域展示（顶部导航、游戏横幅、功能网格、限时专享、组队聚会）
 * - 用户列表展示（筛选、排序、无限滚动）
 * - 下拉刷新和状态管理
 * - 导航和交互处理
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
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// 类型和常量
import { COLORS } from './constants';
import type { UserCard } from './types';

// 区域组件
import {
  FilterTabsArea,
  FunctionGridArea,
  GameBannerArea,
  HeaderArea,
  LimitedOffersArea,
  TeamPartyArea,
  UserListArea,
} from './components';

// 状态管理Hooks
import { useHomeState } from './useHomeState';

// TODO: API集成（后续）
// import * as homepageApi from '../../api/homepageApi';
// #endregion

// #region 3. Types & Schema
interface MainPageProps {
  initialFilter?: string;
  initialRegion?: string;
}
// #endregion

// #region 4. Constants & Config
const PAGE_CONFIG = {
  INITIAL_LOAD_DELAY: 500,
  REFRESH_COOLDOWN: 3000,
  FAB_SIZE: 56,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};
// #endregion

// #region 6. State Management
/**
 * MainPage状态管理（使用useHomeState Hook）
 */
// 状态管理已移至 useHomeState.ts
// #endregion

// #region 7. Domain Logic
/**
 * MainPage业务逻辑Hook
 */
const useMainPageLogic = (props: MainPageProps) => {
  const router = useRouter();
  
  // 使用状态管理Hook
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    handleSearch,
    handleRefresh,
  } = useHomeState();
  
  /**
   * 位置选择处理
   */
  const handleLocationPress = useCallback(() => {
    router.push('/(tabs)/homepage/location');
  }, [router]);
  
  /**
   * 搜索页面跳转
   */
  const handleSearchPress = useCallback(() => {
    router.push('/(tabs)/homepage/search');
  }, [router]);
  
  /**
   * 游戏横幅点击
   */
  const handleGameBannerPress = useCallback(() => {
    router.push({
      pathname: '/(tabs)/homepage/service-detail',
      params: { serviceType: 'game' },
    });
  }, [router]);
  
  /**
   * 功能点击处理
   */
  const handleFunctionPress = useCallback((functionId: string) => {
    router.push({
      pathname: '/(tabs)/homepage/service-detail',
      params: { serviceType: functionId },
    });
  }, [router]);
  
  /**
   * 用户点击处理
   */
  const handleUserPress = useCallback((user: UserCard) => {
    router.push({
      pathname: '/modal/user-detail',
      params: { userId: user.id },
    });
  }, [router]);
  
  /**
   * 查看更多专享
   */
  const handleMoreOffersPress = useCallback(() => {
    router.push('/(tabs)/homepage/featured');
  }, [router]);
  
  /**
   * 组局中心点击
   */
  const handleTeamPartyPress = useCallback(() => {
    router.push('/(tabs)/homepage/event-center');
  }, [router]);
  
  /**
   * 发布按钮点击
   */
  const handlePublishPress = useCallback(() => {
    router.push('/publish');
  }, [router]);
  
  return {
    // 状态
    searchQuery,
    activeFilter,
    activeRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    
    // 事件处理
    setSearchQuery,
    setActiveFilter,
    setActiveRegion,
    handleSearch,
    handleRefresh,
    handleLocationPress,
    handleSearchPress,
    handleGameBannerPress,
    handleFunctionPress,
    handleUserPress,
    handleMoreOffersPress,
    handleTeamPartyPress,
    handlePublishPress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * MainPage主组件
 */
const MainPage: React.FC<MainPageProps> = (props) => {
  const {
    searchQuery,
    activeFilter,
    activeRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    setSearchQuery,
    setActiveFilter,
    setActiveRegion,
    handleSearch,
    handleRefresh,
    handleLocationPress,
    handleSearchPress,
    handleGameBannerPress,
    handleFunctionPress,
    handleUserPress,
    handleMoreOffersPress,
    handleTeamPartyPress,
    handlePublishPress,
  } = useMainPageLogic(props);
  
  // 列表头部组件 - 包含所有顶部区域（包括 Header）
  const renderListHeader = useMemo(() => (
    <ImageBackground
      source={require('../../../../assets/images/images/backgrounds/linearGradint.png')}
      style={styles.upperAreaBackground}
      resizeMode="stretch"
    >
      {/* 顶部导航区域 */}
      <HeaderArea
        location={location}
        onLocationPress={handleLocationPress}
        onSearch={handleSearch}
        onSearchPress={handleSearchPress}
      />
      
      {/* 游戏横幅区域 */}
      <GameBannerArea onPress={handleGameBannerPress} />
      
      {/* 功能服务网格区域 */}
      <FunctionGridArea onFunctionPress={handleFunctionPress} />
      
      {/* 限时专享区域 */}
      <LimitedOffersArea
        offers={limitedOffers}
        onUserPress={handleUserPress}
        onMorePress={handleMoreOffersPress}
      />
      
      {/* 组队聚会区域 */}
      <TeamPartyArea
        onPress={handleTeamPartyPress}
        onMorePress={handleTeamPartyPress}
      />
      
      {/* 筛选标签栏区域 */}
      <FilterTabsArea
        activeTab={activeFilter}
        onTabPress={setActiveFilter}
        activeRegion={activeRegion}
        onRegionPress={setActiveRegion}
      />
    </ImageBackground>
  ), [
    location,
    handleLocationPress,
    handleSearch,
    handleSearchPress,
    handleGameBannerPress,
    handleFunctionPress,
    limitedOffers,
    handleUserPress,
    handleMoreOffersPress,
    handleTeamPartyPress,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
  ]);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent />
      
      {/* 用户列表区域（包含所有内容的统一滚动） */}
      <UserListArea
        users={users}
        loading={loading}
        onUserPress={handleUserPress}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={renderListHeader}
      />
      
      {/* 浮动发布按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePublishPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="发布内容"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  upperAreaBackground: {
    width: '100%',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: PAGE_CONFIG.FAB_SIZE,
    height: PAGE_CONFIG.FAB_SIZE,
    borderRadius: PAGE_CONFIG.FAB_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default MainPage;
export type { MainPageProps };
// #endregion

