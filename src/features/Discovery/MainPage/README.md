# 📱 MainPage - 发现主页面

> **三Tab结构的社交内容发现页面**

---

## 🎯 功能概述

MainPage是Discovery模块的核心页面，提供以下功能：

### 1️⃣ **三Tab切换**
- **关注Tab**: 显示已关注用户的动态
- **热门Tab**: 显示平台热门动态
- **同城Tab**: 显示同城用户的动态

### 2️⃣ **动态流展示**
- 动态卡片列表
- 用户头像和昵称
- 动态内容（文字+图片）
- 话题标签
- 互动数据（点赞/评论/收藏/分享）

### 3️⃣ **交互功能**
- 下拉刷新
- 无限滚动加载
- 点赞/收藏（乐观更新）
- 跳转详情页
- 跳转用户主页
- 跳转话题页

---

## 📂 文件结构

```
MainPage/
├── index.tsx                # 主文件（八段式结构）
├── types.ts                 # 类型定义
├── constants.ts             # 常量配置
├── README.md                # 本文档
└── components/              # 区域组件
    ├── NavigationArea/      # 导航区域（Tab切换）
    └── ContentArea/         # 内容区域（动态列表）
```

---

## 🏗️ 架构说明

### 八段式结构
```typescript
#region 1. File Banner & TOC        // 文档头
#region 2. Imports                  // 依赖导入
#region 3. Types & Schema           // 类型定义
#region 4. Constants & Config       // 常量配置
#region 5. Utils & Helpers          // 工具函数（模拟数据、时间格式化）
#region 6. State Management         // 状态管理（Tab状态、列表数据）
#region 7. Domain Logic             // 业务逻辑（Tab切换、刷新、加载更多、互动）
#region 8. UI Components & Rendering // UI渲染
#region 9. Exports                  // 导出
```

### 核心Hook组合
```typescript
useMainPageState()    // 状态管理
  ├── activeTab       // 当前Tab
  ├── localState      // 本地UI状态
  ├── tabData         // 三个Tab的数据
  └── currentFeeds    // 当前显示的动态列表

useMainPageLogic()    // 业务逻辑
  ├── handleTabChange   // Tab切换
  ├── handleRefresh     // 下拉刷新
  ├── handleLoadMore    // 加载更多
  ├── handleFeedPress   // 动态点击
  ├── handleUserPress   // 用户点击
  ├── handleTopicPress  // 话题点击
  ├── handleLike        // 点赞
  ├── handleComment     // 评论
  ├── handleShare       // 分享
  └── handleCollect     // 收藏
```

---

## 🎨 区域组件

### NavigationArea - 导航区域
```typescript
功能：
- Tab列表（关注/热门/同城）
- Tab指示器动画
- 搜索按钮

Props:
- activeTab: 当前激活的Tab
- onTabChange: Tab切换回调
- onSearchPress: 搜索按钮回调
```

### ContentArea - 内容区域
```typescript
功能：
- FlatList虚拟化列表
- 下拉刷新
- 无限滚动
- 动态卡片渲染
- 空状态/加载状态

Props:
- activeTab: 当前Tab
- feeds: 动态列表数据
- loading: 加载状态
- refreshing: 刷新状态
- hasMore: 是否还有更多
- onRefresh: 刷新回调
- onLoadMore: 加载更多回调
- onFeedPress: 动态点击回调
- onUserPress: 用户点击回调
- onTopicPress: 话题点击回调
- onLike: 点赞回调
- onComment: 评论回调
- onShare: 分享回调
- onCollect: 收藏回调
```

---

## 💻 使用示例

### 基础使用
```typescript
import MainPage from '@/src/features/Discovery/MainPage';

<MainPage 
  initialTab="hot"
  userId={currentUserId}
/>
```

### Props配置
```typescript
interface MainPageProps {
  initialTab?: TabType;        // 初始Tab（默认'hot'）
  userId?: string;              // 当前用户ID
  style?: StyleProp<ViewStyle>; // 自定义样式
}
```

---

## 📊 状态管理

### Tab数据结构
```typescript
interface TabDataState {
  followFeeds: Feed[];   // 关注动态列表
  hotFeeds: Feed[];      // 热门动态列表
  localFeeds: Feed[];    // 同城动态列表
  hasMore: {
    follow: boolean;
    hot: boolean;
    local: boolean;
  };
  page: {
    follow: number;
    hot: number;
    local: number;
  };
}
```

### 本地UI状态
```typescript
interface MainPageState {
  loading: boolean;          // 加载中
  refreshing: boolean;       // 刷新中
  error: string | null;      // 错误信息
  lastRefreshTime: number;   // 上次刷新时间
}
```

