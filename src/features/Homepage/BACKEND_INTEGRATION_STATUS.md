# 🔗 首页模块后端集成状态

> **实时跟踪后端API对接进度**
> 
> **创建时间**: 2025-10-22  
> **最后更新**: 2025-10-22

---

## 📊 **总体进度**

| 模块 | 完成度 | 状态 | 说明 |
|------|--------|------|------|
| **API配置层** | 90% | 🟢 已完成 | config.ts已更新，新增所有端点 |
| **数据适配层** | 80% | 🟢 已完成 | userAdapter.ts已创建 |
| **API服务层** | 70% | 🟡 进行中 | homepageApiEnhanced.ts已创建 |
| **Store集成** | 30% | 🟡 待更新 | 需要替换模拟数据为真实API |
| **组件更新** | 10% | 🔴 待开始 | 组件需要适配新的数据结构 |
| **后端接口** | 40% | 🟡 部分完成 | 用户/内容接口已有，首页专用接口待创建 |

**整体完成度**: 53% | **预计完成时间**: 3-5天

---

## ✅ **已完成工作**

### 1️⃣ **API配置更新** ✅

**文件**: `services/api/config.ts`

已完成：
- ✅ 更新BASE_URL为RuoYi-Cloud-Plus网关地址
- ✅ 新增HOMEPAGE端点（8个）
- ✅ 新增USER端点（6个）
- ✅ 新增CONTENT端点（8个）
- ✅ 新增COMMENT端点（7个）
- ✅ 新增INTERACTION端点（7个）
- ✅ 新增DRAFT端点（6个）
- ✅ 新增LOCATION端点（7个）
- ✅ 新增SERVICE端点（5个）
- ✅ 新增RELATION端点（5个）
- ✅ 新增ANALYTICS端点（3个）

### 2️⃣ **数据适配器** ✅

**文件**: `services/api/adapters/userAdapter.ts`

已完成：
- ✅ UserProfileVO类型定义（完整42字段）
- ✅ UserStatsVO类型定义
- ✅ UserOccupationVO类型定义
- ✅ ServiceStatsVO类型定义
- ✅ transformUserProfile方法（UserProfileVO → UserCard）
- ✅ transformUserList方法（批量转换）
- ✅ mapOnlineStatus方法（状态映射）
- ✅ extractServices方法（职业标签提取）
- ✅ formatPrice方法（价格格式化）
- ✅ calculateDistance方法（距离计算）
- ✅ filterFeaturedUsers方法（精选用户筛选）
- ✅ sortUsers方法（用户排序）

### 3️⃣ **增强API服务** ✅

**文件**: `services/api/homepageApiEnhanced.ts`

已完成：
- ✅ getUserList方法（集成多策略）
- ✅ getNearbyUsers方法（空间索引查询）
- ✅ getRecommendedUsers方法（推荐算法）
- ✅ getLatestUsers方法（最新用户）
- ✅ getFeaturedUsers方法（精选用户）
- ✅ getHomepageConfig方法（配置获取）
- ✅ getServiceItems方法（服务配置）
- ✅ getBannerData方法（横幅数据）
- ✅ 降级策略实现（接口未实现时使用默认数据）
- ✅ 错误处理和日志

### 4️⃣ **集成方案文档** ✅

**文件**: `src/features/Homepage/BACKEND_INTEGRATION_PLAN.md`

已完成：
- ✅ 后端数据结构分析
- ✅ 数据映射关系文档
- ✅ API适配层设计
- ✅ 数据转换示例
- ✅ 后端接口需求规格
- ✅ 性能优化方案
- ✅ 测试策略
- ✅ 实施检查清单

---

## 🟡 **进行中工作**

### 1️⃣ **homepageStore.ts更新** 🟡

**当前状态**: 使用模拟数据  
**目标**: 集成真实API调用

需要更新的方法：
- [ ] loadPageConfig → 调用homepageApiEnhanced.getHomepageConfig()
- [ ] loadPageData → 调用homepageApiEnhanced.getHomepageData()
- [ ] loadFeaturedUsers → 调用homepageApiEnhanced.getFeaturedUsers()

