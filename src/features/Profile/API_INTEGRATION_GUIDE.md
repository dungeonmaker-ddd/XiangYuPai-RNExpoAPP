# 📖 个人主页模块 - API集成指南

> **快速了解如何使用Profile API服务**  
> **创建时间**: 2025-10-23  
> **后端对接**: xypai-user模块

---

## 🎯 已创建的API服务

### ✅ profileApi.ts（完整实现）

基于后端API文档创建，包含以下功能：

#### 1️⃣ 用户资料相关（9个接口）

```typescript
import { profileApi } from '@/services/api';

// 获取用户资料（完整42字段）
const profile = await profileApi.getUserProfile(userId);

// 获取当前用户资料
const myProfile = await profileApi.getCurrentUserProfile();

// 更新用户资料
await profileApi.updateUserProfile(userId, {
  nickname: '新昵称',
  bio: '新简介',
  height: 170,
  // ... 其他字段
});

// 更新当前用户资料
await profileApi.updateCurrentUserProfile({
  nickname: '我的昵称',
});

// 更新在线状态
await profileApi.updateOnlineStatus(userId, 1);  // 1=在线

// 快捷在线状态操作
await profileApi.goOnline();      // 上线
await profileApi.goOffline();     // 离线
await profileApi.goInvisible();   // 隐身

// 检查用户是否在线
const isOnline = await profileApi.isUserOnline(userId);

// 获取资料完整度
const completeness = await profileApi.getProfileCompleteness(userId);
const myCompleteness = await profileApi.getCurrentUserCompleteness();
```

#### 2️⃣ 用户统计相关（4个接口）

```typescript
// 获取用户统计数据
const stats = await profileApi.getUserStats(userId);

// 获取当前用户统计
const myStats = await profileApi.getCurrentUserStats();

// 批量查询用户统计
const batchStats = await profileApi.getBatchUserStats([1, 2, 3]);

// 获取人气用户排行
const popularUsers = await profileApi.getPopularUsers(10);
```

#### 3️⃣ 职业标签相关（7个接口）

```typescript
// 查询用户职业
const occupations = await profileApi.getUserOccupations(userId);

// 查询当前用户职业
const myOccupations = await profileApi.getCurrentUserOccupations();

// 更新用户职业（批量）
await profileApi.updateUserOccupations(userId, {
  occupationCodes: ['model', 'student'],
  keepSortOrder: false,
});

// 更新当前用户职业
await profileApi.updateCurrentUserOccupations({
  occupationCodes: ['office_worker', 'freelancer'],
});

// 添加单个职业
await profileApi.addUserOccupation(userId, 'model');

// 删除单个职业
await profileApi.removeUserOccupation(userId, 'student');

// 查询所有职业字典
const allOccupations = await profileApi.getAllOccupations();

// 根据分类查询职业
const gameOccupations = await profileApi.getOccupationsByCategory('game');
```

#### 4️⃣ 用户关系相关（8个接口）

```typescript
// 关注用户
await profileApi.followUser(targetUserId);

// 取消关注
await profileApi.unfollowUser(targetUserId);

// 获取关注列表
const following = await profileApi.getFollowingList({
  pageNum: 1,
  pageSize: 20,
});

// 获取粉丝列表
const followers = await profileApi.getFollowersList({
  pageNum: 1,
  pageSize: 20,
});

// 获取指定用户的关注列表
const userFollowing = await profileApi.getUserFollowingList(userId);

// 获取指定用户的粉丝列表
const userFollowers = await profileApi.getUserFollowersList(userId);

// 检查用户关系
const relation = await profileApi.checkUserRelation(targetUserId);
console.log(relation.isFollowed);      // 是否已关注
console.log(relation.isMutualFollow);  // 是否互关
console.log(relation.isBlocked);       // 是否拉黑

// 拉黑用户
await profileApi.blockUser(targetUserId);

// 取消拉黑
await profileApi.unblockUser(targetUserId);
```

