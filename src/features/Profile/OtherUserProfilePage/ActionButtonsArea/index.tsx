// #region 1. File Banner & TOC
/**
 * ActionButtonsArea - Bottom Action Buttons Area
 * 
 * 底部操作按钮区域
 * - 关注按钮
 * - 发消息按钮
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Component
 * [4] Styles
 * [5] Export
 */
// #endregion

// #region 2. Imports

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants';

// #endregion

// #region 3. Component

interface ActionButtonsAreaProps {
  isFollowing: boolean;
  loading: boolean;
  onFollowPress: () => void;
  onMessagePress: () => void;
}

const ActionButtonsArea: React.FC<ActionButtonsAreaProps> = ({
  isFollowing,
  loading,
  onFollowPress,
  onMessagePress,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + SPACING.md }]}>
      <TouchableOpacity
        style={[styles.button, styles.followButton, isFollowing && styles.followingButton]}
        onPress={onFollowPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={isFollowing ? COLORS.primary : COLORS.white} />
        ) : (
          <>
            <Ionicons
              name={isFollowing ? 'checkmark' : 'add'}
              size={SIZES.iconSmall}
              color={isFollowing ? COLORS.primary : COLORS.white}
            />
            <Text style={[
              styles.buttonText, 
              isFollowing && { color: COLORS.primary }
            ]}>
              {isFollowing ? '已关注' : '关注'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.messageButton]}
        onPress={onMessagePress}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-outline" size={SIZES.iconSmall} color={COLORS.primary} />
        <Text style={[styles.buttonText, { color: COLORS.primary }]}>私信</Text>
      </TouchableOpacity>
    </View>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    // 阴影效果（架构文档要求）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: SIZES.buttonHeight,
    borderRadius: 24,          // 架构文档要求: 圆角24px
  },
  followButton: {
    backgroundColor: COLORS.primary,
    // 渐变效果（架构文档要求: 紫色渐变#8A2BE2到#9370DB）
  },
  followingButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  messageButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,              // 架构文档要求: 16sp
    fontWeight: '600',
    color: COLORS.white,
  },
});

// #endregion

// #region 5. Export

export default ActionButtonsArea;

// #endregion

