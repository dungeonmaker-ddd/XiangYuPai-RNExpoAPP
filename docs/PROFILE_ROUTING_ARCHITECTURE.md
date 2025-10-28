# 🗺️ Profile Routing Architecture - 个人主页路由架构

## 🎯 路由设计原则

### ✅ 正确的路由架构

```
┌─────────────────────────────────────────────────────────────┐
│                     Profile 路由系统                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ 自己的主页（Own Profile）                               │
│     Route: /(tabs)/profile (无 userId 参数)                 │
│     Component: Profile/MainPage                            │
│     用途: 查看和编辑自己的个人资料                            │
│                                                             │
│  2️⃣ 其他人的主页（Other User's Profile）                    │
│     Route: /profile/[userId]                               │
│     Component: Profile/OtherUserProfilePage                │
│     用途: 查看其他用户的完整个人资料                          │
│                                                             │
│  3️⃣ 快速预览模态框（Quick Preview Modal）                   │
│     Route: /modal/user-detail                              │
│     Component: Homepage/UserDetailFlow/EnhancedUserDetailPage│
│     用途: 首页用户卡片的快速预览                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 用户交互流程

### 场景 1：从首页查看其他用户

```
用户在首页
    ↓
点击用户卡片
    ↓
📱 打开快速预览模态框
   /modal/user-detail?userId=xxx
   (EnhancedUserDetailPage)
   
   显示：
   - 用户基本信息
   - 快速操作按钮（关注、消息）
   - "查看完整主页" 按钮
    ↓
点击 "查看完整主页"
    ↓
✅ 跳转到完整个人主页
   /profile/[userId]
   (OtherUserProfilePage)
   
   显示：
   - 完整的用户资料
   - 动态列表
   - 收藏、点赞等
   - 所有功能卡片
```

### 场景 2：查看自己的主页

```
用户点击底部 Tab "个人"
    ↓
✅ 显示自己的主页
   /(tabs)/profile (无 userId)
   (Profile/MainPage)
   
   功能：
   - 查看自己的资料
   - 编辑个人信息
   - 管理动态、收藏等
   - 查看粉丝/关注
```

### 场景 3：从其他地方访问用户主页

```
各种入口（发现页、消息页、评论等）
    ↓
点击用户头像/昵称
    ↓
✅ 直接跳转到完整主页
   /profile/[userId]
   (OtherUserProfilePage)
```

## 🐛 之前的问题（已修复）

### ❌ 错误的路由（修复前）

```typescript
// EnhancedUserDetailPage.tsx - 修复前
const handleViewFullProfile = useCallback(() => {
  router.push({
    pathname: '/(tabs)/profile',  // ❌ 错误！这是自己的主页
    params: { userId },
  });
}, [userId, router]);

问题：
- 跳转到 tab profile 页面
- 使用了 MainPage 组件（设计用于自己的主页）
- 导致 UI 和功能不匹配
- 可能会显示编辑按钮等不应该出现的功能
```

### ✅ 正确的路由（修复后）

```typescript
// EnhancedUserDetailPage.tsx - 修复后
const handleViewFullProfile = useCallback(() => {
  router.push({
    pathname: '/profile/[userId]',  // ✅ 正确！其他用户主页
    params: { userId },
  });
}, [userId, router]);

优点：
- 跳转到专用的其他用户主页
- 使用 OtherUserProfilePage 组件
- UI 和功能完全匹配
- 只显示查看相关的功能（关注、消息等）
```

## 📂 文件结构映射

```
app/
├── (tabs)/
│   └── profile.tsx                    → Profile/MainPage
│       Route: /(tabs)/profile
│       用途: 自己的主页
│       无 userId 参数时：显示当前登录用户的主页
│       
├── profile/
│   └── [userId].tsx                   → Profile/OtherUserProfilePage
│       Route: /profile/[userId]
│       用途: 其他用户的完整主页
│       必须有 userId 参数
│       
└── modal/
    └── user-detail.tsx                → EnhancedUserDetailPage
        Route: /modal/user-detail
        用途: 快速预览模态框
        从首页用户卡片点击进入

src/features/
├── Profile/
│   ├── MainPage/                      自己的主页组件
│   │   ├── index.tsx
│   │   ├── BackgroundArea/
│   │   ├── UserInfoArea/
│   │   ├── SocialStatsArea/
│   │   └── ...
│   │
│   └── OtherUserProfilePage/          其他用户主页组件
│       ├── index.tsx
│       ├── HeaderArea/
│       ├── ProfileInfoArea/
│       ├── StatsArea/
│       ├── TabArea/
│       ├── ContentArea/
│       ├── ActionButtonsArea/
│       └── ...
│
└── Homepage/
    └── UserDetailFlow/
        └── EnhancedUserDetailPage.tsx 快速预览模态框
```

## 🎨 组件对比

### Profile/MainPage（自己的主页）

**用途：** 当前登录用户的个人主页

**特点：**
- ✅ 可以编辑个人信息
- ✅ 显示编辑按钮
- ✅ 管理自己的内容
- ✅ 查看私密数据
- ✅ 设置功能

**路由：** `/(tabs)/profile`

**示例：**
```typescript
// 无参数，显示当前用户
<MainPage />

