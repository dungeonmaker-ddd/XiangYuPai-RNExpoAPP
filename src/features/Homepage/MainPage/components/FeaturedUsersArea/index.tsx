// #region 1. File Banner & TOC
/**
 * FeaturedUsersArea - 限时专享区域组件
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
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

// TODO: 导入实际的store hooks
// import { useHomepageData, useHomepageLoading } from '../../../../../stores';

// 导入共享组件
import { Card } from '../../../../../components';
// #endregion

// #region 3. Types & Schema
interface FeaturedUsersAreaProps {
  onUserPress: (userId: string) => void;
  onMorePress: () => void;
  style?: StyleProp<ViewStyle>;
}

interface FeaturedUser {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  serviceTypes: string[];
  location: {
    city: string;
    distance?: number;
  };
  specialOffer?: {
    originalPrice: number;
    discountPrice: number;
    discountText: string;
    endTime: string;
  };
}

interface SectionHeaderData {
  title: string;
  subtitle: string;
  actionText: string;
  showMore: boolean;
}

interface CarouselConfig {
  itemWidth: number;
  itemSpacing: number;
  snapToInterval: number;
  showsIndicators: boolean;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  ONLINE_DOT: '#10B981',
  OFFLINE_DOT: '#9CA3AF',
  DISCOUNT_BACKGROUND: '#FEF3C7',
  DISCOUNT_TEXT: '#D97706',
  SHADOW: '#000000',
} as const;

const SIZES = {
  CONTAINER_PADDING: 16,
  SECTION_SPACING: 20,
  CARD_WIDTH: 160,
  CARD_HEIGHT: 220,
  CARD_PADDING: 12,
  CARD_SPACING: 16,
  BORDER_RADIUS: 12,
  AVATAR_SIZE: 60,
  ONLINE_DOT_SIZE: 12,
  TAG_PADDING: 6,
  PRICE_CONTAINER_HEIGHT: 36,
} as const;

const TYPOGRAPHY = {
  SECTION_TITLE: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  SECTION_SUBTITLE: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  MORE_TEXT: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  USER_NAME: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  USER_TAG: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
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
  DISCOUNT: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 14,
  },
} as const;

const ANIMATION_DURATION = 200;
// #endregion

// #region 5. Utils & Helpers
/**
 * 计算轮播配置
 */
const calculateCarouselConfig = (): CarouselConfig => {
  const itemWidth = SIZES.CARD_WIDTH;
  const itemSpacing = SIZES.CARD_SPACING;
  const snapToInterval = itemWidth + itemSpacing;
  
  return {
    itemWidth,
    itemSpacing,
    snapToInterval,
    showsIndicators: false,
  };
};

/**
 * 格式化价格显示
 */