---

## 🔄 数据转换工具

### dataTransform.ts（已创建）

```typescript
import { profileDataTransform } from '@/src/features/Profile/utils/dataTransform';

// 后端UserProfileVO → 前端UserProfile
const userProfile = profileDataTransform.transformUserProfileVOToProfile(vo);

// 职业标签转换
const skills = profileDataTransform.transformOccupationList(occupations);

// 性别转换
const genderCode = profileDataTransform.mapGenderToBackend('male');  // → 1

// 时间转换
const timestamp = profileDataTransform.parseBackendDateTime('2019-08-24T14:15:22Z');
const displayDate = profileDataTransform.formatDateTime(timestamp);

// 数字格式化
const formattedCount = profileDataTransform.formatNumber(12345);  // → 1.2w

// 距离格式化
const displayDistance = profileDataTransform.formatDistance(1500);  // → 1.5km
```

---

## 📊 后端数据结构（UserProfileVO）

### 完整42字段

```json
{
  "userId": 123,
  "nickname": "用户名",
  "avatar": "https://...",
  "avatarThumbnail": "https://...",
  "backgroundImage": "https://...",
  
  "gender": 2,               // 1=男, 2=女
  "genderDesc": "女",
  "birthday": "1999-09-29",
  "age": 25,
  "ageRange": "20-30",
  
  "cityId": 440300,
  "cityName": "深圳市",
  "location": "广东 深圳",
  "address": "深圳市南山区",
  "ipLocation": "广东 深圳",
  
  "bio": "个人简介",
  "height": 162,
  "weight": 44,
  "bmi": 16.8,
  "bmiLevel": "正常",
  "realName": "张三",
  
  "wechat": "sunny0301",
  "wechatMasked": "sun***301",
  "wechatUnlockCondition": 0,  // 0=公开
  "canViewWechat": true,
  
  "isRealVerified": true,
  "isGodVerified": true,
  "isVip": false,
  "vipLevel": 0,
  "isPopular": true,
  
  "onlineStatus": 1,           // 1=在线
  "isOnline": true,
  
  "profileCompleteness": 85,   // 完整度分数
  
  "occupations": [
    {
      "occupationCode": "model",
      "occupationName": "模特"
    }
  ],
  
  "stats": {
    "followerCount": 201,
    "followingCount": 201,
    "totalLikeCount": 999
  }
}
```

---

## 🧪 Mock数据测试

### 使用mockProfileApi

开发阶段可以使用Mock API测试：

```typescript
import { mockProfileApi } from '@/services/api/profileApi';

// 使用Mock数据
const profile = await mockProfileApi.getCurrentUserProfile();
console.log('Mock用户资料:', profile);

// Mock更新操作
await mockProfileApi.updateCurrentUserProfile({
  nickname: '测试昵称',
});
```

---

## 🔧 在组件中使用

### 方式1: 直接调用API

```tsx
import { profileApi } from '@/services/api';

function ProfileComponent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.getCurrentUserProfile();
        // 转换数据
        const transformed = profileDataTransform.transformUserProfileVOToProfile(data);
        setProfile(transformed);
      } catch (error) {
        console.error('加载失败:', error);
      }
    };
    
    loadProfile();
  }, []);
  
  return <Text>{profile?.nickname}</Text>;
}
```

### 方式2: 通过Store调用（推荐）

```tsx
import { useProfileStore } from '@/stores/profileStore';

function ProfileComponent() {
  const { currentProfile, loadUserProfile } = useProfileStore();
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  return <Text>{currentProfile?.nickname}</Text>;
}
```

---

## 🏗️ 待更新：profileStore集成

### 需要在profileStore中集成真实API

