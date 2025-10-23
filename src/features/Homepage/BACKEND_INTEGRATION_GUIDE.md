# 📖 首页模块后端集成使用指南

> **快速上手 - 5分钟了解如何使用后端集成**
> 
> **创建时间**: 2025-10-22  
> **适用版本**: v2.0+

---

## 🚀 **快速开始**

### 1️⃣ **配置API地址**

编辑 `.env.development`:

```env
# 本地开发环境
EXPO_PUBLIC_API_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080

# 或使用Mock模式（后端未启动时）
# EXPO_PUBLIC_API_ENV=mock
# EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 2️⃣ **启动应用**

```bash
cd XiangYuPai-RNExpoAPP
npm start
```

应用会自动：
- ✅ 加载首页配置
- ✅ 尝试连接后端API
- ✅ 后端未响应时使用降级方案（默认数据）

---

## 📊 **数据流向**

### 完整数据流程

```
用户打开首页
    ↓
MainPage组件初始化
    ↓
useHomeState Hook执行
    ↓
调用homepageStore方法
    ├── loadPageConfig()      → homepageApiEnhanced.getHomepageConfig()
    ├── loadPageData()        → homepageApiEnhanced.getServiceItems()
    ├──                       → homepageApiEnhanced.getBannerData()
    └── loadFeaturedUsers()   → homepageApiEnhanced.getFeaturedUsers()
    ↓
homepageApiEnhanced执行
    ├── 尝试调用后端API
    │   ├── 成功 → 返回真实数据
    │   └── 失败（404/超时/网络错误）
    │       └── 使用降级方案（默认数据）
    ↓
UserDataAdapter转换数据
    ├── 后端UserProfileVO
    └── 转换为前端UserCard
    ↓
更新Zustand Store状态
    ├── set({ pageConfig })
    ├── set({ pageData })
    └── set({ featuredUsers })
    ↓
React组件自动重渲染
    ├── UserListArea显示用户
    ├── FeaturedUsersArea显示精选
    └── ServiceGridArea显示服务
    ↓
用户看到数据
```

---

## 🎯 **使用场景**

### 场景1: 后端已启动（生产模式）

```typescript
// 1. 配置真实API地址
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080

// 2. 启动应用
// 应用会：
// - 调用 GET /api/v1/homepage/config（如果后端已实现）
// - 调用 GET /api/v1/homepage/featured-users
// - 调用 GET /api/v1/homepage/services
// - 调用 GET /api/v1/homepage/banner

// 3. 查看结果
// - 成功：显示真实后端数据
// - 失败：显示降级默认数据（无需担心白屏）
```

### 场景2: 后端未启动（降级模式）

```typescript
// 应用会：
// 1. 尝试调用后端API
// 2. 检测到404或网络错误
// 3. 自动切换到降级方案
// 4. 使用homepageApiEnhanced中的默认数据
// 5. 用户无感知，正常使用应用

// 降级策略：
// - getHomepageConfig() → getDefaultConfig()
// - getFeaturedUsers() → getFeaturedUsersFallback()
// - getServiceItems() → getDefaultServices()
// - getBannerData() → getDefaultBanner()
```

### 场景3: 部分接口可用（混合模式）

```typescript
// 假设情况：
// - /api/v1/users/list 已实现 ✅
// - /api/v1/homepage/config 未实现 ❌

// 应用会：
// 1. 配置接口404 → 使用默认配置
// 2. 用户列表接口200 → 使用真实数据
// 3. 两者混合，应用正常运行
```

---

## 🔧 **API调用示例**

### 在组件中调用

```typescript
import { homepageApiEnhanced } from '@/services/api/homepageApiEnhanced';

// 方式1: 直接调用API（不推荐，应使用Store）
async function loadData() {
  try {
    const response = await homepageApiEnhanced.getFeaturedUsers({
      limit: 10,
      cityId: 440300, // 深圳
    });
    
    if (response.success) {
      console.log('精选用户:', response.data);
    }
  } catch (error) {
    console.error('加载失败:', error);
  }
}

// 方式2: 通过Store调用（推荐）
import { useHomepageStore } from '@/stores/homepageStore';

