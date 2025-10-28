// #region 1. File Banner & TOC
/**
 * useOtherUserProfilePage - Main State Management
 * 
 * 对方用户主页的主状态管理
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Hook Implementation
 * [4] Export
 */
// #endregion

// #region 2. Imports

import { useAuthGuard } from '@/src/utils/auth/AuthGuard';
import { useProfileStore } from '@/stores/profileStore';
import { useCallback, useEffect, useState } from 'react';
import type { OtherUserInfo, TabType } from './types';

// #endregion

// #region 3. Hook Implementation

/**
 * 对方用户主页主状态管理
 */
export const useOtherUserProfilePage = (userId: string) => {
  const { requireAuth, isAuthenticated } = useAuthGuard();
  
  // Profile store
  const { loadUserProfile, followUser, unfollowUser } = useProfileStore();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  
  // Local state
  const [activeTab, setActiveTab] = useState<TabType>('dynamics');
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load user profile on mount
  useEffect(() => {
    console.log('[OtherUserProfile] Loading user profile:', userId);
    loadUserProfile(userId);
  }, [userId, loadUserProfile]);
  
  // Update following status
  useEffect(() => {
    if (currentProfile) {
      // TODO: Get actual follow status from backend
      setIsFollowing(false);
    }
  }, [currentProfile]);
  
  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);
  
  /**
   * Handle follow toggle
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
      } else {
        await followUser(Number(userId));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    } finally {
      setActionLoading(false);
    }
  }, [isFollowing, userId, requireAuth, followUser, unfollowUser]);
  
  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserProfile(userId);
    setRefreshing(false);
  }, [userId, loadUserProfile]);
  
  // Helper: Convert gender string to number
  const convertGender = (gender?: string): number | undefined => {
    if (!gender) return undefined;
    switch (gender) {
      case 'male': return 1;
      case 'female': return 2;
      default: return 0;
    }
  };
  
  // Transform profile data
  const userInfo: OtherUserInfo | null = currentProfile ? {
    id: currentProfile.id,
    nickname: currentProfile.nickname,
    avatar: currentProfile.avatar,
    backgroundImage: currentProfile.backgroundImage,
    bio: currentProfile.bio,
    gender: convertGender(currentProfile.gender) as number | undefined,
    age: currentProfile.age,
    location: currentProfile.location,
    occupation: currentProfile.occupations?.[0],
    
    isVip: currentProfile.isVip || false,
    isRealVerified: currentProfile.isRealVerified || false,
    isGodVerified: currentProfile.isGodVerified || false,
    isPopular: currentProfile.isPopular || false,
    
    isOnline: currentProfile.isOnline,
    
    followerCount: currentProfile.followerCount || 0,
    followingCount: currentProfile.followingCount || 0,
    likeCount: currentProfile.likeCount || 0,
    postCount: currentProfile.postCount || 0,
    
    height: currentProfile.height,
    weight: currentProfile.weight,
    skills: currentProfile.skills,
    wechat: currentProfile.wechat,
    phone: currentProfile.phone,
    
    createdAt: currentProfile.createdAt || '',
    distance: undefined,
  } : null;
  
  return {
    // Data
    userInfo,
    activeTab,
    isFollowing,
    loading,
    error,
    actionLoading,
    refreshing,
    isAuthenticated,
    
    // Actions
    handleTabChange,
    handleFollowToggle,
    handleRefresh,
  };
};

// #endregion

// #region 4. Export

export default useOtherUserProfilePage;

// #endregion

