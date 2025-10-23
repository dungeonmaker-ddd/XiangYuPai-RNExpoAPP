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
  View,
} from 'react-native';

// Store
import { useProfileStore } from '@/stores/profileStore';

// 类型和常量
import type { TabType } from '../types';
import { COLORS } from './constants';
import type { MainPageProps } from './types';

// 区域组件
import BackgroundArea from './BackgroundArea';
import SocialStatsArea from './SocialStatsArea';
import TabContentArea from './TabContentArea';
import TabNavigationArea from './TabNavigationArea';
import UserInfoArea from './UserInfoArea';
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
  
  // 加载用户资料
  useEffect(() => {
    console.log('\n📱 MainPage - 开始加载用户资料');
    console.log('   用户ID:', props.userId || 'current-user');
    console.log('   是否本人:', isOwnProfile);
    
    loadUserProfile(props.userId);
  }, [props.userId, loadUserProfile]);
  
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
    handleTabChange,
    handleBack,
    handleAvatarPress,
    handleEditPress,
    handleFollowPress,
    handleFollowingPress,
    handleFollowerPress,
    handleLikePress,
  } = useMainPageLogic(props);
  
  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}  // Tab栏吸顶
      >
        {/* 背景头图区域 */}
        <BackgroundArea
          imageUrl={userInfo.backgroundImage}
          onBack={handleBack}
        />
        
        {/* 用户信息区域 */}
        <UserInfoArea
          userInfo={userInfo}
          isOwnProfile={isOwnProfile}
          onEditPress={handleEditPress}
          onFollowPress={handleFollowPress}
          onAvatarPress={handleAvatarPress}
        />
        
        {/* 社交数据区域 */}
        <SocialStatsArea
          followingCount={userInfo.followingCount || 0}
          followerCount={userInfo.followerCount || 0}
          likeCount={userInfo.likeCount || 0}
          collectCount={userInfo.collectCount || 0}
          onFollowingPress={handleFollowingPress}
          onFollowerPress={handleFollowerPress}
          onLikePress={handleLikePress}
        />
        
        {/* Tab标签栏 */}
        <TabNavigationArea
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Tab内容区域 */}
        <TabContentArea
          activeTab={activeTab}
          userId={userInfo.id}
          isOwnProfile={isOwnProfile}
        />
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
    flexGrow: 1,
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

