// #region 1. File Banner & TOC
/**
 * MainPage - 发现页面主页面
 * 
 * 功能：
 * - 三Tab切换（关注/热门/同城）
 * - 动态流列表展示
 * - 下拉刷新和无限滚动
 * - 导航和互动处理
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
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';

// 类型和常量
import { ROUTES } from '../constants';
import type { Feed, TabType } from '../types';
import { COLORS, PAGE_CONFIG } from './constants';
import type { MainPageProps, MainPageState, TabDataState } from './types';

// 区域组件
import ContentArea from './components/ContentArea';
import NavigationArea from './components/NavigationArea';

// TODO: Stores和API后续集成
// import { useDiscoveryStore } from '../stores/discoveryStore';
// import * as discoveryApi from '../api/discoveryApi';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成模拟动态数据（开发阶段使用）
 */
const generateMockFeeds = (count: number, tab: TabType): Feed[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `feed-${tab}-${Date.now()}-${index}`,
    userId: `user-${Math.floor(Math.random() * 1000)}`,
    userInfo: {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      nickname: `用户${Math.floor(Math.random() * 1000)}`,
      avatar: `https://picsum.photos/seed/${Math.random()}/200`,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      age: 20 + Math.floor(Math.random() * 20),
      tags: [
        {
          type: 'certified' as const,
          label: '认证用户',
          color: '#00C853',
        },
      ],
      isFollowed: Math.random() > 0.5,
    },
    title: Math.random() > 0.7 ? `动态标题 ${index + 1}` : undefined,
    content: `这是${tab === 'follow' ? '关注' : tab === 'hot' ? '热门' : '同城'}动态的内容 ${index + 1}。这里是一些有趣的文字描述...`,
    mediaList: Math.random() > 0.5 ? [
      {
        id: `media-${index}`,
        type: 'image' as const,
        url: `https://picsum.photos/seed/${Math.random()}/800/600`,
        width: 800,
        height: 600,
      },
    ] : [],
    topicList: Math.random() > 0.6 ? [
      {
        name: `话题${Math.floor(Math.random() * 10)}`,
        description: '热门话题',
        participantCount: Math.floor(Math.random() * 10000),
        postCount: Math.floor(Math.random() * 50000),
        hotIndex: Math.floor(Math.random() * 100),
        trendChange: Math.random() > 0.5 ? 1 : -1,
        createdAt: Date.now(),
      },
    ] : [],
    location: Math.random() > 0.7 ? {
      id: `loc-${index}`,
      name: '某个地点',
      address: '某市某区某街道',
      latitude: 39.9 + Math.random(),
      longitude: 116.4 + Math.random(),
      distance: Math.floor(Math.random() * 5000),
    } : undefined,
    likeCount: Math.floor(Math.random() * 1000),
    commentCount: Math.floor(Math.random() * 500),
    shareCount: Math.floor(Math.random() * 100),
    collectCount: Math.floor(Math.random() * 200),
    viewCount: Math.floor(Math.random() * 5000),
    isLiked: Math.random() > 0.7,
    isCollected: Math.random() > 0.8,
    createdAt: Date.now() - Math.random() * 86400000,
    updatedAt: Date.now(),
  }));
};

