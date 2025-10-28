// #region 1. File Banner & TOC
/**
 * ProfileInfoArea - User Profile Information Area
 * 
 * 用户信息区域
 * - 头像
 * - 昵称、性别、年龄
 * - 个人简介
 * - 位置和在线状态
 * - 认证徽章
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Sub-components
 * [4] Main Component
 * [5] Styles
 * [6] Export
 */
// #endregion

// #region 2. Imports

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants';
import type { OtherUserInfo } from '../types';

// #endregion

// #region 3. Sub-components

/**
 * 徽章组件
 */
const Badge: React.FC<{ type: 'vip' | 'verified' | 'god' | 'popular' }> = ({ type }) => {
  const config = {
    vip: { icon: 'star', color: COLORS.warning },
    verified: { icon: 'checkmark-circle', color: COLORS.blue },
    god: { icon: 'trophy', color: COLORS.warning },
    popular: { icon: 'flame', color: COLORS.error },
  }[type];
  
  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Ionicons name={config.icon as any} size={12} color={COLORS.white} />
    </View>
  );
};

/**
 * 性别年龄标签
 */
const GenderAgeTag: React.FC<{ gender: 'male' | 'female' | 'other'; age: number }> = ({
  gender,
  age,
}) => {
  const genderColor = gender === 'male' ? COLORS.blue : gender === 'female' ? COLORS.pink : COLORS.gray400;
  
  return (
    <View style={[styles.genderAgeTag, { backgroundColor: genderColor + '20' }]}>
      <Ionicons
        name={gender === 'male' ? 'male' : 'female'}
        size={14}
        color={genderColor}
      />
      <Text style={[styles.ageText, { color: genderColor }]}>{age}</Text>
    </View>
  );
};

// #endregion

// #region 4. Main Component

interface ProfileInfoAreaProps {
  userInfo: OtherUserInfo;
}

const ProfileInfoArea: React.FC<ProfileInfoAreaProps> = ({ userInfo }) => {
  // State for bio expansion
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  
  // Handle bio text layout
  const handleBioTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > 3) {
      setShowExpandButton(true);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {userInfo.isVip && <Badge type="vip" />}
          {userInfo.isRealVerified && <Badge type="verified" />}
          {userInfo.isGodVerified && <Badge type="god" />}
          {userInfo.isPopular && <Badge type="popular" />}
        </View>
        
        {/* Online Indicator */}
        {userInfo.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      {/* User Info */}
      <View style={styles.infoSection}>
        <View style={styles.nameRow}>
          <Text style={styles.nickname}>{userInfo.nickname}</Text>
          {userInfo.gender && userInfo.age && (
            <GenderAgeTag gender={userInfo.gender} age={userInfo.age} />
          )}
        </View>
        
        {/* Bio with Expand/Collapse */}
        {userInfo.bio && (
          <View style={styles.bioContainer}>
            <Text
              style={styles.bio}
              numberOfLines={isBioExpanded ? undefined : 3}
              onTextLayout={handleBioTextLayout}
            >
              {userInfo.bio}
            </Text>
            {showExpandButton && (
              <TouchableOpacity
                onPress={() => setIsBioExpanded(!isBioExpanded)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.expandButton}>
                  {isBioExpanded ? '收起' : '展开'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Location and Status */}
        <View style={styles.metaRow}>
          {userInfo.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={SIZES.iconXSmall} color={COLORS.textTertiary} />
              <Text style={styles.metaText}>{userInfo.location}</Text>
            </View>
          )}
          
          {userInfo.distance !== undefined && (
            <View style={styles.metaItem}>
              <Ionicons name="navigate-outline" size={SIZES.iconXSmall} color={COLORS.textTertiary} />
              <Text style={styles.metaText}>距您 {userInfo.distance.toFixed(1)}km</Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Ionicons
              name="ellipse"
              size={8}
              color={userInfo.isOnline ? COLORS.success : COLORS.gray400}
            />
            <Text style={[styles.metaText, { color: userInfo.isOnline ? COLORS.successDark : COLORS.gray400 }]}>
              {userInfo.isOnline ? '在线' : '离线'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// #endregion

// #region 5. Styles

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: SIZES.avatarLarge,
    height: SIZES.avatarLarge,
    borderRadius: SIZES.avatarLarge / 2,
    borderWidth: 3,
    borderColor: COLORS.white,
    // Outer glow effect (架构文档要求: 外围2px紫色光晕)
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    width: SIZES.badgeSize,
    height: SIZES.badgeSize,
    borderRadius: SIZES.badgeSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  infoSection: {
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  nickname: {
    fontSize: 20,              // 架构文档要求: 20sp
    fontWeight: '700',         // 架构文档要求: 700字重
    color: COLORS.textPrimary, // 架构文档要求: #000000
  },
  genderAgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bioContainer: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  bio: {
    fontSize: 14,                 // 架构文档要求: 14sp
    color: COLORS.textSecondary,  // 架构文档要求: #333333
    textAlign: 'center',
    lineHeight: 20,               // 架构文档要求: 1.4倍行高 (14 * 1.4 ≈ 20)
  },
  expandButton: {
    fontSize: 14,                 // 架构文档要求: 14sp
    color: COLORS.primary,        // 架构文档要求: 紫色#8A2BE2
    textAlign: 'center',
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,                 // 架构文档要求: 14sp
    color: COLORS.textTertiary,   // 架构文档要求: #999999
  },
});

// #endregion

// #region 6. Export

export default ProfileInfoArea;

// #endregion

