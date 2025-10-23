/**
 * MainPage - 类型定义
 */

import type { StyleProp, ViewStyle } from 'react-native';
import type { TabType, UserProfile } from '../types';

/**
 * MainPage Props
 */
export interface MainPageProps {
  userId?: string;
  initialTab?: TabType;
  style?: StyleProp<ViewStyle>;
}

/**
 * BackgroundArea Props
 */
export interface BackgroundAreaProps {
  imageUrl?: string;
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * UserInfoArea Props
 */
export interface UserInfoAreaProps {
  userInfo: UserProfile;
  isOwnProfile: boolean;
  onEditPress?: () => void;
  onFollowPress?: () => void;
  onAvatarPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * SocialStatsArea Props
 */
export interface SocialStatsAreaProps {
  followingCount: number;
  followerCount: number;
  likeCount: number;
  collectCount: number;
  onFollowingPress: () => void;
  onFollowerPress: () => void;
  onLikePress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TabNavigationArea Props
 */
export interface TabNavigationAreaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TabContentArea Props
 */
export interface TabContentAreaProps {
  activeTab: TabType;
  userId: string;
  isOwnProfile: boolean;
  style?: StyleProp<ViewStyle>;
}

