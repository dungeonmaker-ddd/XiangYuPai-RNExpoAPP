# 💬 消息模块 (Messages Module)

> **基于UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5标准**
> 
> 版本：v2.0 | 创建时间：2025年9月 | 技术栈：Expo React Native + TypeScript

---

## 📋 **模块概览**

消息模块是探店APP的核心社交功能模块，负责处理用户间的消息通信、通知管理和社交互动。

### 🎯 **核心功能**

- **消息主页面**: 4宫格分类入口 + 最近对话列表
- **赞和收藏**: 他人对你内容的点赞和收藏通知
- **评论消息**: 他人对你内容的评论通知
- **粉丝消息**: 新增粉丝和互关通知
- **系统通知**: 官方公告和系统消息
- **私聊对话**: 一对一实时聊天功能

### 📊 **技术架构**

| 技术项 | 选型 | 说明 |
|--------|------|------|
| **前端框架** | Expo React Native | 跨平台移动端开发 |
| **路由系统** | Expo Router | 文件系统路由 |
| **状态管理** | Zustand | 轻量级状态管理 |
| **实时通信** | Socket.io | WebSocket实时消息 |
| **数据持久化** | AsyncStorage | 本地数据存储 |
| **类型系统** | TypeScript | 完整类型安全 |

---

## 📂 **目录结构**

```
src/features/Messages/
├── index.ts                    # 模块主入口
├── types.ts                    # 类型定义
├── constants.ts                # 常量配置
├── README.md                   # 本文档
│
├── MainPage/                   # 消息主页面
├── LikesPage/                  # 赞和收藏页面
├── CommentsPage/               # 评论页面
├── FollowersPage/              # 粉丝页面
├── NotificationsPage/          # 系统通知页面
├── ChatPage/                   # 私聊对话页面
│
├── SharedComponents/           # 模块内共享组件
│   ├── MessageItem/           # 消息列表项组件
│   ├── UserAvatar/            # 用户头像组件
│   ├── ChatBubble/            # 消息气泡组件
│   └── SwipeActions/          # 滑动操作组件
│
├── api/                       # API接口
│   ├── messagesApi.ts         # 消息API
│   ├── chatApi.ts             # 聊天API
│   └── notificationsApi.ts    # 通知API
│
└── stores/                    # 状态管理
    ├── messagesStore.ts       # 消息状态
    ├── chatStore.ts           # 聊天状态
    └── webSocketStore.ts      # WebSocket状态
```

---

## 🎯 **架构设计原则**

### ✅ **遵循的标准**

1. **八段式文件结构** - 所有组件遵循八段式代码组织
2. **层级化页面组** - Feature > Page > Area > Component层级清晰
3. **类型安全优先** - 完整的TypeScript类型定义
4. **性能优化** - 使用React.memo、useCallback、useMemo
5. **移动端优先** - 触觉反馈、手势识别、安全区域适配

### 🎨 **参考标准**

- **现有Homepage模块**: 目录结构、命名规范、状态管理模式
- **现有AuthModule模块**: 页面流程、错误处理、导航设计
- **现有Button组件**: 八段式架构模板、移动端适配、主题配色

---

## 🚀 **快速开始**

### 📦 **导入使用**

```typescript
// 导入页面组件
import { MainPage, ChatPage } from '@/src/features/Messages';

// 导入共享组件
import { MessageItem, UserAvatar } from '@/src/features/Messages';

// 导入Store
import { useMessagesStore, useChatStore } from '@/src/features/Messages';

// 导入类型
import type { Conversation, Message } from '@/src/features/Messages';

// 导入常量
import { MESSAGES_ROUTES, MESSAGES_COLORS } from '@/src/features/Messages';
```

### 🧭 **路由配置**

```typescript
// 消息模块的路由映射
/(tabs)/messages              → MainPage (消息主页面)
/(tabs)/messages/likes        → LikesPage (赞和收藏)
/(tabs)/messages/comments     → CommentsPage (评论)
/(tabs)/messages/followers    → FollowersPage (粉丝)
/(tabs)/messages/notifications → NotificationsPage (系统通知)
/(tabs)/messages/chat/:id     → ChatPage (私聊对话)
```

---

## 📊 **状态管理**

### 🏠 **messagesStore**

管理对话列表和未读消息计数

