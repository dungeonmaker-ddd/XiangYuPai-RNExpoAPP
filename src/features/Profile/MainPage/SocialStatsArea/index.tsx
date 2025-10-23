// #region 1. File Banner & TOC
/**
 * SocialStatsArea - 社交数据区域
 * 
 * 功能：
 * - 关注数/粉丝数/获赞数展示
 * - 三列均分布局
 * - 点击跳转对应列表
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SIZES } from '../constants';
import type { SocialStatsAreaProps } from '../types';
// #endregion

// #region 3-5. Types, Constants & Utils
const formatCount = (count: number): string => {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}w`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};
// #endregion

// #region 6-7. State & Logic
// (简单组件)
// #endregion

// #region 8. UI Components & Rendering
const SocialStatsArea: React.FC<SocialStatsAreaProps> = ({
  followingCount,
  followerCount,
  likeCount,
  collectCount,
  onFollowingPress,
  onFollowerPress,
  onLikePress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* 关注 */}
      <TouchableOpacity
        style={styles.statItem}
        onPress={onFollowingPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{formatCount(followingCount)}</Text>
        <Text style={styles.statLabel}>关注</Text>
      </TouchableOpacity>
      
      {/* 粉丝 */}
      <TouchableOpacity
        style={styles.statItem}
        onPress={onFollowerPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{formatCount(followerCount)}</Text>
        <Text style={styles.statLabel}>粉丝</Text>
      </TouchableOpacity>
      
      {/* 获赞与收藏 */}
      <TouchableOpacity
        style={styles.statItem}
        onPress={onLikePress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>获赞与收藏</Text>
        <Text style={styles.statLabel}></Text>
      </TouchableOpacity>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    height: SIZES.SOCIAL_STATS_HEIGHT,
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default SocialStatsArea;
// #endregion

