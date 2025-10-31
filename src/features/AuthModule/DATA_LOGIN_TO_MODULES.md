# 🔄 DATA: 登录数据流向其他模块

> **文件说明**: 展示登录成功后，authStore的数据如何被其他模块使用  
> **命名规则**: `DATA_` 前缀 = 数据流向文档，便于识别和管理  
> **更新时间**: 2025-10-28

---

## 📊 登录数据结构 (authStore提供)

### **登录成功后，authStore存储的数据**

```typescript
// authStore.ts - 登录后的状态
{
  isAuthenticated: true,           // ✅ 已登录
  accessToken: "eyJ0eXAi...",      // 🔑 访问令牌
  refreshToken: "eyJ0eXAi...",     // 🔄 刷新令牌
  userInfo: {
    id: "2000",                    // 👤 用户ID
    phone: "13900000001",          // 📱 手机号
    nickname: "APP测试员",         // 🏷️ 昵称
    avatar: "https://...",         // 🖼️ 头像URL
    verified: true,                // ✅ 认证状态
    createdAt: "2025-10-28..."     // 📅 创建时间
  }
}
```

**这些数据可以被所有模块访问！**

---

## 🎯 数据流向：authStore → 各个模块

```
登录成功
    ↓
authStore (保存用户数据)
    ├─→ Discovery模块 (发现页)
    ├─→ Messages模块 (消息页)
    ├─→ Profile模块 (个人页)
    ├─→ Homepage模块 (首页)
    ├─→ Comments模块 (评论系统)
    └─→ 任何需要"我是谁"的模块
```

---

## 📱 模块1: Discovery (发现页)

### **场景**: 显示动态卡片，判断是否是自己发布的

```typescript
// src/features/Discovery/components/FeedCard.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

interface FeedCardProps {
  feed: {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    likeCount: number;
  };
}

function FeedCard({ feed }: FeedCardProps) {
  // ✅ 从authStore获取当前用户数据
  const { userInfo, isAuthenticated } = useAuthStore();
  
  // ✅ 判断是否是自己的动态
  const isMyFeed = feed.authorId === userInfo?.id;
  
  return (
    <View style={styles.card}>
      {/* 作者信息 */}
      <View style={styles.header}>
        <Image source={{ uri: feed.authorAvatar }} />
        <Text>{feed.authorName}</Text>
        
        {/* ✅ 如果是自己的动态，显示徽章 */}
        {isMyFeed && (
          <View style={styles.badge}>
            <Text>我的</Text>
          </View>
        )}
      </View>
      
      {/* 内容 */}
      <Text>{feed.content}</Text>
      
      {/* 操作按钮 */}
      <View style={styles.actions}>
        {/* ✅ 已登录才显示点赞按钮 */}
        {isAuthenticated ? (
          <LikeButton 
            feedId={feed.id} 
            userId={userInfo.id}  // ← 使用authStore的数据
          />
        ) : (
          <Text>登录后可点赞</Text>
        )}
        
        {/* ✅ 如果是自己的动态，显示删除按钮 */}
        {isMyFeed && (
          <Button title="删除" onPress={() => deleteFeed(feed.id)} />
        )}
      </View>
    </View>
  );
}
```

### **使用的authStore数据**:
- ✅ `userInfo.id` - 判断是否是自己的动态
- ✅ `isAuthenticated` - 判断是否已登录
- ✅ `userInfo.id` - 传递给点赞功能

---

## 💬 模块2: Messages (消息页)

### **场景**: 聊天消息列表，区分自己和对方的消息

```typescript
// src/features/Messages/components/MessageList.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  // ✅ 从authStore获取当前用户ID
  const { userInfo } = useAuthStore();
  
  return (
    <FlatList
      data={messages}
      renderItem={({ item: message }) => {
        // ✅ 判断是否是自己发的消息
        const isSentByMe = message.senderId === userInfo?.id;
        
        return (
          <View 
            style={[
              styles.messageBubble,
              isSentByMe ? styles.myMessage : styles.theirMessage
            ]}
          >
            <Text>{message.content}</Text>
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        );
      }}
    />
  );
}
```

### **使用的authStore数据**:
- ✅ `userInfo.id` - 判断消息是谁发的
- ✅ 用于左右对齐消息气泡

---

## 💬 模块3: Comments (评论系统)

### **场景**: 评论输入框，显示当前用户头像和昵称

