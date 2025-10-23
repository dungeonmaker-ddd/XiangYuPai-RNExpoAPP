// #region 1. File Banner & TOC
/**
 * UserInfoArea - 用户信息头部区域
 * 
 * 功能：
 * - 用户头像展示（含在线状态）
 * - 基本信息（昵称、性别年龄、认证标签）
 * - 位置和距离信息
 * - 编辑/关注按钮
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../constants';
import type { UserInfoAreaProps } from '../types';
// #endregion

// #region 3-5. Types, Constants & Utils
const DEFAULT_AVATAR = require('@/assets/images/icon.png');

const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};
// #endregion

// #region 6-7. State & Logic
// (简单组件)
// #endregion

// #region 8. UI Components & Rendering
const UserInfoArea: React.FC<UserInfoAreaProps> = ({
  userInfo,
  isOwnProfile,
  onEditPress,
  onFollowPress,
  onAvatarPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* 头像区域 */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onAvatarPress}
        activeOpacity={0.8}
      >
        <Image
          source={userInfo.avatar ? { uri: userInfo.avatar } : DEFAULT_AVATAR}
          style={styles.avatar}
        />
        {/* 在线状态指示 */}
        {userInfo.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </TouchableOpacity>
      
      {/* 用户基本信息 */}
      <View style={styles.userInfoContainer}>
        {/* 昵称和性别年龄 */}
        <View style={styles.nameRow}>
          <Text style={styles.nickname} numberOfLines={1}>
            {userInfo.nickname}
          </Text>
          {userInfo.gender && userInfo.age && (
            <View
              style={[
                styles.genderTag,
                {
                  backgroundColor:
                    userInfo.gender === 'male'
                      ? COLORS.GENDER_MALE
                      : COLORS.GENDER_FEMALE,
                },
              ]}
            >
              <Text style={styles.genderText}>
                {userInfo.gender === 'male' ? '♂' : '♀'}{userInfo.age}
              </Text>
            </View>
          )}
        </View>
        
        {/* 认证标签组 */}
        <View style={styles.badgeRow}>
          {userInfo.isRealVerified && (
            <View style={[styles.badge, styles.verifiedBadge]}>
              <Text style={styles.badgeText}>✓ 实名认证</Text>
            </View>
          )}
          {userInfo.isGodVerified && (
            <View style={[styles.badge, styles.godBadge]}>
              <Text style={styles.badgeText}>👑 大神</Text>
            </View>
          )}
        </View>
        
        {/* 位置距离信息 */}
        <View style={styles.locationRow}>
          {userInfo.isOnline && (
            <Text style={styles.onlineStatus}>🟢 在线</Text>
          )}
          {userInfo.distance !== undefined && (
            <Text style={styles.distanceText}>
              📍 {formatDistance(userInfo.distance)}
            </Text>
          )}
        </View>
      </View>
      
      {/* 编辑/关注按钮 */}
      {isOwnProfile ? (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.followButton}
          onPress={onFollowPress}
          activeOpacity={0.7}
        >
          <Text style={styles.followButtonText}>关注</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.WHITE,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -48, // 露出一半
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_BG,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.ONLINE_GREEN,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
    marginTop: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    maxWidth: 200,
  },
  genderTag: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: COLORS.VERIFIED_BLUE,
  },
  godBadge: {
    backgroundColor: COLORS.GOD_PURPLE,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.WHITE,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStatus: {
    fontSize: 12,
    color: COLORS.ONLINE_GREEN,
    marginRight: 12,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  editButton: {
    width: 80,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  followButton: {
    width: 80,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default UserInfoArea;
// #endregion

