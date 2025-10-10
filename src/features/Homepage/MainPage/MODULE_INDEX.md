# 📚 Homepage MainPage 模块索引

> **快速导航和文件查找指南**

---

## 🗂️ 文件分类索引

### 📱 主要页面组件
| 文件 | 说明 | 结构 | 优先级 |
|------|------|------|--------|
| [MainPage.tsx](./MainPage.tsx) | ⭐ 主页面组件 | 八段式 | 🔴 核心 |
| [HomeScreen.tsx](./HomeScreen.tsx) | 页面父组件（备用） | 简化版 | 🟡 备用 |

### 📤 导出和配置
| 文件 | 说明 | 内容 |
|------|------|------|
| [index.ts](./index.ts) | 统一导出入口 | 组件/Hooks/类型 |
| [constants.ts](./constants.ts) | 常量配置 | 颜色/尺寸/渐变 |
| [types.ts](./types.ts) | 类型定义 | UserCard/FunctionItem/LocationInfo |
| [components/index.ts](./components/index.ts) | 组件导出 | 7个区域组件 |

### 🔄 状态管理Hooks（3个）
| 文件 | 说明 | 主要功能 |
|------|------|----------|
| [useHomeState.ts](./useHomeState.ts) | 状态管理 | 搜索/筛选/用户/加载 |
| [useHomeNavigation.ts](./useHomeNavigation.ts) | 导航管理 | 页面跳转/路由处理 |
| [useHomeData.ts](./useHomeData.ts) | 数据管理 | 数据加载/API调用 |

### 🎨 区域组件（7个）

#### 1️⃣ HeaderArea - 顶部导航区域
| 文件 | 说明 |
|------|------|
| [HeaderArea/index.tsx](./HeaderArea/index.tsx) | 位置显示 + 搜索框 |

**Props**: `location`, `onLocationPress`, `onSearch`, `onSearchPress`

#### 2️⃣ GameBannerArea - 游戏推广横幅
| 文件 | 说明 |
|------|------|
| [GameBannerArea/index.tsx](./GameBannerArea/index.tsx) | 游戏推广大图 |

**Props**: `onPress`

#### 3️⃣ FunctionGridArea - 功能服务网格
| 文件 | 说明 |
|------|------|
| [FunctionGridArea/index.tsx](./FunctionGridArea/index.tsx) | 主组件 - 2行5列功能图标 |
| [FunctionGridArea/processData.ts](./FunctionGridArea/processData.ts) | 数据处理 - 功能项配置 |
| [FunctionGridArea/utilsLayout.ts](./FunctionGridArea/utilsLayout.ts) | 布局工具 - 响应式计算 |

**Props**: `onFunctionPress`

#### 4️⃣ LimitedOffersArea - 限时专享区域
| 文件 | 说明 |
|------|------|
| [LimitedOffersArea/index.tsx](./LimitedOffersArea/index.tsx) | 主组件 - 横向滚动卡片 |
| [LimitedOffersArea/processData.ts](./LimitedOffersArea/processData.ts) | 数据处理 - 专享数据优化 |
| [LimitedOffersArea/utilsLayout.ts](./LimitedOffersArea/utilsLayout.ts) | 布局工具 - 卡片样式 |

**Props**: `offers`, `onUserPress`, `onMorePress`

#### 5️⃣ TeamPartyArea - 组队聚会区域
| 文件 | 说明 |
|------|------|
| [TeamPartyArea/index.tsx](./TeamPartyArea/index.tsx) | 组局中心大图入口 |

**Props**: `onPress`, `onMorePress`

#### 6️⃣ FilterTabsArea - 筛选标签栏区域 ⭐复杂
| 文件 | 说明 |
|------|------|
| [FilterTabsArea/index.tsx](./FilterTabsArea/index.tsx) | 主组件 - 标签栏容器 |
| [FilterTabsArea/processData.ts](./FilterTabsArea/processData.ts) | 数据处理 - 标签配置 |
| [FilterTabsArea/utilsLayout.ts](./FilterTabsArea/utilsLayout.ts) | 布局工具 - 样式计算 |
| [FilterTabsArea/三角形.png](./FilterTabsArea/三角形.png) | 下拉指示图标 |
| [FilterTabsArea/RegionSelector/index.tsx](./FilterTabsArea/RegionSelector/index.tsx) | 区域选择器子组件 |
| [FilterTabsArea/RegionSelector/processData.ts](./FilterTabsArea/RegionSelector/processData.ts) | 区域数据处理 |
| [FilterTabsArea/FilterSelector/index.tsx](./FilterTabsArea/FilterSelector/index.tsx) | 筛选器子组件 |
| [FilterTabsArea/FilterSelector/processData.ts](./FilterTabsArea/FilterSelector/processData.ts) | 筛选数据处理 |

