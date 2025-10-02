# 📊 Messages模块Store审查报告

> 基于现有项目Store实现标准的完整性审查

---

## 🔍 **发现的问题**

### 🔴 **严重问题 (需要立即修复)**

#### 1. **chatStore.ts - sendMessage函数存在Bug**

**问题位置**: `chatStore.ts` 第91-96行

```typescript
// ❌ 错误实现
set({
  messages: [...messages, tempMessage],  // 添加临时消息
  inputText: '',
});

// 之后
set({
  messages: messages.map(msg =>  // ❌ Bug: messages是旧值，不包含tempMessage
    msg.id === tempMessage.id
      ? { ...msg, status: 'sent' as const }
      : msg
  ),
});

// ✅ 正确实现应该是
set(state => ({
  messages: state.messages.map(msg =>  // 使用state.messages获取最新值
    msg.id === tempMessage.id
      ? { ...msg, status: 'sent' as const }
      : msg
  ),
}));
```

#### 2. **chatStore.ts - 缺少setCurrentChat方法**

**问题**: ChatPage需要设置当前对话，但Store中没有提供此方法

```typescript
// ❌ 缺失
// 无法设置currentChat

// ✅ 需要添加
setCurrentChat: (conversation: Conversation | null) => {
  set({ currentChat: conversation });
}
```

---

### 🟡 **重要问题 (建议修复)**

#### 3. **未使用现有项目的devtools和createSafeStorage**

**现有项目标准**:
```typescript
// 现有homepageStore使用
import { devtools, persist } from 'zustand/middleware';
import { createSafeStorage } from './storage-config';

export const useHomepageStore = create<HomepageState>()(
  devtools(
    persist(
      (set, get) => ({...}),
      {
        name: 'homepage-storage',
        storage: createSafeStorage(),  // 使用统一的安全存储
      }
    ),
    { name: 'HomepageStore' }
  )
);
```

**我们的实现**:
```typescript
// ⚠️ 未使用devtools和createSafeStorage
export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({...}),
    {
      name: 'messages-storage',
      storage: createJSONStorage(() => AsyncStorage),  // 直接使用AsyncStorage
    }
  )
);
```

#### 4. **缺少选择器导出 (Selector Exports)**

**现有项目标准**:
```typescript
// 现有homepageStore提供选择器
export const useHomepageConfig = () => useHomepageStore(state => state.pageConfig);
export const useHomepageData = () => useHomepageStore(state => state.pageData);
export const useHomepageLoading = () => useHomepageStore(state => state.loading);
```

**建议添加**:
```typescript
// messagesStore.ts底部添加
export const useConversations = () => useMessagesStore(state => state.conversations);
export const useUnreadCount = () => useMessagesStore(state => state.unreadCount);
export const useMessagesLoading = () => useMessagesStore(state => state.loading);

// chatStore.ts底部添加
export const useCurrentChat = () => useChatStore(state => state.currentChat);
export const useChatMessages = () => useChatStore(state => state.messages);
export const useChatInputText = () => useChatStore(state => state.inputText);
```

#### 5. **CategoryArea的unreadCounts应从Store获取**

**当前实现** (MainPage/index.tsx):
```typescript
// ❌ hardcoded
<CategoryArea
  unreadCounts={{
    likes: 0,
    comments: 0,
    followers: 0,
    notifications: 0,
  }}
  onCategoryPress={logic.handleCategoryPress}
/>
```

**建议改进**:
```typescript
// ✅ 从Store获取
// 1. 在messagesStore中添加分类未读计数
interface MessagesState {
  // ... existing
  categoryUnreadCounts: {
    likes: number;
    comments: number;
    followers: number;
    notifications: number;
  };
}

// 2. MainPage中使用
<CategoryArea
  unreadCounts={logic.state.categoryUnreadCounts}
  onCategoryPress={logic.handleCategoryPress}
/>
```

---

### 🟢 **优化建议 (可选)**

#### 6. **添加WebSocket事件监听器到Store**

当前webSocketStore是空壳，建议集成到chatStore中：

```typescript
// chatStore.ts
// 添加WebSocket消息监听
useEffect(() => {
  const ws = useWebSocketStore.getState();
  
  // 监听新消息事件
  ws.on('new_message', (message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  });
}, []);
```

#### 7. **添加离线消息队列**

```typescript
// chatStore添加
interface ChatState {
  // ... existing
  offlineQueue: Message[];  // 离线时的消息队列
}
```

---

## 🛠️ **修复方案**

### 📋 **必须修复的问题清单**

1. **🔴 P0**: 修复chatStore.sendMessage的状态更新bug
2. **🔴 P0**: 添加chatStore.setCurrentChat方法
3. **🟡 P1**: 统一使用devtools和createSafeStorage
4. **🟡 P1**: 添加选择器导出
5. **🟡 P1**: messagesStore添加categoryUnreadCounts
6. **🟢 P2**: 优化WebSocket集成
7. **🟢 P2**: 添加离线消息队列

---

## ✅ **建议的修正顺序**

### 第一步：修复chatStore的Bug
- 修复sendMessage状态更新
- 添加setCurrentChat方法
- 添加选择器导出

### 第二步：统一Store配置
- 使用devtools中间件
- 使用createSafeStorage
- 添加选择器导出到messagesStore

### 第三步：完善CategoryArea未读计数
- messagesStore添加categoryUnreadCounts
- 从API加载分类未读数
- MainPage使用Store数据

---

**优先级建议**: 立即修复P0问题，P1问题在测试前修复，P2问题可后续优化

---

**📅 审查时间**: 2025年9月  
**📝 审查者**: AI Assistant  
**🎯 标准**: 基于现有homepageStore/userStore实现标准
