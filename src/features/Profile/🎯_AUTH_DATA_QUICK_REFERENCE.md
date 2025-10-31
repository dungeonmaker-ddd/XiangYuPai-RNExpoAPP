# 🎯 Profile + Auth数据 - 快速参考卡

> **一页速查** | 最后更新: 2025-10-28

---

## 📊 两层数据架构

```typescript
┌─────────────────────────────────────────────────────────┐
│  authStore.userInfo (基础身份 - 5字段)                   │
├─────────────────────────────────────────────────────────┤
│  ✅ 用途: 身份识别、基础显示                             │
│  ✅ 来源: 登录时保存                                     │
│  ✅ 特点: 轻量、快速、已在内存                           │
│                                                          │
│  id: string           ← 用户ID                           │
│  phone: string        ← 手机号                           │
│  nickname: string     ← 昵称                             │
│  avatar: string       ← 头像                             │
│  verified: boolean    ← 认证状态                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  profileStore.currentProfile (完整资料 - 42字段)         │
├─────────────────────────────────────────────────────────┤
│  ✅ 用途: 详细资料、统计数据                             │
│  ✅ 来源: API加载                                        │
│  ✅ 特点: 完整、丰富、需要调用API                        │
│                                                          │
│  id, nickname, avatar                                   │
│  + gender, age, location, bio                           │
│  + height, weight, occupations                          │
│  + isRealVerified, isOnline                             │
│  + followingCount, followerCount, likeCount             │
│  + ... (共42个字段)                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 使用决策树

### 我需要什么数据？

```
需要用户ID?
    ├─ YES → authStore.userInfo.id ⚡
    └─ NO ↓

需要手机号?
    ├─ YES → authStore.userInfo.phone ⚡
    └─ NO ↓

需要基础昵称/头像?
    ├─ YES → authStore.userInfo.nickname/avatar ⚡
    └─ NO ↓

需要位置/身高/关注数/完整资料?
    └─ YES → profileStore.currentProfile 📦
```

**⚡ = 已在内存，无需API调用**  
**📦 = 需要API加载**

---

## 💻 代码速查

### 1️⃣ 获取当前用户ID

```typescript
import { useAuthStore } from '@/stores/authStore';

// ✅ 推荐：使用authStore
const userId = useAuthStore(state => state.userInfo?.id);
```

---

### 2️⃣ 加载用户资料

```typescript
import { useProfileStore } from '@/stores/profileStore';

const loadUserProfile = useProfileStore(state => state.loadUserProfile);

// ✅ 加载当前用户（自动使用authStore.userInfo.id）
await loadUserProfile();

// ✅ 加载其他用户
await loadUserProfile('123456');
```

---

### 3️⃣ 判断是否本人主页

```typescript
import { useProfileData } from '@/src/features/Profile/MainPage/hooks/useProfileData';

const { isOwnProfile } = useProfileData({ userId });

if (isOwnProfile) {
  return <EditButton />;
} else {
  return <FollowButton />;
}
```

---

### 4️⃣ 获取基础信息 vs 完整资料

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

// ✅ 基础信息（快速）
const authUserInfo = useAuthStore(state => state.userInfo);
console.log(authUserInfo.id);      // 用户ID
console.log(authUserInfo.phone);   // 手机号

// ✅ 完整资料（需要加载）
const fullProfile = useProfileStore(state => state.currentProfile);
console.log(fullProfile.location);        // 位置
console.log(fullProfile.followingCount);  // 关注数
```

---

### 5️⃣ 使用useProfileData Hook

```typescript
import { useProfileData } from '@/src/features/Profile/MainPage/hooks/useProfileData';

const {
  authUserInfo,       // 基础信息（来自authStore）
  currentProfile,     // 完整资料（来自profileStore）
  isOwnProfile,       // 是否本人主页
  isProfileReady,     // 是否就绪
} = useProfileData();

if (!isProfileReady) return <Loading />;

return (
  <View>
    <Text>ID: {authUserInfo?.id}</Text>
    <Text>手机: {authUserInfo?.phone}</Text>
    <Text>位置: {currentProfile?.location}</Text>
  </View>
);
```

---

## 🚦 常见场景

### 场景1: 点赞/评论需要用户ID

