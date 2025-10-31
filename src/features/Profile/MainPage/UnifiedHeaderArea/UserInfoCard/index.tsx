/**
 * UserInfoCard - 用户信息卡片组件
 * 
 * 功能：
 * - 白色浮动卡片，位于背景图上方
 * - 包含3行信息：姓名性别、认证标签、状态信息
 * - 卡片上浮效果（向上偏移80px）
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CARD_COLORS, CARD_SIZES } from './constants';
import NameGenderRow from './NameGenderRow';
import StatusRow from './StatusRow';
import TagsRow from './TagsRow';
import type { UserInfoCardProps } from './types';

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  nickname,
  gender,
  age,
  isRealVerified,
  isGodVerified,
  isVipVerified,
  isOnline,
  distance,
  followerCount,
  customTags,
  isOwnProfile,
  onEditPress,
}) => {
  return (
    <View style={styles.card}>
      {/* 第一行：姓名 + 性别 + 年龄 + 编辑按钮 */}
      <NameGenderRow
        nickname={nickname}
        gender={gender}
        age={age}
        isOwnProfile={isOwnProfile}
        onEditPress={onEditPress}
      />

      {/* 第二行：认证标签（真人、大神、VIP） */}
      <TagsRow
        isRealVerified={isRealVerified}
        isGodVerified={isGodVerified}
        isVipVerified={isVipVerified}
        customTags={customTags}
      />

      {/* 第三行：在线状态 + 距离 + 粉丝数 */}
      <StatusRow
        isOnline={isOnline}
        distance={distance}
        followerCount={followerCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_COLORS.BACKGROUND,
    borderRadius: CARD_SIZES.BORDER_RADIUS,
    paddingHorizontal: CARD_SIZES.PADDING_HORIZONTAL,
    paddingVertical: CARD_SIZES.PADDING_VERTICAL,
    marginHorizontal: 16,
    gap: CARD_SIZES.ROW_GAP,
    
    // Shadow for iOS
    shadowColor: CARD_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    
    // Shadow for Android
    elevation: 6,
  },
});

export default UserInfoCard;

