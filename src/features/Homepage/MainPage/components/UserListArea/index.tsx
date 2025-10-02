// #region 1. File Banner & TOC
/**
 * UserListArea - 用户列表区域组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback, useRef } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    ListRenderItem,
    Platform,
    RefreshControl,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// TODO: 导入实际的store hooks
// import { useUserList, useCurrentFilters, useUserSearch } from '../../../../../stores';

// 导入共享组件
import { Button, Card, LoadingOverlay } from '../../../../../components';
// #endregion

// #region 3. Types & Schema
interface UserListAreaProps {
  onUserPress: (userId: string) => void;
  onFilterPress: () => void;
  style?: StyleProp<ViewStyle>;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: {
    city: string;
    district: string;
    distance?: number;
  };
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  lastActiveTime: string;
  serviceTypes: string[];
  description: string;
  isVerified: boolean;
  responseRate: number;
}

interface FilterConfig {
  activeFilters: {
    serviceType?: string;
    priceRange?: [number, number];
    location?: string;
    isOnline?: boolean;
    rating?: number;
  };
  availableFilters: {
    serviceTypes: Array<{ type: string; name: string; count: number }>;
    priceRanges: Array<{ range: [number, number]; label: string; count: number }>;
    locations: Array<{ city: string; count: number }>;
  };
}

interface ListState {
  data: User[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  totalCount: number;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#FFFFFF',
  PRIMARY: '#6366F1',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  TEXT: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  TEXT_LIGHT: '#9CA3AF',
  BORDER: '#E5E7EB',
  SURFACE: '#F8FAFC',
  ONLINE_DOT: '#10B981',
  OFFLINE_DOT: '#9CA3AF',
  VERIFIED_BADGE: '#3B82F6',
  SHADOW: '#000000',
} as const;

const SIZES = {
  CONTAINER_PADDING: 16,
  CARD_PADDING: 12,
  CARD_SPACING: 12,
  BORDER_RADIUS: 12,
  AVATAR_SIZE: 60,
  ONLINE_DOT_SIZE: 12,
  TAG_HEIGHT: 20,
  FILTER_HEIGHT: 40,
  LOAD_MORE_HEIGHT: 60,
  VERIFIED_BADGE_SIZE: 16,
} as const;

const TYPOGRAPHY = {
  SECTION_TITLE: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  FILTER_TEXT: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  USER_NAME: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  USER_AGE: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  USER_LOCATION: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  TAG: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
  PRICE: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  PRICE_UNIT: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  RATING: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  DESCRIPTION: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
} as const;

const PAGINATION_CONFIG = {
  PAGE_SIZE: 20,
  LOAD_MORE_THRESHOLD: 3,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化用户年龄显示
 */
const formatUserAge = (age: number, gender: User['gender']): string => {
  const genderIcon = gender === 'male' ? '♂' : gender === 'female' ? '♀' : '';
  return `${age}岁 ${genderIcon}`;
};

/**
 * 格式化距离显示
 */
const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  
  return `${(distance / 1000).toFixed(1)}km`;
};

/**
 * 格式化价格显示
 */
const formatPrice = (price: number): string => {
  return price.toString();
};

/**
 * 格式化评分显示
 */
const formatRating = (rating: number, reviewCount: number): string => {
  const formattedCount = reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount.toString();
  return `${rating.toFixed(1)} (${formattedCount})`;
};

/**
 * 格式化最后活跃时间
 */
const formatLastActiveTime = (lastActiveTime: string): string => {
  const now = new Date();
  const lastActive = new Date(lastActiveTime);
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return '刚刚在线';
  if (diffMins < 60) return `${diffMins}分钟前在线`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前在线`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前在线`;
};

/**
 * 获取用户头像URI
 */
const getUserAvatarUri = (avatar: string): { uri: string } | number => {
  if (avatar.startsWith('http')) {
    return { uri: avatar };
  }
  return { uri: avatar };
};

/**
 * 检查用户是否在线
 */
const getUserOnlineStatus = (user: User): { color: string; text: string } => {
  return user.isOnline 
    ? { color: COLORS.ONLINE_DOT, text: '在线' }
    : { color: COLORS.OFFLINE_DOT, text: formatLastActiveTime(user.lastActiveTime) };
};

/**
 * 生成用户列表项key
 */
const generateUserKey = (user: User): string => {
  return `user_${user.id}`;
};
// #endregion

// #region 6. State Management
/**
 * 用户列表数据状态管理Hook
 */