```typescript
import { useAuthStore } from '@/stores/authStore';

function handleLike() {
  const userId = useAuthStore.getState().userInfo?.id;
  
  if (!userId) {
    router.push('/auth/login');
    return;
  }
  
  likePost(postId, userId);
}
```

---

### 场景2: 显示用户信息

```typescript
import { useAuthStore } from '@/stores/authStore';

// ✅ 只需要昵称和头像
const { nickname, avatar } = useAuthStore(state => state.userInfo || {});

return (
  <View>
    <Image source={{ uri: avatar }} />
    <Text>{nickname}</Text>
  </View>
);
```

---

### 场景3: 完整个人主页

```typescript
import { useProfileStore } from '@/stores/profileStore';
import { useProfileData } from '@/hooks/useProfileData';

function ProfilePage() {
  const loadUserProfile = useProfileStore(state => state.loadUserProfile);
  const { currentProfile, isProfileReady } = useProfileData();
  
  useEffect(() => {
    loadUserProfile();  // 自动使用authStore.userInfo.id
  }, []);
  
  if (!isProfileReady) return <ProfileSkeleton />;
  
  return <FullProfileView profile={currentProfile} />;
}
```

---

## ⚡ 性能优化

### ✅ DO（推荐）

```typescript
// ✅ 使用authStore获取ID（已在内存）
const userId = useAuthStore(state => state.userInfo?.id);

// ✅ 使用选择器避免重渲染
const nickname = useAuthStore(state => state.userInfo?.nickname);

// ✅ 检查缓存避免重复加载
if (!currentProfile) {
  loadUserProfile();
}
```

### ❌ DON'T（避免）

```typescript
// ❌ 为了ID而加载完整profile
const userId = useProfileStore(state => state.currentProfile?.id);

// ❌ 每次渲染都调用
useEffect(() => {
  loadUserProfile();  // 没有依赖项检查！
});

// ❌ 重复获取相同数据
const user1 = useAuthStore(state => state.userInfo);
const user2 = useAuthStore(state => state.userInfo);  // 重复！
```

---

## 📋 检查清单

### 在组件中使用数据前，问自己：

- [ ] 我只需要用户ID吗？ → 使用 `authStore.userInfo.id`
- [ ] 我需要手机号吗？ → 使用 `authStore.userInfo.phone`
- [ ] 我需要完整资料吗？ → 使用 `profileStore.currentProfile`
- [ ] 我检查了认证状态吗？ → 检查 `isAuthenticated`
- [ ] 我避免重复API调用了吗？ → 检查缓存
- [ ] 我使用了选择器吗？ → 避免不必要的重渲染

---

## 🔗 相关文档

- 📖 [AUTH_INTEGRATION_GUIDE.md](./AUTH_INTEGRATION_GUIDE.md) - 完整集成指南
- ✅ [✅_AUTH_INTEGRATION_COMPLETE.md](./✅_AUTH_INTEGRATION_COMPLETE.md) - 完成报告
- 📊 [DATA_LOGIN_TO_MODULES.md](../AuthModule/DATA_LOGIN_TO_MODULES.md) - 数据流向

---

## 🆘 常见问题

### Q: 如何获取当前用户ID？

```typescript
const userId = useAuthStore(state => state.userInfo?.id);
```

### Q: 如何判断是否本人主页？

```typescript
const { isOwnProfile } = useProfileData({ userId });
```

### Q: 如何避免重复加载？

```typescript
const { currentProfile } = useProfileStore();
if (!currentProfile) {
  loadUserProfile();  // 只在没有数据时加载
}
```

### Q: authStore有什么数据？

```typescript
authStore.userInfo = {
  id: string,           // 用户ID
  phone: string,        // 手机号
  nickname: string,     // 昵称
  avatar: string,       // 头像
  verified: boolean,    // 认证状态
  createdAt: string,    // 创建时间
}
```

### Q: profileStore有什么数据？

```typescript
profileStore.currentProfile = {
  id, nickname, avatar,        // 基础信息
  gender, age, location, bio,  // 详细资料
  height, weight,              // 身体信息
  occupations,                 // 职业标签
  isRealVerified, isOnline,    // 状态
  followingCount, followerCount, likeCount,  // 统计
  // ... 共42个字段
}
```

---

**💡 记住：优先使用 authStore，只在需要完整资料时才使用 profileStore**

---

**最后更新**: 2025-10-28  
**维护者**: Development Team

