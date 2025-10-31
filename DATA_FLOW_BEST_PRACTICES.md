# 🏗️ 数据流最佳实践 - 模块间数据使用指南

> **目标**: 避免重复API请求，提高性能，保持数据一致性  
> **原则**: 使用正确的数据源，避免冗余加载

---

## 🎯 核心原则

### **Rule 1: authStore = 全局身份标识 (Global Identity)**

```typescript
// authStore.userInfo - 登录后自动可用，无需额外请求
{
  id: "2000",              // ← 用户唯一ID
  phone: "13900000001",    // ← 手机号
  nickname: "APP测试员",   // ← 昵称
  avatar: "https://...",   // ← 头像
  verified: true,          // ← 认证状态
  createdAt: "..."         // ← 创建时间
}
```

**特点**:
- ✅ 登录后立即可用（无需额外API调用）
- ✅ 全局可访问（所有模块都可以读取）
- ✅ 轻量级数据（6个基础字段）
- ✅ 快速响应（从内存读取）

---

### **Rule 2: profileStore = 完整资料详情 (Full Profile Details)**

```typescript
// profileStore.currentProfile - 需要时才加载，42个详细字段
{
  // authStore的6个字段 +
  gender: 'female',
  age: 25,
  birthday: "1999-09-29",
  bio: "这是我的个人简介",
  height: 162,
  weight: 44,
  location: "深圳市南山区",
  occupations: ["模特", "学生"],
  wechat: "sunny0301",
  isRealVerified: true,
  isGodVerified: true,
  followingCount: 201,
  followerCount: 201,
  // ... 共42个字段
}
```

**特点**:
- 🔄 按需加载（只在访问个人页时请求）
- 📊 详细数据（42个完整字段）
- 💾 可缓存（减少重复请求）
- ✏️ 可编辑（资料编辑功能）

---

## 📋 使用场景对照表

| 场景 | 需要的数据 | 使用的Store | 是否需要API请求 |
|------|-----------|------------|----------------|
| **全局导航栏显示头像/昵称** | 头像、昵称 | `authStore.userInfo` | ❌ 不需要 |
| **评论区显示用户信息** | 头像、昵称、ID | `authStore.userInfo` | ❌ 不需要 |
| **消息列表显示发送者** | 头像、昵称 | `authStore.userInfo` | ❌ 不需要 |
| **发布动态时的作者信息** | 头像、昵称、ID | `authStore.userInfo` | ❌ 不需要 |
| **个人主页完整展示** | 42个详细字段 | `profileStore.currentProfile` | ✅ 需要（首次） |
| **资料编辑页面** | 42个详细字段 | `profileStore.currentProfile` | ✅ 需要（首次） |
| **关注/粉丝统计** | followingCount等 | `profileStore.currentProfile` | ✅ 需要 |

---

## 🔄 **数据流详解**

### **场景1: 全局导航栏显示用户头像**

```typescript
// ✅ 正确做法 - 直接使用authStore
import { useAuthStore } from '@/stores/authStore';

function GlobalHeader() {
  const { userInfo } = useAuthStore();
  
  return (
    <View>
      <Image source={{ uri: userInfo?.avatar }} />
      <Text>{userInfo?.nickname}</Text>
    </View>
  );
}
```

**为什么?**
- ✅ 登录后`userInfo`已经存在，无需额外请求
- ✅ 性能最优（从内存读取）
- ✅ 数据已足够（只需要头像和昵称）

---

```typescript
// ❌ 错误做法 - 多余的API请求
import { useProfileStore } from '@/stores/profileStore';

function GlobalHeader() {
  const { currentProfile, loadUserProfile } = useProfileStore();
  
  useEffect(() => {
    loadUserProfile();  // ← 不必要的API请求！
  }, []);
  
  return (
    <View>
      <Image source={{ uri: currentProfile?.avatar }} />
      <Text>{currentProfile?.nickname}</Text>
    </View>
  );
}
```

**问题**:
- ❌ 每次渲染都请求API（浪费资源）
- ❌ 数据冗余（authStore已有）
- ❌ 用户体验差（等待加载）

---

### **场景2: 发布动态时获取作者信息**

```typescript
// ✅ 正确做法 - 使用authStore
import { useAuthStore } from '@/stores/authStore';

function PublishPost() {
  const { userInfo } = useAuthStore();
  
  const handlePublish = async (content: string) => {
    await postApi.createPost({
      authorId: userInfo.id,        // ← 从authStore获取
      authorName: userInfo.nickname,
      authorAvatar: userInfo.avatar,
      content,
    });
  };
  
  return <PublishForm onSubmit={handlePublish} />;
}
```

