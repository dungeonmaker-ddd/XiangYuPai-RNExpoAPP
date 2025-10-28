// #region 1. File Banner & TOC
/**
 * StatsArea - Statistics Area
 * 
 * 统计数据区域
 * - 关注数
 * - 粉丝数
 * - 获赞数
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

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants';

// #endregion

// #region 3. Component

interface StatsAreaProps {
  followerCount: number;
  followingCount: number;
  likeCount: number;
  onFollowingPress?: () => void;
  onFollowersPress?: () => void;
}

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const StatItem: React.FC<{
  label: string;
  value: number;
  onPress?: () => void;
}> = ({ label, value, onPress }) => (
  <TouchableOpacity
    style={styles.statItem}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Text style={styles.statValue}>{formatCount(value)}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const StatsArea: React.FC<StatsAreaProps> = ({
  followerCount,
  followingCount,
  likeCount,
  onFollowingPress,
  onFollowersPress,
}) => {
  return (
    <View style={styles.container}>
      <StatItem label="关注" value={followingCount} onPress={onFollowingPress} />
      <View style={styles.divider} />
      <StatItem label="粉丝" value={followerCount} onPress={onFollowersPress} />
      <View style={styles.divider} />
      <StatItem label="获赞" value={likeCount} />
    </View>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,           // 架构文档要求: 18sp
    fontWeight: '700',      // 架构文档要求: 700字重
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,           // 架构文档要求: 14sp
    color: COLORS.textTertiary, // 架构文档要求: #999999
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.gray300,
  },
});

// #endregion

// #region 5. Export

export default StatsArea;

// #endregion

