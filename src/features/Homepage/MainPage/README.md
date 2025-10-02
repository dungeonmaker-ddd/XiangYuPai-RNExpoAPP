# MainPage - 首页主页面

> React Native Expo项目首页主页面组件

## 📋 组件概述

MainPage是应用的核心入口页面，负责展示主要功能区域和用户内容。采用八段式架构设计，实现完整的单文件集中管理。

## 🎯 核心职责

- **应用主入口页面** - 用户进入应用后的第一个页面
- **功能导航中心** - 提供所有核心功能的入口
- **用户发现平台** - 展示推荐用户和精选内容
- **状态信息展示** - 显示位置、搜索、筛选等状态信息

## 🏗️ 架构设计

### 八段式结构

```
1. File Banner & TOC      - 文件头部和目录
2. Imports               - 依赖导入
3. Types & Schema        - 类型定义
4. Constants & Config    - 常量配置
5. Utils & Helpers       - 工具函数
6. State Management      - 状态管理
7. Domain Logic          - 业务逻辑
8. UI Components & Rendering - 渲染组件
```

### 目录结构

```
MainPage/
├── index.tsx           # 主组件文件 (八段式结构)
├── types.ts            # 类型定义
├── constants.ts        # 常量配置
├── styles.ts           # 样式定义
├── README.md           # 文档说明
└── components/         # 区域组件
    ├── TopFunctionArea/     # 顶部功能区域
    ├── GameBannerArea/      # 游戏横幅区域
    ├── ServiceGridArea/     # 服务网格区域
    ├── FeaturedUsersArea/   # 限时专享区域
    ├── EventCenterArea/     # 组队聚会区域
    └── UserListArea/        # 用户列表区域
```

## 🔧 技术栈

- **框架**: React Native + Expo
- **路由**: Expo Router
- **状态管理**: Zustand (待集成)
- **类型系统**: TypeScript
- **样式**: StyleSheet

## 📱 区域组件

### 1. TopFunctionArea - 顶部功能区域
- 位置信息显示和选择
- 搜索功能入口
- 系统状态栏管理

### 2. GameBannerArea - 游戏横幅区域
- 展示主推游戏内容
- 动态横幅管理
- 点击跳转处理

### 3. ServiceGridArea - 服务网格区域
- 2x5服务图标网格展示
- 服务状态管理
- 动态配置支持

### 4. FeaturedUsersArea - 限时专享区域
- 精选用户轮播展示
- 区域标题管理
- 水平滚动处理

### 5. EventCenterArea - 组队聚会区域
- 活动中心入口
- 推广横幅展示
- 组队功能导航

### 6. UserListArea - 用户列表区域
- 用户列表展示
- 筛选工具栏管理
- 无限滚动处理

## 🔄 状态管理

### Zustand Stores集成

- **homepageStore**: 首页页面状态和配置
- **userStore**: 用户数据和列表管理
- **locationStore**: 位置信息管理
- **configStore**: 组件配置和主题

### 本地状态

```typescript
interface MainPageState {
  loading: boolean;        // 加载状态
  refreshing: boolean;     // 刷新状态
  error: string | null;    // 错误信息
  lastRefreshTime: number; // 最后刷新时间
}
```

## 🎨 样式系统

### 主题配置
- 颜色系统: Primary, Secondary, Background等
- 尺寸规范: 响应式布局和安全区域
- 动画配置: 持续时间和缓动函数

### 响应式设计
- 基于屏幕尺寸的动态适配
- iOS/Android平台差异处理
- 安全区域适配

## 📡 API集成

### 数据获取
- 首页配置数据
- 用户列表数据
- 位置信息数据
- 组件配置数据

### 缓存策略
- 5分钟TTL缓存
- LRU缓存策略
- 离线数据支持

## 🔗 路由导航

### 页面跳转
- `/homepage/search` - 搜索页面
- `/homepage/location` - 定位页面
- `/homepage/service-detail` - 服务详情页
- `/modal/user-detail` - 用户详情模态

### 参数传递
- 服务类型参数
- 用户ID参数
- 筛选条件参数

## ⚡ 性能优化

### 组件优化
- React.memo记忆化
- useCallback事件处理
- useMemo计算缓存

### 列表优化
- FlatList虚拟化
- 图片懒加载
- 分页加载

### 网络优化
- 请求去重
- 并行数据加载
- 错误重试机制

## 🧪 使用示例

```typescript
import MainPage from '@/src/features/Homepage/MainPage';

// 基本使用
<MainPage />

// 带样式自定义
<MainPage style={customStyles} />
```

## 📝 开发状态

- [x] 基础架构设计
- [x] 八段式结构实现
- [x] 类型定义完成
- [x] 常量配置完成
- [x] 样式系统完成
- [ ] Zustand状态集成
- [ ] 区域组件实现
- [ ] API接口集成
- [ ] 错误边界处理
- [ ] 性能优化实施

## 🔮 后续计划

1. **Zustand状态管理集成** - 替换占位状态逻辑
2. **区域组件逐步实现** - 按优先级实现6个区域组件
3. **API接口层对接** - 实现数据获取和更新
4. **错误处理完善** - 添加ErrorBoundary和错误恢复
5. **性能优化** - 实施记忆化和列表优化
6. **单元测试** - 添加组件和逻辑测试

## 📞 维护信息

- **创建时间**: 2025年9月
- **当前版本**: v1.0.0
- **维护者**: 架构团队
- **技术支持**: React Native + Expo + Zustand技术栈