```typescript
// src/features/Comments/components/CommentInput.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

interface CommentInputProps {
  postId: string;
  onSubmit: (comment: string) => void;
}

function CommentInput({ postId, onSubmit }: CommentInputProps) {
  // ✅ 从authStore获取当前用户信息
  const { userInfo, isAuthenticated } = useAuthStore();
  const [comment, setComment] = useState('');
  
  // ✅ 未登录时显示登录提示
  if (!isAuthenticated) {
    return (
      <View style={styles.loginPrompt}>
        <Text>登录后可以评论</Text>
        <Button title="去登录" onPress={() => router.push('/auth/login')} />
      </View>
    );
  }
  
  const handleSubmit = async () => {
    await onSubmit({
      postId,
      content: comment,
      // ✅ 使用authStore的数据作为作者信息
      authorId: userInfo.id,
      authorName: userInfo.nickname,
      authorAvatar: userInfo.avatar,
    });
    setComment('');
  };
  
  return (
    <View style={styles.inputBox}>
      {/* ✅ 显示当前用户头像 */}
      <Image 
        source={{ uri: userInfo.avatar }} 
        style={styles.avatar}
      />
      
      {/* ✅ 输入框占位符显示用户昵称 */}
      <TextInput
        placeholder={`${userInfo.nickname}，说点什么...`}
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      
      <Button title="发送" onPress={handleSubmit} />
    </View>
  );
}
```

### **使用的authStore数据**:
- ✅ `isAuthenticated` - 判断是否已登录
- ✅ `userInfo.avatar` - 显示头像
- ✅ `userInfo.nickname` - 显示昵称
- ✅ `userInfo.id` - 作为评论作者ID

---

## 🏠 模块4: Homepage (首页)

### **场景**: 首页顶部导航栏，显示用户头像和昵称

```typescript
// src/features/Homepage/components/TopBar.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function TopBar() {
  // ✅ 从authStore获取当前用户信息
  const { userInfo, isAuthenticated } = useAuthStore();
  
  return (
    <View style={styles.topBar}>
      {/* 左侧：位置 */}
      <View style={styles.location}>
        <Text>📍 深圳</Text>
      </View>
      
      {/* 右侧：用户信息 */}
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/profile')}
        style={styles.userInfo}
      >
        {isAuthenticated ? (
          <>
            {/* ✅ 显示用户头像 */}
            <Image 
              source={{ uri: userInfo?.avatar }} 
              style={styles.avatar}
            />
            {/* ✅ 显示用户昵称 */}
            <Text>{userInfo?.nickname}</Text>
          </>
        ) : (
          <Button title="登录" onPress={() => router.push('/auth/login')} />
        )}
      </TouchableOpacity>
    </View>
  );
}
```

### **使用的authStore数据**:
- ✅ `isAuthenticated` - 判断显示头像还是登录按钮
- ✅ `userInfo.avatar` - 显示头像
- ✅ `userInfo.nickname` - 显示昵称

---

## 👤 模块5: Profile (个人页)

### **场景**: 个人主页，优先显示authStore基础信息，再加载完整资料

```typescript
// src/features/Profile/MainPage/index.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

function ProfileMainPage() {
  // ✅ 从authStore获取基础信息（立即可用）
  const { userInfo } = useAuthStore();
  
  // ✅ 从profileStore获取完整资料（按需加载）
  const { currentProfile, loadUserProfile, loading } = useProfileStore();
  
  useEffect(() => {
    // 加载完整资料
    loadUserProfile();
  }, []);
  
  return (
    <View>
      {/* 背景和头像 - 优先使用authStore数据（立即显示） */}
      <BackgroundArea 
        imageUrl={userInfo?.avatar}  // ← authStore
        avatarUrl={userInfo?.avatar} // ← authStore
      />
      
      {/* 用户信息 - 先显示基础信息，加载完成后显示完整信息 */}
      <UserInfoArea 
        userInfo={{
          id: userInfo?.id,              // ← authStore
          nickname: userInfo?.nickname,   // ← authStore
          avatar: userInfo?.avatar,       // ← authStore
          // 完整资料加载后，显示更多字段
          ...currentProfile,
        }}
      />
      
      {loading && <ActivityIndicator />}
      
      {/* 详细资料 - 只有profileStore加载完成后显示 */}
      {currentProfile && (
        <>
          <Text>身高: {currentProfile.height}cm</Text>
          <Text>简介: {currentProfile.bio}</Text>
          <Text>职业: {currentProfile.occupations?.join(', ')}</Text>
        </>
      )}
    </View>
  );
}
```

### **使用的authStore数据**:
- ✅ `userInfo.id` - 用户ID
- ✅ `userInfo.nickname` - 昵称（立即显示）
- ✅ `userInfo.avatar` - 头像（立即显示）
- ✅ 作为加载中的占位数据

---

## 📝 模块6: Publish (发布动态)

### **场景**: 发布动态时，自动填充作者信息

