# 🌐 网关路由配置说明

> **RuoYi-Cloud-Plus网关路由机制**
> 
> **更新**: 2025-10-22

---

## 🎯 **核心问题解答**

### ❓ **为什么需要添加服务名前缀？**

**答**: 因为使用了Spring Cloud Gateway网关路由

```
前端 → 网关(8080) → 各个微服务
```

---

## 🔄 **网关路由工作原理**

### 📊 **完整请求流程**

```
前端应用
    ↓ 请求: /xypai-user/api/v1/users/list
    ↓
网关 (localhost:8080)
    ↓ 匹配路由规则: Path=/xypai-user/**
    ↓ StripPrefix=1 (去掉第一段路径)
    ↓ 转发: /api/v1/users/list
    ↓
xypai-user服务 (localhost:9202)
    ↓ Controller处理: @RequestMapping("/api/v1/users")
    ↓ 返回数据
    ↓
网关转发回前端
    ↓
前端接收数据
```

### 📝 **网关配置示例**

```yaml
# ruoyi-gateway.yml

# XYPai 用户服务
- id: xypai-user
  uri: lb://xypai-user       # 负载均衡到xypai-user服务
  predicates:
    - Path=/xypai-user/**    # 匹配所有 /xypai-user/** 的请求
  filters:
    - StripPrefix=1          # 去掉路径的第一段 (/xypai-user)
```

**含义**：
- `Path=/xypai-user/**` - 只有以`/xypai-user/`开头的请求才会路由到此服务
- `StripPrefix=1` - 转发前去掉第一段路径（`/xypai-user`）

---

## 🎯 **路径映射关系**

### 示例1: 用户列表

| 步骤 | 路径 | 说明 |
|------|------|------|
| 前端请求 | `/xypai-user/api/v1/users/list` | 完整路径 |
| 网关匹配 | `/xypai-user/**` | ✅ 匹配成功 |
| StripPrefix | 去掉 `/xypai-user` | 处理路径 |
| 转发到服务 | `/api/v1/users/list` | 服务接收 |
| Controller | `@RequestMapping("/api/v1/users")` | 处理请求 |

### 示例2: 内容列表

| 步骤 | 路径 | 说明 |
|------|------|------|
| 前端请求 | `/xypai-content/api/v1/contents/list` | 完整路径 |
| 网关匹配 | `/xypai-content/**` | ✅ 匹配成功 |
| StripPrefix | 去掉 `/xypai-content` | 处理路径 |
| 转发到服务 | `/api/v1/contents/list` | 服务接收 |
| Controller | `@RequestMapping("/api/v1/contents")` | 处理请求 |

### 示例3: 错误示例（之前的问题）

| 步骤 | 路径 | 说明 |
|------|------|------|
| 前端请求 | `/api/v1/users/list` | ❌ 缺少服务名 |
| 网关匹配 | 无匹配的路由 | ❌ 404 Not Found |
| 结果 | 网络连接失败 | ❌ 无法转发 |

---

## 📋 **已修复的API端点**

### ✅ **修复前（错误）**

```typescript
USER: {
  LIST: '/api/v1/users/list',  // ❌ 缺少 /xypai-user 前缀
}
```

### ✅ **修复后（正确）**

```typescript
USER: {
  LIST: '/xypai-user/api/v1/users/list',  // ✅ 包含服务名前缀
}
```

---

## 🗺️ **所有服务的路由映射**

| 服务名 | 网关前缀 | 端口 | 示例路径 |
|--------|----------|------|----------|
| xypai-user | `/xypai-user/**` | 9202 | `/xypai-user/api/v1/users/list` |
| xypai-content | `/xypai-content/**` | 9203 | `/xypai-content/api/v1/contents/list` |
| xypai-chat | `/xypai-chat/**` | 9204 | `/xypai-chat/api/v1/messages/list` |
| xypai-trade | `/xypai-trade/**` | 9205 | `/xypai-trade/api/v1/orders/list` |
| xypai-auth | `/xypai-auth/**` | 9201 | `/xypai-auth/api/v1/auth/login` |
| ruoyi-system | `/system/**` | 9201 | `/system/api/v1/config/system` |
| ruoyi-resource | `/resource/**` | 9300 | `/resource/api/v1/upload/image` |

