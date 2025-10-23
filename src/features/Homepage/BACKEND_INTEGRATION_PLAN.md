# 🔗 首页模块后端数据对接方案

> **基于RuoYi-Cloud-Plus后端的完整数据对接设计**
> 
> **创建时间**: 2025-10-22
> **版本**: v1.0

---

## 📊 **后端数据结构分析**

### 🎯 **已有后端接口总览**

根据后端代码分析，以下接口可用于首页模块：

#### 1️⃣ **用户相关接口** (`xypai-user模块`)

| 接口路径 | 方法 | 功能 | 数据结构 | 首页用途 |
|---------|------|------|---------|---------|
| `/api/v1/users/list` | GET | 用户列表查询 | `UserListVO[]` | ✅ 用户列表区域 |
| `/api/v2/user/profile/{userId}` | GET | 用户资料详情 | `UserProfileVO` | ✅ 限时专享、用户详情 |
| `/api/v2/user/profile/{userId}/is-online` | GET | 检查在线状态 | `Boolean` | ✅ 用户状态显示 |
| `/api/v1/users/stats/{userId}` | GET | 用户统计数据 | `UserStatsVO` | ✅ 用户卡片统计 |

#### 2️⃣ **内容相关接口** (`xypai-content模块`)

| 接口路径 | 方法 | 功能 | 数据结构 | 首页用途 |
|---------|------|------|---------|---------|
| `/api/v1/contents/nearby` | GET | 附近内容查询 | `ContentListVO[]` | ✅ 附近筛选 |
| `/api/v1/contents/city/{cityId}` | GET | 城市内容查询 | `ContentListVO[]` | ✅ 城市筛选 |
| `/api/v1/contents/hot` | GET | 热门内容 | `ContentListVO[]` | ✅ 推荐内容 |
| `/api/v1/contents/recommended` | GET | 推荐内容 | `ContentListVO[]` | ✅ 个性化推荐 |

#### 3️⃣ **待创建的首页专用接口**

以下接口需要在后端新建以支持首页特定功能：

| 接口路径 | 方法 | 功能 | 优先级 |
|---------|------|------|--------|
| `/api/v1/homepage/config` | GET | 首页配置 | 🔴 高 |
| `/api/v1/homepage/featured-users` | GET | 精选用户列表 | 🔴 高 |
| `/api/v1/homepage/banner` | GET | 横幅数据 | 🟡 中 |
| `/api/v1/homepage/services` | GET | 服务配置列表 | 🔴 高 |
| `/api/v1/homepage/statistics` | GET | 首页统计数据 | 🟡 中 |
| `/api/v1/homepage/hot-keywords` | GET | 热门搜索词 | 🟢 低 |

---

## 🔄 **数据映射关系**

### 📱 **前端UserCard → 后端数据映射**

```typescript
// 前端类型定义 (types.ts)
interface UserCard {
  id: string;                    // ← UserProfileVO.userId
  avatar: string;                // ← UserProfileVO.avatar
  username: string;              // ← UserProfileVO.nickname
  age: number;                   // ← UserProfileVO.age
  bio: string;                   // ← UserProfileVO.bio
  services: string[];            // ← UserProfileVO.occupations[].name
  distance: number;              // ← 前端计算（基于location）
  status: 'online' | 'available' | 'offline';  // ← UserProfileVO.onlineStatus映射
  photos: string[];              // ← 需要关联Media表
  price?: string;                // ← 需要关联GameService/LifeService
  region?: string;               // ← UserProfileVO.location
  rating?: number;               // ← ServiceStats.avgRating
  reviewCount?: number;          // ← ServiceStats.serviceCount
  // 扩展字段
  isOnline?: boolean;            // ← UserProfileVO.isOnline
  isRealVerified?: boolean;      // ← UserProfileVO.isRealVerified
  isGodVerified?: boolean;       // ← UserProfileVO.isGodVerified
  isVip?: boolean;               // ← UserProfileVO.isVip
  vipLevel?: number;             // ← UserProfileVO.vipLevel
  cityId?: number;               // ← UserProfileVO.cityId
  cityName?: string;             // ← UserProfileVO.cityName
  // 统计数据
  stats?: {
    followerCount: number;       // ← UserStatsVO.followerCount
    contentCount: number;        // ← UserStatsVO.contentCount
    totalLikeCount: number;      // ← UserStatsVO.totalLikeCount
  };
}
```

