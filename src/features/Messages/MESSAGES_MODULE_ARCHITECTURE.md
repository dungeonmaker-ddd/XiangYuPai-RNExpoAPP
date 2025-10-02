# 💬 消息模块架构文档 v1.0

> **AI协作友好** - 为AI理解和修改优化的架构说明文档

---

## 📋 **快速概览**

| 项目信息 | 详细内容 |
|---------|---------|
| **模块名称** | Messages 消息模块 (Feature Module) |
| **技术栈** | React Native + Expo Router + Zustand + TypeScript |
| **架构模式** | 八段式单文件架构 + 层级化页面组 |
| **组件数量** | 6个页面 + 3个区域组件 + 4个共享组件 |
| **路由模式** | Expo Router文件系统路由 |
| **状态管理** | Zustand + AsyncStorage持久化 |
| **命名规范** | Screen(路由) + Page(业务) + Area(区域) + Component(通用) |

---

## 🏗️ **核心架构**

### 📂 **目录结构**
```
src/features/Messages/
├── MainPage/                   # 消息主页面
│   └── components/             # 区域组件
│       ├── CategoryArea/       # 4宫格分类区域
│       ├── ConversationArea/   # 对话列表区域
│       └── NavigationArea/     # 导航栏区域
├── LikesPage/                  # 赞和收藏页面
├── CommentsPage/               # 评论页面
├── FollowersPage/              # 粉丝页面
├── NotificationsPage/          # 系统通知页面
├── ChatPage/                   # 私聊对话页面
├── SharedComponents/           # 共享组件
│   ├── MessageItem/           # 消息列表项
│   ├── UserAvatar/            # 用户头像
│   ├── ChatBubble/            # 消息气泡
│   └── SwipeActions/          # 滑动操作
├── api/                       # API接口
├── stores/                    # 状态管理
└── MESSAGES_MODULE_ARCHITECTURE.md
```

### 🧭 **路由映射**
```
/(tabs)/messages              → MessagesScreen → MainPage
/(tabs)/messages/likes        → LikesScreen → LikesPage
/(tabs)/messages/comments     → CommentsScreen → CommentsPage
/(tabs)/messages/followers    → FollowersScreen → FollowersPage
/(tabs)/messages/notifications → NotificationsScreen → NotificationsPage
/(tabs)/messages/chat/:id     → ChatScreen → ChatPage
```

---

## 📊 **状态管理**

### Stores

- `messagesStore` - 对话列表和未读计数
- `chatStore` - 当前聊天和消息列表
- `webSocketStore` - WebSocket连接状态

### API

- `messagesApi` - 对话列表相关接口
- `chatApi` - 聊天消息相关接口
- `notificationsApi` - 通知相关接口

---

## 🎯 **快速定位**

| 功能 | 文件位置 | Store | API |
|------|---------|-------|-----|
| 消息分类 | CategoryArea | - | - |
| 对话列表 | ConversationArea | messagesStore | messagesApi |
| 私聊 | ChatPage | chatStore | chatApi |
| 通知 | LikesPage等 | - | notificationsApi |

---

**📅 创建时间**: 2025年9月  
**🔄 最后更新**: 2025年9月  
**📝 维护者**: 开发团队
