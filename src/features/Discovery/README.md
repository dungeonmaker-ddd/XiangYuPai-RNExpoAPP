# 🔍 发现页面模块 (Discovery Module)

> **基于UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5标准**  
> **参考Homepage模块架构模式**

---

## 📋 模块信息

- **模块名称**: Discovery (发现页面模块)
- **页面类型**: 社交内容发现页面
- **技术栈**: React Native + Expo Router + TypeScript
- **架构模式**: 八段式单文件架构 + 层级化页面组
- **设计标准**: UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5

---

## 🏗️ 目录结构

```
src/features/Discovery/
├── index.tsx                    # 页面组主文件
├── types.ts                     # 类型定义
├── constants.ts                 # 常量配置
├── README.md                    # 本文档
│
├── MainPage/                    # 📱 主页面（三Tab结构）
│   ├── index.tsx
│   ├── types.ts
│   ├── constants.ts
│   └── components/
│       ├── NavigationArea/      # Tab切换区域
│       └── ContentArea/         # 动态列表区域
│
├── DetailPage/                  # 📋 动态详情页面
├── TopicPage/                   # 🏷️ 话题详情页面
├── PublishPage/                 # ✍️ 发布动态页面
├── TopicSelectPage/             # 🔍 话题选择页面
├── LocationSelectPage/          # 📍 地点选择页面
├── ReportPage/                  # 🚨 举报功能页面
│
├── SharedComponents/            # 🧩 模块内共享组件
│   ├── Button/                  # 按钮组件系列
│   ├── Card/                    # 卡片组件系列
│   └── Display/                 # 展示组件系列
│
├── stores/                      # 📊 状态管理
│   └── discoveryStore.ts        # 发现页面状态
│
└── api/                         # 🌐 API服务
    ├── discoveryApi.ts          # 主API接口
    ├── feedApi.ts               # 动态API
    ├── topicApi.ts              # 话题API
    └── interactionApi.ts        # 互动API
```

---

## 🎯 核心功能

### 1️⃣ **MainPage - 发现主页面**
- 三Tab切换（关注/热门/同城）
- 动态流列表展示
- 下拉刷新
- 无限滚动加载

### 2️⃣ **DetailPage - 动态详情**
- 完整动态内容展示
- 媒体查看器
- 评论列表和互动
- 点赞/收藏/分享

### 3️⃣ **TopicPage - 话题详情**
- 话题信息展示
- 相关动态列表
- 参与统计

### 4️⃣ **PublishPage - 发布动态**
- 文字编辑
- 图片/视频上传
- 话题选择
- 地点选择

### 5️⃣ **TopicSelectPage - 话题选择**
- 热门话题
- 搜索话题
- 多选支持

### 6️⃣ **LocationSelectPage - 地点选择**
- 地图选点
- 附近地点
- 搜索地点

### 7️⃣ **ReportPage - 举报功能**
- 举报理由选择
- 详细描述
- 提交处理

---

## 📐 架构原则

### ✅ **主文件优先原则**
- 所有状态管理在主文件第6段（State Management）
- 所有事件处理在主文件第7段（Domain Logic）
- 所有工具函数在主文件第5段（Utils & Helpers）

### ✅ **styles.ts谨慎使用**
- 简单样式（<50行）→ 直接在index.tsx第9段
- 复杂样式（>50行）→ 独立styles.ts文件

### ✅ **组件作用域限制**
- 区域组件 → Page/components/XXXArea/
- 模块内共享 → Discovery/SharedComponents/
- 不创建全局组件

### ✅ **八段式结构强制执行**
```typescript
#region 1. File Banner & TOC
#region 2. Imports
#region 3. Types & Schema
#region 4. Constants & Config
#region 5. Utils & Helpers        ← 工具函数
#region 6. State Management       ← 状态管理
#region 7. Domain Logic           ← 业务逻辑
#region 8. UI Components & Rendering
#region 9. Exports
```

---

## 🚀 快速开始

### 1. 导入Discovery模块
```typescript
import Discovery from '@/src/features/Discovery';

// 使用
<Discovery initialTab="hot" userId={currentUserId} />
```

### 2. 导入子页面
```typescript
import { MainPage, DetailPage, PublishPage } from '@/src/features/Discovery';
```

### 3. 使用类型定义
```typescript
import type { Feed, Comment, Topic } from '@/src/features/Discovery/types';
```

---

## 📊 开发状态

### ✅ 已完成
- [x] 基础目录结构
- [x] 类型定义（types.ts）
- [x] 常量配置（constants.ts）
- [x] 页面组主文件（index.tsx）
- [x] README文档

### 🔄 进行中
- [ ] MainPage主页面实施
- [ ] DetailPage详情页实施
- [ ] 其他SubPages实施

### 📝 待开发
- [ ] SharedComponents共享组件
- [ ] Stores状态管理
- [ ] API服务接口

---

## 📖 参考文档

- **架构设计文档**: `TxT2/架构设计文档/发现页面模块架构设计文档v2.0.md`
- **补充文档**: `TxT2/架构设计文档/发现页面模块架构设计文档v2.0-补充.md`
- **实施前必读**: `TxT2/架构设计文档/发现页面模块-实施前必读.md`
- **首页模块参考**: `src/features/Homepage/HOMEPAGE_MODULE_ARCHITECTURE.md`
- **核心架构标准**: `.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md`

---

**创建日期**: 2025年9月30日  
**当前版本**: v1.0  
**维护者**: 开发团队