### 🗺️ **前端LocationInfo → 后端City表映射**

```typescript
interface LocationInfo {
  city: string;                  // ← City.name
  district?: string;             // ← 需要补充District表或使用address字段
  cityId?: number;               // ← City.id
  provinceCode?: string;         // ← City.province_code
}
```

### 🎮 **前端ServiceItem → 后端服务配置映射**

```typescript
interface ServiceItem {
  id: string;                    // ← 服务类型编码
  name: string;                  // ← 服务名称
  type: string;                  // ← game/lifestyle等
  enabled: boolean;              // ← 从配置获取
  config: {
    displayName: string;         // ← 显示名称
    backgroundColor: string;     // ← 前端配置
    iconUrl: string;             // ← CDN URL
  };
}
```

---

## 🎯 **首页数据加载策略**

### 📋 **MainPage数据加载流程**

```typescript
// 初始化加载优先级
1. 【立即加载】关键数据（并行）
   ├── loadPageConfig()           // 页面配置（缓存5分钟）
   ├── loadCurrentLocation()      // 用户位置（从Store或GPS）
   └── loadServiceItems()         // 服务配置（缓存30分钟）

2. 【次要加载】内容数据（并行）
   ├── loadFeaturedUsers()        // 精选用户（实时）
   ├── loadBannerData()           // 横幅数据（缓存5分钟）
   └── loadUserList()             // 用户列表首页（实时）

3. 【延迟加载】非关键数据
   ├── loadStatistics()           // 统计数据（缓存10分钟）
   └── loadHotKeywords()          // 热门搜索（缓存15分钟）
```

### 🔄 **数据更新触发时机**

```typescript
触发场景：
1. 页面首次加载          → 全量加载
2. 下拉刷新              → 刷新用户列表 + 精选用户
3. 切换筛选标签          → 重新加载用户列表
4. 选择地区              → 更新位置 + 重新加载用户
5. 应用高级筛选          → 带筛选条件加载用户
6. 页面重新聚焦(useFocusEffect) → 增量更新（检查更新）
```

---

## 🛠️ **API适配层设计**

### 📡 **homepageApi.ts 更新**

需要新增以下真实API调用：

```typescript
// ===== 已有接口保持 =====
// getHomepageConfig()
// getBannerData()
// etc.

// ===== 需要对接后端的接口 =====

/**
 * 获取首页用户列表
 * 对接后端: GET /api/v1/users/list
 */
async getUserList(params: {
  // 筛选条件
  filterTab?: 'nearby' | 'recommend' | 'latest';
  region?: string;
  cityId?: number;
  
  // 分页参数
  page?: number;
  limit?: number;
  
  // 位置参数（附近筛选用）
  longitude?: number;
  latitude?: number;
  radius?: number;
  
  // 高级筛选
  gender?: number;
  ageMin?: number;
  ageMax?: number;
  onlineStatus?: number[];
  isVerified?: boolean;
}): Promise<ApiResponse<{
  users: UserCard[];
  total: number;
  hasMore: boolean;
}>> {
  // 根据filterTab选择不同的后端接口
  switch (params.filterTab) {
    case 'nearby':
      // 调用附近内容接口
      return this.getNearbyUsers(params);
    
    case 'recommend':
      // 调用推荐接口
      return this.getRecommendedUsers(params);
    
    case 'latest':
      // 调用最新用户接口
      return this.getLatestUsers(params);
    
    default:
      // 调用通用列表接口
      return this.getGenericUserList(params);
  }
}

/**
 * 获取精选用户（限时专享）
 * 对接后端: 组合查询优质用户
 */
async getFeaturedUsers(params?: {
  limit?: number;
  serviceType?: string;
  cityId?: number;
}): Promise<ApiResponse<UserCard[]>> {
  // 查询条件：
  // - 实名认证 isRealVerified = true
  // - 高评分 avgRating >= 4.5
  // - VIP用户优先 isVip = true
  // - 最近活跃 lastOnlineTime < 24小时
  
  const response = await apiClient.get('/api/v1/users/list', {
    params: {
      isVerified: true,
      minRating: 4.5,
      isVip: true,
      sortBy: 'rating',
      sortOrder: 'desc',
      limit: params?.limit || 10,
      ...params
    }
  });
  
  return this.transformToUserCards(response.data);
}
```

