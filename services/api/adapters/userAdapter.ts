/**
 * 用户数据适配器
 * 负责后端数据结构到前端数据结构的转换
 */

import type { UserCard } from '@/src/features/Homepage/MainPage/types';

// ===== 后端数据类型定义 =====

/**
 * 后端UserProfileVO类型
 */
export interface UserProfileVO {
  userId: number;
  nickname: string | null;
  avatar: string | null;
  avatarThumbnail: string | null;
  backgroundImage: string | null;
  gender: number | null;
  genderDesc: string | null;
  birthday: string | null;
  age: number | null;
  ageRange: string | null;
  
  // 位置信息
  cityId: number | null;
  cityName: string | null;
  location: string | null;
  address: string | null;
  ipLocation: string | null;
  
  // 个人资料
  bio: string | null;
  height: number | null;
  weight: number | null;
  
  // 联系方式
  wechat: string | null;
  wechatUnlockCondition: number | null;
  
  // 认证标识
  isRealVerified: boolean;
  isGodVerified: boolean;
  isActivityExpert: boolean;
  isVip: boolean;
  isPopular: boolean;
  vipLevel: number | null;
  vipExpireTime: string | null;
  
  // 在线状态
  onlineStatus: number;
  onlineStatusDesc: string;
  isOnline: boolean;
  lastOnlineTime: string | null;
  
  // 资料完整度
  profileCompleteness: number;
  
  // 扩展信息
  occupations: UserOccupationVO[] | null;
  stats: UserStatsVO | null;
  
  // 关系状态
  isFollowed: boolean;
  isMutualFollow: boolean;
  
  // 系统字段
  createdAt: string;
  updatedAt: string;
}

/**
 * 后端UserStatsVO类型
 */
export interface UserStatsVO {
  userId: number;
  followerCount: number;
  followingCount: number;
  contentCount: number;
  totalLikeCount: number;
  totalCollectCount: number;
  activityOrganizerCount: number;
  activityParticipantCount: number;
  activitySuccessCount: number;
  activityCancelCount: number;
  activityOrganizerScore: number;
  activitySuccessRate: number;
  isActive: boolean;
  isPopular: boolean;
}

/**
 * 后端UserOccupationVO类型
 */
export interface UserOccupationVO {
  id: number;
  userId: number;
  occupationCode: string;
  name: string;
  category: string;
  sortOrder: number;
}

/**
 * 后端ServiceStatsVO类型
 */
export interface ServiceStatsVO {
  serviceId: number;
  serviceType: number;
  serviceCount: number;
  avgRating: number;
  goodRate: number;
  avgResponseMinutes: number;
  totalRevenue: number;
}

// ===== 数据适配器类 =====

/**
 * 用户数据适配器
 */
export class UserDataAdapter {
  /**
   * UserProfileVO → UserCard
   * 完整的用户数据转换
   */
  static transformUserProfile(
    profile: UserProfileVO,
    options?: {
      distance?: number;
      serviceInfo?: Partial<ServiceStatsVO>;
      photoUrls?: string[];
    }
  ): UserCard {
    return {
      // 基础信息
      id: profile.userId ? String(profile.userId) : `temp-${Date.now()}-${Math.random()}`,
      avatar: profile.avatar || profile.avatarThumbnail || this.getDefaultAvatar(),
      username: profile.nickname || `用户${profile.userId || '未知'}`,
      age: profile.age || 0,
      bio: profile.bio || '这个家伙很懒惰，没有填写简介',
      
      // 服务信息
      services: this.extractServices(profile.occupations),
      
      // 地理位置
      distance: options?.distance || 0,
      region: profile.location || profile.cityName || '',
      
      // 在线状态
      status: this.mapOnlineStatus(profile.onlineStatus),
      
      // 用户照片
      photos: options?.photoUrls || [],
      
      // 价格信息（可选）
      price: this.formatPrice(options?.serviceInfo),
      
      // 评分信息
      rating: options?.serviceInfo?.avgRating,
      reviewCount: options?.serviceInfo?.serviceCount,
      
      // 最后活跃时间
      lastActive: profile.lastOnlineTime ? new Date(profile.lastOnlineTime).getTime() : undefined,
      
      // 扩展字段
      isOnline: profile.isOnline,
      isRealVerified: profile.isRealVerified,
      isGodVerified: profile.isGodVerified,
      isVip: profile.isVip,
      vipLevel: profile.vipLevel || undefined,
      cityId: profile.cityId || undefined,
      cityName: profile.cityName || undefined,
      
      // 统计数据
      stats: profile.stats ? {
        followerCount: profile.stats.followerCount || 0,
        contentCount: profile.stats.contentCount || 0,
        totalLikeCount: profile.stats.totalLikeCount || 0,
      } : undefined,
    };
  }
  