---

## 🔧 核心功能实现

### 1. Tab切换
```typescript
const handleTabChange = useCallback((tab: TabType) => {
  if (tab === activeTab) return;
  
  setActiveTab(tab);
  
  // 如果该Tab还没有数据，则加载
  if (tabData[`${tab}Feeds`].length === 0) {
    loadTabData(tab);
  }
}, [activeTab, tabData]);
```

### 2. 下拉刷新
```typescript
const handleRefresh = useCallback(async () => {
  // 防止频繁刷新（5秒冷却）
  const now = Date.now();
  if (now - lastRefreshTimeRef.current < 5000) {
    return;
  }
  
  setLocalState(prev => ({ ...prev, refreshing: true }));
  
  try {
    const data = await discoveryApi.getFeedList({ 
      tab: activeTab, 
      page: 1, 
      refresh: true 
    });
    
    // 更新数据
    setTabData(prev => ({
      ...prev,
      [`${activeTab}Feeds`]: data.list,
    }));
  } finally {
    setLocalState(prev => ({ ...prev, refreshing: false }));
    lastRefreshTimeRef.current = Date.now();
  }
}, [activeTab]);
```

### 3. 无限滚动
```typescript
const handleLoadMore = useCallback(async () => {
  if (!currentHasMore || loading || refreshing) {
    return;
  }
  
  setLocalState(prev => ({ ...prev, loading: true }));
  
  try {
    const nextPage = tabData.page[activeTab] + 1;
    const data = await discoveryApi.getFeedList({ 
      tab: activeTab, 
      page: nextPage 
    });
    
    // 追加数据
    setTabData(prev => ({
      ...prev,
      [`${activeTab}Feeds`]: [
        ...prev[`${activeTab}Feeds`],
        ...data.list,
      ],
      page: {
        ...prev.page,
        [activeTab]: nextPage,
      },
      hasMore: {
        ...prev.hasMore,
        [activeTab]: data.hasMore,
      },
    }));
  } finally {
    setLocalState(prev => ({ ...prev, loading: false }));
  }
}, [activeTab, currentHasMore, loading, refreshing]);
```

### 4. 乐观更新（点赞/收藏）
```typescript
const handleLike = useCallback((feedId: string) => {
  // 立即更新UI（乐观更新）
  setTabData(prev => {
    const feeds = prev[`${activeTab}Feeds`];
    return {
      ...prev,
      [`${activeTab}Feeds`]: feeds.map(feed =>
        feed.id === feedId
          ? {
              ...feed,
              isLiked: !feed.isLiked,
              likeCount: feed.isLiked 
                ? feed.likeCount - 1 
                : feed.likeCount + 1,
            }
          : feed
      ),
    };
  });
  
  // 调用API
  discoveryApi.likeFeed({ feedId, action: feed.isLiked ? 'unlike' : 'like' })
    .catch(error => {
      // 失败时回滚
      console.error('点赞失败:', error);
    });
}, [activeTab]);
```

---

## ⚡ 性能优化

### 1. 虚拟化列表
```typescript
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ESTIMATED_ITEM_HEIGHT,
    offset: ESTIMATED_ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. 记忆化优化
```typescript
// 计算属性缓存
const currentFeeds = useMemo(() => {
  return tabData[`${activeTab}Feeds`];
}, [activeTab, tabData]);

// 事件处理缓存
const handleLike = useCallback((feedId) => {
  // 处理逻辑
}, [activeTab]);
```

### 3. 防抖刷新
```typescript
// 5秒冷却时间
const REFRESH_COOLDOWN = 5000;
const lastRefreshTimeRef = useRef(0);

if (Date.now() - lastRefreshTimeRef.current < REFRESH_COOLDOWN) {
  return;
}
```

---

## 🔄 后续集成

### TODO: Stores集成
```typescript
// import { useDiscoveryStore } from '../stores/discoveryStore';
// const { feeds, loadFeeds } = useDiscoveryStore();
```

### TODO: API集成
```typescript
// import * as discoveryApi from '../api/discoveryApi';
// const data = await discoveryApi.getFeedList({ tab, page });
```

---

## 📝 开发状态

- [x] 基础架构完成
- [x] 八段式结构
- [x] NavigationArea区域组件
- [x] ContentArea区域组件
- [x] 模拟数据生成
- [x] Tab切换功能
- [x] 下拉刷新
- [x] 无限滚动
- [x] 乐观更新
- [ ] Stores集成（待后续）
- [ ] API集成（待后续）
- [ ] 真实数据对接（待后续）

---

**创建日期**: 2025年9月30日  
**当前版本**: v1.0  
**维护者**: 开发团队
