# 🐛 首页模块调试指南

> **完整的调试流程和日志查看指南**
> 
> **创建时间**: 2025-10-22  
> **适用版本**: v2.0+

---

## 📱 **数据加载完整流程**

### 🔄 **进入首页时的自动加载**

当用户打开应用进入首页时，会**自动触发**以下数据加载流程：

```
1️⃣ 应用启动
    ↓
app/(tabs)/homepage/index.tsx
    └── <MainPage />
    ↓
2️⃣ MainPage组件挂载
    ↓
useMainPageLogic() Hook执行
    └── 📝 日志: "🎬 MainPage组件已挂载"
    ↓
3️⃣ useHomeState() Hook执行
    └── 📝 日志: "📱 首页初始化数据加载"
    ↓
4️⃣ useEffect触发（组件挂载时）
    ├── loadUsers()           ← 加载用户列表
    └── loadLimitedOffers()   ← 加载精选用户
    ↓
5️⃣ loadUsers()执行
    ├── 📝 日志: "🔄 开始加载用户列表"
    ├── 📝 日志: "📡 调用API: getUserList"
    ├── 🌐 调用homepageApiEnhanced.getUserList()
    ├── 🔄 如果API成功
    │   ├── 📝 日志: "✅ API加载成功"
    │   └── setUsers(真实数据)
    ├── 🔄 如果API失败（404/超时/网络错误）
    │   ├── 📝 日志: "⚠️ API调用失败，使用降级方案"
    │   ├── 📝 日志: "🔄 使用模拟数据生成用户列表"
    │   └── setUsers(模拟数据)
    └── 📝 日志: "⚡ loadUsers: XXms"
    ↓
6️⃣ loadLimitedOffers()执行
    ├── 📝 日志: "🔄 开始加载限时专享用户"
    ├── 📝 日志: "📡 调用API: getFeaturedUsers"
    ├── 🌐 调用homepageApiEnhanced.getFeaturedUsers()
    ├── 🔄 成功/失败处理（同上）
    └── 📝 日志: "⚡ loadLimitedOffers: XXms"
    ↓
7️⃣ 数据加载完成
    ├── 📝 日志: "✅ 初始化加载完成"
    ├── React状态更新
    └── 组件重新渲染
    ↓
8️⃣ 用户看到数据
    ├── UserListArea显示用户列表（20个用户）
    ├── LimitedOffersArea显示精选用户（5个用户）
    └── 其他区域正常显示
```

---

## 🔍 **查看调试日志**

### 📱 **在React Native Debugger中查看**

1. **打开应用**
   ```bash
   npm start
   # 按 'd' 打开开发菜单
   # 选择 "Debug Remote JS"
   ```

2. **打开Chrome DevTools**
   - 访问: `http://localhost:19000/debugger-ui/`
   - 或在React Native Debugger中查看

3. **查看控制台日志**
   ```
   控制台会显示类似以下日志：
   
   📂 🏠 MainPage组件生命周期
     [22:30:15.123] [MainPage] ✅ INFO 🎬 MainPage组件已挂载 {initialFilter: undefined, initialRegion: undefined}
   
   📂 📱 首页初始化数据加载
     [22:30:15.125] [useHomeState] ✅ INFO 🚀 开始初始化加载 {activeFilter: "nearby", activeRegion: "全部", location: "深圳"}
     [22:30:15.126] [useHomeState] ✅ INFO 🔄 开始加载用户列表 {filter: "nearby", region: "全部"}
     [22:30:15.127] [useHomeState] 🔍 DEBUG 📡 调用API: getUserList
     [22:30:15.128] [useHomeState] ✅ INFO 🔄 开始加载限时专享用户
     [22:30:15.129] [useHomeState] 🔍 DEBUG 📡 调用API: getFeaturedUsers
     
     # 如果后端未启动
     [22:30:15.500] [useHomeState] ⚠️  WARN ⚠️ API调用失败，使用降级方案
     [22:30:15.501] [useHomeState] ✅ INFO 🔄 使用模拟数据生成用户列表
     [22:30:16.001] [useHomeState] ✅ INFO ✅ 模拟数据加载完成 {count: 20}
     [22:30:16.002] [useHomeState] ⚡ PERFORMANCE ⚡ loadUsers: 500ms
     
     # 如果后端已启动
     [22:30:15.300] [useHomeState] ✅ INFO ✅ API加载成功 {count: 20, total: 100, hasMore: true}
     [22:30:15.301] [useHomeState] ⚡ PERFORMANCE 🚀 loadUsers: 175ms
     
     [22:30:16.100] [useHomeState] ✅ INFO ✅ 初始化加载完成
   ```