const useUserListData = () => {
  // TODO: 集成实际的Zustand stores
  // const userList = useUserList();
  // const currentFilters = useCurrentFilters();
  
  // 模拟用户列表数据
  const [mockListState] = React.useState<ListState>({
    data: [
      {
        id: '1',
        name: '小明同学',
        avatar: 'https://example.com/avatar1.jpg',
        age: 22,
        gender: 'male',
        location: { city: '北京', district: '朝阳区', distance: 1200 },
        tags: ['王者荣耀', '高端局', '脾气好'],
        price: 45,
        rating: 4.8,
        reviewCount: 156,
        isOnline: true,
        lastActiveTime: new Date().toISOString(),
        serviceTypes: ['honor_of_kings'],
        description: '专业王者荣耀代练，擅长打野位置，可以带你上分！',
        isVerified: true,
        responseRate: 98,
      },
      {
        id: '2',
        name: '温柔小姐姐',
        avatar: 'https://example.com/avatar2.jpg',
        age: 20,
        gender: 'female',
        location: { city: '上海', district: '浦东新区', distance: 800 },
        tags: ['英雄联盟', '声音甜美', '陪聊'],
        price: 35,
        rating: 4.9,
        reviewCount: 234,
        isOnline: true,
        lastActiveTime: new Date().toISOString(),
        serviceTypes: ['league_of_legends'],
        description: '温柔的声音，耐心的指导，让你在游戏中感受温暖。',
        isVerified: true,
        responseRate: 95,
      },
      {
        id: '3',
        name: '探店达人',
        avatar: 'https://example.com/avatar3.jpg',
        age: 25,
        gender: 'female',
        location: { city: '广州', district: '天河区', distance: 2100 },
        tags: ['美食', '本地通', '拍照'],
        price: 28,
        rating: 4.7,
        reviewCount: 89,
        isOnline: false,
        lastActiveTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        serviceTypes: ['explore_shop'],
        description: '资深美食探索者，带你发现城市中的美味秘密。',
        isVerified: false,
        responseRate: 92,
      },
    ],
    loading: false,
    refreshing: false,
    loadingMore: false,
    hasMore: true,
    error: null,
    page: 1,
    totalCount: 1000,
  });
  
  const [mockFilters] = React.useState<FilterConfig>({
    activeFilters: {},
    availableFilters: {
      serviceTypes: [
        { type: 'honor_of_kings', name: '王者荣耀', count: 150 },
        { type: 'league_of_legends', name: '英雄联盟', count: 120 },
        { type: 'explore_shop', name: '探店', count: 80 },
      ],
      priceRanges: [
        { range: [0, 30], label: '30元以下', count: 200 },
        { range: [30, 60], label: '30-60元', count: 300 },
        { range: [60, 100], label: '60-100元', count: 150 },
      ],
      locations: [
        { city: '北京', count: 250 },
        { city: '上海', count: 200 },
        { city: '广州', count: 180 },
      ],
    },
  });
  
  return {
    listState: mockListState,
    filters: mockFilters,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 用户列表区域业务逻辑Hook
 */
const useUserListAreaLogic = (props: UserListAreaProps) => {
  const { onUserPress, onFilterPress } = props;
  const { listState, filters } = useUserListData();
  const flatListRef = useRef<FlatList>(null);
  
  /**
   * 用户卡片点击处理
   */
  const handleUserPress = useCallback((user: User) => {
    onUserPress(user.id);
    
    // TODO: 埋点上报
    console.log('用户卡片点击事件', {
      userId: user.id,
      userName: user.name,
      serviceTypes: user.serviceTypes,
      price: user.price,
      isOnline: user.isOnline,
    });
  }, [onUserPress]);
  
  /**
   * 筛选按钮点击处理
   */
  const handleFilterPress = useCallback(() => {
    onFilterPress();
    
    // TODO: 埋点上报
    console.log('筛选按钮点击事件', {
      activeFilters: filters.activeFilters,
      totalUsers: listState.totalCount,
    });
  }, [onFilterPress, filters.activeFilters, listState.totalCount]);
  
  /**
   * 下拉刷新处理
   */
  const handleRefresh = useCallback(() => {
    // TODO: 调用store的刷新方法
    console.log('用户列表刷新');
  }, []);
  
  /**
   * 加载更多处理
   */
  const handleLoadMore = useCallback(() => {
    if (listState.hasMore && !listState.loadingMore && !listState.loading) {
      // TODO: 调用store的加载更多方法
      console.log('加载更多用户');
    }
  }, [listState.hasMore, listState.loadingMore, listState.loading]);
  
  /**
   * 渲染用户卡片
   */
  const renderUserCard: ListRenderItem<User> = useCallback(({ item, index }) => {
    return (
      <UserCard
        user={item}
        onPress={() => handleUserPress(item)}
        style={styles.userCardContainer}
        isLast={index === listState.data.length - 1}
      />
    );
  }, [handleUserPress, listState.data.length]);
  
  /**
   * 渲染加载更多footer
   */
  const renderListFooter = useCallback(() => {
    if (listState.loadingMore) {
      return (
        <View style={styles.loadMoreContainer}>
          <LoadingOverlay
            loading={true}
            text="加载更多..."
            modal={false}
            style={styles.loadMoreLoading}
          />
        </View>
      );
    }
    
    if (!listState.hasMore && listState.data.length > 0) {
      return (
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>已显示全部用户</Text>
        </View>
      );
    }
    
    return null;
  }, [listState.loadingMore, listState.hasMore, listState.data.length]);
  
  /**
   * 渲染空状态
   */
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>暂无用户</Text>
      <Text style={styles.emptySubtitle}>试试调整筛选条件</Text>
      <Button
        title="重新加载"
        onPress={handleRefresh}
        style={styles.retryButton}
        size="sm"
      />
    </View>
  ), [handleRefresh]);
  
  /**
   * 获取活跃筛选器数量
   */
  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(filters.activeFilters).length;
  }, [filters.activeFilters]);
  
  return {
    listState,
    filters,
    flatListRef,
    renderUserCard,
    renderListFooter,
    renderEmptyState,
    handleFilterPress,
    handleRefresh,
    handleLoadMore,
    getActiveFiltersCount,
  };
};

