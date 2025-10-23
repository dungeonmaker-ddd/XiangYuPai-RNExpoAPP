# 🚀 Discovery模块 - 快速启动指南

> **5分钟上手发现页面模块**

---

## 📋 前置条件

### 后端服务

确保以下服务已启动：

```bash
# 1. 检查Docker服务
cd RuoYi-Cloud-Plus/script/docker
docker ps

# 应该看到：
# ✅ mysql (端口3306)
# ✅ redis (端口6379)
# ✅ nacos (端口8848)

# 2. 启动xypai-content服务
cd ../../xypai-content
mvn spring-boot:run

# 3. 验证服务
curl http://localhost:9403/actuator/health
# 应返回: {"status":"UP"}

# 4. 查看API文档
浏览器访问: http://localhost:9403/doc.html
```

### 前端环境

```bash
# 1. 安装依赖
cd XiangYuPai-RNExpoAPP
npm install

# 2. 启动开发服务器
npm start

# 3. 选择平台
按 'a' 启动Android
按 'i' 启动iOS
按 'w' 启动Web
```

---

## 🎯 使用方式

### 方式1: 直接使用MainPage组件

```typescript
import MainPage from '@/src/features/Discovery/MainPage';

function App() {
  return (
    <MainPage 
      initialTab="hot"
      userId="current-user-id"
    />
  );
}
```

### 方式2: 使用Discovery页面组

```typescript
import Discovery from '@/src/features/Discovery';

function App() {
  return (
    <Discovery 
      initialTab="follow"
      userId="current-user-id"
    />
  );
}
```

### 方式3: 直接调用API

```typescript
import { discoveryApi } from '@/services/api';

// 获取热门动态
const response = await discoveryApi.getFeedList({
  tab: 'hot',
  page: 1,
  pageSize: 20,
});

console.log('动态列表:', response.data.list);
```

### 方式4: 使用Store

```typescript
import { useDiscoveryStore } from '@/stores';

function FeedList() {
  // 获取状态
  const feeds = useDiscoveryStore(state => state.feedData.hotFeeds);
  const loading = useDiscoveryStore(state => state.ui.loading);
  
  // 获取Actions
  const { loadFeedList, toggleLike } = useDiscoveryStore();
  
  // 加载数据
  useEffect(() => {
    loadFeedList('hot', false);
  }, []);
  
  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedCard 
          feed={item}
          onLike={() => toggleLike(item.id, 'hot')}
        />
      )}
    />
  );
}
```

---

## 📡 API调用示例

### 1. 获取动态流（三种模式）

#### 关注Tab
```typescript
const response = await discoveryApi.getFeedList({
  tab: 'follow',
  page: 1,
  pageSize: 20,
});
```

#### 热门Tab
```typescript
const response = await discoveryApi.getFeedList({
  tab: 'hot',
  page: 1,
  pageSize: 20,
});
```

#### 同城Tab（空间索引查询）
```typescript
const response = await discoveryApi.getFeedList({
  tab: 'local',
  longitude: 114.05,  // 用户经度
  latitude: 22.55,    // 用户纬度
  radius: 5000,       // 半径5km
  page: 1,
  pageSize: 20,
});
```

---

### 2. 互动操作

```typescript
// 点赞
await discoveryApi.likeFeed(1001);

// 取消点赞
await discoveryApi.unlikeFeed(1001);

// 收藏
await discoveryApi.collectFeed(1001);

// 取消收藏
await discoveryApi.uncollectFeed(1001);

// 分享
await discoveryApi.shareFeed(1001);
```

---

### 3. 评论管理

```typescript
// 获取评论列表
const comments = await discoveryApi.getCommentList({
  contentId: 1001,
  pageNum: 1,
  pageSize: 20,
});

// 添加一级评论
await discoveryApi.addComment({
  contentId: 1001,
  commentText: '很棒的内容！',
});

// 添加二级回复
await discoveryApi.addComment({
  contentId: 1001,
  parentId: 5001,      // 一级评论ID
  replyToId: 5001,     // 回复的评论ID
  replyToUserId: 2001, // 被回复的用户ID
  commentText: '@用户名 我也这么认为！',
});

// 评论点赞
await discoveryApi.likeComment(5001);
```

---

### 4. 搜索功能

```typescript
// 搜索动态
const results = await discoveryApi.searchFeeds('王者荣耀', 1);

// 按类型搜索
// type: 1=动态, 2=活动, 3=技能
const results = await discoveryApi.searchFeeds('深圳', 2);
```

---

## 🔧 配置说明

### API环境配置

编辑 `services/api/config.ts`:

```typescript
export const API_CONFIG = {
  // 环境切换
  ENVIRONMENT: 'development',  // 开发环境
  // ENVIRONMENT: 'production', // 生产环境
  
  // 基础URL
  BASE_URL: {
    development: 'http://localhost:8080',      // 本地
    production: 'https://api.xiangyupai.com',  // 生产
  },
};
```

### 分页配置

```typescript
// 修改每页数量
const response = await discoveryApi.getFeedList({
  tab: 'hot',
  pageSize: 30,  // 默认20，可自定义
});
```

### 缓存配置

```typescript
// 修改缓存时间
const response = await apiClient.get(endpoint, {
  cache: true,
  cacheTTL: 10 * 60 * 1000,  // 10分钟缓存
});
```

---

## 🐛 常见问题

### Q1: 如何调试API调用？

**A**: 查看控制台日志

```typescript
// apiClient会自动打印请求日志
[API Request] GET /api/v1/contents/hot
[API Response] 200 OK (523ms)
```

---

### Q2: 如何处理401未授权错误？

**A**: 设置Token

```typescript
import { setAuthToken } from '@/services/api';

// 登录成功后设置Token
setAuthToken(userToken);
```

---

### Q3: 如何清除缓存？

**A**: 调用清除方法

```typescript
import { clearAllCache } from '@/services/api';

// 清除所有API缓存
clearAllCache();

// 或清除Store缓存
import { useDiscoveryStore } from '@/stores';
useDiscoveryStore.getState().resetState();
```

---

### Q4: 如何模拟数据测试？

**A**: 使用Mock模式

```typescript
// 1. 修改环境配置
API_CONFIG.ENVIRONMENT = 'mock';

// 2. 或使用模拟数据生成
const mockFeeds = generateMockFeeds(20, 'hot');
```

---

## 🧪 测试接口

### 使用Postman/Apifox测试

```bash
# 1. 导入Swagger文档
URL: http://localhost:9403/v3/api-docs

# 2. 配置环境变量
baseUrl = http://localhost:9403
token = Bearer xxx

# 3. 测试接口
GET {{baseUrl}}/api/v1/contents/hot?limit=10
```

### 使用curl测试

```bash
# 获取热门内容
curl http://localhost:9403/api/v1/contents/hot?limit=10

# 点赞内容
curl -X POST http://localhost:9403/api/v1/content-actions/like/1001 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 添加评论
curl -X POST http://localhost:9403/api/v1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contentId": 1001,
    "commentText": "很棒的内容！"
  }'
```

---

## 📊 数据结构说明

### Feed（动态）数据

```typescript
{
  id: "1001",
  userId: "2001",
  type: 1,              // 1=动态, 2=活动, 3=技能
  typeDesc: "动态",
  title: "标题",
  content: "内容",
  coverImage: "https://...",
  
  // v7.1新增地理位置
  locationName: "深圳市南山区",
  longitude: 114.05,
  latitude: 22.55,
  distance: 2.5,        // km
  
  // 统计数据（来自Redis缓存）
  likeCount: 128,
  commentCount: 45,
  viewCount: 2300,
  
  // 用户互动状态
  isLiked: true,
  isCollected: false,
}
```

### Comment（评论）数据

```typescript
{
  id: "5001",
  feedId: "1001",
  userId: "2001",
  content: "很棒的内容！",
  
  // 回复关系
  parentId: null,       // NULL=一级评论
  replyTo: null,
  
  // 统计
  likeCount: 12,
  replyCount: 3,
  isTop: false,
  isLiked: false,
  
  // 二级回复（最多3条）
  replies: [...],
  totalReplies: 3,
  hasMoreReplies: false,
}
```

---

## 🎨 UI组件使用

### FeedCard组件示例

```typescript
<FeedCard
  feed={feedData}
  onUserClick={(userId) => {
    router.push(`/user/${userId}`);
  }}
  onLike={(feedId) => {
    toggleLike(feedId, activeTab);
  }}
  onComment={(feedId) => {
    router.push(`/feed/${feedId}#comment`);
  }}
/>
```

---

## 🔄 数据流程图

```
用户操作
  ↓
组件事件处理
  ↓
Store Actions
  ↓
API Service
  ↓
HTTP Client
  ↓
后端Gateway (localhost:8080)
  ↓
xypai-content服务 (localhost:9403)
  ↓
├─ Redis缓存 (统计数据)
└─ MySQL数据库 (业务数据)
  ↓
响应返回
  ↓
数据转换 (dataTransform)
  ↓
Store更新
  ↓
组件重新渲染
```

---

## 📝 代码示例集

### 完整的Feed列表实现

```typescript
import React, { useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useDiscoveryStore } from '@/stores';
import FeedCard from './FeedCard';

