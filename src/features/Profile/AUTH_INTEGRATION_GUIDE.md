# 🔗 Profile模块 - Auth数据集成指南

> **最后更新**: 2025-10-28  
> **状态**: ✅ 已完成集成

---

## 📊 数据流架构

### 双层存储架构

```
登录成功
    ↓
authStore.userInfo (基础身份信息)
    ├─ id: string
    ├─ phone: string
    ├─ nickname: string
    ├─ avatar: string
    ├─ verified: boolean
    └─ createdAt: string
    
    ↓ (Profile页面加载时)
    
profileStore.currentProfile (完整资料信息)
    ├─ id: string                     ← 使用 authStore.userInfo.id
    ├─ nickname: string               ← 初始值来自 authStore
    ├─ avatar: string                 ← 初始值来自 authStore
    ├─ phone: string                  ← 从 authStore 同步
    ├─ gender: 'male' | 'female'
    ├─ age: number
    ├─ location: string
    ├─ bio: string
    ├─ height: number
    ├─ weight: number
    ├─ occupations: string[]
    ├─ isRealVerified: boolean
    ├─ isOnline: boolean
    ├─ followingCount: number
    ├─ followerCount: number
    ├─ likeCount: number
    └─ ... (共42个字段)
```

---

## 🎯 核心集成点

### 1️⃣ 用户ID的确定

```typescript
// ❌ 错误：硬编码或假设用户ID
loadUserProfile('123456');

// ✅ 正确：从authStore获取当前用户ID
import { useAuthStore } from '@/stores/authStore';

const authState = useAuthStore.getState();
const currentUserId = authState.userInfo?.id;

loadUserProfile(currentUserId);
```

### 2️⃣ profileStore自动识别

**在 `profileStore.ts` 中已实现智能ID解析**:

```typescript
// stores/profileStore.ts

loadUserProfile: async (userId?: string) => {
  // 🆕 智能用户ID解析
  const authState = useAuthStore.getState();
  const targetUserId = userId || authState.userInfo?.id;
  
  console.log('   传入userId:', userId || '未传入');
  console.log('   authStore用户ID:', authState.userInfo?.id || '未登录');
  console.log('   最终使用:', targetUserId || 'current-user');
  
  // 调用API
  const profileData = targetUserId 
    ? await api.getUserProfile(Number(targetUserId))
    : await api.getCurrentUserProfile();
}
```

**使用方式**:

```typescript
// 方式1: 加载当前用户资料（自动使用authStore.userInfo.id）
await loadUserProfile();

// 方式2: 加载其他用户资料
await loadUserProfile('123456');
```

---

## 🔄 数据同步策略

### 登录后的数据初始化

```typescript
// 登录流程
用户登录
    ↓
authStore.login()  ← 保存基础信息到authStore
    ↓
导航到个人主页
    ↓
MainPage组件挂载
    ↓
useProfileData Hook
    ├─ 检查 authStore.isAuthenticated
    ├─ 检查 authStore.isInitialized
    └─ 获取 authStore.userInfo.id
    ↓
loadUserProfile()  ← 使用authStore.userInfo.id加载完整资料
    ↓
profileStore.currentProfile 更新
```

### 数据同步时机

| 时机 | authStore | profileStore | 说明 |
|------|-----------|--------------|------|
| **登录成功** | ✅ 立即更新 | ❌ 未更新 | 只保存基础信息 |
| **进入个人主页** | ✅ 已有数据 | 🔄 开始加载 | 调用API获取完整资料 |
| **加载完成** | ✅ 不变 | ✅ 已有完整数据 | 两者数据同步 |
| **退出登录** | ❌ 清空 | ❌ 清空 | 两者都重置 |

---

## 📖 使用示例

### 示例1: 在Profile组件中使用

```typescript
// src/features/Profile/MainPage/index.tsx

import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';

const MainPage: React.FC = () => {
  const { currentProfile, loadUserProfile } = useProfileStore();
  const { isAuthenticated, userInfo } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      // ✅ 不需要传userId，自动使用 authStore.userInfo.id
      loadUserProfile();
    }
  }, [isAuthenticated, userInfo]);
  
  return (
    <View>
      {currentProfile ? (
        <UserInfo profile={currentProfile} />
      ) : (
        <Loading />
      )}
    </View>
  );
};
```

### 示例2: 基础身份 vs 完整资料

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

