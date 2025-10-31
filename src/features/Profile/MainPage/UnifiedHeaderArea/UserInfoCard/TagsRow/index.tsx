/**
 * TagsRow - 标签行组件
 * 
 * 功能：
 * - 显示认证标签（真人认证、大神、VIP）
 * - 支持自定义标签
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CARD_COLORS, CARD_SIZES, LABELS } from '../constants';
import type { TagsRowProps } from '../types';

const TagsRow: React.FC<TagsRowProps> = ({
  isRealVerified = false,
  isGodVerified = false,
  isVipVerified = false,
  customTags = [],
}) => {
  const tags = [];

  // 真人认证
  if (isRealVerified) {
    tags.push({
      text: LABELS.REAL_VERIFIED,
      backgroundColor: CARD_COLORS.REAL_VERIFIED_BG,
      textColor: CARD_COLORS.REAL_VERIFIED_TEXT,
      icon: 'checkmark-circle',
    });
  }

  // 大神认证
  if (isGodVerified) {
    tags.push({
      text: LABELS.GOD_VERIFIED,
      backgroundColor: CARD_COLORS.GOD_VERIFIED_BG,
      textColor: CARD_COLORS.GOD_VERIFIED_TEXT,
      icon: 'star',
    });
  }

  // VIP认证
  if (isVipVerified) {
    tags.push({
      text: LABELS.VIP_VERIFIED,
      backgroundColor: CARD_COLORS.VIP_VERIFIED_BG,
      textColor: CARD_COLORS.VIP_VERIFIED_TEXT,
      icon: 'diamond',
    });
  }

  // 自定义标签
  tags.push(...customTags);

  if (tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <View
          key={`tag-${index}`}
          style={[styles.tag, { backgroundColor: tag.backgroundColor }]}
        >
          {tag.icon && (
            <Ionicons
              name={tag.icon as any}
              size={CARD_SIZES.ICON_SMALL}
              color={tag.textColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.tagText, { color: tag.textColor }]}>
            {tag.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  tagText: {
    fontSize: CARD_SIZES.FONT_TAG,
    fontWeight: '600',
  },
});

export default TagsRow;