**为什么?**
- ✅ `userInfo.id` 就是当前用户ID
- ✅ 无需额外请求
- ✅ 数据已足够

---

### **场景3: 个人主页完整展示**

```typescript
// ✅ 正确做法 - 使用profileStore + 按需加载
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

function ProfileMainPage() {
  const { userInfo } = useAuthStore();  // ← 基础身份信息
  const { currentProfile, loadUserProfile } = useProfileStore();
  
  useEffect(() => {
    // 只在首次访问或数据为空时加载
    if (!currentProfile) {
      loadUserProfile();  // ← 加载完整42字段
    }
  }, []);
  
  // 加载中：使用authStore的基础信息占位
  if (!currentProfile) {
    return (
      <View>
        <Image source={{ uri: userInfo?.avatar }} />
        <Text>{userInfo?.nickname}</Text>
        <ActivityIndicator />
      </View>
    );
  }
  
  // 加载完成：显示完整资料
  return (
    <View>
      <Image source={{ uri: currentProfile.avatar }} />
      <Text>{currentProfile.nickname}</Text>
      <Text>身高: {currentProfile.height}cm</Text>
      <Text>简介: {currentProfile.bio}</Text>
      <Text>职业: {currentProfile.occupations.join(', ')}</Text>
      {/* ... 更多详细字段 */}
    </View>
  );
}
```

**优势**:
- ✅ 先显示基础信息（authStore，无等待）
- ✅ 再加载完整资料（profileStore，首次请求）
- ✅ 用户体验好（渐进式加载）

---

### **场景4: 评论区显示当前用户信息**

```typescript
// ✅ 正确做法 - 使用authStore
import { useAuthStore } from '@/stores/authStore';

function CommentInput() {
  const { userInfo } = useAuthStore();
  
  return (
    <View style={styles.commentBox}>
      <Image 
        source={{ uri: userInfo?.avatar }} 
        style={styles.avatar}
      />
      <TextInput 
        placeholder={`${userInfo?.nickname}，说点什么...`}
      />
    </View>
  );
}
```

---

### **场景5: 消息列表显示发送者**

```typescript
// ✅ 正确做法 - 使用authStore判断是否是自己
import { useAuthStore } from '@/stores/authStore';

function MessageList({ messages }) {
  const { userInfo } = useAuthStore();
  
  return messages.map(msg => {
    const isOwn = msg.senderId === userInfo?.id;  // ← 判断是否是自己发的
    
    return (
      <View style={isOwn ? styles.ownMessage : styles.otherMessage}>
        <Image source={{ uri: msg.avatar }} />
        <Text>{msg.content}</Text>
      </View>
    );
  });
}
```

---

## 🎨 **数据流架构图**

```
登录成功
    ↓
【authStore】保存基础用户信息 (6字段)
    ├─ id: "2000"
    ├─ nickname: "APP测试员"
    ├─ avatar: "https://..."
    ├─ phone: "13900000001"
    ├─ verified: true
    └─ createdAt: "..."
    
    ↓ 全局可用，无需额外请求
    
使用场景:
├─ 全局导航栏 → 读取 authStore.userInfo ✅
├─ 评论区头像 → 读取 authStore.userInfo ✅
├─ 消息列表 → 读取 authStore.userInfo ✅
├─ 发布动态 → 读取 authStore.userInfo ✅
└─ 任何需要"我是谁"的场景 ✅

    ↓ 用户点击"我的"Tab
    
【profileStore】加载完整资料 (42字段)
    ├─ authStore的6字段 +
    ├─ gender, age, birthday
    ├─ height, weight, bio
    ├─ location, occupations
    ├─ wechat, isRealVerified
    ├─ followingCount, followerCount
    └─ ... (共42字段)
    
    ↓ 按需加载，只在个人页使用
    
使用场景:
├─ 个人主页完整展示 → 读取 profileStore.currentProfile ✅
├─ 资料编辑页面 → 读取 profileStore.currentProfile ✅
├─ 关注/粉丝统计 → 读取 profileStore.currentProfile ✅
└─ 需要详细资料的场景 ✅
```

---

## 🔄 **缓存策略 (可选优化)**

### **profileStore支持缓存，避免重复请求**