### 🔄 **数据转换适配器**

```typescript
/**
 * 后端数据 → 前端数据转换
 */
class DataAdapter {
  /**
   * UserProfileVO → UserCard
   */
  static transformUserProfile(
    profile: UserProfileVO,
    stats?: UserStatsVO,
    serviceInfo?: { price?: number; rating?: number }
  ): UserCard {
    return {
      id: String(profile.userId),
      avatar: profile.avatar || profile.avatarThumbnail || '',
      username: profile.nickname || '用户' + profile.userId,
      age: profile.age || 0,
      bio: profile.bio || '这个家伙很懒惰，没有填写简介',
      services: profile.occupations?.map(o => o.name) || [],
      distance: 0, // 需要前端计算
      status: this.mapOnlineStatus(profile.onlineStatus),
      photos: [], // 需要关联查询Media
      price: serviceInfo?.price ? `¥${serviceInfo.price}/小时` : undefined,
      region: profile.location || '',
      rating: serviceInfo?.rating,
      reviewCount: stats?.activitySuccessCount,
      // 扩展字段
      isOnline: profile.isOnline,
      isRealVerified: profile.isRealVerified,
      isGodVerified: profile.isGodVerified,
      isVip: profile.isVip,
      vipLevel: profile.vipLevel,
      cityId: profile.cityId,
      cityName: profile.cityName,
      stats: stats ? {
        followerCount: stats.followerCount || 0,
        contentCount: stats.contentCount || 0,
        totalLikeCount: stats.totalLikeCount || 0,
      } : undefined,
    };
  }
  
  /**
   * 在线状态映射
   * 后端: 0=离线, 1=在线, 2=忙碌, 3=隐身
   * 前端: 'online' | 'available' | 'offline'
   */
  static mapOnlineStatus(status?: number): 'online' | 'available' | 'offline' {
    switch (status) {
      case 1: return 'online';    // 在线
      case 2: return 'available'; // 忙碌→可预约
      default: return 'offline';  // 离线/隐身
    }
  }
  
  /**
   * 计算用户距离
   * 使用Haversine公式
   */
  static calculateDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // 地球半径（公里）
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * 
      Math.cos(to.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10; // 保留1位小数
  }
}
```

---

## 🏗️ **后端接口需求**

### 🔴 **高优先级 - 需要立即创建**

#### 1. 首页配置接口

```java
/**
 * 首页配置Controller（需要新建）
 */
@RestController
@RequestMapping("/api/v1/homepage")
public class HomepageController {
  
  /**
   * 获取首页配置
   * GET /api/v1/homepage/config
   */
  @GetMapping("/config")
  public R<HomepageConfigVO> getConfig() {
    return R.ok(HomepageConfigVO.builder()
      .topFunction(TopFunctionConfig.builder()
        .enabled(true)
        .showLocation(true)
        .showSearch(true)
        .build())
      .gameBanner(GameBannerConfig.builder()
        .enabled(true)
        .autoPlay(true)
        .interval(5000)
        .build())
      .serviceGrid(ServiceGridConfig.builder()
        .enabled(true)
        .columns(5)
        .rows(2)
        .build())
      // ... 其他配置
      .build());
  }
  
  /**
   * 获取精选用户列表
   * GET /api/v1/homepage/featured-users
   */
  @GetMapping("/featured-users")
  public R<List<UserCard>> getFeaturedUsers(
    @RequestParam(defaultValue = "10") Integer limit,
    @RequestParam(required = false) String serviceType,
    @RequestParam(required = false) Long cityId
  ) {
    // 查询逻辑：
    // 1. 实名认证用户 (is_real_verified = 1)
    // 2. 高评分 (avg_rating >= 4.5)
    // 3. VIP用户优先 (is_vip = 1, vip_level DESC)
    // 4. 最近活跃 (last_online_time >= NOW() - INTERVAL 24 HOUR)
    // 5. 关联ServiceStats获取价格和评分
    // 6. 关联UserOccupation获取职业标签
  }
  
  /**
   * 获取服务类型配置
   * GET /api/v1/homepage/services
   */
  @GetMapping("/services")
  public R<List<ServiceItemVO>> getServices() {
    // 返回10个服务配置（王者、英雄联盟、探店等）
    // 配置可存储在system_config表或独立配置表
  }
  
  /**
   * 获取横幅数据
   * GET /api/v1/homepage/banner
   */
  @GetMapping("/banner")
  public R<List<BannerVO>> getBanner() {
    // 返回游戏推广横幅配置
    // 包括：图片URL、标题、跳转链接、起止时间
  }
}
```