function SomeComponent() {
  const authUserInfo = useAuthStore(state => state.userInfo);
  const fullProfile = useProfileStore(state => state.currentProfile);
  
  // ✅ 使用基础身份信息（已在内存，无需API调用）
  console.log('用户ID:', authUserInfo?.id);
  console.log('手机号:', authUserInfo?.phone);
  console.log('昵称:', authUserInfo?.nickname);
  
  // ✅ 使用完整资料信息（如需详细信息）
  console.log('位置:', fullProfile?.location);
  console.log('身高:', fullProfile?.height);
  console.log('关注数:', fullProfile?.followingCount);
}
```

### 示例3: 其他模块如何使用

```typescript
// 在其他功能模块中（如Discovery、Messages）

import { useAuthStore } from '@/stores/authStore';

function DiscoveryPage() {
  const currentUserId = useAuthStore(state => state.userInfo?.id);
  
  const handleLike = async (postId: string) => {
    if (!currentUserId) {
      // 未登录，引导登录
      router.push('/auth/login');
      return;
    }
    
    // 已登录，执行点赞
    await likePost(postId, currentUserId);
  };
  
  return <PostList onLike={handleLike} />;
}
```

---

## 🎯 决策树：使用哪个Store?

### 何时使用 authStore.userInfo?

✅ **适用场景**:
- 需要**当前用户ID** (`userInfo.id`)
- 需要**手机号** (`userInfo.phone`)
- 需要**基础昵称/头像** (`userInfo.nickname`, `userInfo.avatar`)
- 需要**认证状态** (`userInfo.verified`)
- **不需要**完整资料的场景

✅ **优点**:
- ⚡ 已在内存，无需API调用
- 🔒 登录时立即可用
- 💾 轻量数据，性能最优

❌ **限制**:
- 只有5个字段（id, phone, nickname, avatar, verified, createdAt）
- 无完整资料信息

---

### 何时使用 profileStore.currentProfile?

✅ **适用场景**:
- 需要**完整资料**（42个字段）
- 需要**位置、身高、体重**等详细信息
- 需要**职业标签** (`occupations`)
- 需要**社交统计**（关注数、粉丝数、获赞数）
- 需要**在线状态** (`isOnline`)

✅ **优点**:
- 📦 完整数据，功能丰富
- 🔄 实时从API加载
- 📊 包含统计数据

❌ **限制**:
- 需要调用API加载（有延迟）
- 仅在Profile页面或明确需要时加载

---

## 🔍 实际使用规则

### 规则1: 优先使用 authStore

```typescript
// ✅ 推荐：需要用户ID时，直接从authStore获取
import { useAuthStore } from '@/stores/authStore';

const currentUserId = useAuthStore(state => state.userInfo?.id);

// ❌ 不推荐：不要为了获取ID而加载完整profile
const fullProfile = useProfileStore(state => state.currentProfile);
const userId = fullProfile?.id;  // 没必要！
```

### 规则2: 避免重复API调用

```typescript
// ❌ 错误：每次渲染都调用
function BadComponent() {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    loadUserProfile();  // 每次都调用API!
  }, []);
}

// ✅ 正确：使用Store缓存
function GoodComponent() {
  const currentProfile = useProfileStore(state => state.currentProfile);
  const loadUserProfile = useProfileStore(state => state.loadUserProfile);
  
  useEffect(() => {
    if (!currentProfile) {
      loadUserProfile();  // 只在需要时调用
    }
  }, []);
}
```

### 规则3: 明确数据来源

```typescript
// ✅ 清晰的注释说明数据来源
function UserCard() {
  // 基础信息：来自authStore（登录时保存）
  const authUserInfo = useAuthStore(state => state.userInfo);
  
  // 完整资料：来自profileStore（API加载）
  const fullProfile = useProfileStore(state => state.currentProfile);
  
  return (
    <View>
      {/* 使用基础信息 */}
      <Text>用户ID: {authUserInfo?.id}</Text>
      <Text>手机号: {authUserInfo?.phone}</Text>
      
      {/* 使用完整资料 */}
      {fullProfile && (
        <>
          <Text>位置: {fullProfile.location}</Text>
          <Text>关注: {fullProfile.followingCount}</Text>
        </>
      )}
    </View>
  );
}
```

---

## 🛠️ 常见场景处理

### 场景1: 用户更新头像

```typescript
// 更新流程
用户上传头像
    ↓
调用API更新头像
    ↓
更新 profileStore.currentProfile.avatar
    ↓
