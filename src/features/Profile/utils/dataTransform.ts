/**
 * Profile模块 - 数据转换工具
 * 
 * 功能：
 * - 后端UserProfileVO → 前端UserProfile
 * - 后端UserStatsVO → 前端统计数据
 * - 后端UserOccupationVO → 前端职业标签
 * - 时间格式转换
 * - 数据格式化
 */

import type {
  OccupationDictVO,
  UserOccupationVO,
  UserProfileVO,
  UserStatsVO,
} from '@/services/api/profileApi';
import type { SkillItem, UserProfile } from '../types';

// ==================== 用户资料转换 ====================

/**
 * 将后端UserProfileVO转换为前端UserProfile
 */
export const transformUserProfileVOToProfile = (
  vo: UserProfileVO
): UserProfile => {
  return {
    id: String(vo.userId),
    nickname: vo.nickname,
    avatar: vo.avatar,
    backgroundImage: vo.backgroundImage,
    
    // 基本信息
    gender: mapGender(vo.gender),
    age: vo.age,
    birthday: vo.birthday,
    bio: vo.bio,
    
    // 位置信息
    location: vo.location || vo.cityName,
    city: vo.cityName,
    district: vo.address,
    ipLocation: vo.ipLocation,
    
    // 联系方式
    wechat: vo.canViewWechat ? vo.wechat : vo.wechatMasked,
    wechatLocked: vo.wechatUnlockCondition !== 0,
    
    // 身体信息
    height: vo.height,
    weight: vo.weight,
    
    // 职业信息
    occupations: vo.occupations?.map(o => o.occupationName) || [],
    
    // 认证标识
    isRealVerified: vo.isRealVerified,
    isGodVerified: vo.isGodVerified,
    isVip: vo.isVip,
    vipLevel: vo.vipLevel,
    
    // 在线状态
    isOnline: vo.isOnline,
    onlineStatus: vo.onlineStatus,
    
    // 统计数据（来自stats字段）
    followingCount: vo.stats?.followingCount || 0,
    followerCount: vo.stats?.followerCount || 0,
    likeCount: vo.stats?.totalLikeCount || 0,
    collectCount: vo.stats?.totalCollectCount || 0,
    
    // 时间
    createdAt: parseBackendDateTime(vo.createdAt),
    lastActiveAt: vo.lastOnlineTime ? parseBackendDateTime(vo.lastOnlineTime) : undefined,
  };
};

/**
 * 性别映射
 * 后端: 0=未设置, 1=男, 2=女, 3=其他
 * 前端: 'male' | 'female'
 */
const mapGender = (gender: number): 'male' | 'female' | undefined => {
  if (gender === 1) return 'male';
  if (gender === 2) return 'female';
  return undefined;
};

/**
 * 性别反向映射
 * 前端: 'male' | 'female'
 * 后端: 1=男, 2=女
 */
export const mapGenderToBackend = (gender?: 'male' | 'female'): number => {
  if (gender === 'male') return 1;
  if (gender === 'female') return 2;
  return 0;  // 未设置
};

// ==================== 职业标签转换 ====================

/**
 * 将后端UserOccupationVO转换为前端SkillItem
 */
export const transformOccupationToSkill = (
  occupation: UserOccupationVO
): SkillItem => {
  return {
    id: String(occupation.id),
    name: occupation.occupationName,
    icon: occupation.iconUrl || getOccupationIcon(occupation.occupationCode),
    type: occupation.category === 'game' ? 'game' : 'lifestyle',
  };
};

/**
 * 批量转换职业列表
 */
export const transformOccupationList = (
  occupations: UserOccupationVO[]
): SkillItem[] => {
  return occupations.map(transformOccupationToSkill);
};

/**
 * 将职业字典VO转换为SkillItem
 */
export const transformOccupationDictToSkill = (
  dict: OccupationDictVO
): SkillItem => {
  return {
    id: dict.code,
    name: dict.name,
    icon: dict.iconUrl || getOccupationIcon(dict.code),
    type: dict.category === 'game' ? 'game' : 'lifestyle',
  };
};

/**
 * 获取职业图标（根据编码）
 */
const getOccupationIcon = (code: string): string => {
  const iconMap: Record<string, string> = {
    // 游戏相关
    honor_of_kings: '🎮',
    league_of_legends: '🎮',
    pubg_mobile: '🎮',
    brawl_stars: '🎮',
    
    // 生活服务
    model: '👗',
    student: '📚',
    office_worker: '💼',
    freelancer: '💻',
    explore_shop: '🏪',
    ktv: '🎤',
    massage: '💆',
    billiards: '🎱',
    
    // 默认
    default: '🏷️',
  };
  
  return iconMap[code] || iconMap.default;
};

// ==================== 时间转换工具 ====================

/**
 * 解析后端时间字符串为时间戳
 * 后端格式：ISO 8601 "2019-08-24T14:15:22Z"
 */
export const parseBackendDateTime = (dateTimeStr: string): number => {
  const date = new Date(dateTimeStr);
  return date.getTime();
};

/**
 * 格式化时间为显示格式
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};

// ==================== 数字格式化工具 ====================

/**
 * 格式化数字（1000+ → 1k, 10000+ → 1w）
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * 格式化距离（米 → 文字描述）
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.floor(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * 格式化BMI等级
 */
export const formatBMILevel = (bmi: number): string => {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '偏胖';
  return '肥胖';
};

/**
 * 格式化资料完整度等级
 */
export const formatCompletenessLevel = (score: number): string => {
  if (score >= 80) return '优秀';
  if (score >= 60) return '良好';
  if (score >= 40) return '一般';
  if (score >= 20) return '较差';
  return '极差';
};

// ==================== 导出 ====================

export const profileDataTransform = {
  transformUserProfileVOToProfile,
  transformOccupationToSkill,
  transformOccupationList,
  transformOccupationDictToSkill,
  mapGenderToBackend,
  parseBackendDateTime,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatDistance,
  formatBMILevel,
  formatCompletenessLevel,
};

