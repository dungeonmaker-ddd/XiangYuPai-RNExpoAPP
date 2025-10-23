# 🚀 个人主页模块 - 快速启动指南

> **5分钟上手个人主页模块**

---

## 📋 已完成功能

### ✅ 核心框架
- MainPage主页面框架
- 四Tab切换系统
- 用户信息展示
- 社交数据展示
- 个人资料页

### ✅ 区域组件（5个）
- BackgroundArea - 背景头图
- UserInfoArea - 用户信息
- SocialStatsArea - 社交数据
- TabNavigationArea - Tab标签栏
- TabContentArea - Tab内容

### ✅ 子页面
- ProfileInfoPage - 个人资料（完整实现）
- DynamicPage - 动态（占位符）
- CollectionPage - 收藏（占位符）
- LikesPage - 点赞（占位符）

---

## 🎯 使用方式

### 方式1: 直接访问（已配置）

打开应用 → 点击底部"我的"Tab → 自动显示个人主页

### 方式2: 在代码中使用

```tsx
import MainPage from '@/src/features/Profile/MainPage';

// 查看自己的主页
<MainPage />

// 查看他人主页
<MainPage userId="user-123" />

// 指定初始Tab
<MainPage initialTab="profile" />
```

### 方式3: 使用Store

```tsx
import { useProfileStore } from '@/stores/profileStore';

function MyComponent() {
  const { currentProfile, loadUserProfile } = useProfileStore();
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  return <Text>{currentProfile?.nickname}</Text>;
}
```

---

## 📱 页面结构

### 主页面布局

```
┌─────────────────────────────┐
│  背景头图区域（320px）       │ ← BackgroundArea
│  [<] 返回按钮                │
└─────────────────────────────┘
┌─────────────────────────────┐
│  [头像] 昵称 ♀18  [编辑]    │ ← UserInfoArea
│         ✓实名认证 👑大神      │
│         🟢在线 📍4.6km       │
└─────────────────────────────┘
┌─────────────────────────────┐
│   201      201    获赞与收藏 │ ← SocialStatsArea
│   关注     粉丝              │
└─────────────────────────────┘
┌─────────────────────────────┐
│  动态  收藏  点赞  资料      │ ← TabNavigationArea
│   ━                          │ (指示器)
└─────────────────────────────┘
┌─────────────────────────────┐
│                              │
│  Tab内容区域                 │ ← TabContentArea
│  (根据选中Tab显示不同内容)   │
│                              │
└─────────────────────────────┘
```

---

## 🎨 当前效果

### Tab切换
- ✅ 点击Tab → Tab高亮 + 指示器移动
- ✅ 内容区域切换对应页面
- ✅ 动画流畅（200ms）

### 资料页
- ✅ 显示8个资料字段（2x4网格）
- ✅ 显示4个技能标签
- ✅ 添加技能按钮（仅本人主页）

### 占位符页面
- ✅ 动态/收藏/点赞页显示占位符
- ✅ 带图标和说明文字

---

## 🔧 下一步开发

### 立即可以做的

1. **完善动态页**
   ```tsx
   // src/features/Profile/DynamicPage/index.tsx
   // - 实现瀑布流布局
   // - 集成动态列表API
   // - 实现互动功能
   ```

2. **完善收藏页**
   ```tsx
   // src/features/Profile/CollectionPage/index.tsx
   // - 复用动态页的瀑布流
   // - 调用收藏列表API
   ```

3. **完善点赞页**
   ```tsx
   // src/features/Profile/LikesPage/index.tsx
   // - 复用动态页的瀑布流
   // - 调用点赞列表API
   ```

### 需要后端API支持

- `GET /api/v1/profile/user/:userId` - 获取用户资料
- `GET /api/v1/profile/posts/:userId` - 获取用户动态
- `GET /api/v1/profile/collections/:userId` - 获取收藏
- `GET /api/v1/profile/likes/:userId` - 获取点赞
- `POST /api/v1/profile/follow` - 关注/取消关注
- `PUT /api/v1/profile/update` - 更新资料

---

## 🐛 已知限制

### 当前使用模拟数据

所有数据都是模拟的，需要后续集成真实API：
- 用户信息：使用generateMockUser()
- 资料字段：使用generateMockProfileFields()
- 技能列表：使用generateMockSkills()

### 占位符页面

以下页面只有占位符UI：
- 动态页（DynamicPage）
- 收藏页（CollectionPage）
- 点赞页（LikesPage）
- 动态详情页（PostDetailPage）
- 编辑页（ProfileEditPage）

### 功能未实现

- 瀑布流动态列表
- 评论系统
- 资料编辑（11个子页面）
- 头像管理
- 技能管理

---

## ✅ 验证清单

### 运行测试

```bash
# 1. 启动应用
npm start

# 2. 点击"我的"Tab
# 应该看到：
# ✅ 背景头图正常显示
# ✅ 用户信息正常显示
# ✅ 社交数据正常显示
# ✅ Tab栏正常显示

# 3. 点击不同Tab
# ✅ 动态Tab → 显示占位符
# ✅ 收藏Tab → 显示占位符
# ✅ 点赞Tab → 显示占位符
# ✅ 资料Tab → 显示个人资料
```

### 功能检查

- [ ] 返回按钮正常
- [ ] Tab切换流畅
- [ ] 资料页正常显示
- [ ] 社交数据可点击
- [ ] 编辑按钮显示（自己主页）
- [ ] 关注按钮显示（他人主页）

---

## 📞 问题排查

### Q1: 个人主页不显示？

**A**: 检查路由配置
```bash
# 确认文件存在：
# app/(tabs)/profile.tsx
# src/features/Profile/MainPage/index.tsx
```

### Q2: Tab切换无反应？

**A**: 检查状态管理
```tsx
// 在MainPage中查看activeTab状态
console.log('activeTab:', activeTab);
```

### Q3: 资料页显示不完整？

**A**: 检查ProfileInfoPage
```tsx
// 确认profileFields和skills数据存在
console.log('profileFields:', profileFields);
```

---

## 🎉 恭喜！

个人主页模块核心框架已完成！

**现在可以**:
- ✅ 查看个人主页框架
- ✅ 切换四个Tab
- ✅ 查看个人资料页
- ✅ 看到社交数据

**接下来**:
- 🚀 实现瀑布流功能
- 🚀 集成真实API
- 🚀 完善编辑功能

---

**创建时间**: 2025-10-23  
**维护者**: 开发团队