#### 2. 用户查询增强接口

```java
/**
 * 首页用户查询Controller（扩展UserController）
 */
@RestController
@RequestMapping("/api/v1/homepage/users")
public class HomepageUserController {
  
  /**
   * 首页用户列表（集成多维度筛选）
   * GET /api/v1/homepage/users/list
   */
  @GetMapping("/list")
  public R<PageResult<HomepageUserVO>> getHomepageUsers(
    @RequestParam(defaultValue = "nearby") String filterTab,
    @RequestParam(required = false) String region,
    @RequestParam(required = false) Long cityId,
    @RequestParam(required = false) Double longitude,
    @RequestParam(required = false) Double latitude,
    @RequestParam(defaultValue = "5000") Integer radius,
    @RequestParam(defaultValue = "1") Integer pageNum,
    @RequestParam(defaultValue = "20") Integer pageSize
  ) {
    // 根据filterTab路由到不同查询：
    // - nearby: 空间索引查询附近用户
    // - recommend: 个性化推荐算法
    // - latest: 按注册时间倒序
    
    // 返回数据包含：
    // - UserProfile基础信息
    // - UserStats统计数据
    // - 用户距离（实时计算）
    // - 在线状态
    // - 服务价格（关联GameService/LifeService）
  }
  
  /**
   * 附近用户（空间索引优化）
   * GET /api/v1/homepage/users/nearby
   */
  @GetMapping("/nearby")
  public R<List<HomepageUserVO>> getNearbyUsers(
    @RequestParam Double longitude,
    @RequestParam Double latitude,
    @RequestParam(defaultValue = "5000") Integer radius,
    @RequestParam(defaultValue = "20") Integer limit
  ) {
    // SQL示例：
    // SELECT u.*, up.*, us.*, 
    //   ST_Distance_Sphere(
    //     location, 
    //     ST_GeomFromText('POINT(? ?)', 4326)
    //   ) AS distance
    // FROM user_profile up
    // LEFT JOIN user u ON up.user_id = u.id
    // LEFT JOIN user_stats us ON up.user_id = us.user_id
    // WHERE ST_Distance_Sphere(
    //   location, 
    //   ST_GeomFromText('POINT(? ?)', 4326)
    // ) <= ?
    // ORDER BY distance ASC
    // LIMIT ?
  }
  
  /**
   * 推荐用户（个性化算法）
   * GET /api/v1/homepage/users/recommend
   */
  @GetMapping("/recommend")
  public R<List<HomepageUserVO>> getRecommendedUsers(
    @RequestParam(required = false) Long userId,
    @RequestParam(defaultValue = "20") Integer limit
  ) {
    // 推荐算法：
    // 1. 基于UserBehavior行为分析
    // 2. 基于SearchHistory搜索历史
    // 3. 基于UserPreference偏好设置
    // 4. 协同过滤算法
  }
}
```

---

## 📊 **数据结构设计**

### 🎯 **HomepageUserVO（首页用户VO）**

建议在后端创建专门的VO用于首页用户列表：

