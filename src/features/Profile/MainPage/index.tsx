// #region 1. File Banner & TOC
/**
 * MainPage - 个人主页主页面
 * 
 * 功能：
 * - 用户资料展示
 * - 四Tab切换（动态/收藏/点赞/资料）
 * - 社交数据展示
 * - 背景头图展示
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
import React, { useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Store
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

// 类型和常量
import type { TabType } from '../types';
import { COLORS } from './constants';
import type { MainPageProps } from './types';

// 区域组件
import ProfileSkeleton from './ProfileSkeleton';
import TabContentArea from './TabContentArea';
import TabNavigationArea from './TabNavigationArea';
import UnauthenticatedArea from './UnauthenticatedArea';
import UnifiedHeaderArea from './UnifiedHeaderArea';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
// (工具函数移至Store层)
// #endregion

// #region 6. State Management
/**
 * MainPage状态管理
 * 使用Zustand Store管理用户资料数据
 */
const useMainPageState = (props: MainPageProps) => {
  // 从Store获取状态
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const activeTab = useProfileStore((state) => state.activeTab);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  
  // 🆕 从AuthStore获取认证状态
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  // 获取Actions
  const setActiveTab = useProfileStore((state) => state.setActiveTab);
  const loadUserProfile = useProfileStore((state) => state.loadUserProfile);
  const followUser = useProfileStore((state) => state.followUser);
  const unfollowUser = useProfileStore((state) => state.unfollowUser);
  
  // 判断是否是自己的主页
  const isOwnProfile = !props.userId || props.userId === 'current-user';
  
  // 初始化Tab（如果props指定了初始Tab）
  useEffect(() => {
    if (props.initialTab && props.initialTab !== activeTab) {
      setActiveTab(props.initialTab);
    }
  }, [props.initialTab, activeTab, setActiveTab]);
  
  // 🆕 加载用户资料 - 只在已登录时加载
  useEffect(() => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 MainPage - 用户资料加载检查');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   是否已初始化:', isInitialized);
    console.log('   是否已登录:', isAuthenticated);
    console.log('   传入的 userId:', props.userId || '(未传入)');
    console.log('   是否本人主页:', isOwnProfile);
    console.log('   当前用户信息:', currentProfile ? `已加载 (${currentProfile.nickname})` : '未加载');
    
    // 🎯 只有在已登录时才加载用户资料
    if (isInitialized && isAuthenticated) {
      console.log('   ✅ 已登录，准备加载用户资料');
      console.log('   📊 调用 loadUserProfile:', props.userId || '(当前用户)');
      
      // 🔥 强制加载，即使已有数据
      console.log('   🚀 [DEBUG] 开始执行 loadUserProfile...');
      loadUserProfile(props.userId);
      console.log('   🚀 [DEBUG] loadUserProfile 调用完成（异步）');
    } else if (isInitialized && !isAuthenticated) {
      console.log('   ⚠️ 未登录，跳过加载资料');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }, [props.userId, isInitialized, isAuthenticated]);
  // ⚠️ 移除 loadUserProfile 依赖，避免无限循环
  
  return {
    activeTab,
    setActiveTab,
    userInfo: currentProfile,
    loading,
    error,
    isOwnProfile,
    followUser,
    unfollowUser,
    loadUserProfile,
    // 🆕 新增认证状态
    isAuthenticated,
    isInitialized,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * MainPage业务逻辑
 */
const useMainPageLogic = (props: MainPageProps) => {
  const router = useRouter();
  const state = useMainPageState(props);
  
  /**
   * Tab切换
   */
  const handleTabChange = useCallback((tab: TabType) => {
    state.setActiveTab(tab);
  }, [state]);
  
  /**
   * 返回按钮
   */
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);
  
  /**
   * 头像点击
   */
  const handleAvatarPress = useCallback(() => {
    console.log('查看头像大图');
    // TODO: 打开头像查看器
  }, []);
  
  /**
   * 编辑按钮
   */
  const handleEditPress = useCallback(() => {
    console.log('编辑资料');
    // TODO: 跳转到编辑页面
    // router.push('/profile/edit');
  }, []);
  
  /**
   * 关注按钮
   */
  const handleFollowPress = useCallback(async () => {
    if (!state.userInfo) return;
    
    try {
      const targetUserId = Number(state.userInfo.id);
      
      // TODO: 检查当前关注状态，然后决定关注或取消关注
      // 这里简化为直接关注
      await state.followUser(targetUserId);
      
      console.log('✅ 关注操作完成，刷新用户资料');
      
      // 刷新用户资料
      if (state.loadUserProfile) {
        await state.loadUserProfile(props.userId);
      }
    } catch (error) {
      console.error('❌ 关注操作失败:', error);
    }
  }, [state, props.userId]);
  
  /**
   * 社交数据点击
   */
  const handleFollowingPress = useCallback(() => {
    console.log('🧭 导航: 查看关注列表');
    // TODO: 跳转到关注列表页面
    // router.push('/profile/following');
  }, [router]);
  
  const handleFollowerPress = useCallback(() => {
    console.log('🧭 导航: 查看粉丝列表');
    // TODO: 跳转到粉丝列表页面
    // router.push('/profile/followers');
  }, [router]);
  
  const handleLikePress = useCallback(() => {
    console.log('🧭 导航: 查看获赞与收藏');
    // TODO: 跳转到获赞收藏页面
    // router.push('/profile/like-collect');
  }, [router]);
  
  return {
    ...state,
    handleTabChange,
    handleBack,
    handleAvatarPress,
    handleEditPress,
    handleFollowPress,
    handleFollowingPress,
    handleFollowerPress,
    handleLikePress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * MainPage主组件
 */
const MainPage: React.FC<MainPageProps> = (props) => {
  const {
    activeTab,
    userInfo,
    loading,
    isOwnProfile,
    isAuthenticated,
    isInitialized,
    handleTabChange,
    handleBack,
    handleAvatarPress,
    handleEditPress,
    handleFollowPress,
    handleFollowingPress,
    handleFollowerPress,
    handleLikePress,
  } = useMainPageLogic(props);
  
  // 🎯 未初始化 - 显示空白（等待AuthStore初始化）
  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>初始化中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // 🎯 未登录状态 - 显示友好的未登录UI
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <UnauthenticatedArea />
      </SafeAreaView>
    );
  }
  
  // 🎯 已登录但数据加载中 - 显示骨架屏
  if (loading || !userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }
  
  // 🎯 已登录且有数据 - 显示完整页面
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* ✨ 整页滚动容器 - 支持整个页面上下滚动 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* ✨ 统一的现代化背景头图区域（嵌套化架构 v2.0） */}
        {/* 包含：背景图 + 顶部操作栏 + 用户信息卡片（姓名/性别/标签/状态） */}
        <UnifiedHeaderArea
          backgroundImage={userInfo.backgroundImage}
          nickname={userInfo.nickname}
          gender={userInfo.gender === 'male' ? 1 : userInfo.gender === 'female' ? 2 : undefined}
          age={userInfo.age}
          isRealVerified={userInfo.isRealVerified}
          isGodVerified={userInfo.isGodVerified}
          isVipVerified={userInfo.isVip}
          isOnline={true} // TODO: 从后端获取在线状态
          distance={userInfo.distance}
          followerCount={userInfo.followerCount}
          isOwnProfile={isOwnProfile}
          onEditPress={handleEditPress}
          onFollowPress={handleFollowPress}
          onBack={handleBack}
        />
        
        {/* Tab标签栏 */}
        <TabNavigationArea
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Tab内容区域 */}
        <View style={styles.tabContent}>
          <TabContentArea
            activeTab={activeTab}
            userId={userInfo.id}
            isOwnProfile={isOwnProfile}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // 不设置 flex:1，让内容自然撑开高度
  },
  tabContent: {
    // 移除 flex: 1，让内容自适应高度
    minHeight: 400, // 最小高度确保有足够空间显示内容
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default MainPage;
export type { MainPageProps } from './types';
// #endregion

