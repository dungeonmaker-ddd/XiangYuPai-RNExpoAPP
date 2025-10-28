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
      <View style={styles.content}>
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
          {/* 昵称和性别年龄标签 */}
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
          
          {/* 认证标签和在线状态 */}
          <View style={styles.statusRow}>
            {userInfo.isRealVerified && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Text style={styles.badgeText}>✓实名认证</Text>
              </View>
            )}
            {userInfo.isGodVerified && (
              <View style={[styles.badge, styles.godBadge]}>
                <Text style={styles.badgeText}>🔱大神</Text>
              </View>
            )}
          </View>
          
          {/* 在线状态和距离信息 */}
          <View style={styles.locationRow}>
            {userInfo.isOnline && (
              <View style={styles.onlineTag}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>在线</Text>
              </View>
            )}
            {userInfo.distance !== undefined && (
              <Text style={styles.distanceText}>
                📍{formatDistance(userInfo.distance)}
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
            <Text style={styles.followButtonText}>+ 关注</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
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
    right: 2,
    bottom: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.ONLINE_GREEN,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
    marginTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    maxWidth: 180,
  },
  genderTag: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 11,
    marginRight: 6,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: COLORS.VERIFIED_BLUE,
  },
  godBadge: {
    backgroundColor: COLORS.GOD_PURPLE,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.WHITE,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.ONLINE_GREEN,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  editButton: {
    width: 70,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  editButtonText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  followButton: {
    width: 70,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default UserInfoArea;
// #endregion