### 2️⃣ **useHomeState.ts更新** 🟡

**当前状态**: 使用generateMockUsers  
**目标**: 调用真实API

需要更新的方法：
- [ ] loadUsers → 调用homepageApiEnhanced.getUserList()
- [ ] loadLimitedOffers → 调用homepageApiEnhanced.getFeaturedUsers()
- [ ] handleSearch → 集成搜索API

---

## 🔴 **待开始工作**

### 1️⃣ **后端接口创建** 🔴高优先级

需要在RuoYi-Cloud-Plus后端创建以下Controller：

#### HomepageController（首页控制器）
```java
路径: xypai-user/src/main/java/com/xypai/user/controller/app/HomepageController.java

需要实现的接口：
- GET  /api/v1/homepage/config          ← 首页配置
- GET  /api/v1/homepage/featured-users  ← 精选用户
- GET  /api/v1/homepage/services        ← 服务配置
- GET  /api/v1/homepage/banner          ← 横幅数据
- GET  /api/v1/homepage/statistics      ← 统计数据
- GET  /api/v1/homepage/hot-keywords    ← 热门搜索
```

#### HomepageUserController（首页用户查询控制器）
```java
路径: xypai-user/src/main/java/com/xypai/user/controller/app/HomepageUserController.java

需要实现的接口：
- GET  /api/v1/homepage/users/list      ← 首页用户列表（集成筛选）
- GET  /api/v1/homepage/users/nearby    ← 附近用户（空间索引）
- GET  /api/v1/homepage/users/recommend ← 推荐用户（算法）
- GET  /api/v1/homepage/users/latest    ← 最新用户
```

#### LocationController（位置服务控制器）
```java
路径: xypai-user/src/main/java/com/xypai/user/controller/app/LocationController.java

需要实现的接口：
- GET  /api/v1/location/cities          ← 城市列表
- GET  /api/v1/location/cities/hot      ← 热门城市
- GET  /api/v1/location/cities/search   ← 搜索城市
- GET  /api/v1/location/cities/:cityId/districts ← 区域列表
```

### 2️⃣ **组件适配** 🔴中优先级

需要更新的组件：
- [ ] UserListArea - 支持真实加载状态
- [ ] FeaturedUsersArea - 对接精选用户API
- [ ] FilterTabsArea - 集成真实筛选逻辑
- [ ] HeaderArea - 集成真实位置和搜索

### 3️⃣ **错误处理增强** 🔴低优先级

- [ ] 创建ErrorBoundary组件
- [ ] 添加全局错误处理
- [ ] 实现错误页面
- [ ] 添加网络状态检测

---

## 🎯 **已有后端接口**

### ✅ **可直接使用的接口**

#### 用户模块 (xypai-user)

| 接口 | 路径 | 状态 | 前端用途 |
|------|------|------|---------|
| 用户列表 | `GET /api/v1/users/list` | ✅ | 通用用户列表查询 |
| 用户详情 | `GET /api/v2/user/profile/:userId` | ✅ | 用户详情页面 |
| 当前用户 | `GET /api/v2/user/profile/current` | ✅ | 获取登录用户信息 |
| 在线检查 | `GET /api/v2/user/profile/:userId/is-online` | ✅ | 实时在线状态 |
| 用户统计 | `GET /api/v1/users/stats/:userId` | ✅ | 用户卡片统计数据 |
| 关注用户 | `POST /api/v1/relations/follow` | ✅ | 关注功能 |
| 取消关注 | `POST /api/v1/relations/unfollow` | ✅ | 取消关注 |

#### 内容模块 (xypai-content)

| 接口 | 路径 | 状态 | 前端用途 |
|------|------|------|---------|
| 内容列表 | `GET /api/v1/contents/list` | ✅ | 内容查询 |
| 热门内容 | `GET /api/v1/contents/hot` | ✅ | 热门推荐 |
| 推荐内容 | `GET /api/v1/contents/recommended` | ✅ | 个性化推荐 |
| 附近内容 | `GET /api/v1/contents/nearby` | ✅ | 空间索引查询 |
| 城市内容 | `GET /api/v1/contents/city/:cityId` | ✅ | 城市筛选 |
| 搜索内容 | `GET /api/v1/contents/search` | ✅ | 搜索功能 |