```java
/**
 * 首页用户VO（聚合数据）
 */
@Data
@Builder
public class HomepageUserVO {
  // 基础信息（来自UserProfile）
  private Long userId;
  private String nickname;
  private String avatar;
  private String avatarThumbnail;
  private Integer age;
  private Integer gender;
  private String bio;
  private String location;
  private Long cityId;
  private String cityName;
  
  // 认证标识
  private Boolean isRealVerified;
  private Boolean isGodVerified;
  private Boolean isVip;
  private Integer vipLevel;
  private Boolean isPopular;
  
  // 在线状态
  private Integer onlineStatus;
  private String onlineStatusDesc;
  private Boolean isOnline;
  private LocalDateTime lastOnlineTime;
  
  // 职业标签（来自UserOccupation）
  private List<String> occupationTags;
  
  // 统计数据（来自UserStats）
  private Integer followerCount;
  private Integer contentCount;
  private Integer totalLikeCount;
  
  // 服务信息（来自GameService/LifeService）
  private BigDecimal pricePerHour;
  private BigDecimal pricePerGame;
  private BigDecimal avgRating;
  private Integer reviewCount;
  
  // 地理位置（计算字段）
  private Double distance;        // 距离（km）
  private String distanceDesc;    // 格式化距离
  
  // 用户照片（来自Content表，取最新3张）
  private List<String> photoUrls;
  
  // 扩展信息
  private Boolean isFollowed;     // 当前用户是否已关注
  private Boolean isFavorite;     // 当前用户是否已收藏
}
```

### 🎯 **HomepageConfigVO（首页配置VO）**

```java
/**
 * 首页配置VO
 */
@Data
@Builder
public class HomepageConfigVO {
  private TopFunctionConfig topFunction;
  private GameBannerConfig gameBanner;
  private ServiceGridConfig serviceGrid;
  private FeaturedUsersConfig featuredUsers;
  private EventCenterConfig eventCenter;
  private UserListConfig userList;
  
  @Data
  @Builder
  public static class TopFunctionConfig {
    private Boolean enabled;
    private Boolean showLocation;
    private Boolean showSearch;
  }
  
  @Data
  @Builder
  public static class ServiceGridConfig {
    private Boolean enabled;
    private Integer columns;
    private Integer rows;
    private List<ServiceItemVO> services;
  }
  
  // ... 其他配置类
}
```

---

## 🔧 **前端实施步骤**

### ✅ **Phase 1: API层更新**（本次实施）

#### 步骤1: 更新 `services/api/config.ts`

```typescript
export const API_ENDPOINTS = {
  HOMEPAGE: {
    CONFIG: '/api/v1/homepage/config',
    DATA: '/api/v1/homepage/data',
    FEATURED_USERS: '/api/v1/homepage/featured-users',
    BANNER: '/api/v1/homepage/banner',
    SERVICES: '/api/v1/homepage/services',
    STATISTICS: '/api/v1/homepage/statistics',
    HOT_KEYWORDS: '/api/v1/homepage/hot-keywords',
    
    // 用户查询
    USER_LIST: '/api/v1/homepage/users/list',
    NEARBY_USERS: '/api/v1/homepage/users/nearby',
    RECOMMEND_USERS: '/api/v1/homepage/users/recommend',
    LATEST_USERS: '/api/v1/homepage/users/latest',
  },
  
  // 现有用户接口（备用）
  USER: {
    LIST: '/api/v1/users/list',
    DETAIL: '/api/v2/user/profile',
    STATS: '/api/v1/users/stats',
  },
  
  // ... 其他端点
};

// 基础URL配置
export const API_BASE_URL = {
  development: 'http://localhost:8080',
  staging: 'https://api-staging.xypai.com',
  production: 'https://api.xypai.com',
};
```

#### 步骤2: 更新 `services/api/homepageApi.ts`

添加真实的后端数据对接方法（见下方完整代码）

#### 步骤3: 创建数据适配器 `services/api/adapters/userAdapter.ts`

