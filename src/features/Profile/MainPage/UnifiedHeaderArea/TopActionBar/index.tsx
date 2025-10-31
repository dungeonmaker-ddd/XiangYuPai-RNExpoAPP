/**
 * TopActionBar - 顶部操作栏组件
 * 
 * 功能：
 * - 左侧：返回按钮
 * - 右侧：编辑按钮（本人）或关注按钮（他人）
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, LABELS, SIZES } from '../constants';
import type { TopActionBarProps } from '../types';

const TopActionBar: React.FC<TopActionBarProps> = ({
  isOwnProfile,
  isFollowing = false,
  isMutualFollowing = false,
  onBack,
  onEditPress,
  onFollowPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const getFollowButtonText = (): string => {
    if (isMutualFollowing) return LABELS.MUTUAL_FOLLOWING;
    if (isFollowing) return LABELS.FOLLOWING;
    return LABELS.FOLLOW;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* 返回按钮 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.TEXT_WHITE} />
      </TouchableOpacity>

      {/* 编辑或关注按钮 */}
      {isOwnProfile ? (
        // 本人主页：编辑按钮
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.TEXT_WHITE} />
          <Text style={styles.editButtonText}>{LABELS.EDIT}</Text>
        </TouchableOpacity>
      ) : (
        // 他人主页：关注按钮
        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followingButton,
            isMutualFollowing && styles.mutualFollowingButton,
          ]}
          onPress={onFollowPress}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText,
            ]}
          >
            {getFollowButtonText()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.SPACING_LARGE,
    paddingBottom: SIZES.SPACING_SMALL,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 编辑按钮（本人）
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.SPACING_TINY,
    paddingHorizontal: SIZES.SPACING_XLARGE,
    paddingVertical: SIZES.SPACING_SMALL,
    borderRadius: 20,
    backgroundColor: COLORS.EDIT_BUTTON_BG,
    borderWidth: 1,
    borderColor: COLORS.EDIT_BUTTON_BORDER,
  },
  editButtonText: {
    fontSize: SIZES.FONT_BUTTON,
    fontWeight: '600',
    color: COLORS.TEXT_WHITE,
  },
  // 关注按钮（他人）
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: SIZES.SPACING_SMALL,
    borderRadius: 20,
    backgroundColor: COLORS.FOLLOW_BUTTON_BG,
    shadowColor: COLORS.BUTTON_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  followingButton: {
    backgroundColor: COLORS.FOLLOWING_BUTTON_BG,
    borderWidth: 1,
    borderColor: COLORS.EDIT_BUTTON_BORDER,
  },
  mutualFollowingButton: {
    backgroundColor: COLORS.FOLLOW_BUTTON_BG,
  },
  followButtonText: {
    fontSize: SIZES.FONT_BUTTON,
    fontWeight: '600',
    color: COLORS.TEXT_WHITE,
  },
  followingButtonText: {
    color: COLORS.TEXT_WHITE,
  },
});

export default TopActionBar;

