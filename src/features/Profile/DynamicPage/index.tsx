// #region 1. File Banner & TOC
/**
 * DynamicPage - 动态页
 * 
 * 功能：
 * - 瀑布流展示用户动态
 * - 下拉刷新
 * - 无限滚动
 */
// #endregion

// #region 2. Imports
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface DynamicPageProps {
  userId: string;
}

interface DynamicItem {
  id: string;
  imageUrl: string;
  title: string;
  likeCount: number;
  aspectRatio: number; // 宽高比，用于计算卡片高度
}

const COLORS = {
  WHITE: '#FFFFFF',
  GRAY_BG: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#757575',
  LIKE_RED: '#FF4081',
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 8;
const PADDING = 16;
const COLUMN_WIDTH = (SCREEN_WIDTH - PADDING * 2 - COLUMN_GAP) / 2;

// 生成模拟数据
const generateMockData = (count: number = 20): DynamicItem[] => {
  const aspectRatios = [0.75, 1, 1.33, 1.5, 0.67]; // 不同宽高比
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    imageUrl: `https://picsum.photos/400/${Math.floor(400 * aspectRatios[i % 5])}?random=${i}`,
    title: `请你们看雪 ${i + 1}`,
    likeCount: Math.floor(Math.random() * 100),
    aspectRatio: aspectRatios[i % 5],
  }));
};

const useDynamicData = (userId: string) => {
  const [data, setData] = useState<DynamicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // 初始加载
  useEffect(() => {
    loadData();
  }, [userId]);
  
  const loadData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newData = generateMockData(20);
      setData(newData);
    } catch (error) {
      console.error('加载动态失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newData = generateMockData(20);
      setData(newData);
      setHasMore(true);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const onLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 🔧 Fix: Generate unique IDs by using current data length as offset
      const currentLength = data.length;
      const newData = generateMockData(10).map((item, index) => ({
        ...item,
        id: `${currentLength + index + 1}`, // Unique ID
      }));
      setData(prev => [...prev, ...newData]);
      if (data.length >= 50) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, refreshing, hasMore, onRefresh, onLoadMore };
};
// #endregion

// #region 8. UI Components & Rendering
const DynamicCard: React.FC<{ item: DynamicItem; onPress: () => void }> = ({ item, onPress }) => {
  const cardHeight = COLUMN_WIDTH / item.aspectRatio + 50; // 图片高度 + 标题和点赞区域
  
  return (
    <TouchableOpacity
      style={[styles.card, { height: cardHeight }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.cardImage, { height: COLUMN_WIDTH / item.aspectRatio }]}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardStats}>
          <Text style={styles.likeIcon}>❤</Text>
          <Text style={styles.likeCount}>{item.likeCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DynamicPage: React.FC<DynamicPageProps> = ({ userId }) => {
  const { data, loading, refreshing, hasMore, onRefresh, onLoadMore } = useDynamicData(userId);
  
  // 分成两列
  const leftColumn = data.filter((_, index) => index % 2 === 0);
  const rightColumn = data.filter((_, index) => index % 2 === 1);
  
  const handleCardPress = (item: DynamicItem) => {
    console.log('点击动态卡片:', item.id);
    // TODO: 导航到动态详情页
  };
  
  if (data.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyText}>还没有发布动态</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: 'masonry' }]}
        renderItem={() => (
          <View style={styles.masonryContainer}>
            {/* 左列 */}
            <View style={styles.column}>
              {leftColumn.map(item => (
                <DynamicCard
                  key={item.id}
                  item={item}
                  onPress={() => handleCardPress(item)}
                />
              ))}
            </View>
            
            {/* 右列 */}
            <View style={styles.column}>
              {rightColumn.map(item => (
                <DynamicCard
                  key={item.id}
                  item={item}
                  onPress={() => handleCardPress(item)}
                />
              ))}
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={COLORS.TEXT_SECONDARY} />
            </View>
          ) : !hasMore ? (
            <View style={styles.loadingFooter}>
              <Text style={styles.endText}>没有更多了</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_BG,
  },
  masonryContainer: {
    flexDirection: 'row',
    padding: PADDING,
    gap: COLUMN_GAP,
  },
  column: {
    flex: 1,
    gap: COLUMN_GAP,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: COLUMN_GAP,
  },
  cardImage: {
    width: '100%',
    backgroundColor: COLORS.GRAY_BG,
  },
  cardInfo: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    lineHeight: 18,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default DynamicPage;
// #endregion

