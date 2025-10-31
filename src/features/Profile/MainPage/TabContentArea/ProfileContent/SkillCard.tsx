/**
 * SkillCard - 技能卡片组件
 * 
 * 显示内容：
 * - 技能图标（64x64）
 * - 技能名称
 * - 技能类型（game/lifestyle）
 * - 价格信息
 * - 评分信息
 * 
 * UI规范：
 * - 水平布局
 * - 圆角8px
 * - 淡紫色背景
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SkillItem } from '../../types';

// #region Types
interface SkillCardProps {
  skill: SkillItem;
  onPress: () => void;
}
// #endregion

// #region Constants
const SKILL_ICON_SIZE = 56;
const DEFAULT_SKILL_ICON = 'https://via.placeholder.com/56';
// #endregion

// #region Utils
// 格式化价格显示
const formatPrice = (price?: number): string => {
  if (!price) return '暂未设置价格';
  return `¥${price}`;
};

// 格式化评分显示
const formatRating = (rating?: number): string => {
  if (!rating) return '暂无评分';
  return rating.toFixed(1);
};

// 获取技能类型显示文本
const getSkillTypeText = (type: 'game' | 'lifestyle'): string => {
  if (type === 'game') return '游戏陪玩';
  if (type === 'lifestyle') return '生活服务';
  return '其他';
};
// #endregion

const SkillCard: React.FC<SkillCardProps> = ({ skill, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 技能图标 */}
      <Image
        source={{ uri: skill.icon || DEFAULT_SKILL_ICON }}
        style={styles.icon}
      />

      {/* 技能信息 */}
      <View style={styles.info}>
        {/* 技能名称 + 类型 */}
        <View style={styles.titleRow}>
          <Text style={styles.skillName} numberOfLines={1}>
            {skill.name}
          </Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>
              {getSkillTypeText(skill.type)}
            </Text>
          </View>
        </View>

        {/* 价格 + 评分 */}
        <View style={styles.detailsRow}>
          {/* 价格 */}
          {skill.price !== undefined && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(skill.price)}</Text>
              <Text style={styles.priceUnit}>/小时</Text>
            </View>
          )}

          {/* 评分 */}
          {skill.rating !== undefined && skill.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.rating}>{formatRating(skill.rating)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 箭头图标 */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#BDBDBD"
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F5FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8D5FF',
  },
  icon: {
    width: SKILL_ICON_SIZE,
    height: SKILL_ICON_SIZE,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#8A2BE2',
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    color: '#8A2BE2',
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});

export default SkillCard;