### 🔎 **日志级别说明**

| 级别 | Emoji | 颜色 | 用途 | 开发环境 | 生产环境 |
|------|------|------|------|---------|----------|
| **DEBUG** | 🔍 | 青色 | 详细调试信息 | ✅ 显示 | ❌ 隐藏 |
| **INFO** | ✅ | 绿色 | 一般信息 | ✅ 显示 | ❌ 隐藏 |
| **WARN** | ⚠️ | 黄色 | 警告信息 | ✅ 显示 | ✅ 显示 |
| **ERROR** | 🚨 | 红色 | 错误信息 | ✅ 显示 | ✅ 显示 |

### 📊 **日志前缀说明**

| 前缀 | 说明 | 示例 |
|------|------|------|
| **🌐 API** | API调用相关 | `📡 调用API: getUserList` |
| **📦 STORE** | Store状态更新 | `📝 更新用户交互状态` |
| **🎨 COMPONENT** | 组件生命周期 | `🎬 MainPage组件已挂载` |
| **🧭 NAVIGATION** | 页面导航 | `🧭 导航: 首页 → 搜索页面` |
| **⚡ PERFORMANCE** | 性能监控 | `⚡ loadUsers: 175ms` |

---

## 🔬 **调试场景**

### 场景1: 检查数据是否成功加载

**查看日志**:
```javascript
// 成功标志
✅ INFO ✅ API加载成功 {count: 20}
✅ INFO ✅ 初始化加载完成

// 失败标志
⚠️  WARN ⚠️ API调用失败，使用降级方案
🚨 ERROR ❌ 加载用户失败
```

**检查步骤**:
1. 打开控制台
2. 搜索关键词: "初始化加载"
3. 查看是否有"✅ 初始化加载完成"
4. 如果有警告，查看降级方案是否生效

### 场景2: 检查API是否被调用

**查看日志**:
```javascript
// API调用日志
🔍 DEBUG 📡 调用API: getUserList
🌐 API GET /api/v1/homepage/users/list {params: {...}}
✅ API 200 /api/v1/homepage/users/list {data: {...}}

// 或者
⚠️  WARN Network request failed
```

**检查步骤**:
1. 搜索: "调用API"
2. 查看是否有API请求日志
3. 查看请求参数是否正确
4. 查看响应状态码和数据

### 场景3: 检查降级方案是否工作

**查看日志**:
```javascript
⚠️  WARN ⚠️ API调用失败，使用降级方案
✅ INFO 🔄 使用模拟数据生成用户列表
✅ INFO ✅ 模拟数据加载完成 {count: 20}
```

**验证方法**:
1. 关闭后端服务
2. 打开应用
3. 应该看到警告日志
4. 但页面仍然显示数据（模拟数据）
5. 无白屏、无崩溃

### 场景4: 检查下拉刷新

**操作**: 在首页下拉

**查看日志**:
```javascript
✅ INFO 🔄 用户触发下拉刷新
✅ INFO 🔄 开始加载用户列表 {filter: "nearby", region: "全部"}
✅ INFO 🔄 开始加载限时专享用户
✅ INFO ✅ 刷新完成
```

### 场景5: 检查筛选切换

**操作**: 点击"推荐"标签

**查看日志**:
```javascript
📝 DEBUG 📝 更新用户交互状态 {selectedFilter: "recommend"}
✅ INFO 🔄 开始加载用户列表 {filter: "recommend", region: "全部"}
📊 DEBUG 📊 状态更新 {users: 20, activeFilter: "recommend"}
```

### 场景6: 检查搜索功能

