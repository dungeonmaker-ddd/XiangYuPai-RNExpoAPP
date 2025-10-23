# ✅ 认证API对接清单

> **后端文档**: `xypai-security/APP认证.md`  
> **前端实现**: `services/api/authApi.ts`  
> **状态**: 🚀 已完成并可用

---

## 📋 API接口清单

### 1️⃣ 认证管理（6个接口）

| 接口名 | 方法 | 路径 | 前端方法 | 状态 |
|--------|------|------|----------|------|
| 密码登录 | POST | `/xypai-auth/api/v1/auth/login` | `authApi.loginWithPassword()` | ✅ 已完成 |
| 短信登录 | POST | `/xypai-auth/api/v1/auth/login/sms` | `authApi.loginWithSms()` | ✅ 已完成 |
| 刷新令牌 | POST | `/xypai-auth/api/v1/auth/refresh` | `authApi.refreshToken()` | ✅ 已完成 |
| 用户登出 | POST | `/xypai-auth/api/v1/auth/logout` | `authApi.logout()` | ✅ 已完成 |
| 发送短信 | POST | `/xypai-auth/api/v1/auth/sms/send` | `authApi.sendSmsCode()` | ✅ 已完成 |
| 验证短信 | POST | `/xypai-auth/api/v1/auth/sms/verify` | `authApi.verifySmsCode()` | ✅ 已完成 |
| 验证令牌 | GET | `/xypai-auth/api/v1/auth/verify` | `authApi.verifyToken()` | ✅ 已完成 |
| 心跳保活 | POST | `/xypai-auth/api/v1/auth/heartbeat` | `authApi.heartbeat()` | ✅ 已完成 |
| 健康检查 | GET | `/xypai-auth/api/v1/auth/health` | `authApi.healthCheck()` | ✅ 已完成 |

### 2️⃣ 会话管理（5个接口）

| 接口名 | 方法 | 路径 | 状态 |
|--------|------|------|------|
| 查询会话列表 | GET | `/xypai-auth/api/v1/auth/sessions` | ⏳ 待实现 |
| 查询当前会话 | GET | `/xypai-auth/api/v1/auth/session/current` | ⏳ 待实现 |
| 统计会话数量 | GET | `/xypai-auth/api/v1/auth/sessions/count` | ⏳ 待实现 |
| 注销会话 | DELETE | `/xypai-auth/api/v1/auth/session/{sessionId}` | ⏳ 待实现 |
| 注销其他会话 | POST | `/xypai-auth/api/v1/auth/sessions/revoke-others` | ⏳ 待实现 |

### 3️⃣ 设备管理（6个接口）

| 接口名 | 方法 | 路径 | 状态 |
|--------|------|------|------|
| 查询设备列表 | GET | `/xypai-auth/api/v1/auth/devices` | ⏳ 待实现 |
| 查询信任设备 | GET | `/xypai-auth/api/v1/auth/devices/trusted` | ⏳ 待实现 |
| 信任设备 | POST | `/xypai-auth/api/v1/auth/device/{deviceId}/trust` | ⏳ 待实现 |
| 取消信任 | DELETE | `/xypai-auth/api/v1/auth/device/{deviceId}/trust` | ⏳ 待实现 |
| 注销设备 | DELETE | `/xypai-auth/api/v1/auth/device/{deviceId}` | ⏳ 待实现 |
| 删除设备 | DELETE | `/xypai-auth/api/v1/auth/device/{deviceId}/delete` | ⏳ 待实现 |

---

## 📦 数据类型对照表

### 后端 → 前端类型映射

| 后端类型 | 前端类型 | 文件 | 说明 |
|----------|----------|------|------|
| `LoginDTO` | `PasswordLoginRequest` | authApi.ts | 密码登录请求 |
| `SmsLoginDTO` | `SmsLoginRequest` | authApi.ts | 短信登录请求 |
| `LoginResultVO` | `LoginResultVO` | authApi.ts | 登录结果 |
| `UserInfo` | `UserInfo` | authApi.ts | 用户信息 |
| `SmsCodeDTO` | `SendSmsRequest` | authApi.ts | 发送短信请求 |
| `R<T>` | `RResponse<T>` | authApi.ts | 统一响应格式 |

---

## 🎯 使用示例

### 1. 密码登录

```typescript
import { authApi } from '@/services/api';

const response = await authApi.loginWithPassword({
  username: 'alice_dev',      // ✅ 用户名
  password: '123456',          // ✅ 密码
  clientType: 'app',           // ✅ 客户端类型
  deviceId: 'device_12345',    // ⚠️ 可选
  rememberMe: false,           // ⚠️ 可选
});

if (response.success) {
  console.log('登录成功:', response.data.userInfo);
  console.log('Token:', response.data.accessToken);
  // ✅ Token已自动保存到apiClient
}
```

### 2. 短信登录

```typescript
// Step 1: 发送验证码
const smsResponse = await authApi.sendSmsCode({
  mobile: '13800138001',       // ✅ 手机号
  type: 'login',               // ✅ 验证码类型
  clientType: 'app',           // ⚠️ 可选
});

// Step 2: 验证并登录
const loginResponse = await authApi.loginWithSms({
  mobile: '13800138001',       // ✅ 手机号
  smsCode: '123456',           // ✅ 验证码
  clientType: 'app',           // ⚠️ 可选
  deviceId: 'device_12345',    // ⚠️ 可选
  rememberMe: false,           // ⚠️ 可选
});

if (loginResponse.success) {
  console.log('登录成功');
}
```