```typescript
// src/features/Publish/PublishPage.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function PublishPage() {
  // ✅ 从authStore获取当前用户信息
  const { userInfo } = useAuthStore();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const handlePublish = async () => {
    try {
      // ✅ 使用authStore的数据作为作者信息
      await publishApi.createPost({
        authorId: userInfo.id,        // ← authStore
        authorName: userInfo.nickname, // ← authStore
        authorAvatar: userInfo.avatar, // ← authStore
        content,
        images,
        publishTime: new Date().toISOString(),
      });
      
      Alert.alert('成功', '发布成功');
      router.back();
    } catch (error) {
      Alert.alert('失败', error.message);
    }
  };
  
  return (
    <View>
      {/* 显示发布者信息预览 */}
      <View style={styles.authorPreview}>
        <Image source={{ uri: userInfo?.avatar }} />
        <Text>{userInfo?.nickname}</Text>
      </View>
      
      <TextInput
        placeholder="分享你的精彩瞬间..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      
      <Button title="发布" onPress={handlePublish} />
    </View>
  );
}
```

### **使用的authStore数据**:
- ✅ `userInfo.id` - 作者ID
- ✅ `userInfo.nickname` - 作者昵称
- ✅ `userInfo.avatar` - 作者头像

---

## 🔔 模块7: Notifications (通知)

### **场景**: 通知列表，标记哪些通知是给"我"的

```typescript
// src/features/Notifications/NotificationList.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  fromUserId: string;
  toUserId: string;
  content: string;
  read: boolean;
}

function NotificationList({ notifications }: { notifications: Notification[] }) {
  // ✅ 从authStore获取当前用户ID
  const { userInfo } = useAuthStore();
  
  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => {
        // ✅ 判断是否是发给我的通知
        const isForMe = item.toUserId === userInfo?.id;
        
        // ✅ 判断是否是我发出的行为
        const isFromMe = item.fromUserId === userInfo?.id;
        
        return (
          <View style={[
            styles.notification,
            !item.read && styles.unread
          ]}>
            <Text>{item.content}</Text>
            
            {isForMe && !item.read && (
              <View style={styles.badge}>
                <Text>新</Text>
              </View>
            )}
            
            {isFromMe && (
              <Text style={styles.note}>这是你的操作</Text>
            )}
          </View>
        );
      }}
    />
  );
}
```

### **使用的authStore数据**:
- ✅ `userInfo.id` - 判断通知是否是给我的
- ✅ `userInfo.id` - 判断是否是我发出的行为

---

## 🛡️ 模块8: RouteGuard (路由守卫)

### **场景**: 保护需要登录的页面

```typescript
// src/features/RouteGuard/index.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter, useSegments } from 'expo-router';

function RouteGuard({ children }) {
  // ✅ 从authStore获取登录状态
  const { isAuthenticated, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (!isInitialized) return;
    
    // 定义受保护的路由
    const protectedRoutes = ['messages', 'profile', 'publish'];
    const currentRoute = segments[1];
    
    // ✅ 未登录且访问受保护路由
    if (!isAuthenticated && protectedRoutes.includes(currentRoute)) {
      console.log('🔒 需要登录，重定向到登录页');
      router.replace('/auth/login');
    }
    
    // ✅ 已登录且在登录页
    if (isAuthenticated && segments[0] === 'auth') {
      console.log('✅ 已登录，重定向到首页');
      router.replace('/(tabs)/homepage');
    }
  }, [isAuthenticated, isInitialized, segments]);
  
  return children;
}
```

### **使用的authStore数据**:
- ✅ `isAuthenticated` - 判断是否已登录
- ✅ `isInitialized` - 判断是否初始化完成

---

## 🎯 通用模式：如何在任何模块使用登录数据

### **模式1: 获取用户ID**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function AnyComponent() {
  const { userInfo } = useAuthStore();
  const currentUserId = userInfo?.id;  // ✅ 当前用户ID
  
  // 使用ID...
}
```

---

### **模式2: 判断是否已登录**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function AnyComponent() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <ProtectedContent />;
}
```

---

### **模式3: 显示用户头像和昵称**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function AnyComponent() {
  const { userInfo } = useAuthStore();
  
  return (
    <View>
      <Image source={{ uri: userInfo?.avatar }} />
      <Text>{userInfo?.nickname}</Text>
    </View>
  );
}
```

---

### **模式4: 判断内容是否属于当前用户**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function AnyComponent({ item }) {
  const { userInfo } = useAuthStore();
  const isMine = item.authorId === userInfo?.id;
  
  return (
    <View>
      {isMine && <Badge text="我的" />}
      {isMine && <Button title="删除" />}
    </View>
  );
}
```

---

## 📊 数据流向总结表

