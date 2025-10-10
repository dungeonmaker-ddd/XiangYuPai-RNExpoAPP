# 🚀 Homepage MainPage 快速入门指南

> **5分钟快速了解和使用重构后的首页模块**

---

## 📦 模块概览

Homepage/MainPage是应用的首页核心模块，采用**八段式结构 + 嵌套化主导架构**，包含7个区域组件和完整的状态管理。

### 核心文件
- `MainPage.tsx` - 主页面组件（八段式结构）⭐
- `index.ts` - 统一导出入口
- 3个Hooks - 状态/导航/数据管理
- 7个区域组件 - 完整的UI模块

---

## ⚡ 快速使用

### 1️⃣ 在路由中使用（推荐）

```typescript
// app/(tabs)/homepage/index.tsx
import MainPage from '@/src/features/Homepage/MainPage';

export default function HomepageScreen() {
  return <MainPage />;
}
```

### 2️⃣ 带初始参数使用

```typescript
<MainPage 
  initialFilter="recommend"  // 初始筛选：附近/推荐/最新
  initialRegion="南山区"     // 初始区域
/>
```

---

## 🎨 区域组件说明

### 1. HeaderArea - 顶部导航
```typescript
<HeaderArea
  location={{ city: '深圳' }}
  onLocationPress={() => {}}
  onSearch={(query) => {}}
  onSearchPress={() => {}}
/>
```
**功能**：位置显示 + 搜索框

### 2. GameBannerArea - 游戏横幅
```typescript
<GameBannerArea onPress={() => {}} />
```
**功能**：游戏推广大图

### 3. FunctionGridArea - 功能网格
```typescript
<FunctionGridArea 
  onFunctionPress={(functionId) => {}} 
/>
```
**功能**：2行5列功能图标（10个功能）

### 4. LimitedOffersArea - 限时专享
```typescript
<LimitedOffersArea
  offers={[...]}              // UserCard[]
  onUserPress={(user) => {}}
  onMorePress={() => {}}
/>
```
**功能**：横向滚动的用户专享卡片

### 5. TeamPartyArea - 组队聚会
```typescript
<TeamPartyArea
  onPress={() => {}}
  onMorePress={() => {}}
/>
```
**功能**：组局中心大图入口

### 6. FilterTabsArea - 筛选标签栏
```typescript
<FilterTabsArea
  activeTab="nearby"
  onTabPress={(tabId) => {}}
  activeRegion="全部"
  onRegionPress={(region) => {}}
/>
```
**功能**：标签切换 + 区域选择 + 筛选器

### 7. UserListArea - 用户列表
```typescript
<UserListArea
  users={[...]}               // UserCard[]
  loading={false}
  onUserPress={(user) => {}}
  refreshing={false}
  onRefresh={() => {}}
  onEndReached={() => {}}
/>
```
**功能**：FlatList虚拟化用户列表

---

## 🔄 Hooks使用

### useHomeState - 状态管理

```typescript
import { useHomeState } from '@/src/features/Homepage/MainPage';

const {
  // 状态
  searchQuery,      // 搜索关键词
  activeFilter,     // 当前筛选（nearby/recommend/latest）
  activeRegion,     // 当前区域
  users,            // 用户列表
  limitedOffers,    // 限时专享列表
  loading,          // 加载中
  refreshing,       // 刷新中
  location,         // 位置信息
  
  // 操作
  setSearchQuery,
  setActiveFilter,
  setActiveRegion,
  handleSearch,
  handleRefresh,
} = useHomeState();
```

### useHomeNavigation - 导航管理

```typescript
import { useHomeNavigation } from '@/src/features/Homepage/MainPage';

const {
  handleUserPress,          // 用户详情
  handleFunctionPress,      // 功能详情
  handleLocationPress,      // 位置选择
  handleSearchPress,        // 搜索页面
  handleGameBannerPress,    // 游戏横幅
  handleTeamPartyPress,     // 组局中心
  handleMoreOffersPress,    // 更多专享
} = useHomeNavigation(navigation);
```

### useHomeData - 数据管理

```typescript
import { useHomeData } from '@/src/features/Homepage/MainPage';

const {
  loadUsers,           // 加载用户列表
  loadLimitedOffers,   // 加载专享数据
  searchUsers,         // 搜索用户
  getUserDetail,       // 获取用户详情
} = useHomeData();
```

---

## 📊 数据类型

