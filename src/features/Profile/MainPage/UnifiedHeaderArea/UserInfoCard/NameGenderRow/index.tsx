/**
 * NameGenderRow - 姓名性别行组件
 * 
 * 功能：
 * - 显示昵称
 * - 显示性别标签（男生/女孩）
 * - 显示年龄
 * - 编辑按钮（仅本人）
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CARD_COLORS, CARD_SIZES, LABELS } from '../constants';
import type { NameGenderRowProps } from '../types';

const NameGenderRow: React.FC<NameGenderRowProps> = ({
  nickname,
  gender,
  age,
  isOwnProfile,
  onEditPress,
}) => {
  const getGenderText = (): string => {
    if (gender === 1) return LABELS.GENDER_MALE;
    if (gender === 2) return LABELS.GENDER_FEMALE;
    return '';
  };

  const getGenderStyle = () => {
    if (gender === 1) return styles.maleTag;
    if (gender === 2) return styles.femaleTag;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* 昵称 */}
      <Text style={styles.nickname} numberOfLines={1}>
        {nickname}
      </Text>

      {/* 性别标签 */}
      {gender && getGenderText() && (
        <View style={[styles.genderTag, getGenderStyle()]}>
          <Text style={styles.genderText}>{getGenderText()}</Text>
        </View>
      )}

      {/* 年龄 */}
      {age !== undefined && (
        <Text style={styles.age}>{age}岁</Text>
      )}

      {/* 编辑按钮（仅本人） */}
      {isOwnProfile && onEditPress && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="create-outline"
            size={CARD_SIZES.ICON_MEDIUM}
            color={CARD_COLORS.EDIT_ICON}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nickname: {
    fontSize: CARD_SIZES.FONT_NICKNAME,
    fontWeight: '700',
    color: CARD_COLORS.TEXT_PRIMARY,
    maxWidth: 200,
  },
  genderTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  maleTag: {
    backgroundColor: CARD_COLORS.MALE_BG,
  },
  femaleTag: {
    backgroundColor: CARD_COLORS.FEMALE_BG,
  },
  genderText: {
    fontSize: CARD_SIZES.FONT_TAG,
    fontWeight: '600',
    color: CARD_COLORS.GENDER_TEXT,
  },
  age: {
    fontSize: CARD_SIZES.FONT_STATUS,
    color: CARD_COLORS.TEXT_SECONDARY,
  },
  editButton: {
    padding: 4,
    marginLeft: 'auto',
  },
});

export default NameGenderRow;