const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}k`;
  }
  return price.toString();
};

/**
 * 格式化评分显示
 */
const formatRating = (rating: number, reviewCount: number): string => {
  return `${rating.toFixed(1)} (${reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})`;
};

/**
 * 获取用户在线状态
 */
const getUserOnlineStatus = (user: FeaturedUser): { color: string; text: string } => {
  return user.isOnline 
    ? { color: COLORS.ONLINE_DOT, text: '在线' }
    : { color: COLORS.OFFLINE_DOT, text: '离线' };
};

/**
 * 检查是否有特价优惠
 */
const hasSpecialOffer = (user: FeaturedUser): boolean => {
  return !!(user.specialOffer && new Date(user.specialOffer.endTime) > new Date());
};

/**
 * 生成用户头像URI
 */
const getUserAvatarUri = (avatar: string): { uri: string } | number => {
  if (avatar.startsWith('http')) {
    return { uri: avatar };
  }
  // TODO: 处理本地头像资源
  return { uri: avatar };
};

/**
 * 计算距离显示文本
 */
const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  
  return `${(distance / 1000).toFixed(1)}km`;
};
// #endregion

// #region 6. State Management
/**
 * 精选用户数据状态管理Hook
 */
const useFeaturedUsersData = () => {
  // TODO: 集成实际的Zustand stores
  // const homepageData = useHomepageData();
  // const featuredUsersLoading = useHomepageLoading();
  
  // 模拟精选用户数据
  const [mockUsers] = React.useState<FeaturedUser[]>([
    {
      id: '1',
      name: '游戏大神',
      avatar: 'https://example.com/avatar1.jpg',
      tags: ['王者荣耀', '高端局'],
      price: 50,
      rating: 4.8,
      reviewCount: 328,
      isOnline: true,
      serviceTypes: ['honor_of_kings'],
      location: { city: '北京', distance: 1200 },
      specialOffer: {
        originalPrice: 80,
        discountPrice: 50,
        discountText: '限时7.5折',
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: '2',
      name: '陪玩小姐姐',
      avatar: 'https://example.com/avatar2.jpg',
      tags: ['英雄联盟', '温柔声音'],
      price: 30,
      rating: 4.9,
      reviewCount: 156,
      isOnline: true,
      serviceTypes: ['league_of_legends'],
      location: { city: '上海', distance: 800 },
    },
    {
      id: '3',
      name: '探店达人',
      avatar: 'https://example.com/avatar3.jpg',
      tags: ['美食', '本地通'],
      price: 25,
      rating: 4.7,
      reviewCount: 89,
      isOnline: false,
      serviceTypes: ['explore_shop'],
      location: { city: '广州', distance: 2500 },
    },
    {
      id: '4',
      name: 'K歌之王',
      avatar: 'https://example.com/avatar4.jpg',
      tags: ['唱歌', '氛围王'],
      price: 40,
      rating: 4.6,
      reviewCount: 203,
      isOnline: true,
      serviceTypes: ['ktv'],
      location: { city: '深圳', distance: 1800 },
      specialOffer: {
        originalPrice: 60,
        discountPrice: 40,
        discountText: '新人8折',
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ]);
  
  const sectionHeader: SectionHeaderData = {
    title: '限时专享',
    subtitle: '精选优质服务者',
    actionText: '查看更多',
    showMore: true,
  };
  
  const carouselConfig = React.useMemo(() => calculateCarouselConfig(), []);
  
  return {
    users: mockUsers,
    sectionHeader,
    carouselConfig,
    loading: false,
    error: null,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 精选用户区域业务逻辑Hook
 */
const useFeaturedUsersAreaLogic = (props: FeaturedUsersAreaProps) => {
  const { onUserPress, onMorePress } = props;
  const { users, sectionHeader, carouselConfig } = useFeaturedUsersData();
  const flatListRef = useRef<FlatList>(null);
  
  /**
   * 用户卡片点击处理
   */
  const handleUserPress = useCallback((user: FeaturedUser) => {
    onUserPress(user.id);
    
    // TODO: 埋点上报
    console.log('精选用户点击事件', {
      userId: user.id,
      userName: user.name,
      serviceTypes: user.serviceTypes,
      price: user.price,
      hasOffer: hasSpecialOffer(user),
    });
  }, [onUserPress]);
  
  /**
   * 更多按钮点击处理
   */
  const handleMorePress = useCallback(() => {
    onMorePress();
    
    // TODO: 埋点上报
    console.log('精选用户更多点击事件', {
      totalUsers: users.length,
    });
  }, [onMorePress, users.length]);
  
  /**
   * 渲染用户卡片
   */
  const renderUserCard = useCallback(({ item }: { item: FeaturedUser }) => {
    return (
      <FeaturedUserCard
        user={item}
        onPress={() => handleUserPress(item)}
        style={{ marginRight: carouselConfig.itemSpacing }}
      />
    );
  }, [handleUserPress, carouselConfig.itemSpacing]);
  
  /**
   * 获取FlatList配置
   */
  const getFlatListProps = useCallback(() => ({
    showsHorizontalScrollIndicator: false,
    snapToInterval: carouselConfig.snapToInterval,
    snapToAlignment: 'start' as const,
    decelerationRate: 'fast' as const,
    pagingEnabled: false,
    removeClippedSubviews: Platform.OS === 'android',
    maxToRenderPerBatch: 3,
    updateCellsBatchingPeriod: 50,
    windowSize: 5,
  }), [carouselConfig]);
  
  return {
    users,
    sectionHeader,
    carouselConfig,
    flatListRef,
    renderUserCard,
    getFlatListProps,
    handleMorePress,
  };
};

/**
 * 精选用户卡片组件
 */
const FeaturedUserCard: React.FC<{
  user: FeaturedUser;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ user, onPress, style }) => {
  const onlineStatus = getUserOnlineStatus(user);
  const hasOffer = hasSpecialOffer(user);
  
  return (
    <TouchableOpacity
      style={[styles.userCard, style]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${user.name}, 评分${user.rating}, 价格${user.price}元`}
    >
      <Card style={styles.cardContainer} variant="elevated">
        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <ImageBackground
              source={getUserAvatarUri(user.avatar)}
              style={styles.avatar}
              imageStyle={styles.avatarImage}
            >
              {/* 在线状态指示器 */}
              <View 
                style={[
                  styles.onlineDot,
                  { backgroundColor: onlineStatus.color }
                ]}
              />
            </ImageBackground>
          </View>
          
          {/* 特价标签 */}
          {hasOffer && user.specialOffer && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {user.specialOffer.discountText}
              </Text>
            </View>
          )}
        </View>
        
        {/* 用户信息 */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name}
          </Text>
          
          {/* 标签 */}
          <View style={styles.tagsContainer}>
            {user.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText} numberOfLines={1}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
          
          {/* 评分和位置 */}
          <View style={styles.metaContainer}>
            <Text style={styles.rating}>
              ⭐ {formatRating(user.rating, user.reviewCount)}
            </Text>
            {user.location.distance && (
              <Text style={styles.distance}>
                📍 {formatDistance(user.location.distance)}
              </Text>
            )}
          </View>
          
          {/* 价格区域 */}
          <View style={styles.priceContainer}>
            {hasOffer && user.specialOffer ? (
              <View style={styles.priceWithDiscount}>
                <Text style={styles.originalPrice}>
                  ¥{user.specialOffer.originalPrice}
                </Text>
                <Text style={styles.discountPrice}>
                  ¥{user.specialOffer.discountPrice}
                </Text>
              </View>
            ) : (
              <Text style={styles.price}>
                ¥{formatPrice(user.price)}
              </Text>
            )}
            <Text style={styles.priceUnit}>/小时</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

