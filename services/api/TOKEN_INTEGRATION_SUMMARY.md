# 🎯 Token认证集成总结

> **完整对接后端Sa-Token认证机制**
> 
> 更新时间: 2025-10-23

---

## 📝 问题回答

### ❓ **我们需要新建文件吗？还是修改现有文件就够了？**

**答案**: **两者都需要！**

1. **修改现有文件** (`client.ts`) - 添加clientId支持
2. **创建新文件** (`authApi.ts`) - 统一管理认证API

---

## 📂 文件清单

### ✅ 已修改的文件

#### 1. `services/api/client.ts`

**修改内容**:
- 添加 `clientId` 属性和管理方法
- 在请求头中自动添加 `X-Client-Id`

```typescript
// 新增的代码片段
class ApiClient {
  private clientId: string = 'web_client';  // 🆕
  
  setClientId(clientId: string): void { }   // 🆕
  getClientId(): string { }                 // 🆕
  
  // 请求时自动添加
  headers: {
    'X-Client-Id': this.clientId,          // 🆕
  }
}
```

**位置**: 第151行（新增）、第319行（修改）

---

#### 2. `services/api/index.ts`

**修改内容**:
- 导出新的 `authApi`
- 导出认证相关类型

```typescript
// 新增导出
export { authApi } from './authApi';

export type {
  LoginResponse, PasswordLoginRequest,
  RefreshTokenRequest, // ...更多类型
} from './authApi';
```

---

### 🆕 新建的文件

#### 1. `services/api/authApi.ts` ⭐ **核心文件**

**功能**:
- 统一管理所有认证API调用
- 自动设置token和clientId
- 与后端Sa-Token完全对接

**主要API**:
```typescript
authApi.loginWithPassword(...)    // 密码登录
authApi.loginWithSms(...)          // 验证码登录
authApi.refreshToken(...)          // 刷新Token
authApi.logout()                   // 登出
authApi.getCurrentUserProfile()    // 获取用户信息
authApi.sendSmsCode(...)           // 发送验证码
authApi.verifySmsCode(...)         // 验证验证码
authApi.checkTokenValidity()       // 检查Token有效性
```

**行数**: 310行

---

#### 2. `services/api/AUTH_INTEGRATION_GUIDE.md` 📚

**内容**:
- 完整的集成指南
- 使用方法和示例
- 与后端对接说明
- 常见问题解答

**行数**: 380行

---

#### 3. `services/api/AUTH_USAGE_EXAMPLE.tsx` 💡

**内容**:
- 9个实际使用示例
- 登录页面组件
- AuthStore集成示例
- 错误处理示例

**行数**: 330行

---

#### 4. `services/api/TOKEN_INTEGRATION_SUMMARY.md`

**内容**: 当前文档（你正在阅读）

---

## 🔄 工作流程

### 完整的认证流程

```
┌─────────────────────────────────────────────────────────────┐
│                    1. 用户登录                                │
│  authApi.loginWithPassword({ phone, password, ... })       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              2. 发送请求到后端                                │
│  POST /xypai-auth/api/v1/auth/login                         │
│  Headers:                                                    │
│    - X-Client-Id: web_client                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             3. 后端Sa-Token认证                              │
│  AuthFilter.java:                                           │
│    - 生成accessToken（JWT）                                  │
│    - 生成refreshToken                                        │
│    - 绑定clientId                                            │
│    - 返回用户信息                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              4. 前端自动保存                                  │
│  apiClient.setAuthToken(accessToken)                        │
│  apiClient.setClientId(clientId)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         5. 后续所有API请求自动添加                            │
│  Headers:                                                    │
│    - Authorization: Bearer {token}                          │
│    - X-Client-Id: {clientId}                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           6. 后端验证（每次请求）                             │
│  AuthFilter.java:                                           │
│    - checkLogin() → 验证token                                │
│    - 验证header中的clientId与token中的clientId是否匹配        │
│    - 匹配成功 ✅ → 放行                                       │
│    - 匹配失败 ❌ → 返回401                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐
    │  7a. 请求成功    │   │  7b. 401错误     │
    │  返回数据        │   │  自动刷新token    │
    └─────────────────┘   └────────┬─────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  8. 自动刷新Token              │
                    │  client.handleUnauthorized() │
                    │    ↓                          │
                    │  authApi.refreshToken()      │
                    │    ↓                          │
                    │  重新发送原请求                │
                    └──────────────────────────────┘
```

---

## 🎯 核心改进点

### 1️⃣ **ClientId支持** 🆕

**问题**: 后端Sa-Token需要验证clientId，但前端没有支持

**解决**:
```typescript
// client.ts
private clientId: string = 'web_client';

headers: {
  'X-Client-Id': this.clientId,  // 对应后端 LoginHelper.CLIENT_KEY
}
```

**后端验证**:
```java
// AuthFilter.java
String headerCid = request.getHeaders().getFirst(LoginHelper.CLIENT_KEY);
String clientId = StpUtil.getExtra(LoginHelper.CLIENT_KEY).toString();

if (!StringUtils.equalsAny(clientId, headerCid)) {
    throw NotLoginException.newInstance(...);  // ❌ 不匹配会报错
}
```

---

### 2️⃣ **统一认证API** 🆕

**问题**: 
- `src/features/AuthModule/api/authApi.ts` 使用Axios
- `services/api/client.ts` 使用fetch
- 两套API客户端并存

**解决**:
- 创建 `services/api/authApi.ts`
- 统一使用 `apiClient`（fetch）
- 自动管理token和clientId

---

### 3️⃣ **自动Token刷新** ✅ 已有

**机制**: 已在 `client.ts` 中实现

