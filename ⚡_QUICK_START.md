# ⚡ 快速开始 - 新功能使用指南

## 🎯 5分钟快速上手

### 1️⃣ 发布内容（PublishPage）

**打开方式**：
- 点击发现Tab的"+"按钮
- 或访问 `/publish` 路由

**快速示例**：
```typescript
// 在你的组件中
import { contentApi } from '@/services/api/contentApi';

const handlePublish = async () => {
  const contentId = await contentApi.publish({
    title: '探店分享',           // 可选
    content: '今天打卡了...',     // 必填
    mediaUrls: ['url1', 'url2'], // 图片
    topicIds: [1, 2],            // 话题
    location: '深圳市南山区'      // 地点
  });
  
  if (contentId) {
    console.log('发布成功！');
  }
};
```

---

### 2️⃣ 查看详情（DetailPage）

**打开方式**：
- 点击任何FeedCard卡片
- 或访问 `/feed/[id]` 路由

**功能包括**：
- ✅ 完整内容展示
- ✅ 图片轮播
- ✅ 评论列表
- ✅ 评论输入
- ✅ 点赞/收藏/分享

---

### 3️⃣ 内容互动（ContentActionAPI）

**点赞/取消点赞**：
```typescript
import { contentApi } from '@/services/api/contentApi';

// 点赞或取消点赞
const success = await contentApi.toggleLike(contentId);
```

**收藏/取消收藏**：
```typescript
// 收藏或取消收藏
const success = await contentApi.toggleCollect(contentId);
```

**检查状态**：
```typescript
// 检查是否已点赞
const isLiked = await contentApi.checkLikeStatus(contentId);

// 批量检查（性能优化）
const statusMap = await contentApi.batchCheckLikeStatus([1, 2, 3]);
```

---

### 4️⃣ 评论功能（CommentAPI）

**发表评论**：
```typescript
import { commentApi } from '@/services/api/commentApi';

// 一级评论
const commentId = await commentApi.add({
  contentId: 123,
  content: '这是一条评论'
});

// 二级回复
const replyId = await commentApi.add({
  contentId: 123,
  parentId: 456,  // 父评论ID
  content: '这是一条回复'
});
```

**获取评论列表**：
```typescript
// 获取一级评论
const comments = await commentApi.getList({
  contentId: 123,
  pageNum: 1,
  pageSize: 20
});

// 获取某条评论的所有回复
const replies = await commentApi.getReplies(commentId);
```

**评论点赞**：
```typescript
// 点赞或取消点赞评论
const success = await commentApi.toggleLike(commentId);
```

**删除评论**：
```typescript
// 删除自己的评论
const success = await commentApi.delete(commentId);
```

---

## 📱 前端组件使用

### FeedCard（优化后）

**新功能**：
- ✅ 评论按钮 💬
- ✅ 点击跳转到详情页
- ✅ 优化的动画效果

**使用示例**：
```tsx
import FeedCard from '@/features/Discovery/MainPage/components/FeedCard';

<FeedCard
  feed={feedData}
  onLike={(id) => handleLike(id)}
  onCollect={(id) => handleCollect(id)}
  onComment={(id) => router.push(`/feed/${id}`)}
  onShare={(id) => handleShare(id)}
  cardWidth={CARD_WIDTH}
/>
```

---

### DetailPage（详情页）

**自动功能**：
- ✅ 自动加载内容详情
- ✅ 自动加载评论列表
- ✅ 实时更新互动数据

**路由参数**：
```typescript
// 访问详情页
router.push(`/feed/${contentId}`);

// 在DetailPage中自动获取ID
const { id } = useLocalSearchParams();
```

---

### PublishPage（发布页）

**完整功能**：
```tsx
// 已集成功能：
- 标题输入框（最多50字）
- 正文输入框（最多5000字，最少1字）
- 图片选择（最多9张）
- 图片预览和删除
- 字符计数显示
- 发布按钮（loading状态）
- 键盘自适应布局
```

**使用方式**：
```tsx
// 直接访问
router.push('/publish');

// 或在Tab中添加发布按钮
<TouchableOpacity onPress={() => router.push('/publish')}>
  <Text>发布</Text>
</TouchableOpacity>
```

---

## 🔧 API接口总览

### 内容操作
| 方法 | 说明 | 权限 |
|------|------|------|
| `contentApi.publish()` | 发布内容 | 需要登录 |
| `contentApi.update()` | 编辑内容 | 需要登录 |
| `contentApi.delete()` | 删除内容 | 需要登录 |
| `contentApi.getMyContents()` | 我的内容 | 需要登录 |

### 互动功能
| 方法 | 说明 | 权限 |
|------|------|------|
| `contentApi.toggleLike()` | 点赞 | 需要登录 |
| `contentApi.toggleCollect()` | 收藏 | 需要登录 |
| `contentApi.share()` | 分享 | 需要登录 |
| `contentApi.checkLikeStatus()` | 检查点赞状态 | 需要登录 |
| `contentApi.batchCheckLikeStatus()` | 批量检查点赞 | 需要登录 |
| `contentApi.getMyLikes()` | 我的点赞 | 需要登录 |
| `contentApi.getMyCollects()` | 我的收藏 | 需要登录 |

### 评论系统
| 方法 | 说明 | 权限 |
|------|------|------|
| `commentApi.add()` | 发表评论 | 需要登录 |
| `commentApi.delete()` | 删除评论 | 需要登录 |
| `commentApi.getList()` | 评论列表 | 无需登录 |
| `commentApi.getReplies()` | 评论回复 | 无需登录 |
| `commentApi.toggleLike()` | 评论点赞 | 需要登录 |
| `commentApi.count()` | 评论统计 | 无需登录 |

---

## 💡 最佳实践

### 1. 错误处理
```typescript
try {
  const result = await contentApi.publish({...});
  if (result) {
    // 成功
  } else {
    // 失败（API返回null）
  }
} catch (error) {
  // 异常（网络错误等）
  console.error(error);
}
```

### 2. 加载状态
```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await contentApi.toggleLike(id);
  } finally {
    setLoading(false);
  }
};
```

### 3. 批量操作（性能优化）
```typescript
// ❌ 不推荐：循环单次请求
for (const id of contentIds) {
  await contentApi.checkLikeStatus(id);
}

// ✅ 推荐：批量请求
const statusMap = await contentApi.batchCheckLikeStatus(contentIds);
```

---

## 🎨 UI/UX特性

### 动画效果
- ✅ 点赞按钮缩放动画
- ✅ 收藏按钮缩放动画
- ✅ 页面切换过渡动画

### 键盘处理
- ✅ 自动避让键盘
- ✅ 点击空白收起键盘
- ✅ 输入框自动聚焦

### 图片处理
- ✅ 图片预览（轮播）
- ✅ 图片上传（多选）
- ✅ 图片删除

---

## 🚀 立即测试

### 1. 启动前端
```bash
cd XiangYuPai-RNExpoAPP
npm start
```

### 2. 测试发布功能
1. 打开APP
2. 点击"+"按钮
3. 输入内容并选择图片
4. 点击发布

### 3. 测试互动功能
1. 在发现页点击任意卡片
2. 查看详情页
3. 点赞/收藏/评论
4. 查看效果

---

## 📞 问题排查

### API调用失败
1. 检查后端服务是否启动
2. 检查网络配置（`services/api/config.ts`）
3. 查看控制台日志

### 权限错误
1. 确保已登录
2. 检查Token是否有效
3. 查看后端权限配置

### UI显示异常
1. 清除缓存重启APP
2. 检查Expo版本
3. 查看控制台错误

---

**快速参考完成！开始使用吧！🚀**

