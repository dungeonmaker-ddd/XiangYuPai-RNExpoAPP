/**
 * StatusRow - 状态行组件
 * 
 * 功能：
 * - 显示在线状态
 * - 显示距离
 * - 显示粉丝数
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CARD_COLORS, CARD_SIZES, LABELS } from '../constants';
import type { StatusRowProps } from '../types';

const StatusRow: React.FC<StatusRowProps> = ({
  isOnline,
  distance,
  followerCount,
}) => {
  // 格式化数字显示
  const formatCount = (count?: number): string => {
    if (!count) return '0';
    if (count >= 10000) return `${(count / 10000).toFixed(1)}w`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* 在线状态 */}
      {isOnline !== undefined && (
        <View style={styles.statusItem}>
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: isOnline ? CARD_COLORS.ONLINE_DOT : CARD_COLORS.OFFLINE_DOT },
            ]}
          />
          <Text style={styles.statusText}>
            {isOnline ? LABELS.ONLINE : LABELS.OFFLINE}
          </Text>
        </View>
      )}

      {/* 距离 */}
      {distance !== undefined && (
        <View style={styles.statusItem}>
          <Ionicons
            name="location-outline"
            size={CARD_SIZES.ICON_MEDIUM}
            color={CARD_COLORS.TEXT_SECONDARY}
          />
          <Text style={styles.statusText}>{distance.toFixed(1)}km</Text>
        </View>
      )}

      {/* 粉丝数 */}
      {followerCount !== undefined && (
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>
            {formatCount(followerCount)} {LABELS.FOLLOWERS}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: CARD_SIZES.ONLINE_DOT_SIZE,
    height: CARD_SIZES.ONLINE_DOT_SIZE,
    borderRadius: CARD_SIZES.ONLINE_DOT_SIZE / 2,
  },
  statusText: {
    fontSize: CARD_SIZES.FONT_STATUS,
    fontWeight: '500',
    color: CARD_COLORS.TEXT_SECONDARY,
  },
});

export default StatusRow;