```typescript
// 检测到401错误
if (response.status === 401) {
  // 1. 调用 authStore.refreshAuthToken()
  // 2. 获取新token并设置
  // 3. 重新发送原请求
  return await this.handleUnauthorized();
}
```

---

## 📋 使用步骤

### Step 1: 在App启动时初始化

```typescript
// app/_layout.tsx
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Platform } from 'react-native';

useEffect(() => {
  // 1. 设置clientId（根据平台）
  if (Platform.OS === 'android') {
    apiClient.setClientId('android_client');
  } else if (Platform.OS === 'ios') {
    apiClient.setClientId('ios_client');
  } else {
    apiClient.setClientId('web_client');
  }

  // 2. 连接AuthStore
  apiClient.connectAuthStore(useAuthStore);

  // 3. 初始化AuthStore
  useAuthStore.getState().initialize();
}, []);
```

---

### Step 2: 在AuthStore中使用authApi

```typescript
// stores/authStore.ts
import { authApi } from '@/services/api';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // 登录方法
  login: async (credentials) => {
    const response = await authApi.loginWithPassword({
      phone: credentials.phone,
      password: credentials.password,
      region: credentials.region,
      deviceId: get().deviceId,
    });

    if (response.success) {
      const { accessToken, refreshToken, userInfo } = response.data;
      
      set({ isAuthenticated: true, accessToken, refreshToken, userInfo });
      
      // ✅ Token已自动存储到apiClient
    }
  },

  // 刷新Token
  refreshAuthToken: async () => {
    const response = await authApi.refreshToken({
      refreshToken: get().refreshToken!,
    });

    if (response.success) {
      set({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    }
  },

  // 登出
  logout: async () => {
    await authApi.logout();
    get().clearAuthData();
  },
}));
```

---

### Step 3: 在登录页使用

```typescript
// LoginScreen.tsx
import { authApi } from '@/services/api';

const handleLogin = async () => {
  const response = await authApi.loginWithPassword({
    phone: '13800138000',
    password: '123456',
    region: '+86',
  });

  if (response.success) {
    // ✅ 登录成功
    // ✅ Token已自动设置
    // ✅ 后续所有API请求自动携带token和clientId
    
    navigation.navigate('Home');
  }
};
```

---

## ✅ 验证清单

使用前请确认：

- [x] 已修改 `client.ts` 添加 clientId 支持
- [x] 已创建 `authApi.ts` 统一认证API
- [x] 已在 `index.ts` 导出 authApi
- [ ] 已在 `_layout.tsx` 中设置 clientId
- [ ] 已在 `_layout.tsx` 中连接 apiClient 与 authStore
- [ ] 已在 `authStore.ts` 中使用 authApi 替代旧的API
- [ ] 已测试登录流程
- [ ] 已测试登出流程
- [ ] 已测试Token刷新流程

---

## 🔍 后端对接验证

### 检查后端配置

1. **AuthFilter.java** - 认证过滤器
   - 位置: `ruoyi-gateway/src/main/java/org/dromara/gateway/filter/AuthFilter.java`
   - 验证: `checkLogin()` + `clientId匹配`

2. **LoginHelper.CLIENT_KEY**
   - 对应前端: `X-Client-Id` header
   - 值: `web_client` / `android_client` / `ios_client`

3. **API端点**
   - 登录: `/xypai-auth/api/v1/auth/login`
   - 刷新: `/xypai-auth/api/v1/auth/refresh`
   - 登出: `/xypai-auth/api/v1/auth/logout`

### 测试方法

```bash
# 1. 测试登录（通过网关）
curl -X POST http://localhost:8080/xypai-auth/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Client-Id: web_client" \
  -d '{
    "phone": "13800138000",
    "password": "123456",
    "region": "+86",
    "loginType": "password"
  }'

# 2. 测试带token的请求
curl http://localhost:8080/xypai-user/api/v1/users/list \
  -H "Authorization: Bearer {your_token}" \
  -H "X-Client-Id: web_client"
```

---

## 📚 相关文档

1. **AUTH_INTEGRATION_GUIDE.md** - 完整集成指南
2. **AUTH_USAGE_EXAMPLE.tsx** - 使用示例代码
3. **GATEWAY_ROUTING.md** - 网关路由说明
4. **client.ts** - API客户端源码
5. **authApi.ts** - 认证API源码

---

## 🎉 完成状态

| 项目 | 状态 | 说明 |
|------|------|------|
| ClientId支持 | ✅ 已完成 | 在client.ts中实现 |
| AuthAPI统一 | ✅ 已完成 | 创建authApi.ts |
| 自动Token管理 | ✅ 已有 | client.ts中已实现 |
| 401自动刷新 | ✅ 已有 | client.ts中已实现 |
| 文档完善 | ✅ 已完成 | 3个文档文件 |
| 使用示例 | ✅ 已完成 | AUTH_USAGE_EXAMPLE.tsx |
| 类型导出 | ✅ 已完成 | index.ts |
| Lint检查 | ✅ 通过 | 无错误 |

---

## 🚀 下一步

1. **在实际项目中集成**
   - 修改 `_layout.tsx` 初始化
   - 修改 `authStore.ts` 使用新的authApi
   - 修改登录页使用新的authApi

2. **测试**
   - 测试登录流程
   - 测试登出流程
   - 测试Token刷新
   - 测试401错误处理

3. **调优**
   - 根据后端实际响应格式调整类型定义
   - 根据实际需求调整clientId配置
   - 优化错误处理和用户提示

---

**创建时间**: 2025-10-23  
**文件统计**: 4个文件（2个修改 + 4个新建）  
**代码行数**: ~1000行  
**状态**: ✅ **就绪，可以使用**

