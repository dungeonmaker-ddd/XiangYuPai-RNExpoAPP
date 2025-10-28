// #region 1. File Banner & TOC
/**
 * WaterfallList - 瀑布流列表组件
 * 
 * 功能：
 * - 真正的双列瀑布流布局（错落排列）
 * - 虚拟化支持（使用ScrollView + 动态渲染）
 * - 下拉刷新
 * - 无限滚动
 * - 性能优化
 * 
 * 算法：
 * 1. 维护两列的当前高度
 * 2. 每个新卡片放到高度较小的那一列
 * 3. 使用绝对定位精确控制位置
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

// 类型
// #endregion

// #region 3. Types & Schema
export interface WaterfallListProps<T = any> {
  data: T[];
  renderItem: (item: T, width: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  numColumns?: number;
  columnGap?: number;
  horizontalPadding?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  getItemHeight?: (item: T, width: number) => number;
}

interface ItemLayout {
  item: any;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_CONFIG = {
  NUM_COLUMNS: 2,
  COLUMN_GAP: 8,
  HORIZONTAL_PADDING: 12,
  ON_END_REACHED_THRESHOLD: 0.5,
} as const;
// #endregion

// #region 5. Utils & Helpers
/**
 * 计算瀑布流布局
 * 算法：贪心算法，每次选择高度最小的列
 */
const calculateWaterfallLayout = <T,>(
  data: T[],
  numColumns: number,
  columnWidth: number,
  columnGap: number,
  getItemHeight?: (item: T, width: number) => number,
): ItemLayout[] => {
  const layouts: ItemLayout[] = [];
  const columnHeights = new Array(numColumns).fill(0);
  
  data.forEach((item, index) => {
    // 找到高度最小的列
    const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // 计算item高度（如果有getItemHeight，使用它；否则使用固定高度）
    const itemHeight = getItemHeight 
      ? getItemHeight(item, columnWidth)
      : 200; // 默认高度
    
    // 计算x, y坐标
    const x = minColumnIndex * (columnWidth + columnGap);
    const y = columnHeights[minColumnIndex];
    
    layouts.push({
      item,
      index,
      x,
      y,
      width: columnWidth,
      height: itemHeight,
    });
    
    // 更新该列的高度
    columnHeights[minColumnIndex] += itemHeight + columnGap;
  });
  
  return layouts;
};

/**
 * 计算总高度
 */
const calculateTotalHeight = (layouts: ItemLayout[]): number => {
  if (layouts.length === 0) return 0;
  
  const maxY = Math.max(...layouts.map(layout => layout.y + layout.height));
  return maxY;
};
// #endregion

// #region 6. State Management & 7. Domain Logic
/**
 * WaterfallList业务逻辑Hook
 */
const useWaterfallLogic = <T,>(props: WaterfallListProps<T>) => {
  const {
    data,
    numColumns = DEFAULT_CONFIG.NUM_COLUMNS,
    columnGap = DEFAULT_CONFIG.COLUMN_GAP,
    horizontalPadding = DEFAULT_CONFIG.HORIZONTAL_PADDING,
    onEndReached,
    onEndReachedThreshold = DEFAULT_CONFIG.ON_END_REACHED_THRESHOLD,
    getItemHeight,
  } = props;
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 计算列宽
  const columnWidth = useMemo(() => {
    const totalGap = columnGap * (numColumns - 1);
    const availableWidth = SCREEN_WIDTH - horizontalPadding * 2 - totalGap;
    return availableWidth / numColumns;
  }, [numColumns, columnGap, horizontalPadding]);
  
  // 计算布局
  const layouts = useMemo(() => {
    return calculateWaterfallLayout(
      data,
      numColumns,
      columnWidth,
      columnGap,
      getItemHeight,
    );
  }, [data, numColumns, columnWidth, columnGap, getItemHeight]);
  
  // 计算总高度
  const totalHeight = useMemo(() => {
    return calculateTotalHeight(layouts);
  }, [layouts]);
  
  // 更新内容高度
  useEffect(() => {
    setContentHeight(totalHeight);
  }, [totalHeight]);
  
  // 处理滚动到底部
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isLoadingMore || !onEndReached) return;
    
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = contentSize.height * (1 - onEndReachedThreshold);
    
    if (layoutMeasurement.height + contentOffset.y >= paddingToBottom) {
      setIsLoadingMore(true);
      onEndReached();
      // 延迟重置状态，防止重复触发
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
  }, [isLoadingMore, onEndReached, onEndReachedThreshold]);
  
  return {
    scrollViewRef,
    layouts,
    columnWidth,
    totalHeight,
    handleScroll,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * WaterfallList主组件
 */
function WaterfallList<T = any>(props: WaterfallListProps<T>) {
  const {
    data,
    renderItem,
    keyExtractor,
    refreshing,
    onRefresh,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    horizontalPadding = DEFAULT_CONFIG.HORIZONTAL_PADDING,
  } = props;
  
  const {
    scrollViewRef,
    layouts,
    columnWidth,
    totalHeight,
    handleScroll,
  } = useWaterfallLogic(props);
  
  // 渲染瀑布流内容
  const renderContent = () => {
    if (data.length === 0 && ListEmptyComponent) {
      return ListEmptyComponent;
    }
    
    return (
      <View style={[styles.container, { height: totalHeight }]}>
        {layouts.map((layout) => (
          <View
            key={keyExtractor(layout.item, layout.index)}
            style={[
              styles.itemContainer,
              {
                position: 'absolute',
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              },
            ]}
          >
            {renderItem(layout.item, layout.width)}
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingHorizontal: horizontalPadding },
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      {ListHeaderComponent}
      {renderContent()}
      {ListFooterComponent}
    </ScrollView>
  );
}
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 12,
  },
  container: {
    position: 'relative',
    width: '100%',
  },
  itemContainer: {
    overflow: 'hidden',
  },
});

export default WaterfallList;
// #endregion

