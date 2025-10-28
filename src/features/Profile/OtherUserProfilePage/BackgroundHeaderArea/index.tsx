/**
 * BackgroundHeaderArea - 背景头图区域（现代化完整版）
 * 
 * Features:
 * - 大背景图片（全屏宽度，用户照片）+ 模糊背景选项
 * - 悬浮的返回按钮（左上角）
 * - 用户信息叠加在背景底部（昵称、性别标签、认证标签、位置）
 * - 关注按钮叠加在右上角（支持多种状态）
 * - 底部真实渐变遮罩确保文字可读性
 * - 完整的标签系统（性别、认证、等级、自定义标签）
 * 
 * 设计参考：对方主页-动态.png + 纯结构架构图标准模板
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BACKGROUND_HEIGHT = 500; // 背景图片高度（增加以容纳用户信息）

// 标签类型定义
interface TagItem {
  text: string;
  backgroundColor: string;
  textColor: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface BackgroundHeaderAreaProps {
  backgroundImage?: string;
  nickname: string;
  age?: number;
  gender?: number; // 1: 男, 2: 女
  isRealVerified?: boolean; // 真人认证
  isGodVerified?: boolean; // 大神认证
  isVipVerified?: boolean; // VIP认证
  isBookable?: boolean; // 可预约
  distance?: number; // 距离（km）
  followerCount?: number; // 粉丝数
  isFollowing?: boolean; // 是否已关注
  isMutualFollowing?: boolean; // 是否互相关注
  customTags?: TagItem[]; // 自定义标签数组
  onFollowPress?: () => void;
  onShare?: () => void;
}

const BackgroundHeaderArea: React.FC<BackgroundHeaderAreaProps> = ({
  backgroundImage,
  nickname,
  age,
  gender,
  isRealVerified = false,
  isGodVerified = false,
  isVipVerified = false,
  isBookable = false,
  distance,
  followerCount,
  isFollowing = false,
  isMutualFollowing = false,
  customTags = [],
  onFollowPress,
  onShare,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  // 格式化粉丝数
  const formatCount = (count?: number): string => {
    if (!count) return '0';
    if (count >= 10000) return `${(count / 10000).toFixed(1)}w`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  // 获取性别标签文字
  const getGenderText = (): string => {
    if (gender === 2) return '女孩';
    if (gender === 1) return '男生';
    return '';
  };

  // 构建认证标签数组
  const buildVerificationTags = (): TagItem[] => {
    const tags: TagItem[] = [];
    
    if (isRealVerified) {
      tags.push({
        text: '真人认证',
        backgroundColor: '#E3F2FD',
        textColor: '#2196F3',
        icon: 'checkmark-circle',
      });
    }
    
    if (isGodVerified) {
      tags.push({
        text: '大神',
        backgroundColor: '#FFF3E0',
        textColor: '#FF9800',
        icon: 'star',
      });
    }

    if (isVipVerified) {
      tags.push({
        text: 'VIP',
        backgroundColor: '#F3E5F5',
        textColor: '#9C27B0',
        icon: 'diamond',
      });
    }
    
    return tags;
  };

  // 获取关注按钮文字
  const getFollowButtonText = (): string => {
    if (isMutualFollowing) return '互相关注';
    if (isFollowing) return '已关注';
    return '关注';
  };

  const renderContent = () => {
    const verificationTags = buildVerificationTags();
    const allTags = [...verificationTags, ...customTags];

    return (
      <>
        {/* 底部真实渐变遮罩 - 确保文字可读性 */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />

        {/* 顶部按钮行 */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          {/* 左侧：返回按钮 */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* 右侧：关注按钮（支持三种状态） */}
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
              isMutualFollowing && styles.mutualFollowingButton,
            ]}
            onPress={onFollowPress}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {getFollowButtonText()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 底部用户信息区域 */}
        <View style={styles.userInfoArea}>
          {/* 第一行：昵称 + 性别标签 */}
          <View style={styles.nicknameRow}>
            <Text style={styles.nickname} numberOfLines={1}>
              {nickname}
            </Text>

            {/* 性别标签 - 独立的文字标签 */}
            {gender && getGenderText() && (
              <View
                style={[
                  styles.genderTag,
                  gender === 2 ? styles.femaleGenderTag : styles.maleGenderTag,
                ]}
              >
                <Text style={styles.genderTagText}>{getGenderText()}</Text>
              </View>
            )}
          </View>

          {/* 第二行：认证标签组 + 自定义标签 */}
          {allTags.length > 0 && (
            <View style={styles.verificationTagsRow}>
              {allTags.map((tag, index) => (
                <View
                  key={`tag-${index}`}
                  style={[
                    styles.verificationTag,
                    { backgroundColor: tag.backgroundColor },
                  ]}
                >
                  {tag.icon && (
                    <Ionicons
                      name={tag.icon}
                      size={12}
                      color={tag.textColor}
                      style={styles.tagIcon}
                    />
                  )}
                  <Text style={[styles.verificationTagText, { color: tag.textColor }]}>
                    {tag.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* 第三行：状态信息标签（可预约 + 距离 + 粉丝） */}
          <View style={styles.statusInfoRow}>
            {isBookable && (
              <View style={styles.statusItem}>
                <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
                <Text style={styles.statusItemText}>可预约</Text>
              </View>
            )}

            {distance !== undefined && (
              <View style={styles.statusItem}>
                <Ionicons name="location-outline" size={14} color="#FFFFFF" />
                <Text style={styles.statusItemText}>{distance.toFixed(1)}km</Text>
              </View>
            )}

            {followerCount !== undefined && (
              <TouchableOpacity style={styles.statusItem} activeOpacity={0.7}>
                <Text style={styles.statusItemText}>
                  {formatCount(followerCount)} 粉丝
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={[styles.background, { height: BACKGROUND_HEIGHT }]}
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[styles.background, styles.defaultBackground]}>
          {renderContent()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: BACKGROUND_HEIGHT,
  },
  background: {
    width: SCREEN_WIDTH,
    height: BACKGROUND_HEIGHT,
    justifyContent: 'space-between',
  },
  defaultBackground: {
    backgroundColor: '#A855F7', // 紫色渐变背景（主题色）
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220, // 增加高度以覆盖更多内容
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#8A2BE2', // 紫色渐变
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // 半透明白色
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  mutualFollowingButton: {
    backgroundColor: '#8A2BE2', // 互相关注保持紫色
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followingButtonText: {
    color: '#FFFFFF',
  },
  userInfoArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 10,
    gap: 10,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nickname: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    maxWidth: SCREEN_WIDTH * 0.5, // 限制最大宽度
  },
  // 性别标签样式（胶囊形状，文字标签）
  genderTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10, // 胶囊形状
    alignItems: 'center',
    justifyContent: 'center',
  },
  femaleGenderTag: {
    backgroundColor: '#FFB6C1', // 粉色背景
  },
  maleGenderTag: {
    backgroundColor: '#87CEEB', // 蓝色背景
  },
  genderTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 认证标签组样式
  verificationTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  verificationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  tagIcon: {
    marginRight: 2,
  },
  verificationTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // 状态信息行样式
  statusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BackgroundHeaderArea;
export { BACKGROUND_HEIGHT };

