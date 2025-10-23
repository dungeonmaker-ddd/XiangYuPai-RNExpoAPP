/**
 * Profile API - 用户资料相关API接口
 * 
 * 对接后端：xypai-user模块
 * - 用户资料查询和更新
 * - 在线状态管理
 * - 资料完整度
 * - 用户统计数据
 * - 职业标签管理
 * - 用户关系（关注/粉丝）
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

// #region 类型定义

/**
 * 用户资料VO（完整版42字段）
 * 对应后端：UserProfileVO
 */
export interface UserProfileVO {
  userId: number;
  nickname: string;
  avatar: string;
  avatarThumbnail?: string;
  backgroundImage?: string;
  
  // 基本信息
  gender: number;  // 0=未设置, 1=男, 2=女, 3=其他
  genderDesc: string;
  birthday?: string;  // YYYY-MM-DD
  age?: number;
  ageRange?: string;
  
  // 位置信息
  cityId?: number;
  cityName?: string;
  location?: string;
  address?: string;
  ipLocation?: string;
  
  // 详细资料
  bio?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  bmiLevel?: string;
  realName?: string;
  
  // 微信信息
  wechat?: string;
  wechatMasked?: string;
  wechatUnlockCondition: number;  // 0=公开, 1=关注后, 2=付费, 3=私密
  wechatUnlockDesc?: string;
  canViewWechat: boolean;
  
  // 认证标识
  isRealVerified: boolean;
  isGodVerified: boolean;
  isActivityExpert: boolean;
  isVip: boolean;
  isVipValid: boolean;
  isPopular: boolean;
  vipLevel: number;
  vipExpireTime?: string;
  
  // 在线状态
  onlineStatus: number;  // 0=离线, 1=在线, 2=忙碌, 3=隐身
  onlineStatusDesc: string;
  isOnline: boolean;
  lastOnlineTime?: string;
  
  // 资料完整度
  profileCompleteness: number;  // 0-100
  completenessLevel: string;
  isProfileComplete: boolean;
  lastEditTime?: string;
  
  // 职业标签
  occupations: UserOccupationVO[];
  
  // 统计数据
  stats: UserStatsVO;
  
  // 关系状态
  isFollowed: boolean;
  isMutualFollow: boolean;
  isBlocked: boolean;
  
  // 时间
  createdAt: string;
  updatedAt: string;
  version: number;
}

/**
 * 用户统计VO
 */
export interface UserStatsVO {
  userId: number;
  followerCount: number;      // 粉丝数
  followingCount: number;     // 关注数
  contentCount: number;       // 内容数
  totalLikeCount: number;     // 获赞总数
  totalCollectCount: number;  // 收藏总数
  activityOrganizerCount: number;
  activityParticipantCount: number;
  activitySuccessCount: number;
  activityCancelCount: number;
  activityOrganizerScore: number;
  activitySuccessRate: number;
  lastSyncTime: string;
  isActive: boolean;
  isPopular: boolean;
  isQualityOrganizer: boolean;
  followerFollowingRatio: number;
}

/**
 * 用户职业VO
 */
export interface UserOccupationVO {
  id: number;
  userId: number;
  occupationCode: string;
  occupationName: string;
  category: string;
  iconUrl?: string;
  sortOrder: number;
  createdAt: string;
  isPrimary: boolean;
}

/**
 * 资料完整度VO
 */
export interface ProfileCompletenessVO {
  userId: number;
  currentScore: number;        // 0-100
  level: string;               // 优秀/良好/一般/较差/极差
  isComplete: boolean;         // ≥80%
  coreFieldsScore: number;     // 核心字段得分（满分50）
  extendedFieldsScore: number; // 扩展字段得分（满分50）
  suggestions: string[];       // 完善建议
  completedItems: string[];    // 已完成项
  remainingScore: number;      // 距离完整还需多少分
  percentage: number;          // 完整度百分比
  progressColor: string;       // success/warning/danger
  message: string;
}

/**
 * 用户资料更新DTO
 */
export interface UserProfileUpdateDTO {
  userId?: number;
  nickname?: string;
  avatar?: string;
  avatarThumbnail?: string;
  backgroundImage?: string;
  gender?: number;
  birthday?: string;
  cityId?: number;
  location?: string;
  address?: string;
  bio?: string;
  height?: number;
  weight?: number;
  realName?: string;
  wechat?: string;
  wechatUnlockCondition?: number;
  onlineStatus?: number;
  version?: number;
}

