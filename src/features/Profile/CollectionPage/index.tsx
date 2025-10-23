// #region 1. File Banner & TOC
/**
 * CollectionPage - 收藏页（占位符）
 * 
 * 功能：
 * - 瀑布流展示收藏内容
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface CollectionPageProps {
  userId: string;
}

const COLORS = {
  GRAY_BG: '#F5F5F5',
  TEXT_SECONDARY: '#757575',
} as const;
// #endregion

// #region 8. UI Components & Rendering
const CollectionPage: React.FC<CollectionPageProps> = ({ userId }) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>⭐</Text>
        <Text style={styles.placeholderText}>收藏页面</Text>
        <Text style={styles.placeholderSubtext}>待实现收藏内容列表</Text>
      </View>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_BG,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default CollectionPage;
// #endregion