**Props**: `activeTab`, `onTabPress`, `activeRegion`, `onRegionPress`

#### 7️⃣ UserListArea - 用户列表区域 ⭐复杂
| 文件 | 说明 |
|------|------|
| [UserListArea/index.tsx](./UserListArea/index.tsx) | 主组件 - FlatList容器 |
| [UserListArea/processData.ts](./UserListArea/processData.ts) | 数据处理 - 用户数据优化 |
| [UserListArea/utilsLayout.ts](./UserListArea/utilsLayout.ts) | 布局工具 - 列表性能 |
| [UserListArea/UserCardComponent/index.tsx](./UserListArea/UserCardComponent/index.tsx) | 用户卡片子组件 |
| [UserListArea/UserCardComponent/processData.ts](./UserListArea/UserCardComponent/processData.ts) | 卡片数据处理 |
| [UserListArea/UserCardComponent/utilsFormat.ts](./UserListArea/UserCardComponent/utilsFormat.ts) | 格式化工具 |

**Props**: `users`, `loading`, `onUserPress`, `onEndReached`, `refreshing`, `onRefresh`

---

## 📖 文档索引

### 🌟 核心文档（必读）
| 文档 | 用途 | 读者 |
|------|------|------|
| [README.md](./README.md) | 模块总览和架构说明 | 所有人 ⭐ |
| [QUICK_START.md](./QUICK_START.md) | 5分钟快速入门 | 新手 🚀 |
| [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) | 重构详细总结 | 开发者 📝 |

### 📋 辅助文档
| 文档 | 用途 | 读者 |
|------|------|------|
| [MODULE_VERIFICATION.md](./MODULE_VERIFICATION.md) | 质量验证清单 | 测试/QA |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | 迁移升级指南 | 维护者 |
| [MODULE_INDEX.md](./MODULE_INDEX.md) | 本文档 - 文件索引 | 所有人 |

### 🎨 设计文档
| 文档 | 用途 |
|------|------|
| [首页模块架构设计.md](./首页模块架构设计.md) | 完整架构设计 |
| [首页区域筛选功能架构设计.md](./首页区域筛选功能架构设计.md) | 筛选功能设计 |
| [组局中心模块架构设计.md](./组局中心模块架构设计.md) | 组局功能设计 |

---

## 🔍 快速查找

### 查找组件实现
```bash
# 查找HeaderArea实现
→ HeaderArea/index.tsx

# 查找FunctionGridArea数据处理
→ FunctionGridArea/processData.ts

# 查找FilterTabsArea的区域选择器
→ FilterTabsArea/RegionSelector/index.tsx
```

### 查找类型定义
```bash
# 查找UserCard类型
→ types.ts (第2-22行)

# 查找FunctionItem类型
→ types.ts (第24-31行)

# 查找LocationInfo类型
→ types.ts (第33-36行)
```

### 查找常量配置
```bash
# 查找颜色常量
→ constants.ts (第7-22行)

# 查找渐变配置
→ constants.ts (第25-28行)

# 查找屏幕尺寸
→ constants.ts (第4行)
```

### 查找Hook使用
```bash
# 查找状态管理
→ useHomeState.ts

# 查找导航处理
→ useHomeNavigation.ts

# 查找数据加载
→ useHomeData.ts
```

---

## 🎯 代码导航路径

### 修改页面布局
```
MainPage.tsx 
  → #region 8. UI Components & Rendering
  → 修改ScrollView中的组件顺序和布局
```

### 修改状态逻辑
```
useHomeState.ts
  → 状态定义区域
  → loadUsers/handleRefresh等函数
```

### 修改导航逻辑
```
useHomeNavigation.ts
  → handleUserPress/handleFunctionPress等函数
```

### 修改区域组件
```
{ComponentName}/index.tsx
  → #region 7. UI Components & Rendering
  → 修改组件渲染逻辑

{ComponentName}/processData.ts
  → 修改数据处理逻辑

{ComponentName}/utilsLayout.ts
  → 修改布局计算逻辑
```

### 添加新的功能项
```
FunctionGridArea/processData.ts
  → FUNCTION_ITEMS数组
  → 添加新的功能配置
```

### 修改筛选标签
```
FilterTabsArea/processData.ts
  → FILTER_TABS数组
  → 修改标签配置
```

### 修改区域选项
```
FilterTabsArea/RegionSelector/processData.ts
  → REGION_OPTIONS数组
  → 修改可选区域列表
```

---

## 📊 模块统计

### 文件数量
- **总文件数**: 35+
  - 组件文件: 15个 (.tsx)
  - 数据处理: 8个 (processData.ts)
  - 工具文件: 4个 (utils*.ts)
  - 配置文件: 3个 (types/constants/index)
  - 文档文件: 9个 (.md)