/**
 * 职业更新DTO
 */
export interface UserOccupationUpdateDTO {
  occupationCodes: string[];  // 最多5个
  keepSortOrder?: boolean;
}

/**
 * 职业字典VO
 */
export interface OccupationDictVO {
  code: string;
  name: string;
  category: string;
  iconUrl?: string;
  sortOrder: number;
  status: number;
  statusDesc: string;
  createdAt: string;
  hasIcon: boolean;
}

// #endregion

// #region API实现

/**
 * Profile API类
 */
class ProfileAPI {
  /**
   * 获取用户资料（完整版42字段）
   * GET /api/v2/user/profile/{userId}
   */
  async getUserProfile(userId: number): Promise<UserProfileVO> {
    const response = await apiClient.get<UserProfileVO>(
      `${API_ENDPOINTS.PROFILE.USER_PROFILE}/${userId}`
    );
    return response.data;
  }
  
  /**
   * 获取当前用户资料
   * GET /api/v2/user/profile/current
   */
  async getCurrentUserProfile(): Promise<UserProfileVO> {
    const response = await apiClient.get<UserProfileVO>(
      API_ENDPOINTS.PROFILE.CURRENT_PROFILE
    );
    return response.data;
  }
  
  /**
   * 更新用户资料
   * PUT /api/v2/user/profile/{userId}
   */
  async updateUserProfile(
    userId: number,
    data: UserProfileUpdateDTO
  ): Promise<void> {
    await apiClient.put(
      `${API_ENDPOINTS.PROFILE.USER_PROFILE}/${userId}`,
      data
    );
  }
  
