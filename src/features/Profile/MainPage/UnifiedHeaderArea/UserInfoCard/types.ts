/**
 * UserInfoCard - Type Definitions
 */

export interface UserInfoCardProps {
  nickname: string;
  gender?: 1 | 2;
  age?: number;
  isRealVerified?: boolean;
  isGodVerified?: boolean;
  isVipVerified?: boolean;
  isOnline?: boolean;
  distance?: number;
  followerCount?: number;
  customTags?: TagItem[];
  isOwnProfile: boolean;
  onEditPress?: () => void;
}

export interface TagItem {
  text: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
}

export interface NameGenderRowProps {
  nickname: string;
  gender?: 1 | 2;
  age?: number;
  isOwnProfile: boolean;
  onEditPress?: () => void;
}

export interface TagsRowProps {
  isRealVerified?: boolean;
  isGodVerified?: boolean;
  isVipVerified?: boolean;
  customTags?: TagItem[];
}

export interface StatusRowProps {
  isOnline?: boolean;
  distance?: number;
  followerCount?: number;
}

