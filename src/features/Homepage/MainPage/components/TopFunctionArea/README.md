# TopFunctionArea - 顶部功能区域组件

> 首页顶部功能区域，包含位置选择和搜索功能入口

## 📋 组件概述

TopFunctionArea是首页的顶部功能区域，负责显示当前位置信息、提供位置选择入口和搜索功能入口。

## 🎯 核心职责

- **系统状态栏管理** - iOS安全区域适配和状态栏样式
- **位置信息显示** - 当前城市和区域信息展示
- **位置选择入口** - 提供位置切换功能
- **搜索功能入口** - 快速搜索用户、服务或地点

## 🏗️ 组件特性

### 功能特性
- 🎯 位置状态智能显示（定位中、未授权、已定位）
- 🔍 动态搜索占位符（基于热门关键词）
- 📱 iOS安全区域自动适配
- ✨ 触觉反馈支持
- 📊 用户行为埋点

### 样式特性
- 🎨 渐变背景适配
- 🌟 半透明容器设计
- 💫 平台差异化阴影
- 📐 响应式布局

## 📱 使用示例

```typescript
import TopFunctionArea from './components/TopFunctionArea';

<TopFunctionArea
  onLocationPress={() => handleNavigation('/homepage/location')}
  onSearchPress={() => handleNavigation('/homepage/search')}
  style={customStyles}
/>
```

## 🔧 Props接口

```typescript
interface TopFunctionAreaProps {
  onLocationPress: () => void;    // 位置点击回调
  onSearchPress: () => void;      // 搜索点击回调
  style?: StyleProp<ViewStyle>;   // 自定义样式
}
```

## 🎨 样式配置

### 颜色系统
- 主背景: `#6366F1` (Primary Blue)
- 半透明容器: `rgba(255, 255, 255, 0.4)`
- 文本颜色: 白色系列

### 尺寸规范
- 区域高度: 120px (含安全区域)
- 位置容器: 36px 高度
- 搜索容器: 40px 高度
- 圆角半径: 12px

## 🔄 状态管理

### 依赖的Store
- **locationStore** - 位置信息和权限状态
- **homepageStore** - 用户交互状态
- **configStore** - 主题和配置信息

### 本地状态
- `LocationDisplayData` - 位置显示数据
- `SearchBarState` - 搜索栏状态

## 🚀 性能优化

### 渲染优化
- `useMemo` 计算位置显示文本
- `useCallback` 缓存事件处理函数
- 条件渲染减少不必要更新

### 交互优化
- 触觉反馈提升用户体验
- 防抖处理避免重复点击
- 加载状态视觉反馈

## 📐 布局结构

```
TopFunctionArea
├── StatusBar (状态栏配置)
├── SafeArea (安全区域适配)
└── ContentContainer
    ├── LocationSelector (位置选择器)
    │   ├── LocationIcon
    │   ├── LocationText
    │   │   ├── Title (城市名)
    │   │   └── Subtitle (区域名)
    │   └── Arrow
    └── SearchBarContainer (搜索栏)
        ├── SearchIcon
        └── PlaceholderText
```

## 🔗 交互流程

1. **位置选择流程**
   - 点击位置区域 → 触发 `onLocationPress`
   - 显示位置权限状态和当前位置
   - 支持定位中状态显示

2. **搜索流程**
   - 点击搜索栏 → 触发 `onSearchPress`
   - 显示动态占位符提示
   - 引导用户进入搜索页面

## 🎯 可访问性

- **无障碍标签** - 为位置和搜索提供语义化标签
- **无障碍提示** - 提供操作指导信息
- **键盘导航** - 支持键盘和辅助设备操作

## 📝 开发状态

- [x] 基础架构实现
- [x] 八段式结构完成
- [x] 位置选择器实现
- [x] 搜索栏实现
- [x] 安全区域适配
- [x] 响应式样式
- [ ] Store集成 (待实际Store实现)
- [ ] 埋点事件上报
- [ ] 触觉反馈集成
- [ ] 动画效果优化

## 🔮 后续优化

1. **动画增强** - 位置切换动画、搜索栏交互动画
2. **智能提示** - 基于用户行为的搜索建议
3. **快捷操作** - 常用位置快速切换
4. **主题适配** - 支持深色模式
5. **网络优化** - 位置信息缓存策略

---

**创建时间**: 2025年9月  
**当前版本**: v1.0.0  
**维护者**: 架构团队