  /**
   * 更新当前用户资料
   * PUT /api/v2/user/profile/current
   */
  async updateCurrentUserProfile(data: UserProfileUpdateDTO): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.PROFILE.CURRENT_PROFILE,
      data
    );
  }
  
  /**
   * 更新在线状态
   * PUT /api/v2/user/profile/{userId}/online-status?onlineStatus=X
   */
  async updateOnlineStatus(
    userId: number,
    onlineStatus: number
  ): Promise<void> {
    await apiClient.put(
      `${API_ENDPOINTS.PROFILE.USER_PROFILE}/${userId}/online-status?onlineStatus=${onlineStatus}`
    );
  }
  
  /**
   * 用户上线
   * PUT /api/v2/user/profile/current/go-online
   */
  async goOnline(): Promise<void> {
    await apiClient.put(API_ENDPOINTS.PROFILE.GO_ONLINE);
  }
  
  /**
   * 用户离线
   * PUT /api/v2/user/profile/current/go-offline
   */
  async goOffline(): Promise<void> {
    await apiClient.put(API_ENDPOINTS.PROFILE.GO_OFFLINE);
  }
  
  /**
   * 用户隐身
   * PUT /api/v2/user/profile/current/go-invisible
   */
  async goInvisible(): Promise<void> {
    await apiClient.put(API_ENDPOINTS.PROFILE.GO_INVISIBLE);
  }
  
  /**
   * 检查用户是否在线
   * GET /api/v2/user/profile/{userId}/is-online
   */
  async isUserOnline(userId: number): Promise<boolean> {
    const response = await apiClient.get<boolean>(
      `${API_ENDPOINTS.PROFILE.USER_PROFILE}/${userId}/is-online`
    );
    return response.data;
  }
  
  /**
   * 获取资料完整度
   * GET /api/v2/user/profile/{userId}/completeness
   */
  async getProfileCompleteness(userId: number): Promise<ProfileCompletenessVO> {
    const response = await apiClient.get<ProfileCompletenessVO>(
      `${API_ENDPOINTS.PROFILE.USER_PROFILE}/${userId}/completeness`
    );
    return response.data;
  }
  
  /**
   * 获取当前用户资料完整度
   * GET /api/v2/user/profile/current/completeness
   */
  async getCurrentUserCompleteness(): Promise<ProfileCompletenessVO> {
    const response = await apiClient.get<ProfileCompletenessVO>(
      `${API_ENDPOINTS.PROFILE.CURRENT_PROFILE}/completeness`
    );
    return response.data;
  }
  
  /**
   * 获取用户统计
   * GET /api/v1/users/stats/{userId}
   */
  async getUserStats(userId: number): Promise<UserStatsVO> {
    const response = await apiClient.get<UserStatsVO>(
      `${API_ENDPOINTS.USER_STATS.STATS}/${userId}`
    );
    return response.data;
  }
  
  /**
   * 获取当前用户统计
   * GET /api/v1/users/stats/current
   */
  async getCurrentUserStats(): Promise<UserStatsVO> {
    const response = await apiClient.get<UserStatsVO>(
      API_ENDPOINTS.USER_STATS.CURRENT
    );
    return response.data;
  }
  
  /**
   * 批量查询用户统计
   * POST /api/v1/users/stats/batch
   */
  async getBatchUserStats(userIds: number[]): Promise<UserStatsVO[]> {
    const response = await apiClient.post<UserStatsVO[]>(
      API_ENDPOINTS.USER_STATS.BATCH,
      userIds
    );
    return response.data;
  }
  
  /**
   * 获取人气用户排行
   * GET /api/v1/users/stats/popular?limit=X
   */
  async getPopularUsers(limit: number = 10): Promise<UserStatsVO[]> {
    const response = await apiClient.get<UserStatsVO[]>(
      `${API_ENDPOINTS.USER_STATS.POPULAR}?limit=${limit}`
    );
    return response.data;
  }
  
  /**
   * 查询用户职业
   * GET /api/v1/occupation/user/{userId}
   */
  async getUserOccupations(userId: number): Promise<UserOccupationVO[]> {
    const response = await apiClient.get<UserOccupationVO[]>(
      `${API_ENDPOINTS.OCCUPATION.USER}/${userId}`
    );
    return response.data;
  }
  
  /**
   * 查询当前用户职业
   * GET /api/v1/occupation/current
   */
  async getCurrentUserOccupations(): Promise<UserOccupationVO[]> {
    const response = await apiClient.get<UserOccupationVO[]>(
      API_ENDPOINTS.OCCUPATION.CURRENT
    );
    return response.data;
  }
  
  /**
   * 更新用户职业
   * PUT /api/v1/occupation/user/{userId}
   */
  async updateUserOccupations(
    userId: number,
    data: UserOccupationUpdateDTO
  ): Promise<void> {
    await apiClient.put(
      `${API_ENDPOINTS.OCCUPATION.USER}/${userId}`,
      data
    );
  }
  
  /**
   * 更新当前用户职业
   * PUT /api/v1/occupation/current
   */
  async updateCurrentUserOccupations(
    data: UserOccupationUpdateDTO
  ): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.OCCUPATION.CURRENT,
      data
    );
  }
  
  /**
   * 添加职业标签
   * POST /api/v1/occupation/user/{userId}/add?occupationCode=X
   */
  async addUserOccupation(
    userId: number,
    occupationCode: string
  ): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.OCCUPATION.USER}/${userId}/add?occupationCode=${occupationCode}`
    );
  }
  
  /**
   * 删除职业标签
   * DELETE /api/v1/occupation/user/{userId}/remove?occupationCode=X
   */
  async removeUserOccupation(
    userId: number,
    occupationCode: string
  ): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.OCCUPATION.USER}/${userId}/remove?occupationCode=${occupationCode}`
    );
  }
  
  /**
   * 查询所有职业
   * GET /api/v1/occupation/list
   */
  async getAllOccupations(): Promise<OccupationDictVO[]> {
    const response = await apiClient.get<OccupationDictVO[]>(
      API_ENDPOINTS.OCCUPATION.LIST
    );
    return response.data;
  }
  
  /**
   * 根据分类查询职业
   * GET /api/v1/occupation/category/{category}
   */
  async getOccupationsByCategory(category: string): Promise<OccupationDictVO[]> {
    const response = await apiClient.get<OccupationDictVO[]>(
      `${API_ENDPOINTS.OCCUPATION.CATEGORY}/${category}`
    );
    return response.data;
  }
  
  /**
   * 关注用户
   * POST /api/v1/relations/follow/{targetUserId}
   */
  async followUser(targetUserId: number): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.RELATION.FOLLOW}/${targetUserId}`
    );
  }
  
  /**
   * 取消关注
   * DELETE /api/v1/relations/follow/{targetUserId}
   */
  async unfollowUser(targetUserId: number): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.RELATION.FOLLOW}/${targetUserId}`
    );
  }
  
  /**
   * 获取关注列表
   * GET /api/v1/relations/following
   */
  async getFollowingList(params?: {
    userId?: number;
    pageNum?: number;
    pageSize?: number;
  }): Promise<{ total: number; rows: any[] }> {
    const queryString = params 
      ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}`
      : '';
    const response = await apiClient.get<{ total: number; rows: any[] }>(
      `${API_ENDPOINTS.RELATION.FOLLOWING}${queryString}`
    );
    return response.data;
  }
  
  /**
   * 获取粉丝列表
   * GET /api/v1/relations/followers
   */
  async getFollowersList(params?: {
    userId?: number;
    pageNum?: number;
    pageSize?: number;
  }): Promise<{ total: number; rows: any[] }> {
    const queryString = params 
      ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}`
      : '';
    const response = await apiClient.get<{ total: number; rows: any[] }>(
      `${API_ENDPOINTS.RELATION.FOLLOWERS}${queryString}`
    );
    return response.data;
  }
  
  /**
   * 获取指定用户关注列表
   * GET /api/v1/relations/{userId}/following
   */
  async getUserFollowingList(
    userId: number,
    params?: { pageNum?: number; pageSize?: number }
  ): Promise<{ total: number; rows: any[] }> {
    const queryString = params 
      ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}`
      : '';
    const response = await apiClient.get<{ total: number; rows: any[] }>(
      `${API_ENDPOINTS.RELATION.USER_RELATIONS}/${userId}/following${queryString}`
    );
    return response.data;
  }
  
  /**
   * 获取指定用户粉丝列表
   * GET /api/v1/relations/{userId}/followers
   */
  async getUserFollowersList(
    userId: number,
    params?: { pageNum?: number; pageSize?: number }
  ): Promise<{ total: number; rows: any[] }> {
    const queryString = params 
      ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}`
      : '';
    const response = await apiClient.get<{ total: number; rows: any[] }>(
      `${API_ENDPOINTS.RELATION.USER_RELATIONS}/${userId}/followers${queryString}`
    );
    return response.data;
  }
  
  /**
   * 检查用户关系
   * GET /api/v1/relations/check/{targetUserId}
   */
  async checkUserRelation(targetUserId: number): Promise<{
    isFollowed: boolean;
    isMutualFollow: boolean;
    isBlocked: boolean;
  }> {
    const response = await apiClient.get<Record<string, boolean>>(
      `${API_ENDPOINTS.RELATION.CHECK}/${targetUserId}`
    );
    const data = response.data;
    return {
      isFollowed: data.isFollowed || false,
      isMutualFollow: data.isMutualFollow || false,
      isBlocked: data.isBlocked || false,
    };
  }
  
  /**
   * 拉黑用户
   * POST /api/v1/relations/block/{targetUserId}
   */
  async blockUser(targetUserId: number): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.RELATION.BLOCK}/${targetUserId}`
    );
  }
  
  /**
   * 取消拉黑
   * DELETE /api/v1/relations/block/{targetUserId}
   */
  async unblockUser(targetUserId: number): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.RELATION.BLOCK}/${targetUserId}`
    );
  }
}

