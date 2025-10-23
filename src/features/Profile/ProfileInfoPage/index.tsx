// #region 1. File Banner & TOC
/**
 * ProfileInfoPage - 个人资料页
 * 
 * 功能：
 * - 个人资料卡片展示
 * - 技能标签展示
 */
// #endregion

// #region 2. Imports
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { ProfileFields, SkillItem } from '../types';
// #endregion

// #region 3-5. Types, Constants & Utils
interface ProfileInfoPageProps {
  userId: string;
  isOwnProfile: boolean;
}

const COLORS = {
  WHITE: '#FFFFFF',
  GRAY_BG: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
  PRIMARY: '#8A2BE2',
} as const;

const generateMockProfileFields = (): ProfileFields => ({
  location: '广东 深圳',
  ipLocation: '广东 深圳',
  height: 162,
  userId: '21566842',
  weight: 44,
  occupation: '模特',
  wechat: 'sunny0301',
  birthday: '09-29',
});

const generateMockSkills = (): SkillItem[] => [
  { id: '1', name: '王者荣耀', icon: '🎮', type: 'game' },
  { id: '2', name: '荒野乱斗', icon: '🎮', type: 'game' },
  { id: '3', name: '探店', icon: '🏪', type: 'lifestyle' },
  { id: '4', name: '按摩', icon: '💆', type: 'lifestyle' },
];
// #endregion

// #region 6-7. State & Logic
const useProfileInfoLogic = (userId: string) => {
  const [profileFields, setProfileFields] = useState<ProfileFields | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  
  useEffect(() => {
    // TODO: 调用API加载数据
    setProfileFields(generateMockProfileFields());
    setSkills(generateMockSkills());
  }, [userId]);
  
  return { profileFields, skills };
};
// #endregion

// #region 8. UI Components & Rendering
const ProfileInfoPage: React.FC<ProfileInfoPageProps> = ({ userId, isOwnProfile }) => {
  const { profileFields, skills } = useProfileInfoLogic(userId);
  
  if (!profileFields) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 个人资料卡片 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>个人资料</Text>
        
        <View style={styles.fieldsGrid}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>常居地</Text>
              <Text style={styles.fieldValue}>{profileFields.location}</Text>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>IP</Text>
              <Text style={styles.fieldValue}>{profileFields.ipLocation}</Text>
            </View>
          </View>
          
          <View style={styles.fieldRow}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>身高</Text>
              <Text style={styles.fieldValue}>{profileFields.height}cm</Text>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>ID</Text>
              <Text style={styles.fieldValue}>{profileFields.userId}</Text>
            </View>
          </View>
          
          <View style={styles.fieldRow}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>体重</Text>
              <Text style={styles.fieldValue}>{profileFields.weight}kg</Text>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>职业</Text>
              <Text style={styles.fieldValue}>{profileFields.occupation}</Text>
            </View>
          </View>
          
          <View style={styles.fieldRow}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>微信</Text>
              <Text style={styles.fieldValue}>{profileFields.wechat}</Text>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>生日</Text>
              <Text style={styles.fieldValue}>{profileFields.birthday}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* 技能标签卡片 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>技能</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skillsList}
        >
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={styles.skillItem}
              activeOpacity={0.7}
            >
              <Text style={styles.skillIcon}>{skill.icon}</Text>
              <Text style={styles.skillName}>{skill.name}</Text>
            </TouchableOpacity>
          ))}
          
          {isOwnProfile && (
            <TouchableOpacity style={styles.addSkillItem} activeOpacity={0.7}>
              <Text style={styles.addIcon}>➕</Text>
              <Text style={styles.addText}>添加技能</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_BG,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  fieldsGrid: {
    gap: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fieldItem: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  skillsList: {
    paddingVertical: 8,
    gap: 12,
  },
  skillItem: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  addSkillItem: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 32,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  addText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default ProfileInfoPage;
// #endregion