---

## ⚠️ **待创建后端接口**

### 🔴 **高优先级**（本周需完成）

1. **首页配置接口**
   ```
   GET /api/v1/homepage/config
   返回: HomepageConfigVO
   用途: 页面布局和功能开关配置
   ```

2. **精选用户接口**
   ```
   GET /api/v1/homepage/featured-users?limit=10&cityId=xxx
   返回: List<HomepageUserVO>
   用途: 限时专享区域展示
   SQL: 查询实名认证+VIP+高评分+最近活跃用户
   ```

3. **首页用户列表接口**
   ```
   GET /api/v1/homepage/users/list?filterTab=nearby&cityId=xxx
   返回: PageResult<HomepageUserVO>
   用途: 主要用户列表，支持多维度筛选
   ```

4. **服务配置接口**
   ```
   GET /api/v1/homepage/services
   返回: List<ServiceItemVO>
   用途: 10个功能图标配置（王者、英雄联盟等）
   ```

### 🟡 **中优先级**（下周完成）

5. **横幅配置接口**
   ```
   GET /api/v1/homepage/banner
   返回: List<BannerVO>
   用途: 游戏推广横幅
   ```

6. **统计数据接口**
   ```
   GET /api/v1/homepage/statistics
   返回: StatisticsVO
   用途: 首页展示的总体统计
   ```

7. **热门搜索接口**
   ```
   GET /api/v1/homepage/hot-keywords
   返回: List<String>
   用途: 搜索框占位符和推荐
   ```

### 🟢 **低优先级**（后续优化）

8. **个性化推荐算法**
   ```
   GET /api/v1/homepage/users/recommend?userId=xxx
   用途: 基于用户行为的智能推荐
   ```

9. **埋点统计接口**
   ```
   POST /api/v1/analytics/events
   用途: 用户行为追踪
   ```

---

## 🏗️ **后端实现建议**

### 📝 **HomepageController参考实现**

创建位置: `RuoYi-Cloud-Plus/xypai-user/src/main/java/com/xypai/user/controller/app/HomepageController.java`

```java
package com.xypai.user.controller.app;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.xypai.user.domain.vo.*;
import com.xypai.user.service.IHomepageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 首页功能控制器
 *
 * @author xypai
 * @date 2025-10-22
 */
@Tag(name = "首页功能", description = "首页数据聚合和配置API")
@RestController
@RequestMapping("/api/v1/homepage")
@RequiredArgsConstructor
@Validated
public class HomepageController extends BaseController {

    private final IHomepageService homepageService;

    /**
     * 获取首页配置
     */
    @Operation(summary = "获取首页配置", description = "获取首页各区域的配置信息")
    @GetMapping("/config")
    public R<HomepageConfigVO> getConfig(
            @Parameter(description = "平台类型") 
            @RequestParam(required = false) String platform,
            @Parameter(description = "应用版本") 
            @RequestParam(required = false) String version) {
        HomepageConfigVO config = homepageService.getHomepageConfig(platform, version);
        return R.ok(config);
    }

    /**
     * 获取精选用户列表
     */
    @Operation(summary = "获取精选用户", description = "获取限时专享的优质用户列表")
    @GetMapping("/featured-users")
    @SaCheckPermission("homepage:user:query")
    public R<List<HomepageUserVO>> getFeaturedUsers(
            @Parameter(description = "数量限制") 
            @RequestParam(defaultValue = "10") Integer limit,
            @Parameter(description = "服务类型") 
            @RequestParam(required = false) String serviceType,
            @Parameter(description = "城市ID") 
            @RequestParam(required = false) Long cityId) {
        List<HomepageUserVO> users = homepageService.getFeaturedUsers(limit, serviceType, cityId);
        return R.ok(users);
    }

    /**
     * 获取服务配置列表
     */
    @Operation(summary = "获取服务配置", description = "获取功能网格的服务类型配置")
    @GetMapping("/services")
    public R<List<ServiceItemVO>> getServices() {
        List<ServiceItemVO> services = homepageService.getServiceItems();
        return R.ok(services);
    }

    /**
     * 获取横幅数据
     */
    @Operation(summary = "获取横幅数据", description = "获取游戏推广横幅配置")
    @GetMapping("/banner")
    public R<List<BannerVO>> getBanner() {
        List<BannerVO> banners = homepageService.getBannerData();
        return R.ok(banners);
    }

    /**
     * 获取首页统计数据
     */
    @Operation(summary = "获取首页统计", description = "获取首页展示的统计信息")
    @GetMapping("/statistics")
    public R<HomepageStatisticsVO> getStatistics() {
        HomepageStatisticsVO statistics = homepageService.getHomepageStatistics();
        return R.ok(statistics);
    }

    /**
     * 获取热门搜索关键词
     */
    @Operation(summary = "获取热门搜索", description = "获取热门搜索关键词列表")
    @GetMapping("/hot-keywords")
    public R<List<String>> getHotKeywords(
            @Parameter(description = "数量限制") 
            @RequestParam(defaultValue = "10") Integer limit) {
        List<String> keywords = homepageService.getHotKeywords(limit);
        return R.ok(keywords);
    }

    /**
     * 获取首页聚合数据
     */
    @Operation(summary = "获取首页数据", description = "一次性获取首页所有数据（性能优化）")
    @GetMapping("/data")
    @SaCheckPermission("homepage:data:query")
    public R<HomepageDataVO> getData(
            @Parameter(description = "城市ID") 
            @RequestParam(required = false) Long cityId,
            @Parameter(description = "是否包含统计") 
            @RequestParam(defaultValue = "true") Boolean includeStatistics) {
        HomepageDataVO data = homepageService.getHomepageData(cityId, includeStatistics);
        return R.ok(data);
    }
}
```