🆕 同步更新 authStore.userInfo.avatar
```

```typescript
async function updateAvatar(newAvatarUrl: string) {
  // 1. 调用API
  await profileApi.updateCurrentUserProfile({
    avatar: newAvatarUrl,
  });
  
  // 2. 更新profileStore
  useProfileStore.getState().updateUserProfile({
    avatar: newAvatarUrl,
  });
  
  // 3. 同步更新authStore
  const authUserInfo = useAuthStore.getState().userInfo;
  if (authUserInfo) {
    useAuthStore.getState().setUserInfo({
      ...authUserInfo,
      avatar: newAvatarUrl,
    });
  }
}
```

### 场景2: 用户退出登录

```typescript
async function handleLogout() {
  // 1. 调用authStore的logout（会清除authStore数据）
  await useAuthStore.getState().logout();
  
  // 2. 清除profileStore数据
  useProfileStore.getState().resetState();
  
  // 3. 导航到登录页
  router.replace('/auth/login');
}
```

### 场景3: 查看其他用户资料

```typescript
function OtherUserProfile({ userId }: { userId: string }) {
  const myUserId = useAuthStore(state => state.userInfo?.id);
  const profileStore = useProfileStore();
  
  useEffect(() => {
    // 加载指定用户的资料
    profileStore.loadUserProfile(userId);
  }, [userId]);
  
  const isOwnProfile = myUserId === userId;
  
  return (
    <View>
      {isOwnProfile ? (
        <EditButton />
      ) : (
        <FollowButton userId={userId} />
      )}
    </View>
  );
}
```

---

## 📋 集成检查清单

### ✅ 必须项

- [x] `profileStore` 已导入 `useAuthStore`
- [x] `loadUserProfile()` 使用 `authStore.userInfo.id`
- [x] `useProfileData` Hook 检查认证状态
- [x] 退出登录时清空两个Store
- [x] 文档说明数据来源和使用场景

### ✅ 推荐项

- [x] 添加详细日志输出
- [x] 数据同步时的错误处理
- [x] 使用选择器避免不必要的重渲染
- [x] 明确注释数据来源

---

## 🚀 快速参考

### 导入

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
```

### 获取当前用户ID

```typescript
const currentUserId = useAuthStore(state => state.userInfo?.id);
```

### 加载当前用户资料

```typescript
const loadUserProfile = useProfileStore(state => state.loadUserProfile);

// 不传参数，自动使用 authStore.userInfo.id
await loadUserProfile();
```

### 获取基础信息

```typescript
const { id, phone, nickname, avatar, verified } = 
  useAuthStore(state => state.userInfo || {});
```

### 获取完整资料

```typescript
const currentProfile = useProfileStore(state => state.currentProfile);
```

---

## 📊 数据字段对照表

| 数据 | authStore.userInfo | profileStore.currentProfile | 说明 |
|------|-------------------|----------------------------|------|
| **用户ID** | ✅ `id` | ✅ `id` | 相同值 |
| **手机号** | ✅ `phone` | ❌ 无 | 仅auth有 |
| **昵称** | ✅ `nickname` | ✅ `nickname` | Profile更丰富 |
| **头像** | ✅ `avatar` | ✅ `avatar` | Profile可能更新 |
| **认证状态** | ✅ `verified` | ✅ `isRealVerified` | 字段名不同 |
| **位置** | ❌ 无 | ✅ `location` | 仅profile有 |
| **身高体重** | ❌ 无 | ✅ `height`, `weight` | 仅profile有 |
| **关注粉丝** | ❌ 无 | ✅ `followingCount`, `followerCount` | 仅profile有 |

---

## 🎓 最佳实践总结

### ✅ DO（推荐做法）

1. **使用 authStore 获取基础身份**
   ```typescript
   const userId = useAuthStore(state => state.userInfo?.id);
   ```

2. **不传参数加载当前用户资料**
   ```typescript
   await loadUserProfile();  // 自动使用 authStore.userInfo.id
   ```

3. **明确注释数据来源**
   ```typescript
   // 基础信息（authStore）
   const userId = authStore.userInfo?.id;
   
   // 完整资料（profileStore）
   const location = profileStore.currentProfile?.location;
   ```

4. **检查认证状态**
   ```typescript
   if (!isAuthenticated) {
     router.replace('/auth/login');
     return;
   }
   ```

### ❌ DON'T（避免做法）

1. **❌ 硬编码用户ID**
   ```typescript
   loadUserProfile('123456');  // 不要这样！
   ```

2. **❌ 为获取ID而加载完整profile**
   ```typescript
   const userId = profileStore.currentProfile?.id;  // 没必要！
   ```

3. **❌ 忽略认证状态**
   ```typescript
   loadUserProfile();  // 没检查是否登录！
   ```

4. **❌ 重复调用API**
   ```typescript
   useEffect(() => {
     loadUserProfile();  // 每次渲染都调用！
   });
   ```

---

**🎉 集成完成！现在Profile模块已完美连接authStore的用户数据**

**最后更新**: 2025-10-28  
**维护者**: Development Team

