// #region 1. File Banner & TOC
/**
 * ContentArea - Content Display Area
 * 
 * 内容展示区域
 * - 动态列表
 * - 资料信息
 * - 技能列表
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Sub-components
 * [4] Main Component
 * [5] Styles
 * [6] Export
 */
// #endregion

// #region 2. Imports

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants';
import type { OtherUserInfo, TabType } from '../types';

// #endregion

// #region 3. Sub-components

/**
 * 动态Tab内容
 */
const DynamicContent: React.FC<{ userInfo: OtherUserInfo; refreshing: boolean; onRefresh: () => void }> = ({
  userInfo,
  refreshing,
  onRefresh,
}) => {
  // TODO: Load posts from API
  const posts: any[] = [];
  
  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="images-outline" size={48} color={COLORS.gray400} />
        </View>
        <Text style={styles.emptyTitle}>暂无动态</Text>
        <Text style={styles.emptyDescription}>TA还没有发布任何动态内容</Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.postItem}>
          <Text>{item.content}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

/**
 * 资料Tab内容
 */
const ProfileContent: React.FC<{ userInfo: OtherUserInfo }> = ({ userInfo }) => {
  // 信息行组件 - 优化布局
  const InfoRow: React.FC<{ 
    icon: string; 
    label: string; 
    value?: string | number;
    iconColor?: string;
  }> = ({ icon, label, value, iconColor = COLORS.gray500 }) => {
    if (!value) return null;
    
    return (
      <View style={styles.infoRow}>
        <View style={styles.infoLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={16} color={iconColor} />
          </View>
          <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    );
  };

  // 标签组件
  const TagItem: React.FC<{ text: string; color?: string }> = ({ text, color = COLORS.primary }) => (
    <View style={[styles.tagItem, { borderColor: color }]}>
      <Text style={[styles.tagText, { color }]}>{text}</Text>
    </View>
  );
  
  return (
    <View style={styles.profileContent}>
      {/* 基本信息卡片 */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>基本信息</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <InfoRow 
            icon="location" 
            label="常居地" 
            value={userInfo.location} 
            iconColor={COLORS.primary} 
          />
          <InfoRow 
            icon="calendar-outline" 
            label="年龄" 
            value={userInfo.age ? `${userInfo.age}岁` : undefined}
            iconColor="#F59E0B"
          />
          <InfoRow 
            icon="resize-outline" 
            label="身高" 
            value={userInfo.height ? `${userInfo.height}cm` : undefined}
            iconColor="#10B981"
          />
          <InfoRow 
            icon="fitness-outline" 
            label="体重" 
            value={userInfo.weight ? `${userInfo.weight}kg` : undefined}
            iconColor="#EF4444"
          />
          <InfoRow 
            icon="briefcase" 
            label="职业" 
            value={userInfo.occupation}
            iconColor="#3B82F6"
          />
        </View>
      </View>

      {/* 个人标签 */}
      {userInfo.skills && userInfo.skills.length > 0 && (
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="pricetag" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>个人标签</Text>
            </View>
            <Text style={styles.tagCount}>{userInfo.skills.length}个</Text>
          </View>
          <View style={styles.tagContainer}>
            {userInfo.skills.map((skill, index) => (
              <TagItem key={index} text={skill} />
            ))}
          </View>
        </View>
      )}
      
      {/* 联系方式卡片 */}
      {userInfo.wechat && (
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#07C160" />
              <Text style={styles.cardTitle}>联系方式</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <InfoRow 
              icon="logo-wechat" 
              label="微信号" 
              value={userInfo.wechat}
              iconColor="#07C160"
            />
          </View>
        </View>
      )}
      
      {/* 个人简介卡片 */}
      {userInfo.bio && (
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>个人简介</Text>
            </View>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{userInfo.bio}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * 技能服务卡片组件
 */
const SkillServiceCard: React.FC<{ skill: any; index: number }> = ({ skill, index }) => (
  <View style={styles.skillServiceCard}>
    {/* 左侧服务封面 */}
    <View style={styles.serviceImageContainer}>
      <Ionicons name="game-controller-outline" size={40} color={COLORS.primary} />
    </View>
    
    {/* 中央服务信息区 */}
    <View style={styles.serviceInfoArea}>
      <View style={styles.serviceTopRow}>
        <Text style={styles.serviceName} numberOfLines={1}>游戏陪玩服务</Text>
        <View style={styles.distanceBadge}>
          <Ionicons name="location-outline" size={10} color={COLORS.textTertiary} />
          <Text style={styles.distanceText}>3.2km</Text>
        </View>
      </View>
      
      <View style={styles.badgesRow}>
        <View style={[styles.certMini, { backgroundColor: COLORS.blue + '20' }]}>
          <Ionicons name="checkmark-circle" size={12} color={COLORS.blue} />
          <Text style={[styles.certMiniText, { color: COLORS.blue }]}>实名认证</Text>
        </View>
        <View style={[styles.certMini, { backgroundColor: COLORS.gold + '20' }]}>
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={[styles.certMiniText, { color: COLORS.gold }]}>大神</Text>
        </View>
      </View>
      
      <Text style={styles.serviceDescription} numberOfLines={2}>
        {skill || '主打野其他位置都能补 能c技术万战韩信 这里是技能介绍...'}
      </Text>
      
      <View style={styles.serviceTagsRow}>
        <View style={styles.serviceTag}>
          <Text style={styles.serviceTagText}>微信区 荣耀王者</Text>
        </View>
        <View style={styles.serviceTag}>
          <Text style={styles.serviceTagText}>巅峰1800+</Text>
        </View>
      </View>
    </View>
    
    {/* 右侧价格区域 */}
    <View style={styles.servicePriceArea}>
      <Text style={styles.priceNumber}>10</Text>
      <Text style={styles.priceUnit}>金币/局</Text>
    </View>
  </View>
);

/**
 * 技能Tab内容
 */
const SkillsContent: React.FC<{ userInfo: OtherUserInfo; refreshing: boolean; onRefresh: () => void }> = ({
  userInfo,
  refreshing,
  onRefresh,
}) => {
  // TODO: Load skills from API
  const skills = userInfo.skills || [];
  
  if (skills.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="star-outline" size={48} color={COLORS.gray400} />
        </View>
        <Text style={styles.emptyTitle}>暂无技能服务</Text>
        <Text style={styles.emptyDescription}>TA还没有发布任何技能服务</Text>
      </View>
    );
  }
  
  // 显示技能服务卡片列表
  return (
    <FlatList
      data={skills}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <SkillServiceCard skill={item} index={index} />}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      contentContainerStyle={styles.skillsListContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

// #endregion

// #region 4. Main Component

interface ContentAreaProps {
  activeTab: TabType;
  userInfo: OtherUserInfo;
  refreshing: boolean;
  onRefresh: () => void;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab, userInfo, refreshing, onRefresh }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dynamics':
        return <DynamicContent userInfo={userInfo} refreshing={refreshing} onRefresh={onRefresh} />;
      case 'profile':
        return <ProfileContent userInfo={userInfo} />;
      case 'skills':
        return <SkillsContent userInfo={userInfo} refreshing={refreshing} onRefresh={onRefresh} />;
      default:
        return null;
    }
  };
  
  return <View style={styles.container}>{renderContent()}</View>;
};

// #endregion

// #region 5. Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  // 空状态容器
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
  },
  // 动态内容
  postItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  // 资料内容
  profileContent: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
  },
  // 信息卡片
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tagCount: {
    fontSize: 12,
    color: COLORS.gray500,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  // 信息行
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    minHeight: 40,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
  // 标签容器
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  tagItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // 简介容器
  bioContainer: {
    padding: SPACING.md,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  // 技能服务列表
  skillsListContent: {
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
  },
  skillServiceCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  serviceInfoArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  certMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  certMiniText: {
    fontSize: 11,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textTertiary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  serviceTagsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 10,
  },
  serviceTagText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  servicePriceArea: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  priceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.red,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

// #endregion

// #region 6. Export

export default ContentArea;

// #endregion

