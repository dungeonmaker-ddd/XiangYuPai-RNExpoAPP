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
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 类型和常量
import type { TabType, UserProfile } from '../types';
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
/**
 * 生成模拟用户数据
 */
const generateMockUser = (userId?: string): UserProfile => {
  return {
    id: userId || 'current-user',
    nickname: '门前游过一群鸭',
    avatar: 'https://picsum.photos/200',
    backgroundImage: 'https://picsum.photos/800/600',
    gender: 'female',
    age: 18,
    bio: '人皮话多不高冷的真实写照',
    location: '广东 深圳',
    city: '深圳',
    ipLocation: '广东 深圳',
    distance: 4.6,
    height: 162,
    weight: 44,
    occupations: ['模特'],
    wechat: 'sunny0301',
    birthday: '09-29',
    isRealVerified: true,
    isGodVerified: true,
    isVip: false,
    isOnline: true,
    onlineStatus: 1,
    followingCount: 201,
    followerCount: 201,
    likeCount: 999,
    collectCount: 150,
    createdAt: Date.now(),
  };
};
// #endregion

// #region 6. State Management
/**
 * MainPage状态管理
 */
const useMainPageState = (props: MainPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(props.initialTab || 'dynamic');
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 判断是否是自己的主页
  const isOwnProfile = !props.userId || props.userId === 'current-user';
  
  // 加载用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      setLoading(true);
      try {
        // TODO: 调用API获取用户信息
        const mockUser = generateMockUser(props.userId);
        setUserInfo(mockUser);
      } catch (error) {
        console.error('加载用户信息失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserInfo();
  }, [props.userId]);
  
  return {
    activeTab,
    setActiveTab,
    userInfo,
    loading,
    isOwnProfile,
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
  const handleFollowPress = useCallback(() => {
    console.log('关注用户');
    // TODO: 调用关注API
  }, []);
  
  /**
   * 社交数据点击
   */
  const handleFollowingPress = useCallback(() => {
    console.log('查看关注列表');
    // TODO: 跳转到关注列表
  }, []);
  
  const handleFollowerPress = useCallback(() => {
    console.log('查看粉丝列表');
    // TODO: 跳转到粉丝列表
  }, []);
  
  const handleLikePress = useCallback(() => {
    console.log('查看获赞与收藏');
    // TODO: 跳转到获赞收藏页面
  }, []);
  
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