// 这个用法是错误的！不应该传入其他用户ID
<MainPage userId="other-user-id" /> // ❌ 不推荐
```

### Profile/OtherUserProfilePage（其他用户主页）

**用途：** 查看其他用户的个人主页

**特点：**
- ✅ 只读模式（不能编辑）
- ✅ 显示关注按钮
- ✅ 显示发消息按钮
- ✅ 显示用户公开信息
- ✅ 查看用户动态
- ❌ 没有编辑功能
- ❌ 不显示私密数据

**路由：** `/profile/[userId]`

**示例：**
```typescript
// 必须传入用户ID
<OtherUserProfilePage userId="other-user-id" /> // ✅ 正确
```

### EnhancedUserDetailPage（快速预览）

**用途：** 首页用户卡片的快速预览

**特点：**
- ✅ 模态框形式
- ✅ 显示基本信息
- ✅ 快速操作（关注、消息）
- ✅ "查看完整主页" 按钮
- ✅ 轻量级，加载快

**路由：** `/modal/user-detail`

**跳转到完整主页：**
```typescript
// ✅ 正确：跳转到 OtherUserProfilePage
router.push({
  pathname: '/profile/[userId]',
  params: { userId },
});
```

## 🔧 修复的文件

### 1. EnhancedUserDetailPage.tsx

**修改：** `handleViewFullProfile` 函数

**Before:**
```typescript
const handleViewFullProfile = useCallback(() => {
  router.push({
    pathname: '/(tabs)/profile',  // ❌
    params: { userId },
  });
}, [userId, router]);
```

**After:**
```typescript
const handleViewFullProfile = useCallback(() => {
  router.push({
    pathname: '/profile/[userId]',  // ✅
    params: { userId },
  });
}, [userId, router]);
```

### 2. Homepage/MainPage/MainPage.tsx

**修改：** `handleViewUserProfile` 函数

**Before:**
```typescript
const handleViewUserProfile = useCallback((userId: string) => {
  console.log('[MainPage] 🧭 导航: 首页 → 个人主页', { userId });
  router.push({
    pathname: '/(tabs)/profile',  // ❌
    params: { userId },
  });
}, [router]);
```

**After:**
```typescript
const handleViewUserProfile = useCallback((userId: string) => {
  console.log('[MainPage] 🧭 导航: 首页 → 其他用户主页', { userId });
  router.push({
    pathname: '/profile/[userId]',  // ✅
    params: { userId },
  });
}, [router]);
```

## 🧪 测试场景

### ✅ 测试 1: 查看其他用户完整主页

```
步骤：
1. 在首页点击任意用户卡片
2. 在模态框中点击 "查看完整主页"
3. 应该看到完整的用户主页（OtherUserProfilePage）
4. 应该看到：
   - 用户头像和资料
   - 关注/发消息按钮在底部
   - 动态、资料、技能等 Tab
   - 不应该有编辑按钮

预期：✅ 使用 OtherUserProfilePage 组件
```

### ✅ 测试 2: 查看自己的主页

```
步骤：
1. 点击底部 Tab "个人"
2. 应该看到自己的主页（MainPage）
3. 应该看到：
   - 可以编辑的资料
   - 编辑按钮
   - 完整的功能访问

预期：✅ 使用 MainPage 组件
```

### ✅ 测试 3: 未登录访问自己的主页

```
步骤：
1. 退出登录
2. 点击底部 Tab "个人"
3. 应该自动跳转到登录页

预期：✅ 重定向到 /auth/login
```

## 📊 路由决策表

| 场景 | 路由 | 组件 | 用途 |
|------|------|------|------|
| 查看自己的主页 | `/(tabs)/profile` | `Profile/MainPage` | 编辑和管理自己的资料 |
| 查看其他用户主页 | `/profile/[userId]` | `Profile/OtherUserProfilePage` | 查看其他用户的完整资料 |
| 首页快速预览 | `/modal/user-detail` | `EnhancedUserDetailPage` | 快速查看用户基本信息 |

## 🎯 最佳实践

### 1. 永远不要混用路由

```typescript
// ❌ 错误：将其他用户ID传给自己的主页
router.push({
  pathname: '/(tabs)/profile',
  params: { userId: 'other-user-id' },
});

// ✅ 正确：使用专用的其他用户主页路由
router.push({
  pathname: '/profile/[userId]',
  params: { userId: 'other-user-id' },
});
```

### 2. 从任何地方查看用户主页的标准方式

```typescript
// 通用函数：智能路由到正确的主页
const navigateToUserProfile = (userId: string, currentUserId: string) => {
  if (userId === currentUserId) {
    // 查看自己的主页
    router.push('/(tabs)/profile');
  } else {
    // 查看其他用户的主页
    router.push({
      pathname: '/profile/[userId]',
      params: { userId },
    });
  }
};
```

### 3. 组件选择逻辑

```
需要查看用户主页时，问自己：

1. 是自己的主页吗？
   ✅ Yes → 使用 /(tabs)/profile (MainPage)
   ❌ No  → 继续下一步

2. 需要完整功能吗？
   ✅ Yes → 使用 /profile/[userId] (OtherUserProfilePage)
   ❌ No  → 使用 /modal/user-detail (快速预览)

3. 已经在模态框中，想看完整的？
   ✅ Yes → 关闭模态框，跳转到 /profile/[userId]
```

## ✅ 修复验证清单

- [x] 修复 EnhancedUserDetailPage 的路由
- [x] 修复 Homepage MainPage 的路由
- [x] 创建路由架构文档
- [ ] 测试：从首页模态框跳转到完整主页
- [ ] 测试：确认使用正确的组件（OtherUserProfilePage）
- [ ] 测试：确认 UI 和功能正确显示

## 📚 相关文档

- **OtherUserProfilePage 架构：** `src/features/Profile/OtherUserProfilePage/ARCHITECTURE_DESIGN.md`
- **MainPage 文档：** `src/features/Profile/MainPage/QUICK_REFERENCE.md`
- **路由配置：** `app/_layout.tsx`

---

**修复日期：** 2025-10-27  
**版本：** v1.0  
**状态：** ✅ 已修复并文档化

**现在路由架构清晰且一致了！** 🎉

