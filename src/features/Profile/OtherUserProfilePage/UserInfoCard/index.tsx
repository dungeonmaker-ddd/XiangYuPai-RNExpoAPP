/**
 * UserInfoCard - 用户信息卡片
 * 
 * 白色卡片，显示用户核心信息
 * - 昵称 + 徽章
 * - 个人简介
 * - 位置和在线状态
 * - 统计数据（关注/粉丝/获赞）
 * 
 * 设计参考：对方主页-动态.png
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

interface UserInfoCardProps {
  nickname: string;
  bio?: string;
  location?: string;
  isOnline?: boolean;
  gender?: number; // 0: 未知, 1: 男, 2: 女
  age?: number;
  followingCount?: number; // Optional - not displayed in this component
  followerCount?: number; // Optional - not displayed in this component
  likeCount?: number; // Optional - not displayed in this component
  onFollowersPress?: () => void; // Optional - not used in this component
  onFollowingPress?: () => void; // Optional - not used in this component
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  nickname,
  bio,
  location,
  isOnline = false,
  gender,
  age,
}) => {
  return (
    <View style={styles.container}>
      {/* 昵称行 */}
      <View style={styles.nicknameRow}>
        <Text style={styles.nickname}>{nickname}</Text>
        
        {/* 性别和年龄徽章 */}
        {(gender !== undefined || age !== undefined) && (
          <View style={styles.badges}>
            {gender === 2 && (
              <View style={[styles.genderBadge, styles.femaleBadge]}>
                <Ionicons name="female" size={12} color="#FFFFFF" />
                {age && <Text style={styles.badgeText}>{age}</Text>}
              </View>
            )}
            {gender === 1 && (
              <View style={[styles.genderBadge, styles.maleBadge]}>
                <Ionicons name="male" size={12} color="#FFFFFF" />
                {age && <Text style={styles.badgeText}>{age}</Text>}
              </View>
            )}
            
            {/* 认证徽章等 */}
            <View style={styles.certBadge}>
              <Text style={styles.certText}>💙</Text>
            </View>
            <View style={styles.certBadge}>
              <Text style={styles.certText}>🎁</Text>
            </View>
          </View>
        )}
      </View>

      {/* 个人简介 */}
      {bio && (
        <Text style={styles.bio} numberOfLines={2}>
          {bio}
        </Text>
      )}

      {/* 位置和状态 */}
      <View style={styles.locationRow}>
        {location && (
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        )}
        
        {isOnline && (
          <View style={styles.statusItem}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>在线</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  femaleBadge: {
    backgroundColor: '#EC4899', // 粉色
  },
  maleBadge: {
    backgroundColor: '#3B82F6', // 蓝色
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  certBadge: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certText: {
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  onlineText: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '500',
  },
});

export default UserInfoCard;