**操作**: 在搜索框输入"陪玩"

**查看日志**:
```javascript
🔍 DEBUG 🔍 搜索关键词变化 {query: "陪玩"}
# 300ms防抖后
✅ INFO 🔍 执行搜索 {query: "陪玩", filter: "nearby", region: "全部"}
✅ INFO ✅ 本地搜索完成 {count: 5}
```

---

## 🛠️ **调试工具**

### 工具1: 日志过滤

```javascript
// 在控制台中过滤特定模块日志
// 搜索框输入: [useHomeState]
// 只显示useHomeState模块的日志

// 过滤特定级别
// 搜索: ERROR
// 只显示错误日志

// 过滤特定操作
// 搜索: 调用API
// 只显示API调用日志
```

### 工具2: 性能监控

所有耗时操作都会自动记录性能日志：

```javascript
⚡ PERFORMANCE 🚀 loadUsers: 175ms       // 快速（< 100ms）
⚡ PERFORMANCE ⚡ loadUsers: 350ms       // 正常（100-500ms）
⚡ PERFORMANCE 🐌 loadUsers: 1200ms     // 慢速（> 500ms）
```

**性能标准**:
- 🚀 优秀: < 100ms
- ⚡ 良好: 100-500ms
- 🐌 需优化: > 500ms

### 工具3: 分组日志

重要流程使用分组日志，方便查看：

```javascript
📂 🏠 MainPage组件生命周期
  ✅ INFO 🎬 MainPage组件已挂载
  📊 DEBUG 📊 状态更新
  ✅ INFO 🎬 MainPage组件已卸载

📂 📱 首页初始化数据加载
  ✅ INFO 🚀 开始初始化加载
  ✅ INFO 🔄 开始加载用户列表
  ✅ INFO ✅ 初始化加载完成
```

---

## 🎯 **常见问题诊断**

### 问题1: 页面一直显示加载中

**症状**: UserListArea一直显示"加载中..."

**查看日志**:
```javascript
# 应该看到
✅ INFO 🔄 开始加载用户列表

# 但是没有看到
✅ INFO ✅ API加载成功  # 或
✅ INFO ✅ 模拟数据加载完成
```

**可能原因**:
1. API调用卡住（超时）
2. 数据转换出错
3. useState未正确更新

**解决方法**:
1. 检查网络请求是否完成
2. 查看是否有ERROR日志
3. 检查try-catch是否捕获错误

### 问题2: 数据为空

**症状**: 用户列表显示"暂无用户"

**查看日志**:
```javascript
✅ INFO ✅ API加载成功 {count: 0}  # ← 注意count为0
# 或
✅ INFO ✅ 模拟数据加载完成 {count: 0}
```

**可能原因**:
1. 后端返回空数据
2. 筛选条件过滤掉所有数据
3. 数据转换返回空数组

**解决方法**:
1. 检查后端数据库是否有数据
2. 检查API响应中rows/data字段
3. 检查UserDataAdapter转换逻辑

### 问题3: API调用失败

**症状**: 看到降级方案日志

**查看日志**:
```javascript
⚠️  WARN ⚠️ API调用失败，使用降级方案 Network Error
```

**可能原因**:
1. 后端服务未启动
2. API地址配置错误
3. 网络不通
4. 接口未实现（404）

**解决方法**:
```bash
# 1. 检查后端服务
curl http://localhost:8080/api/v1/users/list

# 2. 检查API地址
echo $EXPO_PUBLIC_API_BASE_URL

# 3. 检查网络
ping 192.168.1.100

# 4. 查看完整错误信息
# 在日志中找ERROR级别的详细错误
```

### 问题4: 距离显示为0

**症状**: 所有用户距离显示"0.0km"

**查看日志**:
```javascript
# 检查是否有警告
⚠️  WARN 后端UserProfileVO暂时没有latitude和longitude字段
```

**原因**: 后端VO缺少经纬度字段

**临时方案**: 使用模拟距离（开发阶段可接受）

**完整方案**: 需要后端添加字段（见BACKEND_INTEGRATION_PLAN.md）

---

## 📝 **启用调试日志**

