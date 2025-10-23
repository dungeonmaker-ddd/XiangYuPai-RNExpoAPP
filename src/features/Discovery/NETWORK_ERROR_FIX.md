# 🔧 Discovery模块 - 网络错误修复指南

> **错误**: "加载动态失败: 网络连接失败"  
> **原因**: 后端服务未启动或网络配置问题

---

## 🎯 快速修复（3步）

### 步骤1: 检查后端服务

```bash
# 1. 检查Docker服务
cd RuoYi-Cloud-Plus
docker ps

# 应该看到：
# ✅ mysql (端口3306)
# ✅ redis (端口6379)
# ✅ nacos (端口8848)

# 如果没有，启动Docker：
cd script/docker
docker-compose up -d mysql redis nacos
```

### 步骤2: 启动xypai-content服务

```bash
# 方法1: 使用IDE启动
# 在IDE中运行 XyPaiContentApplication 主类

# 方法2: 使用Maven启动
cd xypai-content
mvn spring-boot:run

# 验证服务是否启动
curl http://localhost:9403/actuator/health
# 应返回: {"status":"UP"}
```

### 步骤3: 验证前端配置

检查API配置是否正确：

```typescript
// services/api/config.ts

export const API_CONFIG = {
  ENVIRONMENT: 'development',  // ✅ 确认是development
  
  BASE_URL: {
    development: 'http://localhost:8080',  // ✅ 网关地址
    // 或直接连接服务
    development: 'http://localhost:9403',  // 内容服务地址
  },
};
```

---

## 🔧 详细排查步骤

### 检查1: Docker服务状态

```bash
# PowerShell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 预期输出：
NAME    STATUS          PORTS
mysql   Up X minutes    0.0.0.0:3306->3306/tcp
redis   Up X minutes    0.0.0.0:6379->6379/tcp
nacos   Up X minutes    0.0.0.0:8848->8848/tcp
```

**如果服务未启动**：
```bash
cd RuoYi-Cloud-Plus/script/docker
docker-compose up -d
```

---

### 检查2: xypai-content服务状态

```bash
# 测试健康检查
curl http://localhost:9403/actuator/health

# 如果返回错误，查看日志
cd RuoYi-Cloud-Plus/xypai-content
tail -f logs/info.log
```

**常见启动失败原因**：
1. ❌ Nacos配置未加载
2. ❌ MySQL连接失败
3. ❌ Redis连接失败
4. ❌ 端口被占用

**解决方法**：
```bash
# 查看完整启动日志
mvn spring-boot:run

# 查看端口占用
netstat -ano | findstr 9403
```

---

### 检查3: 网络连接测试

```bash
# 测试网关
curl http://localhost:8080/actuator/health

# 测试内容服务
curl http://localhost:9403/actuator/health

# 测试具体API
curl http://localhost:9403/api/v1/contents/hot?limit=5
```

---

### 检查4: 前端API配置

<function_calls>
<invoke name="read_file">
<parameter name="target_file">XiangYuPai-RNExpoAPP/app/(tabs)/discover.tsx