### UserCard - 用户卡片
```typescript
interface UserCard {
  id: string;
  avatar: string;
  username: string;
  age: number;
  bio: string;
  services: string[];        // 服务类型
  distance: number;          // 距离（km）
  status: 'online' | 'available' | 'offline';
  photos: string[];
  price?: string;
  region?: string;
  rating?: number;
  reviewCount?: number;
}
```

### FunctionItem - 功能项
```typescript
interface FunctionItem {
  id: string;
  name: string;
  icon: string;              // emoji图标
  color: string;             // 主题色
  isHot?: boolean;           // 是否热门
}
```

### LocationInfo - 位置信息
```typescript
interface LocationInfo {
  city: string;              // 城市名
  district?: string;         // 区域名
}
```

---

## 🎯 常用场景

### 场景1：切换筛选标签
```typescript
// 在MainPage中
const { activeFilter, setActiveFilter } = useHomeState();

// 用户点击标签
setActiveFilter('recommend');  // nearby/recommend/latest
```

### 场景2：切换区域
```typescript
const { activeRegion, setActiveRegion } = useHomeState();

// 用户选择区域
setActiveRegion('南山区');
```

### 场景3：搜索用户
```typescript
const { handleSearch } = useHomeState();

// 用户输入搜索
handleSearch('游戏陪玩');
```

### 场景4：导航到用户详情
```typescript
const { handleUserPress } = useHomeNavigation(navigation);

// 点击用户卡片
handleUserPress(user);  // 导航到 /modal/user-detail
```

### 场景5：刷新页面数据
```typescript
const { handleRefresh } = useHomeState();

// 下拉刷新
handleRefresh();  // 自动防抖（3秒冷却）
```

---

## 🎨 自定义样式

### 修改主题色
```typescript
// constants.ts
export const COLORS = {
  primary: '#8B5CF6',        // 主色（紫色）
  primaryLight: '#A855F7',   // 亮紫色
  // ... 其他颜色
};
```

### 调整布局
```typescript
// MainPage.tsx - styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,  // 修改背景色
  },
  fab: {
    right: 16,        // 修改FAB位置
    bottom: 80,
    // ...
  },
});
```

---

## 🐛 常见问题

### Q1: 页面无法加载？
**A**: 检查以下几点：
1. 确认 `app/(tabs)/homepage/index.tsx` 正确导入MainPage
2. 确认所有区域组件都存在
3. 查看控制台错误信息

### Q2: 用户列表为空？
**A**: 当前使用模拟数据：
1. 检查 `useHomeState.ts` 中的 `generateMockUsers` 函数
2. 后续需要集成真实API替换模拟数据

### Q3: 导航不工作？
**A**: 确认：
1. expo-router正确配置
2. 路由文件存在（如 `/(tabs)/homepage/search`）
3. 检查useHomeNavigation的fallback逻辑

### Q4: 筛选功能不生效？
**A**: 检查：
1. `activeFilter` 和 `activeRegion` 状态是否正确更新
2. `handleSearch` 函数的防抖逻辑（300ms）
3. FilterTabsArea的onTabPress和onRegionPress回调

---

## 📚 相关文档

- [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - 详细重构总结
- [首页模块架构设计.md](./首页模块架构设计.md) - 完整架构设计
- [Discovery/MainPage](../Discovery/MainPage/README.md) - 参考实现

---

## 💡 最佳实践

### ✅ 推荐做法
1. 使用MainPage.tsx作为主要入口
2. 通过Props传递初始状态
3. 使用提供的Hooks管理状态
4. 遵循八段式结构扩展功能
5. 在components/index.ts统一导出新组件

### ❌ 避免做法
1. 不要直接修改区域组件的核心逻辑
2. 不要绕过Hooks直接操作状态
3. 不要硬编码导航路径
4. 不要在组件中直接调用API

---

## 🎓 学习路径

### 初学者
1. 阅读MainPage.tsx了解整体结构
2. 查看useHomeState.ts理解状态管理
3. 查看单个区域组件（如HeaderArea）

### 进阶开发
1. 学习八段式结构规范
2. 了解嵌套化主导架构
3. 掌握processData和utils模式
4. 研究Discovery/MainPage参考实现

### 架构师
1. 理解整体模块化设计
2. 掌握Hooks组合模式
3. 优化性能和代码质量
4. 设计新的区域组件

---

**更新日期**: 2025-10-10  
**文档版本**: v2.0  
**适用范围**: Homepage/MainPage v2.0+  
**维护者**: 开发团队

---

🎉 **恭喜！你已经掌握了Homepage/MainPage模块的基本使用方法！**


