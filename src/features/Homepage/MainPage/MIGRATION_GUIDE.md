# 🔄 Homepage MainPage 迁移指南

> **从旧架构迁移到新架构的完整指南**

---

## 📊 架构对比

### 旧架构（已废弃）
```
MainPage/
├── index.tsx                    # 混合状态和UI的主组件
├── components/                  # 中间层组件目录
│   ├── TopFunctionArea/         # 旧顶部组件
│   ├── ServiceGridArea/         # 旧服务网格
│   ├── FeaturedUsersArea/       # 旧专享组件
│   ├── EventCenterArea/         # 旧组局组件
│   └── UserListArea/            # 旧用户列表
└── 缺少完整的状态管理和类型定义
```

### 新架构（当前）
```
MainPage/
├── MainPage.tsx                 # ✨ 八段式主组件
├── HomeScreen.tsx               # 📱 备用父组件
├── index.ts                     # 📤 统一导出
├── types.ts                     # 📋 完整类型
├── constants.ts                 # ⚙️ 完整常量
├── components/index.ts          # 📦 组件导出
│
├── useHomeState.ts              # 🔄 状态Hook
├── useHomeNavigation.ts         # 🔄 导航Hook
├── useHomeData.ts               # 🔄 数据Hook
│
├── HeaderArea/                  # ✅ 新顶部导航
├── GameBannerArea/              # ✅ 游戏横幅
├── FunctionGridArea/            # ✅ 功能网格
├── LimitedOffersArea/           # ✅ 限时专享
├── TeamPartyArea/               # ✅ 组队聚会
├── FilterTabsArea/              # ✅ 筛选标签栏
└── UserListArea/                # ✅ 用户列表
```

---

## 🔀 组件映射

### 组件名称变更

| 旧组件 | 新组件 | 变更说明 |
|--------|--------|----------|
| TopFunctionArea | HeaderArea | 重命名 + 功能增强 |
| ServiceGridArea | FunctionGridArea | 重命名 + 数据处理分离 |
| FeaturedUsersArea | LimitedOffersArea | 重命名 + 结构优化 |
| EventCenterArea | TeamPartyArea | 重命名 + Props简化 |
| - | FilterTabsArea | **新增**筛选标签栏 |
| GameBannerArea | GameBannerArea | 保持 + 结构优化 |
| UserListArea | UserListArea | 保持 + 性能优化 |

---

## 📝 Props变更

### HeaderArea（原TopFunctionArea）

**旧Props**:
```typescript
interface TopFunctionAreaProps {
  onLocationPress: () => void;
  onSearchPress: () => void;
}
```

**新Props**:
```typescript
interface HeaderAreaProps {
  location: LocationInfo;         // ✨ 新增
  onLocationPress: () => void;
  onSearch: (query: string) => void;  // ✨ 新增
  onSearchPress?: () => void;
}
```

**迁移方式**:
```typescript
// 旧用法
<TopFunctionArea
  onLocationPress={() => {}}
  onSearchPress={() => {}}
/>

// 新用法
<HeaderArea
  location={{ city: '深圳' }}
  onLocationPress={() => {}}
  onSearch={(query) => console.log(query)}
  onSearchPress={() => {}}
/>
```

### FunctionGridArea（原ServiceGridArea）

**旧Props**:
```typescript
interface ServiceGridAreaProps {
  onServicePress: (serviceType: string) => void;
}
```

**新Props**:
```typescript
interface FunctionGridAreaProps {
  onFunctionPress: (functionId: string) => void;  // 重命名
}
```

**迁移方式**:
```typescript
// 旧用法
<ServiceGridArea
  onServicePress={(type) => {}}
/>

// 新用法
<FunctionGridArea
  onFunctionPress={(functionId) => {}}
/>
```

### LimitedOffersArea（原FeaturedUsersArea）

**旧Props**:
```typescript
interface FeaturedUsersAreaProps {
  onUserPress: (userId: string) => void;
  onMorePress: () => void;
}
```

**新Props**:
```typescript
interface LimitedOffersAreaProps {
  offers: UserCard[];              // ✨ 新增数据传入
  onUserPress: (user: UserCard) => void;  // 参数类型变更
  onMorePress: () => void;
}
```

**迁移方式**:
```typescript
// 旧用法
<FeaturedUsersArea
  onUserPress={(userId) => {}}
  onMorePress={() => {}}
/>

// 新用法
<LimitedOffersArea
  offers={limitedOffers}
  onUserPress={(user) => {}}
  onMorePress={() => {}}
/>
```

### TeamPartyArea（原EventCenterArea）

**旧Props**:
```typescript
interface EventCenterAreaProps {
  onEventPress: () => void;
}
```

**新Props**:
```typescript
interface TeamPartyAreaProps {
  onPress: () => void;             // 重命名
  onMorePress: () => void;         // ✨ 新增
}
```

