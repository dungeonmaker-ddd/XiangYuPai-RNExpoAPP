# 👤 个人主页模块 (Profile Module)

> **基于UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5标准**  
> **参考Homepage模块架构模式**

---

## 📋 模块信息

- **模块名称**: Profile (个人主页模块)
- **页面类型**: 用户个人中心页面
- **技术栈**: React Native + Expo Router + TypeScript + Zustand
- **架构模式**: 八段式单文件架构 + 层级化页面组
- **设计标准**: UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5

---

## 🏗️ 目录结构

```
src/features/Profile/
├── index.tsx                    # 页面组主文件
├── types.ts                     # 类型定义
├── constants.ts                 # 常量配置
├── README.md                    # 本文档
│
├── MainPage/                    # 📱 主页面（四Tab框架）
│   ├── index.tsx                # 主文件（八段式）
│   ├── types.ts                 # 类型定义
│   ├── constants.ts             # 常量配置
│   ├── BackgroundArea/          # 🖼️ 背景头图区域
│   ├── UserInfoArea/            # 👤 用户信息区域
│   ├── SocialStatsArea/         # 📊 社交数据区域
│   ├── TabNavigationArea/       # 🏷️ Tab标签栏
│   └── TabContentArea/          # 📋 Tab内容区域
│
├── ProfileInfoPage/             # 📋 资料页（个人资料+技能）
├── DynamicPage/                 # 📸 动态页（瀑布流）
├── CollectionPage/              # ⭐ 收藏页（瀑布流）
├── LikesPage/                   # ❤️ 点赞页（瀑布流）
├── PostDetailPage/              # 📋 动态详情页
└── ProfileEditPage/             # ✏️ 资料编辑页
│
├── 📊 状态管理（在项目根stores/）
│   └── profileStore.ts          # 个人主页状态
│
└── 🌐 API服务（待实现）
    └── profileApi.ts            # 个人主页API
```

---

## 🎯 核心功能

### 1️⃣ **MainPage - 个人主页框架**
- 四Tab切换（动态/收藏/点赞/资料）
- 用户资料展示
- 社交数据展示
- 背景头图展示
- 编辑/关注功能

### 2️⃣ **ProfileInfoPage - 个人资料页**
- 个人资料卡片展示（8个字段）
- 技能标签水平滚动
- 添加技能功能（仅本人）

### 3️⃣ **DynamicPage - 动态页**
- 瀑布流动态列表
- 下拉刷新
- 无限滚动

### 4️⃣ **CollectionPage - 收藏页**
- 瀑布流收藏内容

### 5️⃣ **LikesPage - 点赞页**
- 瀑布流点赞内容

### 6️⃣ **PostDetailPage - 动态详情**
- 动态完整内容
- 评论列表
- 互动操作

### 7️⃣ **ProfileEditPage - 资料编辑**
- 所有字段编辑入口
- 头像管理
- 表单验证

---

## 🚀 快速开始

### 基础使用

```tsx
import Profile from '@/src/features/Profile';

// 查看自己的主页
<Profile />

// 查看他人主页
<Profile userId="user-123" />

// 指定初始Tab
<Profile initialTab="profile" />
```

### 使用Store

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

## 📐 架构原则

本模块严格遵循[通用组件架构核心标准 v2.5](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)：

- ✅ **八段式文件结构** - 所有主文件使用统一的八段式代码组织
- ✅ **层级化页面组架构** - Feature → Page → Area 三层架构
- ✅ **主文件优先原则** - 优先在主文件内集中管理逻辑
- ✅ **类型安全** - 完整的TypeScript类型定义

---

## 🔧 区域组件说明

### 🖼️ BackgroundArea - 背景头图区域
```typescript
职责：用户背景图展示 + 渐变遮罩 + 返回按钮
特性：
- 背景图片加载（占位图）
- 底部渐变遮罩（alpha 0-60%）
- 返回按钮（半透明背景）
```

### 👤 UserInfoArea - 用户信息区域
```typescript
职责：头像 + 基本信息 + 认证标签 + 编辑/关注按钮
特性：
- 头像露出一半设计（marginTop: -48）
- 在线状态指示器
- 性别年龄标签（粉/蓝色）
- 实名认证、大神认证标签
- 位置和距离显示
- 编辑/关注按钮切换
```

### 📊 SocialStatsArea - 社交数据区域
```typescript
职责：关注数 + 粉丝数 + 获赞与收藏展示
特性：
- 三列均分布局
- 数字格式化（1k/1w）
- 点击跳转对应列表
```

### 🏷️ TabNavigationArea - Tab标签栏
```typescript
职责：四Tab切换 + 指示器动画 + 吸顶效果
特性：
- 动态/收藏/点赞/资料 四Tab
- 底部指示器（紫色2px）
- 吸顶固定（滚动时）
```

### 📋 TabContentArea - Tab内容区域
```typescript
职责：根据activeTab显示不同内容
特性：
- 条件渲染Tab子页面
- 瀑布流布局支持
```

---

## 📊 开发状态

### ✅ 已完成
- [x] 基础目录结构
- [x] 类型定义（types.ts）
- [x] 常量配置（constants.ts）
- [x] 页面组主文件（index.tsx）
- [x] MainPage主框架页面
- [x] 5个区域组件（BackgroundArea, UserInfoArea, SocialStatsArea, TabNavigationArea, TabContentArea）
- [x] ProfileInfoPage（资料页）
- [x] 占位符页面（DynamicPage, CollectionPage, LikesPage, PostDetailPage, ProfileEditPage）
- [x] profileStore状态管理
- [x] 路由配置更新
- [x] README文档

### 🔄 待实现
- [ ] 动态页瀑布流实现
- [ ] 收藏页瀑布流实现
- [ ] 点赞页瀑布流实现
- [ ] 动态详情页完整实现
- [ ] 资料编辑页完整实现（11个编辑页面/弹窗）
- [ ] API服务集成
- [ ] 后端数据对接

---

## 📖 参考文档

### 设计文档
- **个人主页模块架构设计**: `TXT/页面设计+流程文档/个人主页模块架构设计文档.md`
- **个人信息编辑模块**: `TXT/页面设计+流程文档/个人信息编辑模块架构设计文档.md`

### 技术标准
- **核心架构标准**: `.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md`
- **Homepage模块参考**: `src/features/Homepage/HOMEPAGE_MODULE_ARCHITECTURE.md`

---

## 🎯 后续开发计划

### Phase 1: 完善MainPage（1-2天）
- [ ] 实现动态页瀑布流
- [ ] 实现收藏页瀑布流
- [ ] 实现点赞页瀑布流
- [ ] 集成真实数据

### Phase 2: 动态详情页（1天）
- [ ] 完整内容展示
- [ ] 评论列表
- [ ] 互动操作

### Phase 3: 资料编辑页（2-3天）
- [ ] 编辑主页面
- [ ] 11个编辑页面/弹窗
- [ ] 头像管理
- [ ] 表单验证

### Phase 4: API集成（1-2天）
- [ ] profileApi实现
- [ ] 后端数据对接
- [ ] 错误处理

---

**创建日期**: 2025年10月23日  
**当前版本**: v1.0  
**维护者**: 开发团队  
**状态**: ✅ 核心框架完成，待实现子功能