---

## 📝 **当前API端点配置**

### 首页相关 (xypai-user)

```typescript
HOMEPAGE: {
  CONFIG: '/xypai-user/api/v1/homepage/config',
  FEATURED_USERS: '/xypai-user/api/v1/homepage/featured-users',
  SERVICES: '/xypai-user/api/v1/homepage/services',
  // ...
}
```

### 用户相关 (xypai-user)

```typescript
USER: {
  LIST: '/xypai-user/api/v1/users/list',
  DETAIL: '/xypai-user/api/v2/user/profile/:userId',
  STATS: '/xypai-user/api/v1/users/stats/:userId',
  // ...
}
```

### 内容相关 (xypai-content)

```typescript
CONTENT: {
  LIST: '/xypai-content/api/v1/contents/list',
  HOT: '/xypai-content/api/v1/contents/hot',
  NEARBY: '/xypai-content/api/v1/contents/nearby',
  // ...
}
```

---

## ✅ **测试验证**

### 方法1: 直接测试后端（跳过网关）

```bash
# 直接访问xypai-user服务（端口9202）
curl http://localhost:9202/api/v1/users/list

# 期望：返回用户列表数据
```

### 方法2: 通过网关测试

```bash
# 通过网关访问（端口8080，需要服务名前缀）
curl http://localhost:8080/xypai-user/api/v1/users/list

# 网关流程：
# 1. 匹配规则: /xypai-user/** ✅
# 2. 去掉前缀: /api/v1/users/list
# 3. 转发到: xypai-user服务
# 4. 返回数据
```

### 方法3: 前端测试

```bash
# 启动应用
npm start

# 查看控制台
LOG  📡 请求: GET /xypai-user/api/v1/users/list  ✅ 正确路径
LOG  ✅ API加载成功  ✅ 连接成功
```

---

## 🐛 **常见问题**

### Q1: 看到"网络连接失败"

**原因**: API路径没有服务名前缀

**解决**: 确保所有API路径都有服务名前缀（如`/xypai-user/`）

### Q2: 看到404错误

**原因1**: 服务名前缀错误  
**原因2**: 后端Controller路径不匹配  
**原因3**: 后端服务未启动

**检查**:
```bash
# 检查后端服务是否启动
curl http://localhost:8080/xypai-user/api/v1/users/list

# 检查网关配置
# 查看 ruoyi-gateway.yml 中的路由配置
```

### Q3: 如何知道使用哪个服务？

**规则**:
- 用户相关 → `xypai-user`
- 内容相关 → `xypai-content`
- 聊天相关 → `xypai-chat`
- 交易相关 → `xypai-trade`
- 认证相关 → `xypai-auth`
- 系统配置 → `system`
- 资源上传 → `resource`

---

## 🎯 **验证修复**

### 重启应用后，日志应该显示：

```javascript
// ❌ 修复前
LOG  📡 请求: GET /api/v1/users/list
WARN ⚠️ 网络连接失败

// ✅ 修复后
LOG  📡 请求: GET /xypai-user/api/v1/users/list
LOG  ✅ API加载成功 {count: 20}
```

---

## 📞 **如果还是失败**

### 检查清单：

1. **后端服务是否启动？**
   ```bash
   # 检查xypai-user服务
   curl http://localhost:9202/api/v1/users/list
   ```

2. **网关是否启动？**
   ```bash
   # 检查网关
   curl http://localhost:8080/actuator/health
   ```

3. **API地址是否正确？**
   ```env
   # .env.development
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080  ✅
   # 或
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080  ✅
   ```

4. **前端路径是否正确？**
   ```typescript
   // 查看 services/api/config.ts
   USER: {
     LIST: '/xypai-user/api/v1/users/list',  // ✅ 有前缀
   }
   ```

---

**创建时间**: 2025-10-22  
**问题**: API路径缺少服务名前缀  
**解决**: 所有端点添加服务名前缀  
**状态**: ✅ 已修复

🎉 **现在重启应用，应该能成功连接后端了！**