### 方法1: 修改logger配置

编辑 `src/utils/logger.ts`:

```typescript
const LOG_CONFIG = {
  level: LogLevel.DEBUG,  // ← 改为DEBUG级别
  enableColors: true,
  showTimestamp: true,
  showLocation: true,     // ← 显示文件位置
};
```

### 方法2: 环境变量控制（推荐）

```env
# .env.development
EXPO_PUBLIC_LOG_LEVEL=DEBUG
EXPO_PUBLIC_ENABLE_PERFORMANCE_LOG=true
EXPO_PUBLIC_ENABLE_API_LOG=true
```

然后在logger.ts中读取：

```typescript
const LOG_CONFIG = {
  level: process.env.EXPO_PUBLIC_LOG_LEVEL === 'DEBUG' 
    ? LogLevel.DEBUG 
    : LogLevel.INFO,
  // ...
};
```

---

## 🔧 **手动触发数据加载**

### 在代码中手动调用

```typescript
import { useHomepageStore } from '@/stores/homepageStore';

function DebugComponent() {
  const { loadPageConfig, loadPageData, loadFeaturedUsers } = useHomepageStore();
  
  return (
    <View>
      <Button 
        title="重新加载配置"
        onPress={() => {
          console.log('🔄 手动触发: loadPageConfig');
          loadPageConfig();
        }}
      />
      <Button 
        title="重新加载数据"
        onPress={() => {
          console.log('🔄 手动触发: loadPageData');
          loadPageData();
        }}
      />
      <Button 
        title="重新加载精选用户"
        onPress={() => {
          console.log('🔄 手动触发: loadFeaturedUsers');
          loadFeaturedUsers();
        }}
      />
    </View>
  );
}
```

### 在React Native Debugger中

```javascript
// 在控制台执行

// 方式1: 直接调用Store
const store = require('@/stores/homepageStore').useHomepageStore.getState();
store.loadPageConfig();
store.loadPageData();
store.loadFeaturedUsers();

// 方式2: 直接调用API
const api = require('@/services/api/homepageApiEnhanced').default;
api.getUserList({ filterTab: 'nearby', page: 1, limit: 20 })
  .then(res => console.log('API结果:', res));
```

---

## 📊 **完整日志示例**

### 成功场景（后端已启动）

```javascript
[22:30:15.123] [MainPage] ✅ INFO 🎬 MainPage组件已挂载 {initialFilter: undefined}
[22:30:15.125] [useHomeState] ✅ INFO 🚀 开始初始化加载 {activeFilter: "nearby"}
[22:30:15.126] [useHomeState] ✅ INFO 🔄 开始加载用户列表 {filter: "nearby"}
[22:30:15.127] [useHomeState] 🔍 DEBUG 📡 调用API: getUserList
[22:30:15.128] [API] 🔍 DEBUG 🌐 API GET /api/v1/homepage/users/list {params: {filterTab: "nearby"}}
[22:30:15.300] [API] 🔍 DEBUG ✅ 200 /api/v1/homepage/users/list {data: {users: Array(20)}}
[22:30:15.301] [useHomeState] ✅ INFO ✅ API加载成功 {count: 20, total: 100, hasMore: true}
[22:30:15.302] [useHomeState] ⚡ PERFORMANCE 🚀 loadUsers: 176ms
[22:30:15.310] [useHomeState] ✅ INFO 🔄 开始加载限时专享用户
[22:30:15.311] [useHomeState] 🔍 DEBUG 📡 调用API: getFeaturedUsers
[22:30:15.450] [useHomeState] ✅ INFO ✅ 精选用户API加载成功 {count: 5}
[22:30:15.451] [useHomeState] ⚡ PERFORMANCE 🚀 loadLimitedOffers: 141ms
[22:30:15.500] [useHomeState] ✅ INFO ✅ 初始化加载完成
[22:30:15.501] [MainPage] 📊 DEBUG 📊 状态更新 {users: 20, limitedOffers: 5}
```

### 降级场景（后端未启动）