### 3. 刷新Token

```typescript
// 注意：通常由apiClient自动调用，无需手动调用
const response = await authApi.refreshToken('your_refresh_token');

if (response.success) {
  console.log('Token刷新成功');
  // ✅ 新Token已自动保存
}
```

### 4. 登出

```typescript
await authApi.logout();
// ✅ Token已自动清除
```

### 5. 心跳保活

```typescript
// 定时调用心跳接口，延长会话有效期
setInterval(async () => {
  await authApi.heartbeat();
}, 5 * 60 * 1000); // 每5分钟
```

---

## 🧪 测试方法

### 方式1: 使用示例组件

```typescript
import { PasswordLoginExample, SmsLoginExample, TestAllAuthApis } from '@/services/api/AUTH_LOGIN_EXAMPLE';

// 在你的应用中渲染
<PasswordLoginExample />
<SmsLoginExample />
<TestAllAuthApis />
```

### 方式2: 直接测试API

```bash
# 启动应用
npm start

# 打开调试工具
# 在控制台执行:
import { authApi } from './services/api';

// 测试密码登录
authApi.loginWithPassword({
  username: 'alice_dev',
  password: '123456',
  clientType: 'app'
}).then(console.log);

// 测试发送验证码
authApi.sendSmsCode({
  mobile: '13800138001',
  type: 'login'
}).then(console.log);
```

### 方式3: 使用Postman/Apifox

```bash
# 密码登录
POST http://localhost:8080/xypai-auth/api/v1/auth/login
Content-Type: application/json

{
  "username": "alice_dev",
  "password": "123456",
  "clientType": "app",
  "deviceId": "device_12345",
  "rememberMe": false
}
```

---

## 🔍 调试技巧

### 1. 查看完整日志

```typescript
// authApi方法内部已添加详细日志
// 查看控制台输出:

🔐 [AuthAPI] 密码登录请求
📤 发起登录请求: {...}
📥 登录响应: {...}
✅ 登录成功，已自动设置token
```

### 2. 检查Token

```typescript
import { apiClient } from '@/services/api';

// 查看当前token
console.log('当前Token:', apiClient.getAuthToken());

// 查看clientId
console.log('ClientId:', apiClient.getClientId());
```

### 3. 测试Token有效性

```typescript
const isValid = await authApi.checkTokenValidity();
console.log('Token是否有效:', isValid);
```

---

## ⚠️ 注意事项

### 1. 字段命名差异

| 场景 | 后端字段 | 前端字段 | 说明 |
|------|----------|----------|------|
| 登录 | `username` | `username` | ✅ 用户名 |
| 短信 | `mobile` | `mobile` | ✅ 手机号（不是phone） |
| 客户端 | `clientType` | `clientType` | ✅ 客户端类型 |

### 2. 必填字段

**密码登录**:
- ✅ `username` - 必填
- ✅ `password` - 必填
- ⚠️ `clientType` - 可选（默认'app'）

**短信登录**:
- ✅ `mobile` - 必填
- ✅ `smsCode` - 必填

**发送短信**:
- ✅ `mobile` - 必填
- ✅ `type` - 必填（'login' | 'register' | 'reset'）

### 3. 响应码说明

| code | 说明 | 处理 |
|------|------|------|
| 0 | 成功 | `response.success === true` |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | Token失效，需要重新登录 |
| 500 | 服务器错误 | 提示用户稍后重试 |

### 4. Token自动管理

```typescript
// ✅ 登录后自动保存token
authApi.loginWithPassword(...) 
// → apiClient.setAuthToken() 自动调用

// ✅ 登出后自动清除token
authApi.logout()
// → apiClient.clearAuthToken() 自动调用

// ✅ 后续所有请求自动携带token
// → headers: { 'Authorization': 'Bearer {token}' }
```

---

## 📚 相关文档

1. **后端API文档**: `xypai-security/APP认证.md`
2. **前端实现**: `services/api/authApi.ts`
3. **使用示例**: `services/api/AUTH_LOGIN_EXAMPLE.tsx`
4. **完整指南**: `services/api/AUTH_INTEGRATION_GUIDE.md`
5. **Token机制**: `services/api/TOKEN_INTEGRATION_SUMMARY.md`

---

## ✅ 完成清单

- [x] 创建 `authApi.ts`
- [x] 对接后端9个认证接口
- [x] 类型定义完全匹配后端
- [x] 自动Token管理
- [x] 详细日志输出
- [x] 错误处理
- [x] 创建使用示例
- [x] 创建测试组件
- [ ] **下一步**: 在实际登录页面中集成
- [ ] **下一步**: 连接AuthStore
- [ ] **下一步**: 添加会话管理接口
- [ ] **下一步**: 添加设备管理接口

---

**创建时间**: 2025-10-23  
**状态**: ✅ **核心接口已完成，可以开始使用**  
**优先级**: 🔥 **高（登录功能必需）**

