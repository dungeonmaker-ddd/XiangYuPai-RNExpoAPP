// #region 1. File Banner & TOC
/**
 * UserAvatar - 用户头像组件
 * 
 * 功能：支持多种尺寸的圆形头像，在线状态指示，未读角标
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { UserAvatarProps } from '../../types';
// #endregion

// #region 3. Types & Schema
// #endregion

// #region 4. Constants & Config
const SIZES = {
  small: 24,
  medium: 36,
  large: 48,
};

const COLORS = {
  onlineStatus: '#10B981',
  offlineStatus: '#9CA3AF',
  unreadBadge: '#EF4444',
  border: '#E5E7EB',
};
// #endregion

// #region 5. Utils & Helpers
const getSize = (size: UserAvatarProps['size']): number => {
  if (typeof size === 'number') return size;
  return SIZES[size || 'medium'];
};
// #endregion

// #region 6. State Management
// #endregion

// #region 7. Domain Logic
// #endregion

// #region 8. UI Components & Rendering
const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  size = 'medium',
  showOnlineStatus = false,
  isOnline = false,
  unreadCount = 0,
  onPress,
  style,
}) => {
  const avatarSize = getSize(size);
  const statusSize = avatarSize * 0.25;
  const badgeSize = Math.max(14, avatarSize * 0.35);

  const content = (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: avatar }}
        style={[
          styles.avatar,
          { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
        ]}
      />
      
      {showOnlineStatus && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: isOnline ? COLORS.onlineStatus : COLORS.offlineStatus,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
      
      {unreadCount > 0 && (
        <View
          style={[
            styles.unreadBadge,
            {
              minWidth: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              top: -badgeSize / 3,
              right: -badgeSize / 3,
            },
          ]}
        >
          <Text style={[styles.unreadText, { fontSize: badgeSize * 0.6 }]}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: COLORS.border,
  },
  statusIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    backgroundColor: COLORS.unreadBadge,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
// #endregion

// #region 9. Exports
export default React.memo(UserAvatar);
// #endregion