**迁移方式**:
```typescript
// 旧用法
<EventCenterArea
  onEventPress={() => {}}
/>

// 新用法
<TeamPartyArea
  onPress={() => {}}
  onMorePress={() => {}}
/>
```

### FilterTabsArea（新增组件）

**新Props**:
```typescript
interface FilterTabsAreaProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  activeRegion?: string;
  onRegionPress?: (region: string) => void;
}
```

**使用方式**:
```typescript
<FilterTabsArea
  activeTab="nearby"
  onTabPress={(tabId) => setActiveFilter(tabId)}
  activeRegion="全部"
  onRegionPress={(region) => setActiveRegion(region)}
/>
```

### UserListArea（增强版）

**旧Props**:
```typescript
interface UserListAreaProps {
  onUserPress: (userId: string) => void;
  onFilterPress: () => void;
}
```

**新Props**:
```typescript
interface UserListAreaProps {
  users: UserCard[];              // ✨ 新增数据传入
  loading: boolean;               // ✨ 新增加载状态
  onUserPress: (user: UserCard) => void;  // 参数类型变更
  onEndReached?: () => void;      // ✨ 新增无限滚动
  refreshing?: boolean;           // ✨ 新增刷新状态
  onRefresh?: () => void;         // ✨ 新增刷新回调
}
```

**迁移方式**:
```typescript
// 旧用法
<UserListArea
  onUserPress={(userId) => {}}
  onFilterPress={() => {}}
/>

// 新用法
<UserListArea
  users={users}
  loading={loading}
  onUserPress={(user) => {}}
  onEndReached={() => {}}
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>
```

---

## 🔄 状态管理迁移

### 旧方式：内联状态
```typescript
const [loading, setLoading] = useState(false);
const [users, setUsers] = useState([]);
// ... 更多分散的状态
```

### 新方式：useHomeState Hook
```typescript
const {
  searchQuery,
  activeFilter,
  activeRegion,
  users,
  limitedOffers,
  loading,
  refreshing,
  location,
  handleSearch,
  handleRefresh,
  // ... 更多统一管理的状态
} = useHomeState();
```

---

## 🚀 导航迁移

### 旧方式：直接使用router
```typescript
const router = useRouter();

const handleNavigation = (route, params) => {
  router.push({ pathname: route, params });
};
```

### 新方式：useHomeNavigation Hook
```typescript
const {
  handleUserPress,
  handleFunctionPress,
  handleLocationPress,
  handleSearchPress,
  // ... 更多封装好的导航函数
} = useHomeNavigation(navigation);
```

---

## 📦 导入迁移

### 旧导入方式
```typescript
import {
  EventCenterArea,
  FeaturedUsersArea,
  GameBannerArea,
  ServiceGridArea,
  TopFunctionArea,
  UserListArea,
} from './components';
```

### 新导入方式
```typescript
import {
  FilterTabsArea,
  FunctionGridArea,
  GameBannerArea,
  HeaderArea,
  LimitedOffersArea,
  TeamPartyArea,
  UserListArea,
} from './components';
```

---

## 🔧 数据结构迁移

### User类型 → UserCard类型

**旧User类型**（来自userStore）:
```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  // ...更多字段
}
```

**新UserCard类型**:
```typescript
interface UserCard {
  id: string;
  username: string;  // 字段名变更
  avatar: string;
  age: number;
  // ...更多标准化字段
}
```

**数据转换**:
```typescript
// 从User转换到UserCard
const userCard: UserCard = {
  id: user.id,
  username: user.name,          // name → username
  avatar: user.avatar,
  age: user.age,
  bio: user.description,        // description → bio
  services: user.serviceTypes,  // serviceTypes → services
  distance: user.location.distance || 0,
  status: user.isOnline ? 'online' : 'offline',
  photos: user.images,          // images → photos
  // ...
};
```

---

## ⚠️ 破坏性变更

### 1. 组件名称变更
- `TopFunctionArea` → `HeaderArea`
- `ServiceGridArea` → `FunctionGridArea`
- `FeaturedUsersArea` → `LimitedOffersArea`
- `EventCenterArea` → `TeamPartyArea`

### 2. Props接口变更
- 多个组件新增必需props（如offers, users）
- 回调参数类型从string变更为对象（如UserCard）

### 3. 状态管理变更
- 从内联状态转为Hook管理
- 状态结构标准化

### 4. 导入路径变更
- 从`./components`导入改为从`./components/index.ts`导入
- 新增Hooks导入路径

---

## 🎯 迁移步骤