// #endregion

// #region Mock数据（开发测试用）

/**
 * 生成模拟用户资料
 */
const generateMockProfile = (userId: number): UserProfileVO => {
  return {
    userId,
    nickname: '门前游过一群鸭',
    avatar: 'https://picsum.photos/200/200',
    avatarThumbnail: 'https://picsum.photos/100/100',
    backgroundImage: 'https://picsum.photos/800/600',
    
    gender: 2,  // 女
    genderDesc: '女',
    birthday: '1999-09-29',
    age: 25,
    ageRange: '20-30',
    
    cityId: 440300,
    cityName: '深圳市',
    location: '广东 深圳',
    address: '深圳市南山区',
    ipLocation: '广东 深圳',
    
    bio: '人皮话多不高冷的真实写照',
    height: 162,
    weight: 44,
    bmi: 16.8,
    bmiLevel: '正常',
    realName: '张三',
    
    wechat: 'sunny0301',
    wechatMasked: 'sun***301',
    wechatUnlockCondition: 0,  // 公开
    wechatUnlockDesc: '公开',
    canViewWechat: true,
    
    isRealVerified: true,
    isGodVerified: true,
    isActivityExpert: false,
    isVip: false,
    isVipValid: false,
    isPopular: true,
    vipLevel: 0,
    
    onlineStatus: 1,  // 在线
    onlineStatusDesc: '在线',
    isOnline: true,
    lastOnlineTime: new Date().toISOString(),
    
    profileCompleteness: 85,
    completenessLevel: '优秀',
    isProfileComplete: true,
    lastEditTime: new Date().toISOString(),
    
    occupations: [
      {
        id: 1,
        userId,
        occupationCode: 'model',
        occupationName: '模特',
        category: 'lifestyle',
        iconUrl: '',
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        isPrimary: true,
      },
    ],
    
    stats: {
      userId,
      followerCount: 201,
      followingCount: 201,
      contentCount: 88,
      totalLikeCount: 999,
      totalCollectCount: 150,
      activityOrganizerCount: 10,
      activityParticipantCount: 25,
      activitySuccessCount: 20,
      activityCancelCount: 2,
      activityOrganizerScore: 4.8,
      activitySuccessRate: 90.0,
      lastSyncTime: new Date().toISOString(),
      isActive: true,
      isPopular: true,
      isQualityOrganizer: true,
      followerFollowingRatio: 1.0,
    },
    
    isFollowed: false,
    isMutualFollow: false,
    isBlocked: false,
    
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };
};

