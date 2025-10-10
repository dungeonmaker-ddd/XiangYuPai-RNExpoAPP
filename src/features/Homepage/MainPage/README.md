# 🏠 首页模块 - 嵌套化主导架构

> **基于通用组件模块化架构核心标准的完整重构实现**

## 📁 架构概览

```
src/features/Homepage/MainPage/                # 首页模块根目录
├── MainPage.tsx                            # ✨ 主页面组件 - 八段式结构
├── HomeScreen.tsx                          # 📱 页面父组件 - 备用方案
├── index.ts                                # 📤 统一导出入口
├── types.ts                                # 📋 类型定义 - 所有相关类型
├── constants.ts                            # ⚙️ 常量配置 - 颜色/尺寸/渐变
├── README.md                               # 📖 本文档
├── REFACTOR_SUMMARY.md                     # 📝 重构总结文档
│
├── 📦 组件导出层
│   └── components/index.ts                 # 统一导出所有区域组件
│
├── 🔄 状态管理层 (统一管理)
│   ├── useHomeState.ts                     # 页面主状态管理Hook
│   ├── useHomeNavigation.ts                # 页面导航管理Hook
│   └── useHomeData.ts                      # 页面数据管理Hook
│
├── HeaderArea/                             # ✅ 顶部导航区域
│   └── index.tsx                           # 主组件文件（八段式）
│
├── GameBannerArea/                         # ✅ 游戏推广横幅区域
│   └── index.tsx                           # 主组件文件（八段式）
│
├── FunctionGridArea/                       # ✅ 功能服务网格区域
│   ├── index.tsx                           # 主组件文件（八段式）
│   ├── processData.ts                      # 数据处理逻辑
│   └── utilsLayout.ts                      # 布局工具函数
│
├── LimitedOffersArea/                      # ✅ 限时专享区域
│   ├── index.tsx                           # 主组件文件（八段式）
│   ├── processData.ts                      # 数据处理逻辑
│   └── utilsLayout.ts                      # 布局工具函数
│
├── TeamPartyArea/                          # ✅ 组队聚会区域
│   └── index.tsx                           # 主组件文件（八段式）
│
├── FilterTabsArea/                         # ✅ 筛选标签栏区域 (复杂嵌套)
│   ├── index.tsx                           # 主组件文件（八段式）
│   ├── processData.ts                      # 数据处理逻辑
│   ├── utilsLayout.ts                      # 布局工具函数
│   ├── 三角形.png                          # 下拉指示图标
│   ├── RegionSelector/                     # 🔸 地区选择功能区域
│   │   ├── index.tsx                       # 区域主文件（八段式）
│   │   └── processData.ts                  # 数据处理逻辑
│   └── FilterSelector/                     # 🔸 筛选器功能区域
│       ├── index.tsx                       # 区域主文件（八段式）
│       └── processData.ts                  # 数据处理逻辑
│
└── UserListArea/                           # ✅ 用户列表区域 (复杂嵌套)
    ├── index.tsx                           # 主组件文件（八段式）
    ├── processData.ts                      # 数据处理逻辑
    ├── utilsLayout.ts                      # 布局工具函数
    └── UserCardComponent/                  # 🔸 用户卡片功能区域
        ├── index.tsx                       # 区域主文件（八段式）
        ├── processData.ts                  # 数据处理逻辑
        └── utilsFormat.ts                  # 格式化工具函数
```

## 🎯 架构特性

### 1. 嵌套化主导架构
- ✅ **移除components中间层**：所有组件直接嵌套在页面下
- ✅ **区域化组织**：按UI功能区域划分组件架构
- ✅ **复杂度适配**：简单区域扁平实现，复杂区域嵌套实现

### 2. 八段式结构标准
所有 `index.tsx` 文件严格遵循八段式结构：
```typescript
// #region 1. Imports
// #region 2. Types & Schema  
// #region 3. Constants & Config
// #region 4. Utils & Helpers
// #region 5. State Management
// #region 6. Domain Logic
// #region 7. UI Components & Rendering
// #region 8. Exports
```

### 3. 职责分离原则
- **processData.ts**：数据处理逻辑
- **utilsLayout.ts**：布局工具函数
- **utilsFormat.ts**：格式化工具函数
- **index.tsx**：组件UI实现和功能组装

### 4. 统一状态管理
- **useHomeState.ts**：页面级状态管理
- **useHomeNavigation.ts**：页面级导航管理
- **useHomeData.ts**：页面级数据管理

## 🔧 使用说明

### 导入方式
```typescript
// 导入主页面组件（默认导出）
import MainPage from '@/src/features/Homepage/MainPage';

// 或导入命名导出
import { MainPage, HomeScreen } from '@/src/features/Homepage/MainPage';

// 导入特定区域组件
import { 
  HeaderArea, 
  FunctionGridArea,
  UserListArea 
} from '@/src/features/Homepage/MainPage';

// 导入Hooks
import { 
  useHomeState, 
  useHomeNavigation, 
  useHomeData 
} from '@/src/features/Homepage/MainPage';

// 导入类型和常量
import { 
  UserCard, 
  FunctionItem, 
  LocationInfo,
  COLORS, 
  SCREEN_WIDTH 
} from '@/src/features/Homepage/MainPage';
```

### 基础使用
```typescript
// 在Expo Router路由文件中
// app/(tabs)/homepage/index.tsx
import MainPage from '@/src/features/Homepage/MainPage';

export default function HomepageScreen() {
  return <MainPage />;
}

// 带Props使用
<MainPage 
  initialFilter="recommend" 
  initialRegion="南山区" 
/>
```

### 扩展新区域
1. 在 `src/screens/home/` 下创建新区域文件夹
2. 创建 `index.tsx` 主组件文件（遵循八段式结构）
3. 根据复杂度创建 `processData.ts`、`utilsLayout.ts` 等功能文件
4. 在页面父组件中集成新区域

### 修改现有区域
1. 定位到对应区域文件夹
2. 修改 `index.tsx` 主组件文件
3. 相关业务逻辑修改对应的 `processData.ts` 等文件
4. 保持八段式结构完整性

## 📋 质量标准

### ✅ 架构完整性
- [x] 所有组件按嵌套化架构组织
- [x] 核心文件（index.tsx、types.ts、constants.ts、README.md）完整
- [x] 功能层按需创建，职责单一

### ✅ 代码规范性
- [x] 所有主文件遵循八段式结构
- [x] 命名规范统一（驼峰命名、语义化）
- [x] 类型定义完整，常量全部提取

### ✅ 功能完整性
- [x] 8个主要功能区域全部实现
- [x] 复杂区域（FilterTabsArea、UserListArea）嵌套实现
- [x] 状态管理、导航管理、数据管理分离

---

**版本**: 2.0.0  
**重构日期**: 2024年12月  
**架构标准**: 通用组件模块化架构核心标准  
**维护者**: 架构团队