```typescript
// stores/profileStore.ts

import { profileApi } from '@/services/api';
import { profileDataTransform } from '@/src/features/Profile/utils/dataTransform';

// 更新loadUserProfile方法
loadUserProfile: async (userId?: string) => {
  try {
    set({ loading: true, error: null });
    
    // 🆕 调用真实API
    const data = userId 
      ? await profileApi.getUserProfile(Number(userId))
      : await profileApi.getCurrentUserProfile();
    
    // 🆕 转换数据
    const profile = profileDataTransform.transformUserProfileVOToProfile(data);
    
    set({ currentProfile: profile, loading: false });
  } catch (error) {
    set({
      loading: false,
      error: error instanceof Error ? error.message : '加载失败',
    });
  }
}
```

---

## 📋 API端点配置

### 已在config.ts中配置

所有端点已配置在`services/api/config.ts`的`API_ENDPOINTS`中：

```typescript
API_ENDPOINTS.PROFILE.*        // 用户资料相关
API_ENDPOINTS.USER_STATS.*     // 用户统计相关
API_ENDPOINTS.OCCUPATION.*     // 职业标签相关
API_ENDPOINTS.RELATION.*       // 用户关系相关
```

---

## 🔐 后端对接说明

### 后端模块：xypai-user

所有接口都在`xypai-user`模块中，通过网关访问需要加前缀：`/xypai-user`

### 主要Controller

1. **UserProfileController** - 用户资料管理
   - 路径：`/api/v2/user/profile`
   - 功能：资料查询、更新、在线状态、完整度

2. **UserStatsController** - 用户统计
   - 路径：`/api/v1/users/stats`
   - 功能：统计查询、排行榜

3. **OccupationController** - 职业标签
   - 路径：`/api/v1/occupation`
   - 功能：职业查询、更新、字典管理

4. **RelationController** - 用户关系
   - 路径：`/api/v1/relations`
   - 功能：关注、粉丝、拉黑

---

## 🚀 使用示例

### 完整的用户资料页面加载

```tsx
import { profileApi, profileDataTransform } from '@/services/api';

async function loadCompleteProfileData(userId?: string) {
  try {
    // 并行加载所有数据
    const [profile, occupations, stats] = await Promise.all([
      userId 
        ? profileApi.getUserProfile(Number(userId))
        : profileApi.getCurrentUserProfile(),
      userId
        ? profileApi.getUserOccupations(Number(userId))
        : profileApi.getCurrentUserOccupations(),
      userId
        ? profileApi.getUserStats(Number(userId))
        : profileApi.getCurrentUserStats(),
    ]);
    
    // 转换数据
    const userProfile = profileDataTransform.transformUserProfileVOToProfile(profile);
    const skills = profileDataTransform.transformOccupationList(occupations);
    
    return {
      profile: userProfile,
      skills,
      stats,
    };
  } catch (error) {
    console.error('加载失败:', error);
    throw error;
  }
}
```

### 更新用户资料

```tsx
import { profileApi, mapGenderToBackend } from '@/services/api';

async function updateProfile(updates: Partial<UserProfile>) {
  try {
    // 转换前端数据为后端格式
    const dto: UserProfileUpdateDTO = {
      nickname: updates.nickname,
      bio: updates.bio,
      gender: updates.gender ? mapGenderToBackend(updates.gender) : undefined,
      height: updates.height,
      weight: updates.weight,
      // ... 其他字段
    };
    
    // 调用API
    await profileApi.updateCurrentUserProfile(dto);
    
    console.log('✅ 资料更新成功');
  } catch (error) {
    console.error('❌ 更新失败:', error);
    throw error;
  }
}
```

### 管理职业标签