```typescript
// profileStore.ts
export const useProfileStore = create<ProfileStore>((set, get) => ({
  currentProfile: null,
  lastUpdateTime: 0,
  
  loadUserProfile: async (userId?: string) => {
    const now = Date.now();
    const lastUpdate = get().lastUpdateTime;
    
    // 如果5分钟内已加载，直接使用缓存
    if (get().currentProfile && now - lastUpdate < 5 * 60 * 1000) {
      console.log('✅ 使用缓存的Profile数据');
      return;
    }
    
    // 超过5分钟，重新请求
    console.log('🔄 重新加载Profile数据');
    set({ loading: true });
    
    const profile = await profileApi.getCurrentUserProfile();
    
    set({
      currentProfile: profile,
      lastUpdateTime: now,
      loading: false,
    });
  },
  
  // 强制刷新（编辑后调用）
  refreshProfile: async () => {
    set({ lastUpdateTime: 0 });  // 重置缓存
    await get().loadUserProfile();
  },
}));
```

**使用**:
```typescript
// 普通访问 - 自动使用缓存
loadUserProfile();  // ← 5分钟内不会重复请求

// 编辑后刷新 - 强制请求
await updateProfile(data);
await refreshProfile();  // ← 强制刷新，获取最新数据
```

---

## 📊 **性能对比**

### **错误做法: 每次都请求API**

```typescript
// ❌ 每个组件都请求
function Header() {
  useEffect(() => {
    profileApi.getCurrentUserProfile();  // API请求1
  }, []);
}

function Sidebar() {
  useEffect(() => {
    profileApi.getCurrentUserProfile();  // API请求2
  }, []);
}

function CommentBox() {
  useEffect(() => {
    profileApi.getCurrentUserProfile();  // API请求3
  }, []);
}
```

**结果**: 3个重复的API请求！❌

---

### **正确做法: 使用authStore**

```typescript
// ✅ 所有组件共享authStore
function Header() {
  const { userInfo } = useAuthStore();  // 内存读取
  return <Image source={{ uri: userInfo?.avatar }} />;
}

function Sidebar() {
  const { userInfo } = useAuthStore();  // 内存读取
  return <Text>{userInfo?.nickname}</Text>;
}

function CommentBox() {
  const { userInfo } = useAuthStore();  // 内存读取
  return <Text>@{userInfo?.nickname}</Text>;
}
```

**结果**: 0个API请求！✅

---

## 🎯 **实战示例**

### **示例1: 发现页 - 动态卡片**

```typescript
import { useAuthStore } from '@/stores/authStore';

function FeedCard({ feed }) {
  const { userInfo } = useAuthStore();
  const isOwn = feed.authorId === userInfo?.id;  // ← 判断是否自己的动态
  
  return (
    <View>
      <View style={styles.header}>
        <Image source={{ uri: feed.authorAvatar }} />
        <Text>{feed.authorName}</Text>
        {isOwn && <Badge text="我的" />}  {/* ← 自己的动态显示徽章 */}
      </View>
      <Text>{feed.content}</Text>
      <LikeButton feedId={feed.id} userId={userInfo?.id} />
    </View>
  );
}
```

**数据来源**: `authStore.userInfo.id` (无需API请求)

---

### **示例2: 个人主页 - 完整资料展示**

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

function ProfileMainPage() {
  const { userInfo } = useAuthStore();
  const { currentProfile, loadUserProfile, loading } = useProfileStore();
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  // 渐进式加载：先显示基础信息
  return (
    <View>
      {/* 背景图和头像 - 来自authStore（立即显示） */}
      <BackgroundArea 
        imageUrl={userInfo?.avatar}  // ← 先用authStore的头像
        avatarUrl={userInfo?.avatar}
      />
      
      {/* 用户信息 - 优先使用profileStore，回退到authStore */}
      <UserInfoArea 
        userInfo={currentProfile || {
          id: userInfo?.id,
          nickname: userInfo?.nickname,
          avatar: userInfo?.avatar,
        }}
      />
      
      {loading && <ActivityIndicator />}
      
      {/* 详细资料 - 只有profileStore加载完成后显示 */}
      {currentProfile && (
        <>
          <Text>身高: {currentProfile.height}cm</Text>
          <Text>体重: {currentProfile.weight}kg</Text>
          <Text>简介: {currentProfile.bio}</Text>
          <OccupationTags tags={currentProfile.occupations} />
        </>
      )}
    </View>
  );
}
```

**数据来源**:
- 基础信息（立即显示）: `authStore.userInfo`
- 详细资料（按需加载）: `profileStore.currentProfile`

---

### **示例3: 资料编辑页 - 表单初始值**

```typescript
import { useProfileStore } from '@/stores/profileStore';

