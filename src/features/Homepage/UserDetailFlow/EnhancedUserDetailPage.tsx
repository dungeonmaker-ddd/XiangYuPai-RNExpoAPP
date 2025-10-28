// #region 1. File Banner & TOC
/**
 * EnhancedUserDetailPage - Enhanced User Detail Modal Page
 * 
 * Features:
 * - Rich user profile display
 * - Real backend data integration
 * - Authentication-aware actions
 * - Guest mode support
 * - Smooth animations
 * - Better UI/UX design
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Store
import { useProfileStore } from '../../../../stores/profileStore';
import { useAuthGuard } from '../../../utils/auth/AuthGuard';

// Types
// #endregion

// #region 3. Types & Schema
interface EnhancedUserDetailPageProps {
  userId: string;
  visible?: boolean;
  onClose?: () => void;
}

interface UserActionResult {
  success: boolean;
  message?: string;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  primary: '#9333EA',
  secondary: '#A855F7',
  white: '#FFFFFF',
  black: '#000000',
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  blue: '#3B82F6',
  pink: '#EC4899',
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

const AVATAR_SIZE = 120;
const BADGE_SIZE = 20;
// #endregion

// #region 5. Utils & Helpers
/**
 * Format numbers with K/W suffix
 */
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

/**
 * Get gender color
 */
const getGenderColor = (gender?: 'male' | 'female' | 'other'): string => {
  switch (gender) {
    case 'male':
      return COLORS.blue;
    case 'female':
      return COLORS.pink;
    default:
      return COLORS.gray400;
  }
};

/**
 * Get online status text and color
 */
const getOnlineStatus = (isOnline?: boolean): { text: string; color: string } => {
  if (isOnline) {
    return { text: '在线', color: COLORS.success };
  }
  return { text: '离线', color: COLORS.gray400 };
};
// #endregion

// #region 6. State Management
// Using Zustand store from profileStore
// #endregion

// #region 7. Domain Logic
const useUserDetailLogic = (userId: string) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuth, isAuthenticated, withAuth } = useAuthGuard();
  
  // Profile store
  const { loadUserProfile, followUser, unfollowUser } = useProfileStore();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  
  // Local state
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Load user profile
  useEffect(() => {
    console.log('[EnhancedUserDetail] 加载用户资料:', userId);
    loadUserProfile(userId);
  }, [userId]);
  
  // Update following status from profile
  useEffect(() => {
    if (currentProfile) {
      // TODO: Get actual follow status from backend
      setIsFollowing(false);
    }
  }, [currentProfile]);
  
  /**
   * Handle follow/unfollow
   */
  const handleFollowToggle = useCallback(async () => {
    if (!requireAuth({ action: '关注用户' })) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      if (isFollowing) {
        await unfollowUser(Number(userId));
        setIsFollowing(false);
        Alert.alert('成功', '已取消关注');
      } else {
        await followUser(Number(userId));
        setIsFollowing(true);
        Alert.alert('成功', '已关注');
      }
    } catch (error) {
      Alert.alert('失败', '操作失败，请重试');
    } finally {
      setActionLoading(false);
    }
  }, [isFollowing, userId, requireAuth, followUser, unfollowUser]);
  
  /**
   * Handle send message
   */
  const handleSendMessage = useCallback(() => {
    if (!requireAuth({ action: '发送消息' })) {
      return;
    }
    
    // TODO: Navigate to chat
    router.push({
      pathname: '/(tabs)/messages/chat/[conversationId]',
      params: { conversationId: `user-${userId}` },
    });
  }, [userId, router, requireAuth]);
  
  /**
   * Handle view full profile
   * 跳转到完整的其他用户主页（使用 OtherUserProfilePage）
   */
  const handleViewFullProfile = useCallback(() => {
    router.push({
      pathname: '/profile/[userId]',
      params: { userId },
    });
  }, [userId, router]);
  
  /**
   * Handle share profile
   */
  const handleShareProfile = useCallback(() => {
    // Guest can share
    Alert.alert('分享', `分享 ${currentProfile?.nickname || '用户'} 的个人主页`);
    // TODO: Implement share functionality
  }, [currentProfile]);
  
  return {
    // Data
    currentProfile,
    loading,
    error,
    isFollowing,
    actionLoading,
    isAuthenticated,
    insets,
    
    // Actions
    handleFollowToggle,
    handleSendMessage,
    handleViewFullProfile,
    handleShareProfile,
  };
};
// #endregion

