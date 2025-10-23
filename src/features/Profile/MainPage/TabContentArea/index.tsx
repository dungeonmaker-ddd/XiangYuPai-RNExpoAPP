// #region 1. File Banner & TOC
/**
 * TabContentArea - Tab内容区域
 * 
 * 功能：
 * - 根据activeTab显示不同内容
 * - 集成各个Tab子页面
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import type { TabContentAreaProps } from '../types';

// Tab内容页面
import CollectionPage from '../../CollectionPage';
import DynamicPage from '../../DynamicPage';
import LikesPage from '../../LikesPage';
import ProfileInfoPage from '../../ProfileInfoPage';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
// (简单组件，作为容器)
// #endregion

// #region 8. UI Components & Rendering
const TabContentArea: React.FC<TabContentAreaProps> = ({
  activeTab,
  userId,
  isOwnProfile,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {activeTab === 'profile' && (
        <ProfileInfoPage userId={userId} isOwnProfile={isOwnProfile} />
      )}
      {activeTab === 'dynamic' && (
        <DynamicPage userId={userId} />
      )}
      {activeTab === 'collection' && (
        <CollectionPage userId={userId} />
      )}
      {activeTab === 'likes' && (
        <LikesPage userId={userId} />
      )}
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
});

export default TabContentArea;
// #endregion