function ProfileEditPage() {
  const { currentProfile, loadUserProfile, updateProfile } = useProfileStore();
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    // 确保有完整资料
    if (!currentProfile) {
      loadUserProfile();
    } else {
      // 用完整资料初始化表单
      setFormData({
        nickname: currentProfile.nickname,
        bio: currentProfile.bio,
        height: currentProfile.height,
        weight: currentProfile.weight,
        // ...
      });
    }
  }, [currentProfile]);
  
  const handleSave = async () => {
    await updateProfile(formData);
    Alert.alert('保存成功');
  };
  
  return <EditForm data={formData} onSave={handleSave} />;
}
```

**数据来源**: `profileStore.currentProfile` (需要完整42字段)

---

## 🔧 **高级模式: 数据同步**

### **场景: 用户在设置页更新了昵称**

```typescript
// SettingsPage.tsx
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

function SettingsPage() {
  const { userInfo, setUserInfo } = useAuthStore();
  const { currentProfile, updateProfile } = useProfileStore();
  
  const handleUpdateNickname = async (newNickname: string) => {
    // 1. 调用API更新
    await profileApi.updateCurrentUserProfile({
      nickname: newNickname,
    });
    
    // 2. 同步更新两个Store
    // 更新authStore（全局身份）
    setUserInfo({
      ...userInfo,
      nickname: newNickname,
    });
    
    // 更新profileStore（完整资料）
    updateProfile({
      ...currentProfile,
      nickname: newNickname,
    });
    
    Alert.alert('昵称更新成功');
  };
  
  return <NicknameEditor onSave={handleUpdateNickname} />;
}
```

**原则**: 更新后端 → 同步更新所有相关Store

---

## ✅ **最佳实践总结**

### **1. 使用authStore的场景**

- ✅ 全局导航栏（头像、昵称）
- ✅ 评论区作者信息
- ✅ 消息列表发送者
- ✅ 发布内容时的作者ID
- ✅ 判断"是否是我的内容"
- ✅ 任何只需要基础身份信息的场景

**特征**: 频繁使用、轻量级、全局共享

---

### **2. 使用profileStore的场景**

- ✅ 个人主页完整展示
- ✅ 资料编辑页面
- ✅ 关注/粉丝统计
- ✅ 身高体重等详细信息
- ✅ 职业标签、认证状态
- ✅ 任何需要完整资料的场景

**特征**: 按需加载、重量级、详细数据

---

### **3. 数据流规则**

```
登录 → authStore (基础6字段)
        ↓
        全局使用（无需额外请求）
        
访问个人页 → profileStore (完整42字段)
              ↓
              按需加载（首次请求）
              ↓
              缓存5分钟（避免重复请求）
```

---

### **4. 避免的错误**

❌ **错误1**: 每个组件都请求Profile API
```typescript
// ❌ 不要这样做
useEffect(() => {
  profileApi.getCurrentUserProfile();  // 重复请求
}, []);
```

✅ **正确**: 使用Store
```typescript
// ✅ 这样做
const { userInfo } = useAuthStore();  // 共享状态
```

---

❌ **错误2**: 只需要昵称却加载完整资料
```typescript
// ❌ 浪费资源
const { currentProfile } = useProfileStore();
return <Text>{currentProfile?.nickname}</Text>;  // 只用了1个字段
```

✅ **正确**: 使用authStore
```typescript
// ✅ 高效
const { userInfo } = useAuthStore();
return <Text>{userInfo?.nickname}</Text>;  // 无需API请求
```

---

## 🎊 **架构评分**

| 维度 | 评分 | 说明 |
|-----|------|------|
| **性能** | ⭐⭐⭐⭐⭐ | 最小化API请求 |
| **可维护性** | ⭐⭐⭐⭐⭐ | 职责清晰 |
| **用户体验** | ⭐⭐⭐⭐⭐ | 快速响应 |
| **扩展性** | ⭐⭐⭐⭐⭐ | 易于添加新功能 |

**综合评分**: ⭐⭐⭐⭐⭐ (满分)

---

## 🚀 **快速参考卡片**

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 需要什么数据？
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 基础身份信息 (id, nickname, avatar)
import { useAuthStore } from '@/stores/authStore';
const { userInfo } = useAuthStore();

// 完整资料 (42字段)
import { useProfileStore } from '@/stores/profileStore';
const { currentProfile } = useProfileStore();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 什么时候加载？
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// authStore - 登录后自动可用
// ✅ 无需手动加载

// profileStore - 访问个人页时加载
useEffect(() => {
  if (!currentProfile) {
    loadUserProfile();
  }
}, []);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**创建时间**: 2025-10-28  
**状态**: ✅ 生产级最佳实践  
**适用**: 所有模块开发参考