/**
 * 区域标题组件
 */
const SectionHeader: React.FC<{
  headerData: SectionHeaderData;
  onMorePress: () => void;
}> = ({ headerData, onMorePress }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTextContainer}>
      <Text style={styles.sectionTitle}>{headerData.title}</Text>
      <Text style={styles.sectionSubtitle}>{headerData.subtitle}</Text>
    </View>
    
    {headerData.showMore && (
      <TouchableOpacity
        style={styles.moreButton}
        onPress={onMorePress}
        accessibilityRole="button"
        accessibilityLabel="查看更多精选用户"
      >
        <Text style={styles.moreText}>{headerData.actionText}</Text>
        <Text style={styles.moreArrow}>›</Text>
      </TouchableOpacity>
    )}
  </View>
);

/**
 * FeaturedUsersArea 主组件
 */
const FeaturedUsersArea: React.FC<FeaturedUsersAreaProps> = (props) => {
  const {
    users,
    sectionHeader,
    carouselConfig,
    flatListRef,
    renderUserCard,
    getFlatListProps,
    handleMorePress,
  } = useFeaturedUsersAreaLogic(props);
  
  // 空状态
  if (users.length === 0) {
    return (
      <View style={[styles.container, props.style]}>
        <SectionHeader
          headerData={sectionHeader}
          onMorePress={handleMorePress}
        />
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>暂无精选用户</Text>
          <Text style={styles.emptySubtitle}>优质服务者即将上线</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, props.style]}>
      {/* 区域标题 */}
      <SectionHeader
        headerData={sectionHeader}
        onMorePress={handleMorePress}
      />
      
      {/* 用户轮播列表 */}
      <FlatList
        ref={flatListRef}
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.listContentContainer}
        style={styles.listContainer}
        {...getFlatListProps()}
      />
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.SECTION_SPACING,
  },
  
  // 标题样式
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.CONTAINER_PADDING,
    marginBottom: 16,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.SECTION_TITLE,
    color: COLORS.TEXT,
  },
  
  sectionSubtitle: {
    ...TYPOGRAPHY.SECTION_SUBTITLE,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  
  moreText: {
    ...TYPOGRAPHY.MORE_TEXT,
    color: COLORS.PRIMARY,
  },
  
  moreArrow: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginLeft: 4,
  },
  
  // 列表样式
  listContainer: {
    // FlatList样式
  },
  
  listContentContainer: {
    paddingHorizontal: SIZES.CONTAINER_PADDING,
  },
  
  // 用户卡片样式
  userCard: {
    width: SIZES.CARD_WIDTH,
  },
  
  cardContainer: {
    padding: SIZES.CARD_PADDING,
    height: SIZES.CARD_HEIGHT,
  },
  
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
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
  
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.DISCOUNT_BACKGROUND,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.WARNING,
  },
  
  discountText: {
    ...TYPOGRAPHY.DISCOUNT,
    color: COLORS.DISCOUNT_TEXT,
  },
  
  // 用户信息样式
  userInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  userName: {
    ...TYPOGRAPHY.USER_NAME,
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  
  tag: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SIZES.TAG_PADDING,
    paddingVertical: 2,
    borderRadius: 10,
    marginHorizontal: 2,
    marginVertical: 1,
  },
  
  tagText: {
    ...TYPOGRAPHY.USER_TAG,
    color: COLORS.BACKGROUND,
  },
  
  metaContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  
  rating: {
    ...TYPOGRAPHY.RATING,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  
  distance: {
    ...TYPOGRAPHY.RATING,
    color: COLORS.TEXT_LIGHT,
  },
  
  // 价格样式
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    height: SIZES.PRICE_CONTAINER_HEIGHT,
  },
  
  price: {
    ...TYPOGRAPHY.PRICE,
    color: COLORS.PRIMARY,
  },
  
  priceWithDiscount: {
    alignItems: 'center',
  },
  
  originalPrice: {
    ...TYPOGRAPHY.RATING,
    color: COLORS.TEXT_LIGHT,
    textDecorationLine: 'line-through',
  },
  
  discountPrice: {
    ...TYPOGRAPHY.PRICE,
    color: COLORS.ERROR,
  },
  
  priceUnit: {
    ...TYPOGRAPHY.PRICE_UNIT,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 2,
  },
  
  // 空状态样式
  emptyContainer: {
    height: SIZES.CARD_HEIGHT,
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.CONTAINER_PADDING,
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default FeaturedUsersArea;
export type { FeaturedUsersAreaProps };
// #endregion
