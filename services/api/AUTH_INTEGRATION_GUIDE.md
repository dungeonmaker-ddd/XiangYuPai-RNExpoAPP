# 🔐 认证集成指南

> **与后端Sa-Token认证完全对接**
> 
> 更新时间: 2025-10-23

---

## 📋 目录

1. [架构概览](#架构概览)
2. [Token管理机制](#token管理机制)
3. [如何使用](#如何使用)
4. [与AuthStore集成](#与authstore集成)
5. [与后端Sa-Token对接](#与后端sa-token对接)

---

## 🏗️ 架构概览

### 认证流程图

```
┌─────────────┐
│   用户登录   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  authApi.loginWithPassword()        │
│  或 authApi.loginWithSms()          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  后端: POST /xypai-auth/api/v1/auth/login │
│  认证: Sa-Token                      │
└──────┬──────────────────────────────┘
       │
       ▼ 返回 { accessToken, refreshToken, clientId, userInfo }
       │
┌──────┴──────────────────────────────┐
│  自动存储:                            │
│  ✅ apiClient.setAuthToken(token)   │
│  ✅ apiClient.setClientId(clientId) │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  后续所有API请求自动添加:            │
│  - Authorization: Bearer {token}    │
│  - X-Client-Id: {clientId}          │
└─────────────────────────────────────┘
```

---

## 🎯 Token管理机制

### 1️⃣ **自动添加Token和ClientId**

所有API请求会自动添加认证信息（`client.ts` 第313-320行）：

```typescript
const requestConfig: RequestInit = {
  method,
  headers: {
    ...this.defaultHeaders,
    ...headers,
    'Authorization': `Bearer ${token}`,      // ✅ 自动添加
    'X-Client-Id': this.clientId,            // ✅ 自动添加（对应后端CLIENT_KEY）
  },
};
```

### 2️⃣ **401错误自动刷新Token**

当accessToken过期时，自动刷新（`client.ts` 第194-255行）：

```typescript
// 检测到401错误
if (response.status === 401) {
  // 1. 调用 authStore.refreshAuthToken()
  // 2. 获取新token
  // 3. 重新发送原请求
  return await this.handleUnauthorized();
}
```

### 3️⃣ **连接AuthStore实现状态同步**

在应用启动时连接AuthStore（`client.ts` 第161-167行）：

```typescript
// App.tsx 或 _layout.tsx
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

// 连接AuthStore
apiClient.connectAuthStore(useAuthStore);
```

---

## 🚀 如何使用

### 方式1: 使用 `authApi`（推荐）

#### 登录示例

```typescript
import { authApi } from '@/services/api';

// 密码登录
const handlePasswordLogin = async () => {
  try {
    const response = await authApi.loginWithPassword({
      phone: '13800138000',
      password: '123456',
      region: '+86',
      deviceId: 'device_123',
      // clientId 会自动使用默认值 'web_client'
    });

    if (response.success) {
      const { accessToken, userInfo } = response.data;
      
      // ✅ Token已自动存储到apiClient
      // ✅ 后续所有请求自动携带token和clientId
      
      console.log('登录成功:', userInfo);
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 验证码登录
const handleSmsLogin = async () => {
  try {
    // 1. 先发送验证码
    await authApi.sendSmsCode({
      phone: '13800138000',
      region: '+86',
      type: 'login',
    });

    // 2. 用户输入验证码后登录
    const response = await authApi.loginWithSms({
      phone: '13800138000',
      smsCode: '123456',
      region: '+86',
    });

    if (response.success) {
      console.log('登录成功');
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
};
```

#### 登出示例

```typescript
const handleLogout = async () => {
  try {
    await authApi.logout();
    // ✅ Token已自动清除
    console.log('登出成功');
  } catch (error) {
    console.error('登出失败:', error);
  }
};
```

#### 获取当前用户信息

```typescript
const getUserProfile = async () => {
  try {
    const response = await authApi.getCurrentUserProfile();
    
    if (response.success) {
      console.log('用户信息:', response.data);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};
```

---

### 方式2: 直接使用 `apiClient`

```typescript
import { apiClient } from '@/services/api';

// 手动设置token（不推荐，建议使用authApi）
apiClient.setAuthToken('your_access_token');
apiClient.setClientId('your_client_id');

// 手动清除token
apiClient.clearAuthToken();
```

---

## 🔗 与AuthStore集成

### Step 1: 在AuthStore中调用authApi

```typescript
// src/features/AuthModule/stores/authStore.ts

import { authApi } from '@/services/api';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // ...其他状态

  // 登录方法
  login: async (credentials) => {
    try {
      const response = await authApi.loginWithPassword({
        phone: credentials.phone,
        password: credentials.password,
        region: credentials.region,
        deviceId: get().deviceId,
      });

      if (response.success) {
        const { accessToken, refreshToken, userInfo } = response.data;

        // 保存到store
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          userInfo,
        });

        // 保存到SecureStore
        await secureStorage.setItem('ACCESS_TOKEN', accessToken);
        await secureStorage.setItem('REFRESH_TOKEN', refreshToken);
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 刷新Token方法
  refreshAuthToken: async () => {
    try {
      const refreshToken = get().refreshToken;
      
      if (!refreshToken) {
        throw new Error('没有refresh token');
      }

      const response = await authApi.refreshToken({
        refreshToken,
      });

      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        set({
          accessToken,
          refreshToken: newRefreshToken,
        });

        await secureStorage.setItem('ACCESS_TOKEN', accessToken);
        await secureStorage.setItem('REFRESH_TOKEN', newRefreshToken);
      }
    } catch (error) {
      console.error('刷新token失败:', error);
      // 刷新失败，清除认证数据
      get().clearAuthData();
      throw error;
    }
  },

  // 登出方法
  logout: async () => {
    try {
      await authApi.logout();
      get().clearAuthData();
    } catch (error) {
      console.error('登出失败:', error);
      // 即使登出失败也清除本地数据
      get().clearAuthData();
    }
  },

  // 清除认证数据
  clearAuthData: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    });

    secureStorage.deleteItem('ACCESS_TOKEN');
    secureStorage.deleteItem('REFRESH_TOKEN');
  },
}));
```

### Step 2: 在应用启动时连接

```typescript
// app/_layout.tsx

import { useEffect } from 'react';
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  useEffect(() => {
    // 🎯 连接API客户端与AuthStore
    apiClient.connectAuthStore(useAuthStore);
    
    // 初始化AuthStore
    useAuthStore.getState().initialize();
  }, []);

  return (
    // ...your app layout
  );
}
```

---

## 🔧 与后端Sa-Token对接

### 后端认证机制（AuthFilter.java）

```java
// 后端检查逻辑
StpUtil.checkLogin();  // 检查是否登录

// 检查clientId是否匹配
String headerCid = request.getHeaders().getFirst(LoginHelper.CLIENT_KEY);  // "X-Client-Id"
String clientId = StpUtil.getExtra(LoginHelper.CLIENT_KEY).toString();

if (!StringUtils.equalsAny(clientId, headerCid)) {
    throw NotLoginException.newInstance(...);  // ❌ clientId不匹配
}
```

### 前端对接（client.ts）

```typescript
// ✅ 自动添加clientId到header
headers: {
  'Authorization': `Bearer ${token}`,
  'X-Client-Id': this.clientId,  // 对应后端 LoginHelper.CLIENT_KEY
}
```

### ClientId配置

**默认值**: `'web_client'`

**自定义clientId**:

```typescript
import { apiClient } from '@/services/api';

// 根据平台设置不同的clientId
if (Platform.OS === 'android') {
  apiClient.setClientId('android_client');
} else if (Platform.OS === 'ios') {
  apiClient.setClientId('ios_client');
} else {
  apiClient.setClientId('web_client');
}
```

---

## 🛡️ 安全最佳实践

### 1. Token存储

```typescript
import * as SecureStore from 'expo-secure-store';

// ✅ 使用SecureStore存储敏感信息
await SecureStore.setItemAsync('ACCESS_TOKEN', token);
await SecureStore.setItemAsync('REFRESH_TOKEN', refreshToken);

// ❌ 不要使用AsyncStorage存储token
// await AsyncStorage.setItem('ACCESS_TOKEN', token);  // 不安全
```

### 2. 自动登出

```typescript
// 监听401错误，自动登出
apiClient.on('unauthorized', () => {
  useAuthStore.getState().clearAuthData();
  // 跳转到登录页
  router.replace('/auth/login');
});
```

### 3. Token过期处理

```typescript
// client.ts已自动处理401错误
// 1. 检测到401 → 自动调用refreshToken
// 2. 刷新成功 → 重新发送原请求
// 3. 刷新失败 → 清除认证数据，跳转登录页
```

---

## 📚 API文档

### authApi方法列表

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `loginWithPassword()` | 密码登录 | `PasswordLoginRequest` | `Promise<ApiResponse<LoginResponse>>` |
| `loginWithSms()` | 验证码登录 | `SmsLoginRequest` | `Promise<ApiResponse<LoginResponse>>` |
| `refreshToken()` | 刷新Token | `RefreshTokenRequest` | `Promise<ApiResponse<RefreshTokenResponse>>` |
| `logout()` | 登出 | `LogoutRequest?` | `Promise<ApiResponse<void>>` |
| `getCurrentUserProfile()` | 获取当前用户信息 | - | `Promise<ApiResponse<UserInfo>>` |
| `sendSmsCode()` | 发送验证码 | `SendSmsRequest` | `Promise<ApiResponse<SendSmsResponse>>` |
| `verifySmsCode()` | 验证验证码 | `VerifySmsRequest` | `Promise<ApiResponse<{valid: boolean}>>` |
| `checkTokenValidity()` | 检查Token有效性 | - | `Promise<boolean>` |

---

## 🐛 常见问题

### Q1: 401错误一直出现

**原因**: clientId不匹配或token已过期

**解决**:
```typescript
// 检查clientId是否正确
console.log('当前clientId:', apiClient.getClientId());

// 检查token是否有效
const isValid = await authApi.checkTokenValidity();
console.log('Token有效性:', isValid);
```

### Q2: 登录后其他API还是401

**原因**: token没有正确存储

**解决**:
```typescript
// 确保使用authApi登录
const response = await authApi.loginWithPassword({...});
// ✅ authApi会自动调用 apiClient.setAuthToken()

// 检查token是否已设置
console.log('Token已设置:', apiClient.getAuthToken());
```

### Q3: 刷新token失败

**原因**: refreshToken过期或无效

**解决**:
```typescript
// 刷新失败时自动清除认证数据并跳转登录
// 已在 client.ts handleUnauthorized() 中实现
```

---

## ✅ 完成清单

使用前请确认：

- [ ] 已创建 `authApi.ts`
- [ ] 已修改 `client.ts` 添加 `clientId` 支持
- [ ] 已在 `index.ts` 导出 `authApi`
- [ ] 已在 `_layout.tsx` 连接 `apiClient` 与 `authStore`
- [ ] 已在 `authStore.ts` 中使用 `authApi` 替代旧的API调用
- [ ] 已配置正确的 `clientId`（根据平台）
- [ ] 已测试登录、登出、刷新token流程

---

## 📞 技术支持

如有问题，请查看：
- `services/api/client.ts` - API客户端核心实现
- `services/api/authApi.ts` - 认证API实现
- `services/api/config.ts` - API端点配置
- `RuoYi-Cloud-Plus/ruoyi-gateway/src/main/java/org/dromara/gateway/filter/AuthFilter.java` - 后端认证过滤器

---

**创建时间**: 2025-10-23  
**最后更新**: 2025-10-23  
**版本**: v1.0  
**状态**: ✅ 已完成并测试