```typescript
const messages = useMessagesStore();

// 状态
messages.conversations    // 对话列表
messages.unreadCount     // 未读消息总数
messages.loading         // 加载状态
messages.error          // 错误信息

// 方法
messages.loadConversations()    // 加载对话列表
messages.markAsRead(id)         // 标记为已读
messages.deleteConversation(id) // 删除对话
messages.refreshConversations() // 刷新对话
```

### 💬 **chatStore**

管理当前聊天会话和消息列表

```typescript
const chat = useChatStore();

// 状态
chat.currentChat      // 当前对话
chat.messages        // 消息列表
chat.inputText       // 输入文本
chat.loading         // 加载状态

// 方法
chat.loadMessages(chatId)   // 加载消息
chat.sendMessage(content)   // 发送消息
chat.setInputText(text)     // 设置输入
chat.clearChat()           // 清空聊天
```

### 🔌 **webSocketStore**

管理WebSocket连接状态

```typescript
const ws = useWebSocketStore();

// 状态
ws.connected           // 连接状态
ws.reconnectAttempts  // 重连次数

// 方法
ws.connect()                 // 连接
ws.disconnect()              // 断开
ws.sendEvent(event, data)   // 发送事件
```

---

## 🌐 **API接口**

### 📡 **messagesApi**

```typescript
import { messagesApi } from '@/src/features/Messages';

// 获取对话列表
const conversations = await messagesApi.getConversations();

// 标记为已读
await messagesApi.markAsRead(conversationId);

// 删除对话
await messagesApi.deleteConversation(conversationId);

// 获取未读计数
const count = await messagesApi.getUnreadCount();
```

### 💬 **chatApi**

```typescript
import { chatApi } from '@/src/features/Messages';

// 获取聊天消息
const messages = await chatApi.getMessages(chatId, page);

// 发送消息
await chatApi.sendMessage(chatId, content);

// 标记消息已读
await chatApi.markMessagesAsRead(chatId, messageIds);
```

---

## 🎨 **主题配置**

模块使用统一的主题配置，与现有Button组件保持一致：

```typescript
import { MESSAGES_COLORS } from '@/src/features/Messages';

// 主题色
PRIMARY: '#6366F1'    // 主色调 (与Button统一)
SECONDARY: '#8B5CF6'  // 辅助色
SUCCESS: '#10B981'    // 成功色
ERROR: '#EF4444'      // 错误色
```

---

## ⚡ **性能优化**

### 🧠 **记忆化优化**

所有组件都使用了React性能优化API：

- `React.memo()` - 组件记忆化
- `useMemo()` - 计算属性缓存
- `useCallback()` - 事件处理缓存

### 📜 **列表优化**

对话列表和消息列表使用FlatList虚拟化：

- 初始渲染数量: 10条
- 批次渲染数量: 10条
- 窗口大小: 10屏

---

## 🔧 **开发指南**

### ✅ **添加新页面**

1. 在`src/features/Messages/`下创建新页面目录
2. 参考MainPage实现八段式结构
3. 在`Messages/index.ts`中导出
4. 在`app/(tabs)/messages/`下创建对应路由

### ✅ **添加新组件**

1. 在`SharedComponents/`下创建新组件目录
2. 基于Button.tsx模板实现八段式结构
3. 在`SharedComponents/index.ts`中导出
4. 编写组件README.md文档

---

## 📖 **相关文档**

- [消息模块修正版架构设计v2.0.md](./消息模块修正版架构设计v2.0.md) - 完整架构设计文档
- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../../.cursor/rules/) - 核心架构标准
- [Homepage模块文档](../Homepage/HOMEPAGE_MODULE_ARCHITECTURE.md) - 参考模块文档
- [AuthModule模块文档](../AuthModule/AUTH_MODULE_ARCHITECTURE.md) - 参考模块文档

---

## ⚠️ **注意事项**

1. 所有组件必须遵循八段式结构
2. 新增功能必须先更新types.ts类型定义
3. API调用必须包含错误处理
4. WebSocket连接需要处理重连逻辑
5. 移动端交互需要添加触觉反馈

---

**📅 创建时间**: 2025年9月  
**🔄 最后更新**: 2025年9月  
**📝 维护者**: 开发团队  
**🎯 版本**: v2.0  
**🏆 质量标准**: 与Homepage/AuthModule同等质量