/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp: number): string => {
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
// #endregion

// #region 6. State Management
/**
 * MainPage状态管理Hook
 */
const useMainPageState = (props: MainPageProps) => {
  // 当前激活的Tab
  const [activeTab, setActiveTab] = useState<TabType>(props.initialTab || 'hot');
  
  // 本地UI状态
  const [localState, setLocalState] = useState<MainPageState>({
    loading: false,
    refreshing: false,
    error: null,
    lastRefreshTime: 0,
  });
  
  // Tab数据状态
  const [tabData, setTabData] = useState<TabDataState>({
    followFeeds: [],
    hotFeeds: [],
    localFeeds: [],
    hasMore: {
      follow: true,
      hot: true,
      local: true,
    },
    page: {
      follow: 1,
      hot: 1,
      local: 1,
    },
  });
  
  // 上次刷新时间ref
  const lastRefreshTimeRef = useRef(0);
  
  // TODO: 集成Zustand stores
  // const { feeds, loadFeeds } = useDiscoveryStore();
  
  // 计算当前Tab的数据
  const currentFeeds = useMemo(() => {
    switch (activeTab) {
      case 'follow':
        return tabData.followFeeds;
      case 'hot':
        return tabData.hotFeeds;
      case 'local':
        return tabData.localFeeds;
      default:
        return [];
    }
  }, [activeTab, tabData]);
  
  const currentHasMore = useMemo(() => {
    return tabData.hasMore[activeTab];
  }, [activeTab, tabData.hasMore]);
  
  return {
    // 状态
    activeTab,
    setActiveTab,
    localState,
    setLocalState,
    tabData,
    setTabData,
    currentFeeds,
    currentHasMore,
    lastRefreshTimeRef,
    userId: props.userId,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * MainPage业务逻辑Hook
 */
const useMainPageLogic = (props: MainPageProps) => {
  const router = useRouter();
  const state = useMainPageState(props);
  const {
    activeTab,
    setActiveTab,
    localState,
    setLocalState,
    tabData,
    setTabData,
    currentFeeds,
    currentHasMore,
    lastRefreshTimeRef,
  } = state;
  
  /**
   * 初始化页面数据
   */
  useEffect(() => {
    const initializeData = async () => {
      setLocalState(prev => ({ ...prev, loading: true }));
      
      try {
        // TODO: 替换为真实API调用
        // const data = await discoveryApi.getFeedList({ tab: activeTab, page: 1 });
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, PAGE_CONFIG.INITIAL_LOAD_DELAY));
        
        // 生成模拟数据
        const mockData = generateMockFeeds(PAGE_CONFIG.PAGE_SIZE, activeTab);
        
        setTabData(prev => ({
          ...prev,
          [`${activeTab}Feeds`]: mockData,
          page: {
            ...prev.page,
            [activeTab]: 1,
          },
        }));
      } catch (error) {
        console.error('初始化数据失败:', error);
        setLocalState(prev => ({
          ...prev,
          error: '加载失败，请重试',
        }));
      } finally {
        setLocalState(prev => ({ ...prev, loading: false }));
      }
    };
    
    initializeData();
  }, []); // 只在首次加载时执行
  
  /**
   * 切换Tab
   */
  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    
    // 如果该Tab还没有数据，则加载
    const tabFeeds = tabData[`${tab}Feeds` as keyof TabDataState];
    if (Array.isArray(tabFeeds) && tabFeeds.length === 0) {
      setLocalState(prev => ({ ...prev, loading: true }));
      
      // TODO: 替换为真实API调用
      setTimeout(() => {
        const mockData = generateMockFeeds(PAGE_CONFIG.PAGE_SIZE, tab);
        setTabData(prev => ({
          ...prev,
          [`${tab}Feeds`]: mockData,
        }));
        setLocalState(prev => ({ ...prev, loading: false }));
      }, 300);
    }
  }, [activeTab, tabData]);
  
  /**
   * 下拉刷新
   */
  const handleRefresh = useCallback(async () => {
    // 防止频繁刷新
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < PAGE_CONFIG.REFRESH_COOLDOWN) {
      return;
    }
    lastRefreshTimeRef.current = now;
    
    setLocalState(prev => ({ ...prev, refreshing: true }));
    
    try {
      // TODO: 替换为真实API调用
      // const data = await discoveryApi.getFeedList({ tab: activeTab, page: 1, refresh: true });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = generateMockFeeds(PAGE_CONFIG.PAGE_SIZE, activeTab);
      
      setTabData(prev => ({
        ...prev,
        [`${activeTab}Feeds`]: mockData,
        page: {
          ...prev.page,
          [activeTab]: 1,
        },
        hasMore: {
          ...prev.hasMore,
          [activeTab]: true,
        },
      }));
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setLocalState(prev => ({
        ...prev,
        refreshing: false,
        lastRefreshTime: Date.now(),
      }));
    }
  }, [activeTab]);
  
  /**
   * 加载更多
   */
  const handleLoadMore = useCallback(async () => {
    if (!currentHasMore || localState.loading || localState.refreshing) {
      return;
    }
    
    setLocalState(prev => ({ ...prev, loading: true }));
    
    try {
      const nextPage = tabData.page[activeTab] + 1;
      
      // TODO: 替换为真实API调用
      // const data = await discoveryApi.getFeedList({ tab: activeTab, page: nextPage });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = generateMockFeeds(PAGE_CONFIG.PAGE_SIZE, activeTab);
      
      setTabData(prev => ({
        ...prev,
        [`${activeTab}Feeds`]: [
          ...((prev[`${activeTab}Feeds` as keyof TabDataState] as Feed[]) || []),
          ...mockData,
        ],
        page: {
          ...prev.page,
          [activeTab]: nextPage,
        },
        hasMore: {
          ...prev.hasMore,
          [activeTab]: mockData.length === PAGE_CONFIG.PAGE_SIZE,
        },
      }));
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLocalState(prev => ({ ...prev, loading: false }));
    }
  }, [activeTab, currentHasMore, localState.loading, localState.refreshing, tabData.page]);
  
  /**
   * 搜索按钮点击
   */
  const handleSearchPress = useCallback(() => {
    router.push(ROUTES.DISCOVERY.MAIN + '/search');
  }, [router]);
  
  /**
   * 动态卡片点击
   */
  const handleFeedPress = useCallback((feedId: string) => {
    router.push({
      pathname: ROUTES.DISCOVERY.DETAIL,
      params: { feedId },
    });
  }, [router]);
  
  /**
   * 用户头像点击
   */
  const handleUserPress = useCallback((userId: string) => {
    router.push({
      pathname: ROUTES.MODAL.USER_DETAIL,
      params: { userId },
    });
  }, [router]);
  
  /**
   * 话题点击
   */
  const handleTopicPress = useCallback((topicName: string) => {
    router.push({
      pathname: ROUTES.DISCOVERY.TOPIC,
      params: { topicName },
    });
  }, [router]);
  
  /**
   * 点赞
   */
  const handleLike = useCallback((feedId: string) => {
    // TODO: 调用API
    console.log('点赞:', feedId);
    
    // 乐观更新UI
    setTabData(prev => {
      const feeds = prev[`${activeTab}Feeds` as keyof TabDataState] as Feed[];
      return {
        ...prev,
        [`${activeTab}Feeds`]: feeds.map(feed =>
          feed.id === feedId
            ? {
                ...feed,
                isLiked: !feed.isLiked,
                likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
              }
            : feed
        ),
      };
    });
  }, [activeTab]);
  
  /**
   * 评论
   */
  const handleComment = useCallback((feedId: string) => {
    router.push({
      pathname: ROUTES.DISCOVERY.DETAIL,
      params: { feedId, autoFocusComment: 'true' },
    });
  }, [router]);
  
  /**
   * 分享
   */
  const handleShare = useCallback((feedId: string) => {
    // TODO: 实现分享功能
    console.log('分享:', feedId);
  }, []);
  
  /**
   * 收藏
   */
  const handleCollect = useCallback((feedId: string) => {
    // TODO: 调用API
    console.log('收藏:', feedId);
    
    // 乐观更新UI
    setTabData(prev => {
      const feeds = prev[`${activeTab}Feeds` as keyof TabDataState] as Feed[];
      return {
        ...prev,
        [`${activeTab}Feeds`]: feeds.map(feed =>
          feed.id === feedId
            ? {
                ...feed,
                isCollected: !feed.isCollected,
                collectCount: feed.isCollected ? feed.collectCount - 1 : feed.collectCount + 1,
              }
            : feed
        ),
      };
    });
  }, [activeTab]);
  
  return {
    // 状态
    activeTab,
    currentFeeds,
    currentHasMore,
    loading: localState.loading,
    refreshing: localState.refreshing,
    error: localState.error,
    // 事件处理
    handleTabChange,
    handleRefresh,
    handleLoadMore,
    handleSearchPress,
    handleFeedPress,
    handleUserPress,
    handleTopicPress,
    handleLike,
    handleComment,
    handleShare,
    handleCollect,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * MainPage主组件
 */
const MainPage: React.FC<MainPageProps> = (props) => {
  const {
    activeTab,
    currentFeeds,
    currentHasMore,
    loading,
    refreshing,
    error,
    handleTabChange,
    handleRefresh,
    handleLoadMore,
    handleSearchPress,
    handleFeedPress,
    handleUserPress,
    handleTopicPress,
    handleLike,
    handleComment,
    handleShare,
    handleCollect,
  } = useMainPageLogic(props);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.NAV_BACKGROUND} />
      
      {/* 导航区域 */}
      <NavigationArea
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearchPress={handleSearchPress}
      />
      
      {/* 内容区域 */}
      <ContentArea
        activeTab={activeTab}
        feeds={currentFeeds}
        loading={loading}
        refreshing={refreshing}
        hasMore={currentHasMore}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onFeedPress={handleFeedPress}
        onUserPress={handleUserPress}
        onTopicPress={handleTopicPress}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onCollect={handleCollect}
      />
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default MainPage;
export type { MainPageProps } from './types';
// #endregion
