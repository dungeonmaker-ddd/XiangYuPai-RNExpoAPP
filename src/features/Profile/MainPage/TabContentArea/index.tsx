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
import { useProfileStore } from '@/stores/profileStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import type { TabContentAreaProps } from '../types';

// Tab内容组件
import CollectionContent from './CollectionContent';
import DynamicContent from './DynamicContent';
import LikesContent from './LikesContent';
import ProfileContent from './ProfileContent';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
// (简单组件，作为容器)
// #endregion

// #region 8. UI Components & Rendering
const TabContentArea: React.FC<TabContentAreaProps> = ({
  activeTab,
  userId,
  posts,
  loading,
  onPostPress,
  onUserPress,
  onLoadMore,
  style,
}) => {
  // 从 profileStore 获取完整用户资料和技能列表
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const skills = []; // TODO: 从 profileStore 或 API 获取技能列表

  // 判断是否是本人主页（从 props 推断）
  const isOwnProfile = !userId || userId === currentProfile?.id;

  return (
    <View style={[styles.container, style]}>
      {/* 动态Tab */}
      {activeTab === 'dynamic' && (
        <DynamicContent
          posts={posts}
          loading={loading}
          onPostPress={onPostPress}
          onLoadMore={onLoadMore}
        />
      )}

      {/* 收藏Tab */}
      {activeTab === 'collection' && (
        <CollectionContent
          posts={posts}
          loading={loading}
          onPostPress={onPostPress}
          onLoadMore={onLoadMore}
        />
      )}

      {/* 点赞Tab */}
      {activeTab === 'likes' && (
        <LikesContent
          posts={posts}
          loading={loading}
          onPostPress={onPostPress}
          onLoadMore={onLoadMore}
        />
      )}

      {/* 资料Tab */}
      {activeTab === 'profile' && currentProfile && (
        <ProfileContent
          userInfo={currentProfile}
          skills={skills}
          isOwnProfile={isOwnProfile}
          onSkillPress={(skillId) => {
            console.log('查看技能详情:', skillId);
            // TODO: 跳转到技能详情页
          }}
          onAddSkillPress={() => {
            console.log('添加技能');
            // TODO: 跳转到技能添加页
          }}
          onEditInfoPress={() => {
            console.log('编辑个人资料');
            // TODO: 跳转到资料编辑页
          }}
        />
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

