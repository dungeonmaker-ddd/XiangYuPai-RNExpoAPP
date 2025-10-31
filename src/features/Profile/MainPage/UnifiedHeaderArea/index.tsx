/**
 * UnifiedHeaderArea - 统一的现代化背景头图区域（重构版）
 * 
 * 架构模式：🔵 嵌套化架构（Nested Architecture）
 * 
 * 功能：
 * - 大背景图片（全屏宽度，500px高度）
 * - 顶部操作栏（返回 + 编辑/关注按钮）
 * - 用户信息卡片（姓名、性别、认证标签、状态信息）
 * 
 * 架构组成：
 * - BackgroundLayer - 背景层（图片 + 渐变）
 * - TopActionBar - 顶部操作栏（返回 + 操作按钮）
 * - UserInfoCard - 用户信息卡片（3行信息）
 * 
 * 设计原则：
 * - 单一职责：每个子组件只负责一个功能区域
 * - 高内聚：子组件内部高度内聚
 * - 低耦合：子组件之间相对独立
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import BackgroundLayer from './BackgroundLayer';
import TopActionBar from './TopActionBar';
import UserInfoCard from './UserInfoCard';
import { BACKGROUND_HEIGHT, CARD_ELEVATION_OFFSET } from './constants';
import type { UnifiedHeaderAreaProps } from './types';

const UnifiedHeaderArea: React.FC<UnifiedHeaderAreaProps> = ({
  // Background
  backgroundImage,
  
  // User Basic Info
  nickname,
  gender,
  age,
  
  // Verification Badges
  isRealVerified = false,
  isGodVerified = false,
  isVipVerified = false,
  
  // Status Info
  isOnline,
  distance,
  followerCount,
  
  // Follow Status
  isFollowing = false,
  isMutualFollowing = false,
  
  // Custom Tags
  customTags = [],
  
  // Page Type
  isOwnProfile,
  
  // Event Callbacks
  onBack,
  onEditPress,
  onFollowPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 背景层 */}
      <BackgroundLayer backgroundImage={backgroundImage} />

      {/* 顶部操作栏 */}
      <TopActionBar
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        isMutualFollowing={isMutualFollowing}
        onBack={onBack}
        onEditPress={onEditPress}
        onFollowPress={onFollowPress}
      />

      {/* 用户信息卡片（浮动在底部） */}
      <View style={styles.cardContainer}>
        <UserInfoCard
          nickname={nickname}
          gender={gender}
          age={age}
          isRealVerified={isRealVerified}
          isGodVerified={isGodVerified}
          isVipVerified={isVipVerified}
          isOnline={isOnline}
          distance={distance}
          followerCount={followerCount}
          customTags={customTags}
          isOwnProfile={isOwnProfile}
          onEditPress={onEditPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BACKGROUND_HEIGHT,
    position: 'relative',
  },
  cardContainer: {
    position: 'absolute',
    bottom: CARD_ELEVATION_OFFSET,
    left: 0,
    right: 0,
  },
});

export default UnifiedHeaderArea;
export { BACKGROUND_HEIGHT };

