# 🧭 XiangYuPai-RNExpoAPP 路由配置指南

> **当前状态**: 路由配置已修复，测试页面已就位

## 📁 **当前路由结构**

```
app/
├── _layout.tsx                    # 根布局（Stack导航）
├── (tabs)/                        # Tab导航组
│   ├── _layout.tsx                # Tab布局配置
│   ├── index.tsx                  # 默认Tab（重定向到homepage）
│   ├── homepage/                  # 首页Tab及子页面
│   │   ├── _layout.tsx            # 首页子页面Stack布局
│   │   ├── index.tsx              # 首页主页面 ⭐ 当前显示测试页面
│   │   ├── test-main.tsx          # 测试版首页（临时）
│   │   ├── debug.tsx              # 路由调试页面
│   │   ├── search.tsx             # 搜索页面
│   │   ├── service-detail.tsx     # 服务详情页面
│   │   ├── location.tsx           # 位置选择页面
│   │   ├── filter-online.tsx      # 线上筛选页面
│   │   ├── event-center.tsx       # 组局中心页面
│   │   └── featured.tsx           # 限时专享页面
│   ├── discover.tsx               # 发现Tab
│   ├── publish.tsx                # 发布Tab
│   ├── messages.tsx               # 消息Tab
│   └── profile.tsx                # 我的Tab
├── modal/                         # 模态页面
│   ├── user-detail.tsx            # 用户详情模态
│   └── filter-panel.tsx           # 筛选面板模态
├── modal.tsx                      # 默认模态页面
└── test-homepage.tsx              # 全局测试页面
```

## 🎯 **测试步骤**

### 1. 启动应用
```bash
expo start
```

### 2. 测试基础导航
- 应用启动后会显示底部5个Tab
- 点击"首页"Tab应该显示测试页面
- 测试页面包含所有导航功能的测试按钮

### 3. 验证路由功能
测试页面提供了以下测试按钮：

#### 🔝 顶部功能测试
- **位置选择** → `/(tabs)/homepage/location`
- **搜索功能** → `/(tabs)/homepage/search`

#### 🎮 服务功能测试
- **服务详情** → `/(tabs)/homepage/service-detail`

#### ⭐ 精选功能测试
- **限时专享** → `/(tabs)/homepage/featured`
- **组局中心** → `/(tabs)/homepage/event-center`

#### 🔧 工具功能测试
- **筛选功能** → `/(tabs)/homepage/filter-online`

#### 📱 模态页面测试
- **用户详情** → `/modal/user-detail`

#### 🗂️ Tab切换测试
- **发现** → `/(tabs)/discover`
- **消息** → `/(tabs)/messages`
- **我的** → `/(tabs)/profile`

## 🔧 **路由修复记录**

### 已修复的问题：

1. ✅ **删除冲突文件** - 移除了旧的 `app/(tabs)/explore.tsx`
2. ✅ **修复路径别名** - 更新了 `tsconfig.json` 中的路径配置
3. ✅ **统一Tab配置** - 确保Tab布局指向正确的文件
4. ✅ **修正导航路径** - 更新MainPage中的所有导航路径
5. ✅ **更新路由常量** - 修正了 `constants.ts` 中的路由配置

### 路由配置详情：

#### Tab布局 (`app/(tabs)/_layout.tsx`)
```typescript
<Tabs.Screen name="homepage" />  // 指向 /(tabs)/homepage
<Tabs.Screen name="discover" />  // 指向 /(tabs)/discover
<Tabs.Screen name="publish" />   // 指向 /(tabs)/publish
<Tabs.Screen name="messages" />  // 指向 /(tabs)/messages
<Tabs.Screen name="profile" />   // 指向 /(tabs)/profile
```

#### 首页子路由 (`app/(tabs)/homepage/_layout.tsx`)
```typescript
<Stack.Screen name="index" />           // 首页主页面
<Stack.Screen name="search" />          // 搜索页面
<Stack.Screen name="service-detail" />  // 服务详情页面
<Stack.Screen name="location" />        // 位置选择页面
<Stack.Screen name="filter-online" />   // 筛选页面
<Stack.Screen name="event-center" />    // 组局中心页面
<Stack.Screen name="featured" />        // 限时专享页面
```

## 🚀 **启用完整首页的步骤**

当路由测试通过后，执行以下步骤启用完整的MainPage：

### 1. 恢复真实首页
```typescript
// 修改 app/(tabs)/homepage/index.tsx
import { ErrorBoundary } from '@/src/components';
import MainPage from '@/src/features/Homepage/MainPage';

export default function HomepageScreen() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  );
}
```

### 2. 检查组件导入
确保以下路径别名正确配置：
```json
// tsconfig.json
{
  "paths": {
    "@/*": ["./"],
    "@/src/*": ["./src/*"],
    "@/stores/*": ["./stores/*"],
    "@/services/*": ["./services/*"]
  }
}
```

### 3. 验证MainPage组件
确保MainPage组件能正确导入：
- Zustand状态管理
- 区域组件（6个）
- 共享组件（ErrorBoundary、LoadingOverlay等）

## ⚠️ **可能遇到的问题**

### 1. 组件导入错误
**症状**: "Cannot find module" 错误  
**解决**: 检查路径别名配置，确保组件文件存在

### 2. 状态管理错误
**症状**: Zustand store导入失败  
**解决**: 确保所有store文件正确创建并导出

### 3. 导航参数错误
**症状**: 路由参数传递失败  
**解决**: 检查导航路径和参数格式

## 🎯 **下一步**

1. **测试路由** - 使用测试页面验证所有导航功能
2. **启用真实首页** - 确认路由正常后，启用完整的MainPage
3. **功能测试** - 测试所有区域组件的交互功能
4. **性能优化** - 验证性能优化措施是否生效

## 📞 **调试工具**

### 访问调试页面
导航到: `/(tabs)/homepage/debug`

### 查看路由日志
在测试页面中点击按钮，查看控制台输出的导航日志

### 检查路由状态
使用 `usePathname()` hook 查看当前路由状态

---

**创建时间**: 2025年9月  
**当前版本**: v1.0.0  
**维护者**: 开发团队