/**
 * 生成模拟资料完整度
 */
const generateMockCompleteness = (userId: number): ProfileCompletenessVO => {
  return {
    userId,
    currentScore: 85,
    level: '优秀',
    isComplete: true,
    coreFieldsScore: 45,
    extendedFieldsScore: 40,
    suggestions: [
      '上传更多照片可增加10分',
      '完善技能标签可增加5分',
    ],
    completedItems: [
      '头像',
      '昵称',
      '性别',
      '生日',
      '位置',
      '身高',
      '体重',
      '职业',
    ],
    remainingScore: 15,
    percentage: 85,
    progressColor: 'success',
    message: '资料完整度优秀，继续保持！',
  };
};

/**
 * Mock Profile API（开发环境使用）
 */
export const mockProfileApi = {
  async getUserProfile(userId: number): Promise<UserProfileVO> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockProfile(userId);
  },
  
  async getCurrentUserProfile(): Promise<UserProfileVO> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockProfile(1);  // 当前用户ID=1
  },
  
  async updateUserProfile(
    userId: number,
    data: UserProfileUpdateDTO
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: 更新用户资料', userId, data);
  },
  
  async updateCurrentUserProfile(data: UserProfileUpdateDTO): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: 更新当前用户资料', data);
  },
  
  async getUserStats(userId: number): Promise<UserStatsVO> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockProfile(userId).stats;
  },
  
  async getCurrentUserStats(): Promise<UserStatsVO> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockProfile(1).stats;
  },
  
  async getCurrentUserCompleteness(): Promise<ProfileCompletenessVO> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockCompleteness(1);
  },
  
  async getUserOccupations(userId: number): Promise<UserOccupationVO[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockProfile(userId).occupations;
  },
  
  async updateCurrentUserOccupations(
    data: UserOccupationUpdateDTO
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: 更新职业标签', data);
  },
  
  async getAllOccupations(): Promise<OccupationDictVO[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        code: 'model',
        name: '模特',
        category: 'lifestyle',
        iconUrl: '',
        sortOrder: 1,
        status: 1,
        statusDesc: '启用',
        createdAt: new Date().toISOString(),
        hasIcon: false,
      },
      {
        code: 'student',
        name: '学生',
        category: 'education',
        iconUrl: '',
        sortOrder: 2,
        status: 1,
        statusDesc: '启用',
        createdAt: new Date().toISOString(),
        hasIcon: false,
      },
      {
        code: 'office_worker',
        name: '白领',
        category: 'profession',
        iconUrl: '',
        sortOrder: 3,
        status: 1,
        statusDesc: '启用',
        createdAt: new Date().toISOString(),
        hasIcon: false,
      },
    ];
  },
  
  async followUser(targetUserId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: 关注用户', targetUserId);
  },
  
  async unfollowUser(targetUserId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock: 取消关注', targetUserId);
  },
  
  async checkUserRelation(targetUserId: number): Promise<{
    isFollowed: boolean;
    isMutualFollow: boolean;
    isBlocked: boolean;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      isFollowed: false,
      isMutualFollow: false,
      isBlocked: false,
    };
  },
  
  async getFollowingList(params?: any): Promise<{ total: number; rows: any[] }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total: 201,
      rows: [],  // TODO: 生成模拟关注列表
    };
  },
  
  async getFollowersList(params?: any): Promise<{ total: number; rows: any[] }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total: 201,
      rows: [],  // TODO: 生成模拟粉丝列表
    };
  },
};

// #endregion

// #region 实例和导出

/**
 * Profile API实例
 */
export const profileApi = new ProfileAPI();

// #endregion