### 📝 **HomepageUserController参考实现**

创建位置: `RuoYi-Cloud-Plus/xypai-user/src/main/java/com/xypai/user/controller/app/HomepageUserController.java`

```java
package com.xypai.user.controller.app;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.xypai.user.domain.dto.HomepageUserQueryDTO;
import com.xypai.user.domain.vo.HomepageUserVO;
import com.xypai.user.service.IHomepageUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 首页用户查询控制器
 *
 * @author xypai
 * @date 2025-10-22
 */
@Tag(name = "首页用户", description = "首页用户查询和筛选API")
@RestController
@RequestMapping("/api/v1/homepage/users")
@RequiredArgsConstructor
@Validated
public class HomepageUserController extends BaseController {

    private final IHomepageUserService homepageUserService;

    /**
     * 首页用户列表（集成筛选）
     */
    @Operation(summary = "首页用户列表", description = "支持多维度筛选的用户列表查询")
    @GetMapping("/list")
    @SaCheckPermission("homepage:user:list")
    public TableDataInfo<HomepageUserVO> list(
            @Validated HomepageUserQueryDTO query,
            PageQuery pageQuery) {
        startPage();
        List<HomepageUserVO> list = homepageUserService.getHomepageUserList(query);
        return getDataTable(list);
    }

    /**
     * 附近用户（空间索引查询）
     */
    @Operation(summary = "附近用户", description = "基于地理位置的附近用户查询（使用空间索引）")
    @GetMapping("/nearby")
    @SaCheckPermission("homepage:user:query")
    public R<List<HomepageUserVO>> nearby(
            @Parameter(description = "经度", required = true) 
            @RequestParam Double longitude,
            @Parameter(description = "纬度", required = true) 
            @RequestParam Double latitude,
            @Parameter(description = "半径（米）") 
            @RequestParam(defaultValue = "5000") Integer radius,
            @Parameter(description = "数量限制") 
            @RequestParam(defaultValue = "20") Integer limit) {
        List<HomepageUserVO> users = homepageUserService.getNearbyUsers(
            longitude, latitude, radius, limit);
        return R.ok(users);
    }

    /**
     * 推荐用户（个性化算法）
     */
    @Operation(summary = "推荐用户", description = "基于用户行为的个性化推荐")
    @GetMapping("/recommend")
    @SaCheckPermission("homepage:user:query")
    public R<List<HomepageUserVO>> recommend(
            @Parameter(description = "数量限制") 
            @RequestParam(defaultValue = "20") Integer limit,
            @Parameter(description = "城市ID") 
            @RequestParam(required = false) Long cityId) {
        List<HomepageUserVO> users = homepageUserService.getRecommendedUsers(limit, cityId);
        return R.ok(users);
    }

    /**
     * 最新用户
     */
    @Operation(summary = "最新用户", description = "最新注册的用户列表")
    @GetMapping("/latest")
    @SaCheckPermission("homepage:user:query")
    public R<List<HomepageUserVO>> latest(
            @Parameter(description = "数量限制") 
            @RequestParam(defaultValue = "20") Integer limit,
            @Parameter(description = "城市ID") 
            @RequestParam(required = false) Long cityId) {
        List<HomepageUserVO> users = homepageUserService.getLatestUsers(limit, cityId);
        return R.ok(users);
    }
}
```