### 代码行数
- **MainPage.tsx**: ~370行
- **总代码量**: ~2000+行
- **文档量**: ~1500+行

### 组件层级
- **主组件**: 1个 (MainPage)
- **区域组件**: 7个
- **子组件**: 2个 (RegionSelector, FilterSelector, UserCardComponent)
- **最大嵌套**: 3层

---

## 🎓 学习路径

### 🌟 初学者路径
1. [QUICK_START.md](./QUICK_START.md) - 快速入门
2. [README.md](./README.md) - 模块总览
3. [MainPage.tsx](./MainPage.tsx) - 主组件实现
4. [HeaderArea/index.tsx](./HeaderArea/index.tsx) - 简单组件示例

### 🔥 进阶路径
1. [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - 重构详情
2. [useHomeState.ts](./useHomeState.ts) - 状态管理
3. [FilterTabsArea/](./FilterTabsArea/) - 复杂组件示例
4. [UserListArea/](./UserListArea/) - 列表性能优化

### 🚀 专家路径
1. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - 迁移指南
2. [MODULE_VERIFICATION.md](./MODULE_VERIFICATION.md) - 验证清单
3. 架构设计文档 - 深入理解
4. Discovery/MainPage - 对比参考

---

## 🔗 快捷链接

### 在VSCode中快速打开
```
# 主组件
Cmd/Ctrl + P → MainPage.tsx

# 状态管理
Cmd/Ctrl + P → useHomeState.ts

# 区域组件
Cmd/Ctrl + P → HeaderArea/index.tsx
Cmd/Ctrl + P → FunctionGridArea/index.tsx

# 配置文件
Cmd/Ctrl + P → constants.ts
Cmd/Ctrl + P → types.ts
```

### 快速搜索
```
# 查找组件使用
Cmd/Ctrl + Shift + F → "HeaderArea"

# 查找类型定义
Cmd/Ctrl + Shift + F → "interface UserCard"

# 查找常量使用
Cmd/Ctrl + Shift + F → "COLORS.primary"
```

---

## 📞 快速帮助

### 我想...

#### 修改页面布局
→ 查看 [MainPage.tsx](./MainPage.tsx) 第254行开始的UI渲染部分

#### 添加新的功能图标
→ 编辑 [FunctionGridArea/processData.ts](./FunctionGridArea/processData.ts)

#### 修改筛选标签
→ 编辑 [FilterTabsArea/processData.ts](./FilterTabsArea/processData.ts)

#### 修改用户卡片样式
→ 编辑 [UserListArea/UserCardComponent/index.tsx](./UserListArea/UserCardComponent/index.tsx)

#### 添加新的导航
→ 编辑 [useHomeNavigation.ts](./useHomeNavigation.ts)

#### 修改主题色
→ 编辑 [constants.ts](./constants.ts) COLORS配置

#### 学习如何使用
→ 阅读 [QUICK_START.md](./QUICK_START.md)

#### 了解重构内容
→ 阅读 [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)

#### 从旧版本迁移
→ 阅读 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 🗺️ 依赖关系图

```
MainPage.tsx
├── 导入 → components/index.ts
│   ├── → HeaderArea/index.tsx
│   ├── → GameBannerArea/index.tsx
│   ├── → FunctionGridArea/index.tsx
│   │   ├── → processData.ts
│   │   └── → utilsLayout.ts
│   ├── → LimitedOffersArea/index.tsx
│   │   ├── → processData.ts
│   │   └── → utilsLayout.ts
│   ├── → TeamPartyArea/index.tsx
│   ├── → FilterTabsArea/index.tsx
│   │   ├── → processData.ts
│   │   ├── → utilsLayout.ts
│   │   ├── → RegionSelector/index.tsx
│   │   │   └── → processData.ts
│   │   └── → FilterSelector/index.tsx
│   │       └── → processData.ts
│   └── → UserListArea/index.tsx
│       ├── → processData.ts
│       ├── → utilsLayout.ts
│       └── → UserCardComponent/index.tsx
│           ├── → processData.ts
│           └── → utilsFormat.ts
├── 导入 → useHomeState.ts
├── 导入 → types.ts
└── 导入 → constants.ts
```

---

## 📈 更新历史

### v2.0.0 (2025-10-10)
- ✨ 重构为八段式结构
- ✨ 整合所有区域组件
- ✨ 完善状态管理
- ✨ 优化导航逻辑
- 📝 完整文档体系

### v1.0.0 (之前)
- 基础实现
- 分散的组件结构
- 简单的状态管理

---

**索引版本**: v1.0  
**更新日期**: 2025-10-10  
**维护者**: 开发团队

---

💡 **提示**: 使用 Cmd/Ctrl + F 在本文档中搜索你需要的内容！