```tsx
import { profileApi } from '@/services/api';

// 添加职业
async function addOccupation(code: string) {
  try {
    // 获取当前职业列表
    const current = await profileApi.getCurrentUserOccupations();
    
    // 检查是否已有5个（最多5个）
    if (current.length >= 5) {
      alert('最多只能添加5个职业标签');
      return;
    }
    
    // 添加新职业
    const newCodes = [...current.map(o => o.occupationCode), code];
    await profileApi.updateCurrentUserOccupations({
      occupationCodes: newCodes,
    });
    
    console.log('✅ 职业添加成功');
  } catch (error) {
    console.error('❌ 添加失败:', error);
  }
}

// 删除职业
async function removeOccupation(code: string) {
  try {
    const current = await profileApi.getCurrentUserOccupations();
    const newCodes = current
      .map(o => o.occupationCode)
      .filter(c => c !== code);
    
    await profileApi.updateCurrentUserOccupations({
      occupationCodes: newCodes,
    });
    
    console.log('✅ 职业删除成功');
  } catch (error) {
    console.error('❌ 删除失败:', error);
  }
}
```

### 关注/粉丝功能

```typescript
import { profileApi } from '@/services/api';

// 关注用户
async function toggleFollow(targetUserId: number, isFollowed: boolean) {
  try {
    if (isFollowed) {
      await profileApi.unfollowUser(targetUserId);
      console.log('✅ 已取消关注');
    } else {
      await profileApi.followUser(targetUserId);
      console.log('✅ 已关注');
    }
  } catch (error) {
    console.error('❌ 操作失败:', error);
  }
}

// 查看关注列表
async function viewFollowingList() {
  try {
    const data = await profileApi.getFollowingList({
      pageNum: 1,
      pageSize: 20,
    });
    
    console.log(`关注列表: ${data.total}个`, data.rows);
  } catch (error) {
    console.error('加载失败:', error);
  }
}
```

---

## 🎨 UserProfileVO字段映射

### 后端 → 前端映射关系

| 后端字段 | 类型 | 前端字段 | 说明 |
|---------|------|---------|------|
| `userId` | number | `id` (string) | 用户ID |
| `nickname` | string | `nickname` | 昵称 |
| `avatar` | string | `avatar` | 头像URL |
| `backgroundImage` | string | `backgroundImage` | 背景图 |
| `gender` | 1/2 | 'male'/'female' | 性别映射 |
| `age` | number | `age` | 年龄 |
| `birthday` | string | `birthday` | 生日 |
| `location` | string | `location` | 位置 |
| `bio` | string | `bio` | 简介 |
| `height` | number | `height` | 身高(cm) |
| `weight` | number | `weight` | 体重(kg) |
| `wechat` | string | `wechat` | 微信号 |
| `isRealVerified` | boolean | `isRealVerified` | 实名认证 |
| `isGodVerified` | boolean | `isGodVerified` | 大神认证 |
| `isOnline` | boolean | `isOnline` | 在线状态 |
| `stats.followerCount` | number | `followerCount` | 粉丝数 |
| `stats.followingCount` | number | `followingCount` | 关注数 |
| `stats.totalLikeCount` | number | `likeCount` | 获赞数 |

---

## 🧪 测试验证

### 测试步骤

```bash
# 1. 启动后端服务
cd RuoYi-Cloud-Plus
# 确保xypai-user模块运行在端口9401

# 2. 测试API接口
curl http://localhost:8080/xypai-user/api/v2/user/profile/current

# 3. 在前端调用
npm start
# 打开Chrome DevTools
```

### 在控制台测试

```javascript
// 在Chrome DevTools Console中执行

// 测试获取用户资料
import { profileApi } from '@/services/api';
const profile = await profileApi.getCurrentUserProfile();
console.log('用户资料:', profile);

// 测试更新资料
await profileApi.updateCurrentUserProfile({
  nickname: '测试昵称',
  bio: '测试简介',
});

// 测试职业标签
const occupations = await profileApi.getCurrentUserOccupations();
console.log('职业标签:', occupations);
```

---

## 🔧 后续集成步骤

### Step 1: 更新profileStore（已创建，需集成API）