---

## 📋 **数据转换示例**

### 后端 → 前端数据流

```
数据库 (MySQL)
├── user_profile表 (42字段)
├── user_stats表 (统计数据)
├── user_occupation表 (职业标签)
└── service_stats表 (服务评分)
    ↓
Service层组装
├── IHomepageUserService.getHomepageUserList()
├── 关联查询 (LEFT JOIN)
├── 空间索引查询 (ST_Distance_Sphere)
└── 数据聚合
    ↓
VO层封装
├── HomepageUserVO (聚合42+字段)
├── 包含: 基础信息+统计+服务+位置
└── 包含: 距离计算+状态映射
    ↓
Controller返回
├── R.ok(List<HomepageUserVO>)
└── 统一响应格式
    ↓
网关转发
├── RuoYi-Gateway
└── 路由到前端
    ↓
前端API层接收
├── homepageApiEnhanced.getUserList()
├── RuoYiResponse<UserProfileVO[]>解析
└── 错误处理和重试
    ↓
数据适配层转换
├── UserDataAdapter.transformUserList()
├── UserProfileVO → UserCard
└── 字段映射和格式化
    ↓
Store层存储
├── homepageStore.setPageData()
├── Zustand状态更新
└── AsyncStorage持久化
    ↓
组件层消费
├── UserListArea读取users数组
├── React渲染UserCard
└── 用户交互
```

---

## 🔧 **开发环境配置**

### 环境变量设置

创建 `.env.development`:
```env
# API配置
EXPO_PUBLIC_API_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
EXPO_PUBLIC_ENABLE_MOCK=false

# 功能开关
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CACHE=true

# 调试选项
EXPO_PUBLIC_DEBUG_API=true
EXPO_PUBLIC_DEBUG_STORE=true
```

### 本地开发步骤

1. **启动后端服务**
   ```bash
   cd RuoYi-Cloud-Plus
   # 启动Nacos、Redis、MySQL
   # 启动ruoyi-gateway
   # 启动xypai-user模块
   # 启动xypai-content模块
   ```

2. **配置API地址**
   ```bash
   # 查看本机IP
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   
   # 更新.env.development中的IP地址
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:8080
   ```

3. **启动前端**
   ```bash
   cd XiangYuPai-RNExpoAPP
   npm start
   ```

---

## 🧪 **测试策略**

### 阶段1: Mock数据测试（当前）
- ✅ 使用generateMockUsers
- ✅ 模拟API延迟
- ✅ 测试UI和交互

### 阶段2: 降级方案测试（下一步）
- 🟡 后端接口404时使用默认数据
- 🟡 网络错误时显示错误状态
- 🟡 超时重试机制

### 阶段3: 真实API测试
- 🔴 连接真实后端
- 🔴 测试所有接口
- 🔴 性能测试
- 🔴 错误场景测试

### 阶段4: 生产环境测试
- 🔴 压力测试
- 🔴 兼容性测试
- 🔴 安全测试

---

## 📈 **下一步行动**

### 本周任务（2025-10-22 ~ 2025-10-26）

#### 前端任务
- [ ] 更新homepageStore.ts（2小时）
  - [ ] 集成homepageApiEnhanced
  - [ ] 替换所有模拟数据调用
  - [ ] 添加错误处理
  
