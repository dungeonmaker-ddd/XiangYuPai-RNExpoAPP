/**
 * ProfileContent - 资料Tab内容
 * 
 * 功能：
 * - 显示用户基本信息（性别、年龄、身高、体重、职业等）
 * - 显示个人介绍
 * - 显示技能列表
 * - 添加技能按钮（仅本人显示）
 * 
 * UI参考：架构文档-资料Tab设计
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SkillItem, UserProfile } from '../../types';
import InfoCard from './InfoCard';
import SkillCard from './SkillCard';

// #region Types
interface ProfileContentProps {
  userInfo: UserProfile;
  skills?: SkillItem[];
  isOwnProfile: boolean;
  onSkillPress?: (skillId: string) => void;
  onAddSkillPress?: () => void;
  onEditInfoPress?: () => void;
}
// #endregion

// #region Utils
// 计算年龄
const calculateAge = (birthday?: string): number | undefined => {
  if (!birthday) return undefined;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// 格式化性别显示
const formatGender = (gender?: 'male' | 'female'): string => {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未设置';
};
// #endregion

const ProfileContent: React.FC<ProfileContentProps> = ({
  userInfo,
  skills = [],
  isOwnProfile,
  onSkillPress,
  onAddSkillPress,
  onEditInfoPress,
}) => {
  const age = calculateAge(userInfo.birthday);

  return (
    <View style={styles.container}>
      {/* 基本信息卡片 */}
      <InfoCard
        title="基本信息"
        onEditPress={isOwnProfile ? onEditInfoPress : undefined}
      >
        {/* 性别 */}
        {userInfo.gender && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>性别</Text>
            <Text style={styles.infoValue}>{formatGender(userInfo.gender)}</Text>
          </View>
        )}

        {/* 年龄 */}
        {age !== undefined && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年龄</Text>
            <Text style={styles.infoValue}>{age}岁</Text>
          </View>
        )}

        {/* 身高 */}
        {userInfo.height && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>身高</Text>
            <Text style={styles.infoValue}>{userInfo.height}cm</Text>
          </View>
        )}

        {/* 体重 */}
        {userInfo.weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>体重</Text>
            <Text style={styles.infoValue}>{userInfo.weight}kg</Text>
          </View>
        )}

        {/* 常居地 */}
        {userInfo.location && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>常居地</Text>
            <Text style={styles.infoValue}>{userInfo.location}</Text>
          </View>
        )}

        {/* 职业 */}
        {userInfo.occupations && userInfo.occupations.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>职业</Text>
            <View style={styles.occupations}>
              {userInfo.occupations.map((occupation, index) => (
                <View key={index} style={styles.occupationTag}>
                  <Text style={styles.occupationText}>{occupation}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 微信 */}
        {userInfo.wechat && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>微信</Text>
            <View style={styles.wechatContainer}>
              <Text style={styles.infoValue}>{userInfo.wechat}</Text>
              {userInfo.wechatLocked && (
                <Ionicons name="lock-closed" size={14} color="#757575" />
              )}
            </View>
          </View>
        )}

        {/* 如果没有任何基本信息 */}
        {!userInfo.gender && !age && !userInfo.height && 
         !userInfo.weight && !userInfo.location && 
         (!userInfo.occupations || userInfo.occupations.length === 0) && (
          <View style={styles.emptyInfo}>
            <Text style={styles.emptyText}>
              {isOwnProfile ? '完善基本信息，让大家更了解你' : '暂未填写基本信息'}
            </Text>
          </View>
        )}
      </InfoCard>

      {/* 个人介绍卡片 */}
      {(userInfo.bio || isOwnProfile) && (
        <InfoCard
          title="个人介绍"
          onEditPress={isOwnProfile ? onEditInfoPress : undefined}
        >
          {userInfo.bio ? (
            <Text style={styles.bioText}>{userInfo.bio}</Text>
          ) : (
            <View style={styles.emptyInfo}>
              <Text style={styles.emptyText}>
                {isOwnProfile ? '添加个人介绍，展示你的个性' : '暂未填写个人介绍'}
              </Text>
            </View>
          )}
        </InfoCard>
      )}

      {/* 技能列表卡片 */}
      <InfoCard title="我的技能">
        {skills.length > 0 ? (
          <View style={styles.skillsList}>
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onPress={() => onSkillPress?.(skill.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyInfo}>
            <Text style={styles.emptyText}>
              {isOwnProfile ? '添加技能，展示你的特长' : '暂无技能展示'}
            </Text>
          </View>
        )}

        {/* 添加技能按钮（仅本人显示） */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.addSkillButton}
            onPress={onAddSkillPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color="#8A2BE2" />
            <Text style={styles.addSkillText}>添加技能</Text>
          </TouchableOpacity>
        )}
      </InfoCard>

      {/* 底部间距 */}
      <View style={styles.bottomSpace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#757575',
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  occupations: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  occupationTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
  },
  occupationText: {
    fontSize: 13,
    color: '#8A2BE2',
  },
  wechatContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyInfo: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
  bioText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
  },
  skillsList: {
    gap: 12,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderStyle: 'dashed',
    gap: 8,
  },
  addSkillText: {
    fontSize: 15,
    color: '#8A2BE2',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 24,
  },
});

export default ProfileContent;