### Step 1: 更新导入
```typescript
// 更新组件导入
import {
  HeaderArea,              // ✨ 新名称
  FunctionGridArea,        // ✨ 新名称
  LimitedOffersArea,       // ✨ 新名称
  TeamPartyArea,           // ✨ 新名称
  FilterTabsArea,          // ✨ 新增
  GameBannerArea,
  UserListArea,
} from './components';

// 添加Hooks导入
import { useHomeState } from './useHomeState';
```

### Step 2: 更新状态管理
```typescript
// 替换分散的状态
const {
  users,
  loading,
  // ... 其他状态
} = useHomeState();
```

### Step 3: 更新组件使用
```typescript
// 更新所有组件为新Props
<HeaderArea
  location={location}
  onLocationPress={handleLocationPress}
  onSearch={handleSearch}
  onSearchPress={handleSearchPress}
/>

// 添加新组件
<FilterTabsArea
  activeTab={activeFilter}
  onTabPress={setActiveFilter}
  activeRegion={activeRegion}
  onRegionPress={setActiveRegion}
/>
```

### Step 4: 测试验证
```bash
# 运行TypeScript检查
npx tsc --noEmit

# 运行ESLint
npm run lint

# 启动应用测试
npm start
```

---

## 🐛 常见迁移问题

### 问题1: 组件找不到
**错误**: `Cannot find name 'TopFunctionArea'`

**解决**:
```typescript
// 旧
import { TopFunctionArea } from './components';

// 新
import { HeaderArea } from './components';
```

### 问题2: Props类型不匹配
**错误**: `Type 'string' is not assignable to type 'UserCard'`

**解决**:
```typescript
// 旧
onUserPress={(userId) => navigate(userId)}

// 新
onUserPress={(user) => navigate(user.id)}
```

### 问题3: 缺少必需props
**错误**: `Property 'offers' is missing`

**解决**:
```typescript
// 旧
<FeaturedUsersArea />

// 新
<LimitedOffersArea offers={limitedOffers} />
```

### 问题4: 状态未定义
**错误**: `Cannot read property 'data' of undefined`

**解决**:
```typescript
// 使用Hook获取状态
const { users, limitedOffers } = useHomeState();
```

---

## ✅ 迁移检查清单

### 代码层面
- [ ] 更新所有组件导入
- [ ] 更新所有组件名称
- [ ] 更新所有Props传递
- [ ] 添加Hook导入
- [ ] 更新状态管理
- [ ] 更新导航处理
- [ ] 移除旧组件引用

### 功能层面
- [ ] 测试页面加载
- [ ] 测试所有导航
- [ ] 测试筛选功能
- [ ] 测试搜索功能
- [ ] 测试刷新功能
- [ ] 测试用户交互

### 数据层面
- [ ] 验证数据类型转换
- [ ] 验证API调用（如有）
- [ ] 验证Store集成（如有）
- [ ] 验证数据流向

---

## 📚 参考资源

### 文档
- [README.md](./README.md) - 完整架构说明
- [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - 重构详情
- [QUICK_START.md](./QUICK_START.md) - 快速入门
- [MODULE_VERIFICATION.md](./MODULE_VERIFICATION.md) - 验证清单

### 示例代码
- [MainPage.tsx](./MainPage.tsx) - 主页面实现
- [Discovery/MainPage](../Discovery/MainPage/index.tsx) - 参考实现

---

## 💡 最佳实践建议

### ✅ 推荐做法
1. **使用新的MainPage.tsx**作为主要入口
2. **通过useHomeState管理所有状态**
3. **通过useHomeNavigation处理所有导航**
4. **保持组件Props接口稳定**
5. **添加TypeScript类型检查**

### ❌ 避免做法
1. 不要混用旧组件名和新组件名
2. 不要跳过数据类型转换
3. 不要直接修改核心组件
4. 不要忽略TypeScript错误
5. 不要绕过状态管理Hook

---

## 🎯 迁移时间估算

| 任务 | 预估时间 | 难度 |
|------|----------|------|
| 更新导入和命名 | 15分钟 | ⭐ 简单 |
| 更新Props传递 | 30分钟 | ⭐⭐ 中等 |
| 整合状态管理 | 1小时 | ⭐⭐⭐ 中等 |
| 测试和验证 | 1-2小时 | ⭐⭐⭐ 中等 |
| **总计** | **2-3.5小时** | **中等** |

---

## 📞 技术支持

遇到迁移问题？

1. **查看文档**: 先查看QUICK_START.md和README.md
2. **检查类型**: 使用TypeScript检查类型错误
3. **参考示例**: 查看MainPage.tsx实现
4. **对比参考**: 查看Discovery/MainPage的实现

---

**迁移指南版本**: v1.0  
**适用版本**: Homepage/MainPage v2.0+  
**更新日期**: 2025-10-10  
**维护者**: 开发团队

---

🎉 **按照本指南完成迁移后，你将获得更清晰、更易维护的首页模块！**