- [ ] 更新useHomeState.ts（1小时）
  - [ ] 调用真实API
  - [ ] 实现分页加载
  - [ ] 处理加载状态

- [ ] 测试降级方案（1小时）
  - [ ] 测试接口404情况
  - [ ] 测试网络错误
  - [ ] 验证默认数据

#### 后端任务（需要后端团队配合）
- [ ] 创建HomepageController（4小时）
  - [ ] 实现6个核心接口
  - [ ] 编写Service层逻辑
  - [ ] 编写Mapper SQL

- [ ] 创建HomepageUserController（4小时）
  - [ ] 实现4个用户查询接口
  - [ ] 优化空间索引查询
  - [ ] 实现推荐算法

- [ ] 创建VO类（1小时）
  - [ ] HomepageConfigVO
  - [ ] HomepageUserVO
  - [ ] ServiceItemVO
  - [ ] BannerVO

### 下周任务（2025-10-27 ~ 2025-11-02）

- [ ] 组件层适配（8小时）
- [ ] 完整测试（4小时）
- [ ] 性能优化（4小时）
- [ ] 文档更新（2小时）

---

## 🐛 **已知问题**

### 🔴 **阻塞问题**

1. **后端接口缺失**
   - 问题: 首页专用接口未实现
   - 影响: 无法使用最优查询策略
   - 解决: 暂时使用降级方案（通用接口）
   - 优先级: 🔴 高

2. **位置数据不完整**
   - 问题: UserProfileVO缺少经纬度字段
   - 影响: 无法精确计算距离
   - 解决: 后端需要在VO中添加latitude/longitude
   - 优先级: 🔴 高

### 🟡 **非阻塞问题**

3. **用户照片关联**
   - 问题: 需要关联Media表查询用户照片
   - 影响: 用户卡片照片区域为空
   - 解决: 后端在HomepageUserVO中包含photoUrls
   - 优先级: 🟡 中

4. **价格信息缺失**
   - 问题: 需要关联GameService/LifeService获取价格
   - 影响: 价格显示为undefined
   - 解决: 后端在HomepageUserVO中包含pricePerHour
   - 优先级: 🟡 中

---

## ✅ **验收标准**

### 功能验收
- [ ] 首页配置正确加载
- [ ] 用户列表正确显示
- [ ] 精选用户正确显示
- [ ] 筛选功能正常工作
- [ ] 分页加载正常
- [ ] 下拉刷新正常
- [ ] 错误状态正确显示
- [ ] 加载状态正确显示

### 性能验收
- [ ] 首页加载时间 < 2秒
- [ ] 用户列表滚动流畅 (60fps)
- [ ] API响应时间 < 500ms
- [ ] 内存占用合理 < 200MB

### 数据验收
- [ ] 用户数据完整准确
- [ ] 在线状态实时更新
- [ ] 距离计算准确
- [ ] 图片正确加载

---

## 📞 **协作沟通**

### 前端团队
- 📧 联系人: AI协作团队
- 📂 工作目录: `XiangYuPai-RNExpoAPP/`
- 🔧 主要文件: 
  - `services/api/homepageApiEnhanced.ts`
  - `stores/homepageStore.ts`
  - `src/features/Homepage/MainPage/`

### 后端团队
- 📧 联系人: 后端开发团队
- 📂 工作目录: `RuoYi-Cloud-Plus/xypai-user/`
- 🔧 需要创建:
  - `controller/app/HomepageController.java`
  - `controller/app/HomepageUserController.java`
  - `service/IHomepageService.java`
  - `service/impl/HomepageServiceImpl.java`

### 协作文档
- 📖 [后端集成方案](./BACKEND_INTEGRATION_PLAN.md)
- 📖 [API接口规格](./BACKEND_INTEGRATION_PLAN.md#后端接口需求)
- 📖 [数据映射关系](./BACKEND_INTEGRATION_PLAN.md#数据映射关系)

---

**最后更新**: 2025-10-22 22:00  
**下次评审**: 2025-10-24  
**负责人**: AI协作团队