```javascript
[22:30:15.123] [MainPage] ✅ INFO 🎬 MainPage组件已挂载
[22:30:15.125] [useHomeState] ✅ INFO 🚀 开始初始化加载
[22:30:15.126] [useHomeState] ✅ INFO 🔄 开始加载用户列表
[22:30:15.127] [useHomeState] 🔍 DEBUG 📡 调用API: getUserList
[22:30:15.128] [API] 🔍 DEBUG 🌐 API GET /api/v1/homepage/users/list
[22:30:25.130] [API] 🚨 ERROR Network Error: timeout
[22:30:25.131] [useHomeState] ⚠️  WARN ⚠️ API调用失败，使用降级方案 Network Error
[22:30:25.132] [useHomeState] ✅ INFO 🔄 使用模拟数据生成用户列表
[22:30:25.632] [useHomeState] ✅ INFO ✅ 模拟数据加载完成 {count: 20}
[22:30:25.633] [useHomeState] ⚡ PERFORMANCE ⚡ loadUsers: 507ms
[22:30:25.640] [useHomeState] ✅ INFO 🔄 开始加载限时专享用户
[22:30:26.140] [useHomeState] ✅ INFO ✅ 模拟数据加载完成 {count: 5}
[22:30:26.200] [useHomeState] ✅ INFO ✅ 初始化加载完成
```

---

## 🎨 **添加自定义日志**

### 在组件中添加日志

```typescript
import { createLogger } from '@/src/utils/logger';

const logger = createLogger('MyComponent');

function MyComponent() {
  useEffect(() => {
    logger.info('组件挂载');
    
    return () => {
      logger.info('组件卸载');
    };
  }, []);
  
  const handleClick = () => {
    logger.debug('用户点击按钮');
    // ...
  };
  
  return <Button onPress={handleClick} />;
}
```

### 在API中添加日志

```typescript
import { apiLogger } from '@/src/utils/logger';

async function myApiCall() {
  apiLogger.apiRequest('GET', '/api/v1/my-endpoint', { param: 'value' });
  
  const response = await fetch(url);
  
  apiLogger.apiResponse('/api/v1/my-endpoint', response.status, response.data);
}
```

### 性能监控

```typescript
import { measurePerformance } from '@/src/utils/logger';

async function expensiveOperation() {
  const perf = measurePerformance('expensiveOperation');
  
  // 执行耗时操作
  await doSomething();
  
  perf.end(); // 自动输出: ⚡ PERFORMANCE expensiveOperation: XXms
}
```

---

## 📈 **日志最佳实践**

### ✅ **DO - 推荐做法**

1. **在关键操作添加日志**
   ```typescript
   logger.info('🔄 开始加载数据');
   const data = await loadData();
   logger.info('✅ 数据加载成功', { count: data.length });
   ```

2. **使用性能监控**
   ```typescript
   const perf = measurePerformance('operation');
   await doOperation();
   perf.end();
   ```

3. **使用分组日志**
   ```typescript
   logger.groupStart('复杂流程');
   logger.info('步骤1');
   logger.info('步骤2');
   logger.groupEnd();
   ```

4. **错误日志包含上下文**
   ```typescript
   logger.error('加载失败', { userId, filter, error });
   ```

### ❌ **DON'T - 避免做法**

1. **不要过度日志**
   ```typescript
   // ❌ 太多了
   logger.debug('进入函数');
   logger.debug('创建变量');
   logger.debug('调用方法');
   logger.debug('退出函数');
   ```

2. **不要在循环中打日志**
   ```typescript
   // ❌ 性能问题
   users.forEach(user => {
     logger.debug('处理用户', user);
   });
   
   // ✅ 改为
   logger.debug('批量处理用户', { count: users.length });
   ```

3. **不要记录敏感信息**
   ```typescript
   // ❌ 安全问题
   logger.debug('用户登录', { password: '123456' });
   
   // ✅ 改为
   logger.debug('用户登录', { userId: '***' });
   ```

---

## 🎓 **调试技巧**

### 技巧1: 快速定位问题

1. 打开控制台
2. 搜索 "ERROR" 或 "❌"
3. 查看错误日志和堆栈
4. 向上查找相关的INFO/DEBUG日志

