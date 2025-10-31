# Token 格式适配说明

## 📌 问题背景

### 原始问题
- **前端发送**: `Authorization: Bearer <token>`
- **后端期望**: `Authorization: <token>` (Sa-Token 默认配置)
- **结果**: 后端无法识别 token，返回 401 错误

### 为什么不修改后端？

后端的 Sa-Token 配置可能是为**管理端（Web 后台）**设计的：
```yaml
# script/config/nacos/application-common.yml
sa-token:
  token-name: Authorization
  check-same-token: true
  # 没有配置 token-prefix: Bearer
```

如果修改全局配置，可能会影响：
1. ✅ 管理端的认证逻辑
2. ✅ 其他已有的微服务
3. ✅ 现有的测试和部署流程

---

## 🔧 解决方案

### **修改前端适配后端（推荐）**

在 `services/api/client.ts` 中修改 `setAuthToken` 方法：

```typescript
// 修改前（标准 OAuth2.0 格式）
setAuthToken(token: string): void {
  this.defaultHeaders['Authorization'] = `Bearer ${token}`;
}

// 修改后（适配 Sa-Token 默认配置）
setAuthToken(token: string): void {
  this.defaultHeaders['Authorization'] = token;
}
```

---

## ✅ 优点

### 1. **最小影响原则**
- ✅ 不修改后端全局配置
- ✅ 不影响管理端
- ✅ 不影响其他服务

### 2. **快速部署**
- ✅ 只需要重启前端 APP
- ✅ 不需要重启后端服务
- ✅ 不需要更新 Nacos 配置

### 3. **兼容性好**
- ✅ APP 端独立配置
- ✅ 管理端保持不变
- ✅ 两端互不干扰

---

## 📋 Token 格式对比

| 端 | Header 格式 | 说明 |
|-----|------------|------|
| **管理端 (Web)** | `Authorization: <token>` | 保持原有配置 |
| **APP 端 (Mobile)** | `Authorization: <token>` | 🆕 前端适配后端 |

**注意**: 两端现在使用相同的格式，都不使用 "Bearer" 前缀。

---

## 🔍 如何验证

### 查看前端日志

```log
🔑 [第三层] API请求拦截 - 已自动添加token
   请求: GET /xypai-user/api/v2/user/profile/2000
   Token格式: Authorization: eyJ0eXAiOiJKV1QiLCJh... (无Bearer前缀) ✅
   说明: APP端直接发送token，适配后端Sa-Token默认配置
```

### 成功的响应

```json
{
  "data": {
    "userId": 2000,
    "nickname": "APP测试员",
    ...
  },
  "code": 200,
  "message": "操作成功"
}
```

---

## 🚨 注意事项

### 如果后端升级了 Sa-Token 配置

如果将来后端全局配置改为支持 Bearer 前缀：

```yaml
sa-token:
  token-name: Authorization
  token-prefix: Bearer  # 🆕 添加此配置
  is-read-header: true
```

那么前端需要**恢复原来的配置**：

```typescript
setAuthToken(token: string): void {
  this.defaultHeaders['Authorization'] = `Bearer ${token}`;
}
```

### 如何判断后端是否支持 Bearer？

1. **查看 Nacos 配置**
   - 登录 Nacos: http://localhost:8848/nacos
   - 查看 `application-common.yml`
   - 检查是否有 `token-prefix: Bearer`

2. **查看后端日志**
   - 搜索 `Sa-Token` 启动日志
   - 查看 token 配置信息

3. **测试 API**
   - 尝试发送 `Authorization: Bearer <token>`
   - 如果返回 200，说明支持 Bearer
   - 如果返回 401，说明不支持

---

## 📚 相关文档

- [Sa-Token 官方文档](https://sa-token.cc)
- [Sa-Token Token 前缀配置](https://sa-token.cc/doc.html#/use/config)
- [OAuth 2.0 Bearer Token](https://datatracker.ietf.org/doc/html/rfc6750)

---

## 🔄 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2025-01-28 | 初始版本，前端适配后端，去掉 Bearer 前缀 |

---

## 👨‍💻 维护者

如有问题，请联系技术团队。

