# ClientId 不匹配问题修复记录

## 🚨 问题描述

### 症状
- 登录成功，Token 有效
- 访问个人主页时返回 401 错误
- 错误信息：`"认证失败，无法访问系统资源"`
- 后端日志没有任何请求记录
- 网关层直接拦截了请求

### 错误日志
```json
{
  "data": "{\"code\": 401, \"msg\": \"认证失败，无法访问系统资源\", \"data\": null}",
  "code": 200,
  "message": "Success"
}
```

---

## 🔍 问题根源

### 网关的 ClientId 验证机制

在 `ruoyi-gateway/src/main/java/org/dromara/gateway/filter/AuthFilter.java` 中：

```java
// 检查 header 与 param 里的 clientid 与 token 里的是否一致
String headerCid = request.getHeaders().getFirst(LoginHelper.CLIENT_KEY);
String paramCid = request.getQueryParams().getFirst(LoginHelper.CLIENT_KEY);
String clientId = StpUtil.getExtra(LoginHelper.CLIENT_KEY).toString();

if (!StringUtils.equalsAny(clientId, headerCid, paramCid)) {
    // token 无效
    throw NotLoginException.newInstance(StpUtil.getLoginType(),
        "-100", "客户端ID与Token不匹配",
        StpUtil.getTokenValue());
}
```

### 不匹配的原因

| 位置 | 字段名 | 值 | 说明 |
|-----|-------|---|------|
| **登录请求** | `clientType` | `'app'` | 发送到后端 `/api/v1/auth/login` |
| **Token 存储** | `LoginHelper.CLIENT_KEY` | `'app'` | 后端将 clientType 存储到 token 的 extra 中 |
| **后续请求** | `X-Client-Id` | `'web_client'` | ❌ 前端默认值，与 token 中不一致 |
| **网关验证** | - | `'app' !== 'web_client'` | ❌ 验证失败，返回 401 |

---

## 🔧 解决方案

### 修改前端 ClientId

在 `services/api/client.ts` 中：

```typescript
// 修改前
private clientId: string = 'web_client';

// 修改后
private clientId: string = 'app';  // 必须与登录时的 clientType 一致！
```

### 验证流程

```typescript
// 1. 登录时
const response = await authApi.loginWithPassword({
  username: '13900000001',
  password: 'Test@123456',
  clientType: 'app',  // ✅ 发送到后端
  deviceId: 'device_xxx'
});

// 2. 后端存储
// Token extra: { clientId: 'app' }

// 3. 后续请求
const headers = {
  'Authorization': 'Bearer <token>',
  'X-Client-Id': 'app'  // ✅ 与 token 中的一致
};

// 4. 网关验证
// headerCid: 'app'
// tokenCid: 'app'
// 'app' === 'app' ✅ 通过验证
```

---

## ✅ 验证结果

### 修复前
```log
🔑 API请求拦截
   Token格式: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJh...
   ClientId: web_client ❌ (不匹配)

❌ 响应: {"code": 401, "msg": "认证失败，无法访问系统资源"}
```

### 修复后
```log
🔑 API请求拦截
   Token格式: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJh...
   ClientId: app ✅ (与登录时的 clientType 一致)

✅ 响应: {
  "data": {
    "userId": 2000,
    "nickname": "APP测试员",
    ...
  },
  "code": 200
}
```

---

## 📚 相关知识

### LoginHelper.CLIENT_KEY

后端定义：
```java
// LoginHelper.java
public static final String CLIENT_KEY = "clientId";
```

### 请求流程

```
前端 APP
  ↓ 登录: POST /api/v1/auth/login
  ↓ Body: { username, password, clientType: 'app' }
  ↓
网关 (AuthFilter - 跳过登录接口)
  ↓
xypai-auth 服务
  ↓ 创建 Token，存储 extra: { clientId: 'app' }
  ↓ 返回: { accessToken: 'xxx' }
  ↓
前端保存 Token
  ↓
  ↓ 后续请求: GET /api/v2/user/profile/2000
  ↓ Headers: { Authorization: 'Bearer xxx', X-Client-Id: 'app' }
  ↓
网关 (AuthFilter)
  ↓ 1. 验证 Token 有效性
  ↓ 2. 检查 ClientId: headerCid === tokenCid ✅
  ↓ 3. 通过验证，转发请求
  ↓
xypai-user 服务
  ↓ 返回用户资料
```

---

## ⚠️ 注意事项

### 1. ClientId 必须全局一致

如果你的 APP 有多个入口（登录、注册、第三方登录等），**所有入口都必须使用相同的 clientType**。

```typescript
// ✅ 正确：所有入口统一使用 'app'
loginWithPassword({ ..., clientType: 'app' })
loginWithSms({ ..., clientType: 'app' })
register({ ..., clientType: 'app' })

// ❌ 错误：不同入口使用不同的 clientType
loginWithPassword({ ..., clientType: 'app' })
loginWithSms({ ..., clientType: 'mobile' })  // ❌ 不一致！
```

### 2. 不同客户端使用不同的 ClientId

| 客户端类型 | clientType/clientId | 说明 |
|----------|-------------------|------|
| Web 后台管理 | `'web'` | 管理员使用 |
| 移动 APP | `'app'` | 普通用户使用 |
| 小程序 | `'mini'` | 微信小程序 |

### 3. Token 过期后需要重新登录

如果修改了 clientId，旧的 token 将无法使用（clientId 不匹配），用户需要重新登录。

---

## 🔍 故障排查

### 如何确认 ClientId 不匹配？

1. **查看网关日志**
   - 搜索："客户端ID与Token不匹配"
   - 或："认证失败，无法访问系统资源"

2. **查看前端日志**
   ```log
   🔑 API请求拦截
      ClientId: xxx  ← 检查这个值
   ```

3. **直接测试**
   ```bash
   # 使用 curl 测试（带错误的 clientId）
   curl -X GET \
     'http://localhost:8080/xypai-user/api/v2/user/profile/2000' \
     -H 'Authorization: Bearer <token>' \
     -H 'X-Client-Id: wrong_client_id'
   
   # 应该返回 401
   ```

---

## 📖 参考文档

- [Sa-Token 官方文档](https://sa-token.cc)
- [Sa-Token 多端登录](https://sa-token.cc/doc.html#/plugin/multi-client)
- [RuoYi-Cloud-Plus 网关配置](../ruoyi-gateway/README.md)

---

## 🔄 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2025-01-28 | 初始版本，修复 clientId 不匹配问题 |

---

## 👨‍💻 维护者

如有问题，请联系技术团队。