// #region 8. UI Components & Rendering

/**
 * Loading State
 */
const LoadingView: React.FC = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>加载中...</Text>
  </View>
);

/**
 * Error State
 */
const ErrorView: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <View style={styles.centerContainer}>
    <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>重试</Text>
    </TouchableOpacity>
  </View>
);

/**
 * User Badge Component
 */
const UserBadge: React.FC<{ type: 'vip' | 'verified' | 'god' | 'popular' }> = ({ type }) => {
  const config = {
    vip: { icon: 'star', color: COLORS.warning, label: 'VIP' },
    verified: { icon: 'checkmark-circle', color: COLORS.blue, label: '实名' },
    god: { icon: 'trophy', color: COLORS.warning, label: '大神' },
    popular: { icon: 'flame', color: COLORS.error, label: '人气' },
  }[type];
  
  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Ionicons name={config.icon as any} size={12} color={COLORS.white} />
    </View>
  );
};

/**
 * Stat Item Component
 */
const StatItem: React.FC<{ label: string; value: string | number; onPress?: () => void }> = ({
  label,
  value,
  onPress,
}) => (
  <TouchableOpacity style={styles.statItem} onPress={onPress} disabled={!onPress}>
    <Text style={styles.statValue}>{typeof value === 'number' ? formatCount(value) : value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

/**
 * Info Row Component
 */
const InfoRow: React.FC<{ icon: string; text: string; color?: string }> = ({
  icon,
  text,
  color = COLORS.gray700,
}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={16} color={color} />
    <Text style={[styles.infoText, { color }]}>{text}</Text>
  </View>
);

/**
 * Skill Tag Component
 */
const SkillTag: React.FC<{ skill: string }> = ({ skill }) => (
  <View style={styles.skillTag}>
    <Text style={styles.skillText}>{skill}</Text>
  </View>
);

/**
 * Main Enhanced User Detail Page
 */
const EnhancedUserDetailPage: React.FC<EnhancedUserDetailPageProps> = ({
  userId,
  visible = true,
  onClose,
}) => {
  const {
    currentProfile,
    loading,
    error,
    isFollowing,
    actionLoading,
    isAuthenticated,
    insets,
    handleFollowToggle,
    handleSendMessage,
    handleViewFullProfile,
    handleShareProfile,
  } = useUserDetailLogic(userId);
  
  const router = useRouter();
  
  // Loading state
  if (loading && !currentProfile) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <LoadingView />
        </View>
      </Modal>
    );
  }
  
  // Error state
  if (error && !currentProfile) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <ErrorView error={error} onRetry={() => router.back()} />
        </View>
      </Modal>
    );
  }
  
  if (!currentProfile) {
    return null;
  }
  
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header with Background */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Image
            source={{ uri: currentProfile.backgroundImage || 'https://via.placeholder.com/600x200' }}
            style={styles.headerBackground}
            blurRadius={20}
          />
          <View style={styles.headerOverlay} />
          
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose || (() => router.back())}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={handleShareProfile}>
              <Ionicons name="share-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar and Basic Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: currentProfile.avatar }}
                style={styles.avatar}
              />
              {/* Badges */}
              <View style={styles.badgeContainer}>
                {currentProfile.isVip && <UserBadge type="vip" />}
                {currentProfile.isRealVerified && <UserBadge type="verified" />}
                {currentProfile.isGodVerified && <UserBadge type="god" />}
                {currentProfile.isPopular && <UserBadge type="popular" />}
              </View>
              
              {/* Online Status */}
              {currentProfile.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>
            
            {/* Name and Info */}
            <View style={styles.nameSection}>
              <View style={styles.nameRow}>
                <Text style={styles.nickname}>{currentProfile.nickname}</Text>
                {currentProfile.gender && currentProfile.age && (
                  <View
                    style={[
                      styles.genderAge,
                      { backgroundColor: getGenderColor(currentProfile.gender) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={currentProfile.gender === 'male' ? 'male' : 'female'}
                      size={14}
                      color={getGenderColor(currentProfile.gender)}
                    />
                    <Text style={[styles.ageText, { color: getGenderColor(currentProfile.gender) }]}>
                      {currentProfile.age}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Bio */}
              {currentProfile.bio && (
                <Text style={styles.bio}>{currentProfile.bio}</Text>
              )}
              
              {/* Location and Online Status */}
              <View style={styles.infoRowContainer}>
                {currentProfile.location && (
                  <InfoRow icon="location-outline" text={currentProfile.location} />
                )}
                <InfoRow
                  icon="ellipse"
                  text={getOnlineStatus(currentProfile.isOnline).text}
                  color={getOnlineStatus(currentProfile.isOnline).color}
                />
              </View>
            </View>
          </View>
          
          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatItem
              label="关注"
              value={currentProfile.followingCount || 0}
              onPress={() => {}}
            />
            <View style={styles.statDivider} />
            <StatItem
              label="粉丝"
              value={currentProfile.followerCount || 0}
              onPress={() => {}}
            />
            <View style={styles.statDivider} />
            <StatItem
              label="获赞"
              value={currentProfile.likeCount || 0}
            />
          </View>
          
          {/* Skills/Occupation Tags */}
          {currentProfile.skills && currentProfile.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.sectionTitle}>标签</Text>
              <View style={styles.skillsContainer}>
                {currentProfile.skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </View>
            </View>
          )}
          
          {/* Physical Info */}
          {(currentProfile.height || currentProfile.weight) && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>基本信息</Text>
              <View style={styles.physicalInfo}>
                {currentProfile.height && (
                  <InfoRow icon="resize-outline" text={`身高 ${currentProfile.height}cm`} />
                )}
                {currentProfile.weight && (
                  <InfoRow icon="barbell-outline" text={`体重 ${currentProfile.weight}kg`} />
                )}
              </View>
            </View>
          )}
          
          {/* WeChat Info */}
          {currentProfile.wechat && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>联系方式</Text>
              <View style={styles.wechatInfo}>
                <Ionicons name="logo-wechat" size={20} color={COLORS.success} />
                <Text style={styles.wechatText}>
                  {isAuthenticated ? currentProfile.wechat : '登录后可见'}
                </Text>
              </View>
            </View>
          )}
          
          {/* View Full Profile Button */}
          <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewFullProfile}>
            <Text style={styles.viewProfileText}>查看完整主页</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={{ height: insets.bottom + 100 }} />
        </ScrollView>
        
        {/* Bottom Action Buttons */}
        <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollowToggle}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={isFollowing ? 'checkmark' : 'add'}
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.actionButtonText}>
                  {isFollowing ? '已关注' : '关注'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleSendMessage}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>
              发消息
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  header: {
    height: 180,
    position: 'relative',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: -60,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  genderAge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray700,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.gray300,
  },
  skillsSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  physicalInfo: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  wechatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
  },
  wechatText: {
    fontSize: 15,
    color: COLORS.gray900,
    fontWeight: '500',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewProfileText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 14,
    borderRadius: 12,
  },
  followButton: {
    backgroundColor: COLORS.primary,
  },
  followingButton: {
    backgroundColor: COLORS.gray500,
  },
  messageButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.gray700,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default EnhancedUserDetailPage;
// #endregion

