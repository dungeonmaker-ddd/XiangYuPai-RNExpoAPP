// #region 1. File Banner & TOC
/**
 * OtherUserProfilePage - Other User's Profile Page
 * 
 * 对方用户主页页面（完整页面，非模态框）
 * 
 * Features:
 * - 完整的页面布局
 * - 头部导航
 * - 用户信息展示
 * - 统计数据
 * - Tab切换（动态/资料/技能）
 * - 底部操作按钮
 * - 认证系统集成
 * - 刷新支持
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Main Component
 * [4] Styles
 * [5] Export
 */
// #endregion

// #region 2. Imports

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sub-components
import BackgroundHeaderArea from './BackgroundHeaderArea';
import ContentArea from './ContentArea';
import TabArea from './TabArea';

// State management
import { useAuthGuard } from '@/src/utils/auth/AuthGuard';
import useOtherUserProfilePage from './useOtherUserProfilePage';

// Event handlers
import navigateToMessage from './navigateToMessage';
import onOtherUserProfileShare from './onOtherUserProfileShare';

// Constants
import { COLORS, SIZES, SPACING } from './constants';

// Types
import type { OtherUserProfilePageProps } from './types';

// #endregion

// #region 3. Main Component

/**
 * 对方用户主页页面
 */
const OtherUserProfilePage: React.FC<OtherUserProfilePageProps> = ({ userId }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuth } = useAuthGuard();
  
  const {
    userInfo,
    activeTab,
    isFollowing,
    loading,
    error,
    actionLoading,
    refreshing,
    handleTabChange,
    handleFollowToggle,
    handleRefresh,
  } = useOtherUserProfilePage(userId);
  
  // Handle share
  const handleShare = () => {
    if (userInfo) {
      onOtherUserProfileShare(userInfo.nickname, userInfo.id);
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!requireAuth({ action: '发送消息' })) {
      return;
    }
    
    if (userInfo) {
      navigateToMessage(router, userInfo.id, userInfo.nickname);
    }
  };
  
  // Loading state
  if (loading && !userInfo) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }
  
  // Error state
  if (error && !userInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  // No data
  if (!userInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>用户不存在</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
      >
        {/* Background Header with User Info Overlay */}
        <BackgroundHeaderArea
          backgroundImage={userInfo.backgroundImage}
          nickname={userInfo.nickname}
          age={userInfo.age}
          gender={userInfo.gender}
          isRealVerified={userInfo.isRealVerified}
          isGodVerified={userInfo.isGodVerified}
          isBookable={true}
          distance={userInfo.distance}
          followerCount={userInfo.followerCount}
          isFollowing={isFollowing}
          onFollowPress={handleFollowToggle}
          onShare={handleShare}
        />
        
        {/* Tab Navigation (吸顶导航) */}
        <TabArea activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Tab Content */}
        <ContentArea
          activeTab={activeTab}
          userInfo={userInfo}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </ScrollView>
      
      {/* Bottom Action Button (私信) */}
      <View style={[styles.bottomButtonArea, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleSendMessage}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#8A2BE2" />
          <Text style={styles.messageButtonText}>私信</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
  },
  bottomButtonArea: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: SIZES.buttonHeight,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

// #endregion

// #region 5. Export

export default OtherUserProfilePage;

// #endregion