/**
 * 用户卡片组件
 */
const UserCard: React.FC<{
  user: User;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
}> = ({ user, onPress, style, isLast }) => {
  const onlineStatus = getUserOnlineStatus(user);
  
  return (
    <TouchableOpacity
      style={[style, !isLast && styles.cardMarginBottom]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${user.name}, ${formatUserAge(user.age, user.gender)}, 评分${user.rating}`}
    >
      <Card style={styles.userCardContent} variant="default">
        <View style={styles.cardHeader}>
          {/* 头像区域 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <ImageBackground
                source={getUserAvatarUri(user.avatar)}
                style={styles.avatar}
                imageStyle={styles.avatarImage}
              >
                {/* 在线状态点 */}
                <View 
                  style={[
                    styles.onlineDot,
                    { backgroundColor: onlineStatus.color }
                  ]}
                />
                
                {/* 认证标识 */}
                {user.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>✓</Text>
                  </View>
                )}
              </ImageBackground>
            </View>
          </View>
          
          {/* 用户基础信息 */}
          <View style={styles.userBasicInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.userAge}>
                {formatUserAge(user.age, user.gender)}
              </Text>
            </View>
            
            <Text style={styles.userLocation} numberOfLines={1}>
              📍 {user.location.city} {user.location.district}
              {user.location.distance && ` · ${formatDistance(user.location.distance)}`}
            </Text>
            
            <Text style={styles.onlineStatus} numberOfLines={1}>
              {onlineStatus.text}
            </Text>
          </View>
          
          {/* 价格区域 */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>
              ¥{formatPrice(user.price)}
            </Text>
            <Text style={styles.priceUnit}>/小时</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                ⭐ {formatRating(user.rating, user.reviewCount)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* 标签区域 */}
        <View style={styles.tagsSection}>
          {user.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {tag}
              </Text>
            </View>
          ))}
          
          {user.tags.length > 3 && (
            <View style={[styles.tag, styles.moreTagsTag]}>
              <Text style={[styles.tagText, styles.moreTagsText]}>
                +{user.tags.length - 3}
              </Text>
            </View>
          )}
        </View>
        
        {/* 描述 */}
        <Text style={styles.userDescription} numberOfLines={2}>
          {user.description}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

/**
 * 筛选工具栏组件
 */
const FilterToolbar: React.FC<{
  onFilterPress: () => void;
  activeFiltersCount: number;
  totalCount: number;
}> = ({ onFilterPress, activeFiltersCount, totalCount }) => (
  <View style={styles.filterToolbar}>
    <View style={styles.filterLeft}>
      <Text style={styles.totalCountText}>
        共{totalCount}位服务者
      </Text>
    </View>
    
    <TouchableOpacity
      style={styles.filterButton}
      onPress={onFilterPress}
      accessibilityRole="button"
      accessibilityLabel="打开筛选面板"
    >
      <Text style={styles.filterIcon}>🔍</Text>
      <Text style={styles.filterText}>筛选</Text>
      {activeFiltersCount > 0 && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

/**
 * UserListArea 主组件
 */
const UserListArea: React.FC<UserListAreaProps> = (props) => {
  const {
    listState,
    filters,
    flatListRef,
    renderUserCard,
    renderListFooter,
    renderEmptyState,
    handleFilterPress,
    handleRefresh,
    handleLoadMore,
    getActiveFiltersCount,
  } = useUserListAreaLogic(props);
  
  return (
    <View style={[styles.container, props.style]}>
      {/* 区域标题 */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>推荐用户</Text>
      </View>
      
      {/* 筛选工具栏 */}
      <FilterToolbar
        onFilterPress={handleFilterPress}
        activeFiltersCount={getActiveFiltersCount()}
        totalCount={listState.totalCount}
      />
      
      {/* 用户列表 */}
      <FlatList
        ref={flatListRef}
        data={listState.data}
        renderItem={renderUserCard}
        keyExtractor={generateUserKey}
        style={styles.listContainer}
        contentContainerStyle={[
          styles.listContentContainer,
          listState.data.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={PAGINATION_CONFIG.PAGE_SIZE / 2}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={PAGINATION_CONFIG.PAGE_SIZE / 2}
        getItemLayout={(data, index) => ({
          length: 180, // 估算的卡片高度
          offset: 180 * index,
          index,
        })}
      />
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 标题样式
  headerContainer: {
    paddingHorizontal: SIZES.CONTAINER_PADDING,
    marginBottom: 12,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.SECTION_TITLE,
    color: COLORS.TEXT,
  },
  
  // 筛选工具栏样式
  filterToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.CONTAINER_PADDING,
    marginBottom: 16,
  },
  
  filterLeft: {
    flex: 1,
  },
  
  totalCountText: {
    ...TYPOGRAPHY.FILTER_TEXT,
    color: COLORS.TEXT_SECONDARY,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    position: 'relative',
  },
  
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  
  filterText: {
    ...TYPOGRAPHY.FILTER_TEXT,
    color: COLORS.TEXT,
  },
  
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.ERROR,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
  },
  
  // 列表样式
  listContainer: {
    flex: 1,
  },
  
  listContentContainer: {
    paddingHorizontal: SIZES.CONTAINER_PADDING,
    paddingBottom: 100, // 底部导航空间
  },
  
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  // 用户卡片样式
  userCardContainer: {
    // 用户卡片容器
  },
  
  cardMarginBottom: {
    marginBottom: SIZES.CARD_SPACING,
  },
  
  userCardContent: {
    padding: SIZES.CARD_PADDING,
  },
  
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  
  // 头像区域样式
  avatarSection: {
    marginRight: 12,
  },
  
  avatarWrapper: {
    position: 'relative',
  },
  
  avatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  
  avatarImage: {
    borderRadius: SIZES.AVATAR_SIZE / 2,
  },
  
  onlineDot: {
    width: SIZES.ONLINE_DOT_SIZE,
    height: SIZES.ONLINE_DOT_SIZE,
    borderRadius: SIZES.ONLINE_DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  
  verifiedBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: COLORS.VERIFIED_BADGE,
    width: SIZES.VERIFIED_BADGE_SIZE,
    height: SIZES.VERIFIED_BADGE_SIZE,
    borderRadius: SIZES.VERIFIED_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  verifiedIcon: {
    fontSize: 10,
    color: COLORS.BACKGROUND,
    fontWeight: '600',
  },
  
  // 用户基础信息样式
  userBasicInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  
  userName: {
    ...TYPOGRAPHY.USER_NAME,
    color: COLORS.TEXT,
    marginRight: 8,
  },
  
  userAge: {
    ...TYPOGRAPHY.USER_AGE,
    color: COLORS.TEXT_SECONDARY,
  },
  
  userLocation: {
    ...TYPOGRAPHY.USER_LOCATION,
    color: COLORS.TEXT_LIGHT,
  },
  
  onlineStatus: {
    ...TYPOGRAPHY.USER_LOCATION,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 价格区域样式
  priceSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 80,
  },
  
  price: {
    ...TYPOGRAPHY.PRICE,
    color: COLORS.PRIMARY,
  },
  
  priceUnit: {
    ...TYPOGRAPHY.PRICE_UNIT,
    color: COLORS.TEXT_SECONDARY,
  },
  
  ratingContainer: {
    marginTop: 4,
  },
  
  rating: {
    ...TYPOGRAPHY.RATING,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 标签区域样式
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  
  tag: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
    height: SIZES.TAG_HEIGHT,
    justifyContent: 'center',
  },
  
  tagText: {
    ...TYPOGRAPHY.TAG,
    color: COLORS.BACKGROUND,
  },
  
  moreTagsTag: {
    backgroundColor: COLORS.SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  
  moreTagsText: {
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 描述样式
  userDescription: {
    ...TYPOGRAPHY.DESCRIPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 加载更多样式
  loadMoreContainer: {
    height: SIZES.LOAD_MORE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadMoreLoading: {
    backgroundColor: 'transparent',
  },
  
  noMoreContainer: {
    height: SIZES.LOAD_MORE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  noMoreText: {
    ...TYPOGRAPHY.FILTER_TEXT,
    color: COLORS.TEXT_LIGHT,
  },
  
  // 空状态样式
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
  },
  
  retryButton: {
    minWidth: 120,
  },
});

export default UserListArea;
export type { UserListAreaProps };
// #endregion