export default function FeedListScreen() {
  // 获取状态
  const feeds = useDiscoveryStore(state => state.feedData.hotFeeds);
  const loading = useDiscoveryStore(state => state.ui.loading);
  const refreshing = useDiscoveryStore(state => state.ui.refreshing);
  const hasMore = useDiscoveryStore(state => state.feedData.hasMore.hot);
  
  // 获取Actions
  const loadFeedList = useDiscoveryStore(state => state.loadFeedList);
  const loadMoreFeeds = useDiscoveryStore(state => state.loadMoreFeeds);
  const toggleLike = useDiscoveryStore(state => state.toggleLike);
  
  // 初始加载
  useEffect(() => {
    loadFeedList('hot', false);
  }, []);
  
  // 下拉刷新
  const handleRefresh = async () => {
    await loadFeedList('hot', true);
  };
  
  // 加载更多
  const handleLoadMore = async () => {
    if (hasMore && !loading) {
      await loadMoreFeeds('hot');
    }
  };
  
  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <FeedCard
          feed={item}
          onLike={() => toggleLike(item.id, 'hot')}
        />
      )}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
```

---

## 🎓 学习资源

### 推荐阅读顺序

1. **基础概念** → `README.md`
2. **类型定义** → `types.ts`
3. **API服务** → `services/api/discoveryApi.ts`
4. **状态管理** → `stores/discoveryStore.ts`
5. **数据转换** → `utils/dataTransform.ts`
6. **页面实现** → `MainPage/index.tsx`
7. **集成报告** → `API_INTEGRATION_COMPLETE.md`

### 技术要点

- **Zustand状态管理** - 轻量级全局状态
- **乐观更新模式** - 即时UI反馈
- **数据转换层** - 前后端数据适配
- **空间索引查询** - 高性能地理查询
- **Redis缓存架构** - 统计数据优化

---

## ⚙️ 高级配置

### 自定义API baseURL

```typescript
// 临时修改（仅当前会话）
import { apiClient } from '@/services/api/client';
apiClient.setBaseURL('http://your-custom-api.com');

// 永久修改
// 编辑 services/api/config.ts
BASE_URL: {
  development: 'http://your-dev-api.com',
}
```

### 自定义缓存策略

```typescript
// 修改discoveryApi.ts中的缓存配置
export const getFeedList = async (params) => {
  return apiClient.get(endpoint, {
    cache: true,
    cacheTTL: 10 * 60 * 1000,  // 10分钟缓存
  });
};
```

### 自定义分页大小

```typescript
// MainPage中修改
const loadFeedList = async (tab) => {
  await discoveryApi.getFeedList({
    tab,
    pageSize: 30,  // 自定义每页数量
  });
};
```

---

## 🔍 调试技巧

### 查看Store状态

```typescript
import { getStoreStates } from '@/stores';

// 打印所有Store状态
console.log('Store状态:', getStoreStates());

// 只查看Discovery状态
console.log('Discovery状态:', useDiscoveryStore.getState());
```

### 查看API请求

```typescript
// apiClient会自动打印请求日志
// 在浏览器/控制台查看：

[API Request] GET /api/v1/contents/hot?limit=20
[API Response] 200 OK (523ms)
[API Data] {list: [...], total: 150, hasMore: true}
```

### 测试乐观更新

```typescript
const testOptimisticUpdate = async () => {
  const feed = useDiscoveryStore.getState().feedData.hotFeeds[0];
  console.log('点赞前:', feed.likeCount, feed.isLiked);
  
  await useDiscoveryStore.getState().toggleLike(feed.id, 'hot');
  
  const updatedFeed = useDiscoveryStore.getState().feedData.hotFeeds[0];
  console.log('点赞后:', updatedFeed.likeCount, updatedFeed.isLiked);
};
```

---

## 📞 技术支持

### 遇到问题？

1. **查看日志** - 检查控制台错误信息
2. **验证后端** - 确认xypai-content服务运行
3. **检查网络** - 确认网关转发正常
4. **查看文档** - 阅读`API_INTEGRATION_COMPLETE.md`

### 联系方式

- **GitHub Issues** - 提交Bug或功能建议
- **技术文档** - 查看详细技术文档
- **代码示例** - 参考MainPage实现

---

## 🎉 快速上手完成！

现在你已经：
- ✅ 了解了基本使用方式
- ✅ 掌握了API调用方法
- ✅ 学会了Store使用
- ✅ 知道了调试技巧

**下一步**：
- 🚀 开始开发DetailPage（动态详情页面）
- 🚀 实现PublishPage（发布动态页面）
- 🚀 创建路由文件

---

**文档版本**: v1.0  
**最后更新**: 2025-10-23  
**状态**: ✅ **可以使用**