  /**
   * 批量转换用户列表
   */
  static transformUserList(
    profiles: UserProfileVO[],
    currentLocation?: { latitude: number; longitude: number }
  ): UserCard[] {
    return profiles.map(profile => {
      // 计算距离（如果有位置信息）
      const distance = currentLocation ? 
        this.calculateDistance(currentLocation, profile) : 0;
      
      return this.transformUserProfile(profile, { distance });
    });
  }
  
  /**
   * 在线状态映射
   * 后端: 0=离线, 1=在线, 2=忙碌, 3=隐身
   * 前端: 'online' | 'available' | 'offline'
   */
  static mapOnlineStatus(status: number): 'online' | 'available' | 'offline' {
    switch (status) {
      case 1: return 'online';    // 在线
      case 2: return 'available'; // 忙碌→可预约
      case 3: return 'offline';   // 隐身→离线
      default: return 'offline';  // 离线
    }
  }
  
  /**
   * 提取服务列表
   */
  static extractServices(occupations: UserOccupationVO[] | null): string[] {
    if (!occupations || occupations.length === 0) {
      return ['模特']; // 默认服务
    }
    
    return occupations
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(o => o.name)
      .slice(0, 5); // 最多显示5个
  }
  
  /**
   * 格式化价格显示
   */
  static formatPrice(serviceInfo?: Partial<ServiceStatsVO>): string | undefined {
    if (!serviceInfo) return undefined;
    
    const { avgRating, serviceCount } = serviceInfo;
    
    // 根据评分和服务次数估算价格（示例逻辑）
    if (avgRating && avgRating >= 4.5) {
      return '¥80-150/小时';
    } else if (avgRating && avgRating >= 4.0) {
      return '¥50-100/小时';
    } else if (serviceCount && serviceCount > 0) {
      return '¥30-80/小时';
    }
    
    return undefined;
  }
  
  /**
   * 计算两点间距离（Haversine公式）
   */
  static calculateDistance(
    from: { latitude: number; longitude: number },
    profile: UserProfileVO
  ): number {
    // 如果用户没有位置信息，返回0
    if (!profile.location) return 0;
    
    // 从location字段解析经纬度（假设格式为"lat,lng"）
    // 实际应该从数据库的POINT字段获取
    // 这里作为示例实现
    
    // TODO: 后端需要在UserProfileVO中添加latitude和longitude字段
    // 或者在API响应中包含计算好的distance
    
    const R = 6371; // 地球半径（公里）
    
    // 临时：如果后端没有经纬度，返回随机距离（开发阶段）
    return Math.round(Math.random() * 10 * 10) / 10;
  }
  
  /**
   * 获取默认头像
   */
  static getDefaultAvatar(): string {
    return 'https://via.placeholder.com/100/8B5CF6/FFFFFF?text=User';
  }
  
  /**
   * 格式化距离显示
   */
  static formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }
  
  /**
   * 判断用户是否最近活跃
   * 规则：24小时内有活动
   */
  static isRecentlyActive(lastOnlineTime: string | null): boolean {
    if (!lastOnlineTime) return false;
    
    const last = new Date(lastOnlineTime).getTime();
    const now = Date.now();
    const hoursDiff = (now - last) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  }
  
  /**
   * 筛选优质用户（精选用户条件）
   */
  static filterFeaturedUsers(profiles: UserProfileVO[]): UserProfileVO[] {
    return profiles.filter(profile => {
      // 条件1: 实名认证
      if (!profile.isRealVerified) return false;
      
      // 条件2: 最近活跃
      if (!this.isRecentlyActive(profile.lastOnlineTime)) return false;
      
      // 条件3: 资料完整度 >= 80%
      if (profile.profileCompleteness < 80) return false;
      
      // 条件4: VIP用户优先或高评分用户
      const isQualified = profile.isVip || 
                          (profile.stats?.isPopular) ||
                          (profile.stats && profile.stats.followerCount > 100);
      
      return isQualified;
    });
  }
  
  /**
   * 排序用户列表
   */
  static sortUsers(
    profiles: UserProfileVO[],
    sortBy: 'distance' | 'rating' | 'newest' | 'popular' = 'distance'
  ): UserProfileVO[] {
    const sorted = [...profiles];
    
    switch (sortBy) {
      case 'distance':
        // 按距离排序（需要先计算距离）
        return sorted;
      
      case 'rating':
        // 按评分排序
        return sorted.sort((a, b) => {
          const ratingA = a.stats?.activityOrganizerScore || 0;
          const ratingB = b.stats?.activityOrganizerScore || 0;
          return ratingB - ratingA;
        });
      
      case 'newest':
        // 按注册时间排序
        return sorted.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });
      
      case 'popular':
        // 按人气排序
        return sorted.sort((a, b) => {
          const popularA = (a.stats?.followerCount || 0) + (a.stats?.totalLikeCount || 0);
          const popularB = (b.stats?.followerCount || 0) + (b.stats?.totalLikeCount || 0);
          return popularB - popularA;
        });
      
      default:
        return sorted;
    }
  }
}

// ===== 导出类型 =====
export type {
    ServiceStatsVO, UserOccupationVO, UserProfileVO,
    UserStatsVO
};

