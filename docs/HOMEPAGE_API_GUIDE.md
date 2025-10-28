# 📘 首页公开接口调用指南

> **版本**: v1.0  
> **更新日期**: 2025-10-24  
> **适用范围**: 匿名用户（未登录状态）

---

## 🎯 核心策略

### ⭐ 集中式公开接口管理

**唯一匿名访问入口**：`HomepageController` (`/api/v1/homepage/**`)

```
✅ 允许匿名访问：/xypai-user/api/v1/homepage/**
❌ 需要登录：     /xypai-user/api/v1/users/**
❌ 需要登录：     /xypai-user/api/v1/profile/**
```

**优势**：
- 🔐 **安全清晰**：默认全部需要登录，只有 homepage 例外
- 🎯 **集中管理**：所有匿名接口都在一个控制器中
- 🚀 **易于维护**：只需维护一个白名单规则

---

## 📡 可用接口列表

### 1️⃣ 获取精选用户
```typescript
// ✅ 正确调用
GET /xypai-user/api/v1/homepage/featured-users?limit=5

// 响应示例
{
  "code": 200,
  "msg": "成功",
  "data": [
    {
      "userId": 1,
      "nickname": "小明",
      "avatar": "https://example.com/avatar.jpg",
      "gender": "M",
      "age": 25,
      "city": "深圳",
      "isVip": true,
      "isGodVerified": true
    }
  ]
}
```

### 2️⃣ 获取附近的人
```typescript
// ✅ 正确调用
GET /xypai-user/api/v1/homepage/nearby-users?city=深圳&limit=20

// 响应示例
{
  "code": 200,
  "msg": "成功",
  "data": [
    {
      "userId": 2,
      "nickname": "小红",
      "avatar": "https://example.com/avatar2.jpg",
      "gender": "F",
      "age": 23,
      "city": "深圳",
      "distance": 1.5  // 距离（km）
    }
  ]
}
```

### 3️⃣ 获取推荐用户
```typescript
// ✅ 正确调用
GET /xypai-user/api/v1/homepage/recommended-users?limit=10

// 响应示例
{
  "code": 200,
  "msg": "成功",
  "data": [
    {
      "userId": 3,
      "nickname": "小刚",
      "avatar": "https://example.com/avatar3.jpg",
      "isActivityExpert": true,
      "tags": ["游戏", "健身"]
    }
  ]
}
```

### 4️⃣ 获取新用户
```typescript
// ✅ 正确调用
GET /xypai-user/api/v1/homepage/new-users?limit=10

// 响应示例
{
  "code": 200,
  "msg": "成功",
  "data": [
    {
      "userId": 4,
      "nickname": "新人小李",
      "avatar": "https://example.com/avatar4.jpg",
      "registeredDays": 2,  // 注册天数
      "isNew": true
    }
  ]
}
```

---

## 🚫 已废弃的调用方式

### ❌ 错误调用（会返回 401）

```typescript
// ❌ 已废弃：直接调用用户列表接口
GET /xypai-user/api/v1/users/list
// 返回：{ "code": 401, "msg": "认证失败，无法访问系统资源" }

// ❌ 已废弃：直接访问用户主页
GET /xypai-user/api/v1/users/123/profile
// 返回：{ "code": 401, "msg": "认证失败，无法访问系统资源" }
```

### ✅ 正确调用（使用 homepage 接口）

```typescript
// ✅ 推荐：通过首页接口获取用户
GET /xypai-user/api/v1/homepage/recommended-users?limit=20
// 返回：{ "code": 200, "data": [...] }
```

---

## 🔧 前端调用示例

### React Native 示例

```typescript
// src/services/api/homepageApiEnhanced.ts

import { apiClient } from './client';

/**
 * 首页公开接口（无需登录）
 */
export class HomepageAPI {
  
  /**
   * 获取精选用户
   */
  async getFeaturedUsers(limit = 5): Promise<UserListVO[]> {
    const response = await apiClient.get('/xypai-user/api/v1/homepage/featured-users', {
      params: { limit }
    });
    return response.data.data;
  }

  /**
   * 获取附近的人
   */
  async getNearbyUsers(city: string, limit = 20): Promise<UserListVO[]> {
    const response = await apiClient.get('/xypai-user/api/v1/homepage/nearby-users', {
      params: { city, limit }
    });
    return response.data.data;
  }

  /**
   * 获取推荐用户
   */
  async getRecommendedUsers(limit = 10): Promise<UserListVO[]> {
    const response = await apiClient.get('/xypai-user/api/v1/homepage/recommended-users', {
      params: { limit }
    });
    return response.data.data;
  }

  /**
   * 获取新用户
   */
  async getNewUsers(limit = 10): Promise<UserListVO[]> {
    const response = await apiClient.get('/xypai-user/api/v1/homepage/new-users', {
      params: { limit }
    });
    return response.data.data;
  }
}

export const homepageAPI = new HomepageAPI();
```