```typescript
/**
 * 用户数据适配器
 * 后端数据 → 前端数据格式转换
 */
export class UserDataAdapter {
  // 转换方法...
}
```

### ✅ **Phase 2: Store层更新**（下一步）

#### 更新 `stores/homepageStore.ts`

- 集成真实API调用
- 替换模拟数据
- 添加错误处理
- 实现缓存策略

### ✅ **Phase 3: 组件层更新**（最后）

#### 更新各区域组件

- UserListArea: 支持加载状态、分页
- FeaturedUsersArea: 对接精选用户API
- HeaderArea: 集成真实位置数据

---

## 🎯 **数据缓存策略**

### 📦 **多层缓存架构**

```typescript
Layer 1: API Client内存缓存
├── 配置数据: 5分钟TTL
├── 横幅数据: 5分钟TTL
└── 服务列表: 30分钟TTL

Layer 2: Zustand Store状态
├── 用户列表: 不缓存（实时）
├── 精选用户: 不缓存（实时）
└── 页面配置: 持久化到AsyncStorage

Layer 3: AsyncStorage持久化
├── pageConfig: 长期缓存
├── userInteraction: 用户偏好
└── lastLocation: 最后位置
```

---

## 🔐 **安全与认证**

### 🔒 **Token管理**

```typescript
// API Client配置
apiClient.interceptors.request.use(config => {
  // 从Store获取token
  const token = authStore.getState().accessToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Token刷新逻辑
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      const refreshed = await authStore.getState().refreshToken();
      if (refreshed) {
        // 重试原请求
        return apiClient.request(error.config);
      } else {
        // 跳转登录页
        router.replace('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 📈 **性能优化方案**

### ⚡ **接口调用优化**

```typescript
// 1. 并行加载关键数据
async function initializeHomepage() {
  const [config, services, location] = await Promise.allSettled([
    homepageApi.getHomepageConfig(),
    homepageApi.getServiceItems(),
    locationStore.getCurrentLocation(),
  ]);
  
  // 处理结果...
  
  // 2. 次要数据延迟加载
  setTimeout(async () => {
    const [featured, banner] = await Promise.allSettled([
      homepageApi.getFeaturedUsers(),
      homepageApi.getBannerData(),
    ]);
  }, 500);
}

// 3. 请求去重
const deduplicator = new Map<string, Promise<any>>();

function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  if (deduplicator.has(key)) {
    return deduplicator.get(key)!;
  }
  
  const promise = fetcher().finally(() => {
    deduplicator.delete(key);
  });
  
  deduplicator.set(key, promise);
  return promise;
}
```

### 🎨 **UI性能优化**

```typescript
// 1. 列表虚拟化（FlatList已实现）
// 2. 图片懒加载
// 3. 组件记忆化
// 4. 计算属性缓存
```

---

## 🧪 **测试策略**

### 📝 **API Mock方案**

开发阶段使用MSW（Mock Service Worker）模拟后端：

```typescript
// mocks/handlers/homepage.ts
import { http, HttpResponse } from 'msw';

export const homepageHandlers = [
  // 模拟首页配置接口
  http.get('/api/v1/homepage/config', () => {
    return HttpResponse.json({
      code: 200,
      data: {
        topFunction: { enabled: true, showLocation: true },
        // ... 完整配置
      },
      message: 'success'
    });
  }),
  
  // 模拟精选用户接口
  http.get('/api/v1/homepage/featured-users', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '10';
    
    return HttpResponse.json({
      code: 200,
      data: generateMockUsers(Number(limit)),
      message: 'success'
    });
  }),
  
  // ... 其他接口
];
```

### ✅ **环境切换**

```typescript
// services/api/config.ts