function MyComponent() {
  const { pageData, loadFeaturedUsers } = useHomepageStore();
  
  useEffect(() => {
    loadFeaturedUsers();
  }, []);
  
  return (
    <View>
      {pageData?.featuredUsers.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### 在useHomeState中调用

```typescript
// useHomeState.ts已更新为调用真实API

import { homepageApiEnhanced } from '@/services/api/homepageApiEnhanced';

const loadUsers = useCallback(async (filter, region) => {
  setLoading(true);
  try {
    // 🆕 调用真实API
    const response = await homepageApiEnhanced.getUserList({
      filterTab: filter,
      region,
      page: 1,
      limit: 20,
    });
    
    if (response.success) {
      setUsers(response.data.users);
    }
  } catch (error) {
    console.error('加载用户失败:', error);
    // 降级为模拟数据
    setUsers(generateMockUsers(filter, region));
  } finally {
    setLoading(false);
  }
}, []);
```

---

## 🎨 **降级策略说明**

### 为什么需要降级？

1. **后端接口未完成** - 前端可以先开发调试
2. **网络不稳定** - 用户体验不会中断
3. **后端服务异常** - 应用仍然可用
4. **开发效率** - 前后端可并行开发

### 降级触发条件

```typescript
// 1. HTTP 404 - 接口未实现
if (error?.response?.status === 404) {
  return this.getDefaultConfig();
}

// 2. 网络错误
if (error.message === 'Network Error') {
  return this.getDefaultData();
}

// 3. 超时错误
if (error.code === 'ECONNABORTED') {
  return this.getCachedData() || this.getDefaultData();
}
```

### 降级数据来源

1. **硬编码默认数据** - homepageApiEnhanced中的`getDefault*`方法
2. **本地缓存数据** - AsyncStorage中的历史数据
3. **模拟数据生成器** - useHomeState中的`generateMockUsers`

---

## 🧪 **测试后端集成**

### 测试清单

#### ✅ **配置接口测试**

```bash
# 1. 测试后端配置接口
curl http://localhost:8080/api/v1/homepage/config

# 期望结果：
{
  "code": 200,
  "msg": "success",
  "data": {
    "topFunction": { "enabled": true, ... },
    "gameBanner": { "enabled": true, ... },
    ...
  }
}

# 2. 前端验证
# - 打开应用
# - 查看控制台日志："[HomepageStore] 页面配置加载成功"
# - 检查网络请求：devtools → Network → /api/v1/homepage/config
```

#### ✅ **精选用户接口测试**

```bash
# 1. 测试后端精选用户接口
curl http://localhost:8080/api/v1/homepage/featured-users?limit=10

# 期望结果：
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "userId": 1,
      "nickname": "用户A",
      "avatar": "http://...",
      "isRealVerified": true,
      ...
    }
  ]
}

# 2. 前端验证
# - 打开首页
# - 查看"限时专享"区域
# - 应显示真实用户数据（头像、昵称、标签）
```

#### ✅ **降级方案测试**

```bash
# 1. 关闭后端服务

# 2. 打开应用
# - 应看到控制台警告："配置接口未实现，使用默认配置"
# - 应看到控制台警告："精选用户接口未实现，使用降级方案"
# - 页面仍然正常显示（使用默认数据）

# 3. 验证降级逻辑
# - 检查网络请求：应该看到失败的请求
# - 检查数据显示：应该看到默认的10个服务图标
# - 检查用户体验：无白屏、无崩溃
```

---

## 🐛 **常见问题**

### Q1: 为什么看到"使用默认配置"的警告？

**A**: 这是正常的降级行为，表示：
- 后端`/api/v1/homepage/config`接口未实现或返回404
- 前端自动使用默认配置
- 不影响功能使用

**解决方案**:
1. 检查后端服务是否启动
2. 检查`HomepageController.java`是否已创建
3. 检查网关路由配置

### Q2: 用户列表为空怎么办？

**A**: 检查以下几点：

1. **后端数据库有数据吗？**
   ```sql
   SELECT COUNT(*) FROM user_profile;
   -- 应该 > 0
   ```

2. **API调用成功了吗？**
   - 查看Network请求
   - 查看响应数据

3. **数据转换正确吗？**
   - 检查UserDataAdapter.transformUserList()
   - 检查字段映射

### Q3: 如何调试API调用？

**A**: 开启调试模式：

```typescript
// services/api/client.ts

// 添加请求日志
apiClient.interceptors.request.use(config => {
  console.log('[API Request]', config.method, config.url, config.params);
  return config;
});

// 添加响应日志
apiClient.interceptors.response.use(response => {
  console.log('[API Response]', response.config.url, response.data);
  return response;
});
```

### Q4: 距离计算不准确？

**A**: 当前限制和解决方案：

**问题原因**:
- 后端`UserProfileVO`暂时没有`latitude`和`longitude`字段
- `UserDataAdapter.calculateDistance()`返回随机值

**临时方案**:
- 使用模拟距离（开发阶段可接受）

**完整方案**（需要后端配合）:
1. 后端在`HomepageUserVO`中添加`latitude`和`longitude`字段
2. 后端在SQL查询中包含距离计算
3. 前端直接使用后端返回的`distance`值

```java
// 后端SQL示例
SELECT 
  up.*,
  ST_X(up.location) AS longitude,
  ST_Y(up.location) AS latitude,
  ST_Distance_Sphere(
    up.location,
    ST_GeomFromText('POINT(? ?)', 4326)
  ) / 1000 AS distance
FROM user_profile up
...
```

### Q5: 如何切换到Mock模式？

**A**: 修改环境变量：

```env
# .env.development
EXPO_PUBLIC_API_ENV=mock
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# 然后启动MSW服务（如果已配置）
npm run mock-server
```

---

## 📝 **代码示例**

### 示例1: 获取用户列表

```typescript
import { homepageApiEnhanced } from '@/services/api/homepageApiEnhanced';

async function loadNearbyUsers() {
  try {
    const response = await homepageApiEnhanced.getUserList({
      filterTab: 'nearby',
      longitude: 114.0579, // 深圳经度
      latitude: 22.5431,   // 深圳纬度
      radius: 5000,        // 5km范围
      page: 1,
      limit: 20,
    });
    
    if (response.success) {
      console.log('附近用户:', response.data.users.length, '个');
      console.log('总数:', response.data.total);
      console.log('是否有更多:', response.data.hasMore);
    }
  } catch (error) {
    console.error('加载失败:', error);
  }
}
```

### 示例2: 获取精选用户

```typescript
async function loadFeaturedUsers() {
  const response = await homepageApiEnhanced.getFeaturedUsers({
    limit: 10,
    cityId: 440300, // 深圳市
    refresh: true,  // 强制刷新，不使用缓存
  });
  
  if (response.success) {
    response.data.forEach(user => {
      console.log(`${user.username} - ${user.rating}星 - ${user.services.join(',')}`);
    });
  }
}
```

### 示例3: 在Store中使用

```typescript
// stores/homepageStore.ts

// ✅ 已更新的loadFeaturedUsers方法
loadFeaturedUsers: async () => {
  const { setLoading, setError } = get();
  
  try {
    setLoading('featuredUsers', true);
    setError('featuredUsers', null);
    
    // 调用API
    const response = await homepageApiEnhanced.getFeaturedUsers({
      limit: 10,
      refresh: false,
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // 更新状态
    set(state => ({
      pageData: state.pageData ? {
        ...state.pageData,
        featuredUsers: response.data.map(user => ({
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          tags: user.services,
          price: parseFloat(user.price?.replace(/[^\d.]/g, '') || '0'),
          rating: user.rating || 0,
        })),
      } : null,
    }));
  } catch (error) {
    setError('featuredUsers', error.message);
  } finally {
    setLoading('featuredUsers', false);
  }
}
```

---

## 🔄 **数据更新机制**

### 自动更新

```typescript
// MainPage初始化时自动加载
useEffect(() => {
  homepageStore.loadPageConfig();
  homepageStore.loadPageData();
  homepageStore.loadFeaturedUsers();
}, []);

// 页面重新聚焦时增量更新
useFocusEffect(
  useCallback(() => {
    // 只刷新动态数据
    homepageStore.loadFeaturedUsers();
  }, [])
);
```

### 手动刷新

```typescript
// 下拉刷新触发
const handleRefresh = async () => {
  setRefreshing(true);
  
  await Promise.all([
    homepageStore.loadPageData(),
    homepageStore.loadFeaturedUsers(),
    // 用户列表通过useHomeState刷新
  ]);
  
  setRefreshing(false);
};
```

---

## 🎯 **后端开发建议**

### 接口实现优先级

#### 🔴 **本周必须完成**（核心功能）

1. **用户列表接口**
   ```
   GET /api/v1/homepage/users/list
   - 支持分页
   - 支持基础筛选（城市、性别、年龄）
   - 返回HomepageUserVO（包含统计数据）
   ```

2. **精选用户接口**
   ```
   GET /api/v1/homepage/featured-users
   - 查询实名认证+VIP+高评分用户
   - 限制10-20个
   - 按评分排序
   ```

3. **页面配置接口**
   ```
   GET /api/v1/homepage/config
   - 返回硬编码配置即可
   - 后续可改为从数据库读取
   ```

#### 🟡 **下周完成**（增强功能）

4. **附近用户接口**（空间索引查询）
5. **推荐算法接口**
6. **横幅配置接口**

#### 🟢 **后续优化**（可选功能）

7. **统计数据接口**
8. **热门搜索接口**
9. **埋点统计接口**

### SQL优化建议

```sql
-- 1. 确保空间索引存在
ALTER TABLE user_profile ADD SPATIAL INDEX idx_location (location);

-- 2. 确保常用查询字段有索引
CREATE INDEX idx_city_status ON user_profile(city_id, online_status, is_real_verified);
CREATE INDEX idx_vip_popular ON user_profile(is_vip, is_popular, vip_level);
CREATE INDEX idx_created_completeness ON user_profile(created_at DESC, profile_completeness DESC);

-- 3. 优化关联查询
-- 使用LEFT JOIN而不是多次查询
-- 在查询时就关联user_stats和user_occupation
```

---

## 📊 **性能监控**

### 前端监控点

```typescript
// 记录API调用时间
const startTime = Date.now();
const response = await homepageApiEnhanced.getUserList(params);
const duration = Date.now() - startTime;

console.log('[Performance] getUserList耗时:', duration, 'ms');

// 期望指标：
// - 配置接口: < 100ms
// - 用户列表: < 500ms
// - 精选用户: < 300ms
```

### 后端监控点

```java
// 在Controller中添加性能监控
@GetMapping("/featured-users")
public R<List<HomepageUserVO>> getFeaturedUsers(...) {
    long startTime = System.currentTimeMillis();
    
    List<HomepageUserVO> users = homepageService.getFeaturedUsers(...);
    
    long duration = System.currentTimeMillis() - startTime;
    log.info("[Performance] getFeaturedUsers耗时: {}ms", duration);
    
    return R.ok(users);
}

// 期望指标：
// - 简单查询: < 100ms
// - 复杂关联: < 300ms
// - 空间索引: < 200ms
```

---

## 🔗 **相关文档**

- 📖 [后端集成方案](./BACKEND_INTEGRATION_PLAN.md) - 完整技术方案
- 📖 [集成状态跟踪](./BACKEND_INTEGRATION_STATUS.md) - 当前进度
- 📖 [后端Controller参考](../../../RuoYi-Cloud-Plus/xypai-user/HOMEPAGE_CONTROLLER_REFERENCE.md) - 后端实现参考
- 📖 [首页模块架构](./HOMEPAGE_MODULE_ARCHITECTURE.md) - 完整架构文档

---

## 💡 **最佳实践**

### ✅ **DO - 推荐做法**

1. **使用Store管理数据** - 不要在组件中直接调用API
2. **处理所有错误** - try-catch + 错误状态显示
3. **使用降级方案** - 接口失败时提供默认数据
4. **记录详细日志** - console.log/console.error帮助调试
5. **测试各种场景** - 成功、失败、超时、网络错误

### ❌ **DON'T - 避免做法**

1. **不要忽略错误** - 会导致白屏或崩溃
2. **不要硬编码URL** - 使用API_ENDPOINTS常量
3. **不要跳过降级** - 会影响开发效率
4. **不要阻塞UI** - 使用异步加载和加载状态
5. **不要假设数据一定存在** - 使用可选链和默认值

---

## 🎊 **成功标志**

当你看到以下现象，说明集成成功：

### ✅ **配置加载成功**
- 控制台: `[HomepageStore] 页面配置加载成功`
- 页面: 所有区域正常显示

### ✅ **精选用户加载成功**
- 控制台: `[HomepageStore] 精选用户加载成功: X个`
- 页面: "限时专享"区域显示真实用户

### ✅ **降级方案工作**
- 控制台: `[HomepageAPI] 配置接口未实现，使用默认配置`
- 页面: 仍然正常显示（无白屏）

### ✅ **错误处理正常**
- 网络错误时: 显示错误提示 + 重试按钮
- 数据为空时: 显示空状态页面
- 加载中时: 显示加载指示器

---

**创建时间**: 2025-10-22  
**更新时间**: 2025-10-22  
**维护者**: AI协作团队

🎉 **恭喜！你已经了解如何使用后端集成功能！**