### 在组件中使用

```typescript
// src/features/Homepage/MainPage/index.tsx

import { homepageAPI } from '@/services/api/homepageApiEnhanced';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedUsers();
  }, []);

  const loadFeaturedUsers = async () => {
    try {
      setLoading(true);
      // ✅ 调用匿名接口（无需登录）
      const users = await homepageAPI.getFeaturedUsers(5);
      setFeaturedUsers(users);
    } catch (error) {
      console.error('加载精选用户失败', error);
      // 降级策略：使用模拟数据
      setFeaturedUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>精选用户</Text>
      {featuredUsers.map(user => (
        <UserCard key={user.userId} user={user} />
      ))}
    </View>
  );
}
```

---

## 🔐 认证流程说明

### 匿名访问流程

```
1. 前端发起请求
   ↓
2. 网关检查白名单（/xypai-user/api/v1/homepage/** ✅）
   ↓
3. 转发到 xypai-user 服务
   ↓
4. SaToken检查白名单（/api/v1/homepage/** ✅）
   ↓
5. 放行，执行 HomepageController
   ↓
6. 返回数据
```

### 登录后访问流程

```
1. 前端发起请求（带 token）
   ↓
2. 网关检查（有token，放行）
   ↓
3. 转发到 xypai-user 服务
   ↓
4. SaToken验证token（有效，放行）
   ↓
5. 执行 UserController、UserProfileController 等
   ↓
6. 返回个性化数据
```

---

## 📋 接口对照表

| 功能 | ❌ 旧接口（已禁用） | ✅ 新接口（推荐） |
|------|-------------------|------------------|
| 用户列表 | `/api/v1/users/list` | `/api/v1/homepage/recommended-users` |
| 精选用户 | 无 | `/api/v1/homepage/featured-users` |
| 附近的人 | `/api/v1/users/nearby` | `/api/v1/homepage/nearby-users` |
| 新用户 | 无 | `/api/v1/homepage/new-users` |
| 用户主页 | `/api/v1/users/{id}/profile` | **需要登录后访问** |

---

## 🚀 迁移步骤

### 第1步：更新前端API调用

```typescript
// ❌ 旧代码
const users = await apiClient.get('/xypai-user/api/v1/users/list');

// ✅ 新代码
const users = await homepageAPI.getRecommendedUsers(20);
```

### 第2步：测试匿名访问

```bash
# 测试精选用户（无需token）
curl http://localhost:8080/xypai-user/api/v1/homepage/featured-users?limit=5

# 预期响应：200 OK
{
  "code": 200,
  "msg": "成功",
  "data": [...]
}
```

### 第3步：测试受保护接口

```bash
# 测试用户列表（需要token）
curl http://localhost:8080/xypai-user/api/v1/users/list

# 预期响应：401 Unauthorized
{
  "code": 401,
  "msg": "认证失败，无法访问系统资源"
}
```

---

## ❓ 常见问题

### Q1: 为什么要集中到 HomepageController？

**A**: 
- 🔐 **安全**: 默认全部需要登录，只有 homepage 例外（白名单最小化）
- 🎯 **清晰**: 公开 vs 受保护接口边界明确
- 🚀 **维护**: 只需维护一个白名单规则，降低配置错误风险

### Q2: 如果需要新增匿名接口怎么办？

**A**: 在 `HomepageController` 中添加新方法即可，无需修改白名单配置。

```java
// 新增热门话题接口
@GetMapping("/hot-topics")
public R<List<TopicVO>> getHotTopics() {
    // 实现逻辑
}
```

### Q3: 内容服务的匿名接口怎么处理？

**A**: 建议在 `xypai-content` 中也创建 `ContentHomepageController`，统一管理匿名接口。

```
✅ /xypai-content/api/v1/homepage/hot-content
✅ /xypai-content/api/v1/homepage/recommended-content
❌ /xypai-content/api/v1/content/list（需要登录）
```

### Q4: 登录后能否继续访问 homepage 接口？

**A**: 可以！homepage 接口同时支持匿名和登录用户访问，登录后可返回更个性化的推荐。

---

## 📖 参考文档

- [HomepageController.java](../xypai-user/src/main/java/com/xypai/user/controller/app/public_/HomepageController.java)
- [SaTokenConfig.java](../xypai-user/src/main/java/com/xypai/user/config/SaTokenConfig.java)
- [ruoyi-gateway.yml](../script/config/nacos/ruoyi-gateway.yml)

---

**✅ 配置已更新，前端需要修改调用方式！**

