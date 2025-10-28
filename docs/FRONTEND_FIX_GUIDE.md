# 🔧 前端API调用修复指南

> **问题**: 前端仍在调用已禁用的接口 `/api/v1/users/list`  
> **错误**: `401 认证失败，无法访问系统资源`  
> **原因**: 后端已将该接口设为需要登录，前端需改用公开接口

---

## 🎯 需要修改的文件

### 1. `services/api/homepageApiEnhanced.ts`

#### ❌ 错误调用（第363行、第479行）

```typescript
// ❌ 调用已禁用的接口
const response = await apiClient.get<RuoYiResponse<UserProfileVO[]>>(
  `${API_ENDPOINTS.USER.LIST}?${queryParams}`  // 返回401
);
```

#### ✅ 正确调用（使用homepage接口）

```typescript
// ✅ 调用公开接口
const response = await apiClient.get<RuoYiResponse<UserProfileVO[]>>(
  `${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`  // 允许匿名
);
```

---

## 📝 完整修复代码

### 修改 `getGenericUserList` 方法（line 351-402）

```typescript
/**
 * 🆕 通用用户列表（使用HomepageController）
 */
private async getGenericUserList(params: UserListParams): Promise<ApiResponse<UserListResponse>> {
  try {
    // 构建查询参数
    const queryParams = buildQueryParams({
      limit: params.limit || params.pageSize || 20,
    });
    
    // ✅ 调用公开的首页推荐接口（无需登录）
    const response = await apiClient.get<RuoYiResponse<UserProfileVO[]>>(
      `${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
    );
    
    // 🔍 调试：查看完整响应
    console.log('[HomepageAPI] 后端响应数据结构:', {
      hasData: !!response.data,
      hasDataData: !!(response.data && response.data.data),
      code: response.data?.code,
      msg: response.data?.msg,
      dataType: typeof response.data?.data,
      dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not-array',
    });
    
    // 🆕 添加空值检查
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn('[HomepageAPI] 后端返回数据格式异常', response.data);
      throw new Error('后端返回数据格式错误：data.data不是数组');
    }
    
    // 转换数据
    const users = UserDataAdapter.transformUserList(response.data.data);
    
    return {
      data: {
        users,
        total: users.length,
        pageNum: params.page || 1,
        pageSize: params.pageSize || 20,
        hasMore: users.length >= (params.pageSize || 20),
      },
      code: response.data.code,
      message: response.data.msg,
      timestamp: Date.now(),
      success: response.data.code === 200,
    };
  } catch (error) {
    console.error('[HomepageAPI] getGenericUserList error:', error);
    throw error;
  }
}
```

### 修改 `getFeaturedUsersFallback` 方法（line 467-517）

```typescript
/**
 * 精选用户降级方案（使用现有接口组合）
 */
private async getFeaturedUsersFallback(params?: {
  limit?: number;
  serviceType?: string;
  cityId?: number;
}): Promise<ApiResponse<FeaturedUser[]>> {
  // ✅ 使用首页推荐接口（无需登录）
  const queryParams = buildQueryParams({
    limit: params?.limit || 10,
  });
  
  const response = await apiClient.get<RuoYiResponse<UserProfileVO[]>>(
    `${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
  );
  
  // 🔍 调试：查看响应
  console.log('[HomepageAPI] 降级方案响应:', {
    hasData: !!response.data,
    hasDataData: !!(response.data && response.data.data),
    dataType: typeof response.data?.data,
  });
  
  // 🆕 添加空值检查
  if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
    console.warn('[HomepageAPI] 降级方案数据异常，返回空数组');
    return {
      data: [],
      code: 200,
      message: 'No data available',
      timestamp: Date.now(),
      success: true,
    };
  }
  
  // 前端过滤优质用户
  const filtered = UserDataAdapter.filterFeaturedUsers(response.data.data);
  const sorted = UserDataAdapter.sortUsers(filtered, 'rating');
  const limited = sorted.slice(0, params?.limit || 10);
  
  const users = UserDataAdapter.transformUserList(limited);
  
  console.log('[HomepageAPI] 降级方案处理完成', { count: users.length });
  
  return {
    data: users,
    code: 200,
    message: 'success',
    timestamp: Date.now(),
    success: true,
  };
}
```

---

## 🔧 修改步骤

### 第1步：修改第363行
```typescript
// 原代码（line 363）
`${API_ENDPOINTS.USER.LIST}?${queryParams}`

// 改为
`${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
```

### 第2步：修改第479行
```typescript
// 原代码（line 479）
`${API_ENDPOINTS.USER.LIST}?${queryParams}`

// 改为
`${API_ENDPOINTS.HOMEPAGE.RECOMMENDED_USERS}?${queryParams}`
```

### 第3步：验证修改

重启前端应用，检查日志：
```
✅ 应该看到：GET /xypai-user/api/v1/homepage/recommended-users
❌ 不应看到：GET /xypai-user/api/v1/users/list
```

---

## 📊 接口对照表

| 旧接口（已禁用） | 新接口（公开） | 说明 |
|-----------------|---------------|------|
| `/api/v1/users/list` | `/api/v1/homepage/recommended-users` | 推荐用户 |
| `/api/v1/users/list` | `/api/v1/homepage/nearby-users` | 附近的人 |
| 无 | `/api/v1/homepage/featured-users` | 精选用户 |
| 无 | `/api/v1/homepage/new-users` | 新用户 |

---

## 🧪 测试验证

### 测试1：启动应用（应该成功）
```bash
npm start
# 或
npx expo start
```

### 测试2：检查首页加载
```
✅ 预期：首页正常加载用户列表
❌ 之前：401错误，降级为模拟数据
```

### 测试3：检查网络请求
```
✅ 预期：GET /xypai-user/api/v1/homepage/recommended-users → 200 OK
❌ 之前：GET /xypai-user/api/v1/users/list → 401 Unauthorized
```

---

## 🎯 预期效果

修复后：
- ✅ 首页在未登录状态下正常加载用户数据
- ✅ 不再出现401错误
- ✅ 不再降级到模拟数据
- ✅ 使用后端真实数据

---

**🚀 修改后重启应用即可生效！**

