// #region 1. File Banner & TOC
/**
 * CategoryArea - 4宫格消息分类区域
 * 
 * 功能：展示赞和收藏、评论、粉丝、系统通知四个分类入口
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MESSAGE_CATEGORIES } from '../../../constants';
// #endregion

// #region 3. Types & Schema
interface CategoryAreaProps {
  unreadCounts: Record<string, number>;
  onCategoryPress: (type: string) => void;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  background: '#FFFFFF',
  cardBackground: '#F9FAFB',
  text: '#1F2937',
  badge: '#EF4444',
};
// #endregion

// #region 5. Utils & Helpers
// #endregion

// #region 6. State Management
// #endregion

// #region 7. Domain Logic
// #endregion

// #region 8. UI Components & Rendering
const CategoryCard: React.FC<{
  title: string;
  count: number;
  onPress: () => void;
}> = ({ title, count, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.cardTitle}>{title}</Text>
    {count > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const CategoryArea: React.FC<CategoryAreaProps> = ({ unreadCounts, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      {MESSAGE_CATEGORIES.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.title}
          count={unreadCounts[category.id] || 0}
          onPress={() => onCategoryPress(category.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '48%',
    height: 80,
    marginRight: '4%',
    marginBottom: 12,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.badge,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
// #endregion

// #region 9. Exports
export default React.memo(CategoryArea);
export { CategoryArea };
// #endregion