### 技巧2: 追踪数据流

1. 搜索 "开始加载"
2. 跟踪整个加载过程
3. 查看每个步骤的日志
4. 找到失败的环节

### 技巧3: 性能分析

1. 搜索 "PERFORMANCE"
2. 查看所有性能日志
3. 找出耗时最长的操作
4. 针对性优化

### 技巧4: 导出日志

```javascript
// 在控制台执行
copy(console.logs);  // 复制所有日志

// 或者使用右键 → Save as... 保存日志到文件
```

---

## 📦 **日志输出示例文件**

创建文件 `homepage-debug-log.txt` 保存调试日志：

```
=== 首页模块调试日志 ===
时间: 2025-10-22 22:30:15
环境: development
API: http://localhost:8080

[22:30:15.123] [MainPage] ✅ INFO 🎬 MainPage组件已挂载
[22:30:15.125] [useHomeState] ✅ INFO 🚀 开始初始化加载
[22:30:15.126] [useHomeState] ✅ INFO 🔄 开始加载用户列表 {filter: "nearby", region: "全部"}
[22:30:15.127] [useHomeState] 🔍 DEBUG 📡 调用API: getUserList
[22:30:15.300] [useHomeState] ✅ INFO ✅ API加载成功 {count: 20, total: 100}
[22:30:15.302] [useHomeState] ⚡ PERFORMANCE 🚀 loadUsers: 176ms
[22:30:15.310] [useHomeState] ✅ INFO 🔄 开始加载限时专享用户
[22:30:15.450] [useHomeState] ✅ INFO ✅ 精选用户API加载成功 {count: 5}
[22:30:15.500] [useHomeState] ✅ INFO ✅ 初始化加载完成

=== 用户交互日志 ===
[22:30:25.100] [MainPage] ✅ INFO 🧭 导航: 首页 → 用户详情 {userId: "1", username: "用户A"}
[22:30:35.200] [useHomeState] ✅ INFO 🔄 用户触发下拉刷新
[22:30:36.000] [useHomeState] ✅ INFO ✅ 刷新完成

=== 性能统计 ===
loadUsers: 176ms
loadLimitedOffers: 141ms
总加载时间: 375ms
```

---

## 🔗 **相关文档**

- 📖 [后端集成状态](./BACKEND_INTEGRATION_STATUS.md) - 查看集成进度
- 📖 [后端集成指南](./BACKEND_INTEGRATION_GUIDE.md) - API使用指南
- 📖 [后端集成方案](./BACKEND_INTEGRATION_PLAN.md) - 技术方案
- 📖 [Logger工具文档](../../../src/utils/logger.ts) - 日志工具API

---

## ✅ **调试检查清单**

### 首次运行检查

- [ ] 打开应用，查看控制台
- [ ] 看到"🎬 MainPage组件已挂载"日志
- [ ] 看到"🚀 开始初始化加载"日志
- [ ] 看到"开始加载用户列表"日志
- [ ] 看到"开始加载限时专享用户"日志
- [ ] 看到"✅ 初始化加载完成"日志
- [ ] 页面显示数据（真实或模拟）

### API集成检查

- [ ] 后端服务已启动
- [ ] API地址配置正确
- [ ] 看到"📡 调用API"日志
- [ ] 看到"✅ API加载成功"日志
- [ ] 数据格式正确转换
- [ ] 用户列表正确显示

### 降级方案检查

- [ ] 关闭后端服务
- [ ] 重启应用
- [ ] 看到"⚠️ API调用失败"警告
- [ ] 看到"使用降级方案"日志
- [ ] 页面仍然显示模拟数据
- [ ] 无白屏、无崩溃

### 性能检查

- [ ] 查看所有PERFORMANCE日志
- [ ] loadUsers < 500ms
- [ ] loadLimitedOffers < 300ms
- [ ] 总加载时间 < 2秒
- [ ] 无明显卡顿

---

**创建时间**: 2025-10-22  
**最后更新**: 2025-10-22  
**维护者**: AI协作团队

🎉 **现在你可以通过详细的日志清楚地看到首页数据加载的整个过程！**