```typescript
// stores/profileStore.ts

// ✅ 已有的Mock实现
loadUserProfile: async (userId?) => {
  // TODO: 替换为真实API调用
  const mockProfile = generateMockUser(userId);
  set({ currentProfile: mockProfile });
}

// 🔄 更新为真实API
loadUserProfile: async (userId?) => {
  try {
    set({ loading: true });
    
    const data = userId 
      ? await profileApi.getUserProfile(Number(userId))
      : await profileApi.getCurrentUserProfile();
    
    const profile = transformUserProfileVOToProfile(data);
    set({ currentProfile: profile, loading: false });
  } catch (error) {
    set({ loading: false, error: error.message });
  }
}
```

### Step 2: 在MainPage中使用

```typescript
// MainPage/index.tsx

// ✅ 已通过useProfileStore使用
const { currentProfile, loadUserProfile } = useProfileStore();

useEffect(() => {
  loadUserProfile();  // 自动调用API
}, []);
```

### Step 3: 实现编辑功能

```typescript
// ProfileEditPage/index.tsx

import { profileApi } from '@/services/api';

const handleSave = async () => {
  try {
    await profileApi.updateCurrentUserProfile({
      nickname: editedNickname,
      bio: editedBio,
      height: editedHeight,
    });
    
    // 刷新资料
    await loadUserProfile();
    
    alert('保存成功');
  } catch (error) {
    alert('保存失败: ' + error.message);
  }
};
```

---

## 📝 API接口清单

### 已实现的接口（28个）

#### 用户资料（9个）
- [x] getUserProfile - 获取用户资料
- [x] getCurrentUserProfile - 获取当前用户资料
- [x] updateUserProfile - 更新用户资料
- [x] updateCurrentUserProfile - 更新当前用户资料
- [x] updateOnlineStatus - 更新在线状态
- [x] goOnline - 上线
- [x] goOffline - 离线
- [x] goInvisible - 隐身
- [x] isUserOnline - 检查在线

#### 资料完整度（2个）
- [x] getProfileCompleteness - 获取资料完整度
- [x] getCurrentUserCompleteness - 获取当前用户完整度

#### 用户统计（4个）
- [x] getUserStats - 获取用户统计
- [x] getCurrentUserStats - 获取当前用户统计
- [x] getBatchUserStats - 批量查询统计
- [x] getPopularUsers - 人气用户排行

#### 职业标签（7个）
- [x] getUserOccupations - 查询用户职业
- [x] getCurrentUserOccupations - 查询当前用户职业
- [x] updateUserOccupations - 更新用户职业
- [x] updateCurrentUserOccupations - 更新当前用户职业
- [x] addUserOccupation - 添加职业
- [x] removeUserOccupation - 删除职业
- [x] getAllOccupations - 获取所有职业字典
- [x] getOccupationsByCategory - 根据分类查询职业

#### 用户关系（6个）
- [x] followUser - 关注用户
- [x] unfollowUser - 取消关注
- [x] getFollowingList - 获取关注列表
- [x] getFollowersList - 获取粉丝列表
- [x] getUserFollowingList - 获取指定用户关注列表
- [x] getUserFollowersList - 获取指定用户粉丝列表
- [x] checkUserRelation - 检查用户关系
- [x] blockUser - 拉黑用户
- [x] unblockUser - 取消拉黑

---

## 🎊 完成状态

### ✅ 已完成

- ✅ profileApi.ts - 完整实现（400+行）
- ✅ dataTransform.ts - 数据转换工具
- ✅ config.ts - 端点配置更新
- ✅ index.ts - 导出配置
- ✅ mockProfileApi - Mock数据支持

### 🔄 待完成

- [ ] profileStore集成真实API
- [ ] MainPage使用真实数据
- [ ] 编辑功能API对接
- [ ] 错误处理完善

---

**创建时间**: 2025-10-23  
**状态**: ✅ API服务层完成  
**下一步**: 集成到Store和组件