| 模块 | 使用场景 | 使用的authStore数据 |
|------|---------|-------------------|
| **Discovery** | 判断是否是自己的动态 | `userInfo.id` |
| **Messages** | 区分自己和对方的消息 | `userInfo.id` |
| **Comments** | 显示评论者头像昵称 | `userInfo.avatar`, `userInfo.nickname` |
| **Homepage** | 顶部导航栏显示用户信息 | `userInfo.avatar`, `userInfo.nickname` |
| **Profile** | 个人主页基础信息 | `userInfo.id`, `userInfo.nickname`, `userInfo.avatar` |
| **Publish** | 发布内容时的作者信息 | `userInfo.id`, `userInfo.nickname`, `userInfo.avatar` |
| **Notifications** | 判断通知是否给我 | `userInfo.id` |
| **RouteGuard** | 路由守卫 | `isAuthenticated` |

---

## ✅ 核心原则

### **1. authStore = 全局身份标识**

```typescript
// 任何模块都可以这样使用
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

const { userInfo } = useAuthStore();
// ✅ 立即可用，无需API请求
```

---

### **2. 优先使用authStore**

```typescript
// ✅ 正确 - 使用authStore
const { userInfo } = useAuthStore();
const myId = userInfo?.id;

// ❌ 错误 - 不必要地加载profileStore
const { currentProfile } = useProfileStore();
loadUserProfile();  // 多余的API请求
const myId = currentProfile?.id;
```

---

### **3. 所有模块共享同一份数据**

```typescript
// Discovery模块
const { userInfo } = useAuthStore();  // userInfo.id = "2000"

// Messages模块
const { userInfo } = useAuthStore();  // userInfo.id = "2000"

// Comments模块
const { userInfo } = useAuthStore();  // userInfo.id = "2000"

// ✅ 所有模块读取同一份数据，零开销！
```

---

## 🎊 完整示例：Discovery模块使用登录数据

```typescript
// src/features/Discovery/MainPage/index.tsx

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';

function DiscoveryMainPage() {
  // 1️⃣ 获取当前用户信息（来自authStore）
  const { userInfo, isAuthenticated } = useAuthStore();
  
  // 2️⃣ 获取动态列表（来自discoveryStore）
  const { feeds, loadFeeds } = useDiscoveryStore();
  
  useEffect(() => {
    loadFeeds();
  }, []);
  
  return (
    <FlatList
      data={feeds}
      renderItem={({ item: feed }) => (
        <View style={styles.feedCard}>
          {/* 作者信息 */}
          <View style={styles.header}>
            <Image source={{ uri: feed.authorAvatar }} />
            <Text>{feed.authorName}</Text>
            
            {/* ✅ 如果是自己的动态，显示"我的"徽章 */}
            {feed.authorId === userInfo?.id && (
              <Badge text="我的" />
            )}
          </View>
          
          {/* 内容 */}
          <Text>{feed.content}</Text>
          
          {/* 操作按钮 */}
          <View style={styles.actions}>
            {/* ✅ 已登录：显示点赞按钮 */}
            {isAuthenticated ? (
              <LikeButton 
                feedId={feed.id}
                userId={userInfo.id}  // ← authStore数据
                currentUserAvatar={userInfo.avatar}  // ← authStore数据
              />
            ) : (
              /* ✅ 未登录：显示登录提示 */
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text>登录后可点赞</Text>
              </TouchableOpacity>
            )}
            
            {/* ✅ 如果是自己的动态：显示删除按钮 */}
            {feed.authorId === userInfo?.id && (
              <Button 
                title="删除" 
                onPress={() => handleDelete(feed.id)} 
              />
            )}
          </View>
        </View>
      )}
    />
  );
}
```

**使用的authStore数据**:
- ✅ `userInfo.id` - 判断是否是自己的动态
- ✅ `isAuthenticated` - 判断是否显示点赞按钮
- ✅ `userInfo.avatar` - 传递给点赞组件

---

## 🎯 总结

### **authStore → 其他模块的数据流**

```
登录成功 → authStore保存数据
    ↓
所有模块通过 useAuthStore() 访问
    ↓
✅ 零API请求
✅ 快速响应
✅ 数据一致
```

### **关键要点**

1. ✅ **authStore = 全局身份管理** - 所有模块都可以访问
2. ✅ **无需额外请求** - 登录后数据立即可用
3. ✅ **性能最优** - 从内存读取，零延迟
4. ✅ **数据一致** - 所有模块共享同一份数据

---

**文件命名**: `DATA_` 前缀表示数据流向文档  
**创建时间**: 2025-10-28  
**状态**: ✅ 生产就绪  
**用途**: 开发者参考，展示实际数据使用方式