const getBaseURL = (): string => {
  const env = process.env.NODE_ENV;
  const apiEnv = process.env.EXPO_PUBLIC_API_ENV || env;
  
  switch (apiEnv) {
    case 'production':
      return API_BASE_URL.production;
    case 'staging':
      return API_BASE_URL.staging;
    case 'mock':
      return 'http://localhost:3000'; // MSW
    default:
      return API_BASE_URL.development;
  }
};
```

---

## 📋 **实施检查清单**

### ✅ **后端工作**

- [ ] 创建HomepageController
  - [ ] GET /api/v1/homepage/config
  - [ ] GET /api/v1/homepage/featured-users
  - [ ] GET /api/v1/homepage/services
  - [ ] GET /api/v1/homepage/banner
- [ ] 创建HomepageUserController
  - [ ] GET /api/v1/homepage/users/list
  - [ ] GET /api/v1/homepage/users/nearby
  - [ ] GET /api/v1/homepage/users/recommend
- [ ] 创建VO类
  - [ ] HomepageConfigVO
  - [ ] HomepageUserVO
  - [ ] ServiceItemVO
  - [ ] BannerVO
- [ ] 优化SQL查询
  - [ ] 空间索引查询（附近用户）
  - [ ] 关联查询优化（LEFT JOIN）
  - [ ] 分页性能优化
- [ ] 添加Redis缓存
  - [ ] 首页配置缓存
  - [ ] 热门用户缓存
  - [ ] 服务配置缓存

### ✅ **前端工作**

- [ ] 更新API配置 (config.ts)
- [ ] 更新homepageApi.ts
  - [ ] 添加真实API调用方法
  - [ ] 实现数据转换适配器
  - [ ] 添加错误处理
  - [ ] 实现请求去重
- [ ] 创建数据适配器
  - [ ] UserDataAdapter
  - [ ] LocationDataAdapter
  - [ ] ServiceDataAdapter
- [ ] 更新homepageStore.ts
  - [ ] 替换模拟数据为API调用
  - [ ] 实现错误状态管理
  - [ ] 添加重试机制
- [ ] 更新组件
  - [ ] UserListArea支持真实分页
  - [ ] FeaturedUsersArea对接API
  - [ ] FilterTabsArea筛选逻辑
- [ ] 添加加载状态
  - [ ] 骨架屏组件
  - [ ] 加载指示器
  - [ ] 空状态页面
  - [ ] 错误状态页面

---

## 🚀 **部署配置**

### 🌐 **环境变量**

```env
# .env.development
EXPO_PUBLIC_API_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
EXPO_PUBLIC_ENABLE_MOCK=false
EXPO_PUBLIC_CACHE_TTL=300000

# .env.staging
EXPO_PUBLIC_API_ENV=staging
EXPO_PUBLIC_API_BASE_URL=https://api-staging.xypai.com
EXPO_PUBLIC_ENABLE_MOCK=false

# .env.production
EXPO_PUBLIC_API_ENV=production
EXPO_PUBLIC_API_BASE_URL=https://api.xypai.com
EXPO_PUBLIC_ENABLE_MOCK=false
```

---

## 📞 **接口对接协调**

### 🤝 **前后端协作清单**

#### 后端提供：
1. Swagger/OpenAPI文档
2. 接口基础URL和环境
3. 测试账号和Token
4. 数据库测试数据
5. 接口响应时间SLA

#### 前端提供：
1. 数据格式需求文档（本文档）
2. 接口调用示例
3. 性能指标要求
4. 错误处理要求
5. 缓存策略说明

---

## 📖 **后续优化方向**

### 🔮 **功能增强**

1. **智能推荐**
   - 基于用户行为的个性化推荐
   - A/B测试不同推荐算法
   - 实时反馈调整推荐权重

2. **搜索优化**
   - ElasticSearch全文搜索
   - 搜索词高亮显示
   - 搜索历史和热词

3. **实时功能**
   - WebSocket推送在线状态变化
   - 实时通知新用户
   - 位置变化实时更新

### 🎯 **性能优化**

1. **GraphQL集成**（可选）
   - 按需查询字段
   - 减少over-fetching
   - 批量查询优化

2. **CDN加速**
   - 图片CDN
   - 静态资源CDN
   - API响应缓存

3. **离线支持**
   - 离线缓存
   - 增量同步
   - 冲突解决

---

**文档创建**: 2025-10-22  
**维护者**: AI协作团队  
**状态**: ✅ 方案设计完成，待实施  
**下一步**: 实施Phase 1 - API层更新


