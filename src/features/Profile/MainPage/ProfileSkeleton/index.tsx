/**
 * ProfileSkeleton - 个人主页骨架屏
 * 
 * 功能：
 * - 显示加载状态的占位符
 * - 模拟真实内容布局
 * - 提供视觉反馈
 */

import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import { COLORS, SIZES } from '../constants';

/**
 * 骨架屏组件
 */
const ProfileSkeleton: React.FC = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  
  // 闪烁动画
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  return (
    <View style={styles.container}>
      {/* 背景区域 */}
      <Animated.View
        style={[
          styles.backgroundArea,
          { opacity: shimmerOpacity },
        ]}
      />
      
      {/* 头像区域 */}
      <View style={styles.avatarArea}>
        <Animated.View
          style={[
            styles.avatar,
            { opacity: shimmerOpacity },
          ]}
        />
      </View>
      
      {/* 用户信息区域 */}
      <View style={styles.userInfoArea}>
        <Animated.View
          style={[
            styles.nameBar,
            { opacity: shimmerOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.bioBar,
            { opacity: shimmerOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.tagsBar,
            { opacity: shimmerOpacity },
          ]}
        />
      </View>
      
      {/* 社交数据区域 */}
      <View style={styles.statsArea}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.statItem}>
            <Animated.View
              style={[
                styles.statValue,
                { opacity: shimmerOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.statLabel,
                { opacity: shimmerOpacity },
              ]}
            />
          </View>
        ))}
      </View>
      
      {/* Tab标签栏 */}
      <View style={styles.tabBar}>
        {[1, 2, 3, 4].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.tabItem,
              { opacity: shimmerOpacity },
            ]}
          />
        ))}
      </View>
      
      {/* 内容区域 */}
      <View style={styles.contentArea}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.contentItem,
              { opacity: shimmerOpacity },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  
  // 背景区域
  backgroundArea: {
    width: '100%',
    height: SIZES.BACKGROUND_HEIGHT,
    backgroundColor: COLORS.GRAY_BG,
  },
  
  // 头像区域
  avatarArea: {
    alignItems: 'center',
    marginTop: -SIZES.AVATAR_OFFSET,
    marginBottom: 12,
  },
  avatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.AVATAR_SIZE / 2,
    backgroundColor: COLORS.GRAY_BG,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
  },
  
  // 用户信息区域
  userInfoArea: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  nameBar: {
    width: 120,
    height: 24,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 12,
    marginBottom: 8,
  },
  bioBar: {
    width: 200,
    height: 16,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagsBar: {
    width: 160,
    height: 24,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 12,
  },
  
  // 社交数据区域
  statsArea: {
    flexDirection: 'row',
    height: SIZES.SOCIAL_STATS_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.DIVIDER,
    marginBottom: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    width: 40,
    height: 20,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 10,
    marginBottom: 4,
  },
  statLabel: {
    width: 30,
    height: 14,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 7,
  },
  
  // Tab标签栏
  tabBar: {
    flexDirection: 'row',
    height: SIZES.TAB_HEIGHT,
    borderBottomWidth: 1,
    borderColor: COLORS.DIVIDER,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 14,
  },
  
  // 内容区域
  contentArea: {
    flex: 1,
    padding: 16,
  },
  contentItem: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default ProfileSkeleton;

