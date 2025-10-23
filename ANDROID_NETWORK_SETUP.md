# 🤖 Android环境网络配置指南

> **解决Android模拟器无法访问主机localhost的问题**
> 
> **创建时间**: 2025-10-22  
> **适用**: Android Studio模拟器

---

## 🎯 **核心问题**

### ❌ **问题现象**

```
Android模拟器内运行的应用
    ↓
请求: http://localhost:8080/api/...
    ↓
连接到: Android模拟器自己的localhost
    ↓
❌ 网络连接失败（主机后端没在模拟器内）
```

### ✅ **解决方案**

```
Android模拟器内运行的应用
    ↓
请求: http://10.0.2.2:8080/api/...  ⬅️ 使用特殊IP
    ↓
10.0.2.2 = 主机的localhost
    ↓
连接到: 主机的8080端口
    ↓
✅ 成功访问后端服务
```

---

## 🔧 **已自动修复**

### ✅ **自动检测机制**（已实现）

**文件**: `services/api/config.ts` 第16-38行

```typescript
const getDevApiUrl = (): string => {
  // 1. 优先使用环境变量
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // 2. 自动检测平台
  if (Platform.OS === 'android') {
    // 🤖 Android模拟器 → 10.0.2.2
    return 'http://10.0.2.2:8080';
  } else if (Platform.OS === 'ios') {
    // 🍎 iOS模拟器 → localhost
    return 'http://localhost:8080';
  } else {
    // 🌐 Web → localhost
    return 'http://localhost:8080';
  }
};
```

---

## 📱 **不同环境的IP地址**

| 环境 | IP地址 | 端口 | 说明 |
|------|--------|------|------|
| **Android Studio模拟器** | `10.0.2.2` | 8080 | ✅ 已自动配置 |
| **iOS模拟器** | `localhost` | 8080 | ✅ 已自动配置 |
| **Genymotion模拟器** | `10.0.3.2` | 8080 | 需要手动配置 |
| **真实Android设备** | `192.168.1.XXX` | 8080 | 需要手动配置 |
| **真实iOS设备** | `192.168.1.XXX` | 8080 | 需要手动配置 |
| **Web浏览器** | `localhost` | 8080 | ✅ 已自动配置 |

---

## 🎯 **验证修复**

### 重启应用后查看日志：

```javascript
// 启动时会显示：
LOG  [API Config] 🤖 检测到Android环境，使用 10.0.2.2:8080 访问主机

// 然后API请求会使用正确地址：
LOG  📡 请求: GET http://10.0.2.2:8080/xypai-user/api/v1/users/list
//                    ↑ 正确的IP地址

// 成功连接后端：
LOG  [useHomeState] ✅ API加载成功 {count: 20}
```

---

## 🔧 **手动配置（可选）**

### 方法1: 环境变量配置

创建 `.env.development`:

```env
# Android Studio模拟器（自动配置，无需设置）
# EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080

# Genymotion模拟器
EXPO_PUBLIC_API_BASE_URL=http://10.0.3.2:8080

# 真实设备（使用主机局域网IP）
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
```

**查看主机IP**:
```bash
# Windows
ipconfig
# 找到 "IPv4 地址" → 如 192.168.1.100

# Mac/Linux
ifconfig
# 找到 "inet" → 如 192.168.1.100
```

### 方法2: 代码中覆盖

编辑 `services/api/config.ts`:

```typescript
const getDevApiUrl = (): string => {
  // 强制使用指定地址
  return 'http://192.168.1.100:8080';  // ⬅️ 修改为你的主机IP
  
  // 或保持自动检测...
};
```

---

## 📊 **网络测试**

### 测试1: 检测IP配置

```bash
# 重启应用后，查看控制台第一行日志：
LOG  [API Config] 🤖 检测到Android环境，使用 10.0.2.2:8080 访问主机
# ✅ 说明IP配置正确
```

### 测试2: 测试网络连通性

**在Android模拟器内测试**（通过adb）:

```bash
# 1. 连接到模拟器shell
adb shell

# 2. 测试主机连通性
ping -c 3 10.0.2.2

# 3. 测试端口是否开放
telnet 10.0.2.2 8080

# 期望：能连通，说明网络配置正确
```

### 测试3: 测试API调用

```bash
# 在模拟器内测试（通过adb）
adb shell

# 使用curl测试（需要先在模拟器内安装curl）
curl http://10.0.2.2:8080/xypai-user/api/v1/users/list

# 期望：返回用户列表数据
```

---

## 🐛 **故障排查**

### 问题1: 仍然显示"网络连接失败"

**检查步骤**:

1. **确认后端服务已启动**
   ```bash
   # 在主机上测试
   curl http://localhost:8080/xypai-user/api/v1/users/list
   
   # 应该返回数据
   ```

2. **确认网关正常工作**
   ```bash
   curl http://localhost:8080/actuator/health
   
   # 应该返回健康状态
   ```

3. **确认模拟器网络正常**
   ```bash
   # 在模拟器内ping主机
   adb shell ping -c 3 10.0.2.2
   
   # 应该有响应
   ```

4. **查看详细错误**
   ```javascript
   // 查看控制台ERROR日志
   ERROR [HomepageAPI] ... 
   // 查看具体错误信息
   ```

### 问题2: Genymotion模拟器不work

**解决**：Genymotion使用不同的IP

```env
# .env.development
EXPO_PUBLIC_API_BASE_URL=http://10.0.3.2:8080
```

### 问题3: 真实设备连不上

**解决**：使用主机的局域网IP

```bash
# 1. 查看主机IP
ipconfig  # Windows
# 找到: 192.168.1.100

# 2. 配置环境变量
# .env.development
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080

# 3. 确保手机和电脑在同一WiFi
# 4. 确保防火墙允许8080端口
```

---

## 🎓 **网络知识点**

### Android模拟器特殊IP地址

| IP地址 | 含义 |
|--------|------|
| `10.0.2.1` | 模拟器的网关 |
| `10.0.2.2` | **主机的localhost**（最重要） |
| `10.0.2.3` | 第一个DNS服务器 |
| `127.0.0.1` | 模拟器自己（不是主机） |

### 端口号

| 端口 | 服务 |
|------|------|
| 8080 | RuoYi网关 |
| 9202 | xypai-user服务 |
| 9203 | xypai-content服务 |
| 8848 | Nacos注册中心 |
| 6379 | Redis |

---

## ✅ **最佳实践**

### 推荐配置方案

```env
# .env.development

# ===== Android Studio模拟器 =====
# 无需配置，自动使用 10.0.2.2

# ===== Genymotion模拟器 =====
# EXPO_PUBLIC_API_BASE_URL=http://10.0.3.2:8080

# ===== 真实设备（同一WiFi） =====
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080

# ===== iOS模拟器 =====
# 无需配置，自动使用 localhost

# ===== 测试环境 =====
# EXPO_PUBLIC_API_BASE_URL=https://test-api.xiangyupai.com

# ===== 生产环境 =====
# EXPO_PUBLIC_API_BASE_URL=https://api.xiangyupai.com
```

---

## 📝 **配置说明**

### 自动检测（默认，推荐）

```typescript
// ✅ 优点
- 无需手动配置
- 自动适配Android/iOS/Web
- 开发体验好

// ⚠️ 限制
- 只支持Android Studio标准模拟器
- 不支持Genymotion
- 不支持真实设备

// 📊 适用场景
- 本地开发调试
- Android Studio模拟器
- iOS模拟器
```

### 环境变量（灵活，强大）

```typescript
// ✅ 优点
- 可以覆盖自动检测
- 支持所有环境
- 团队协作友好

// 📊 适用场景
- Genymotion模拟器
- 真实设备测试
- 团队协作
- 多环境切换
```

---

## 🚀 **立即测试**

### 步骤：

```bash
# 1. 确保后端服务启动
# 在主机上运行：
curl http://localhost:8080/xypai-user/api/v1/users/list
# 应该返回数据 ✅

# 2. 停止前端应用（Ctrl+C）

# 3. 重新启动前端
npm start

# 4. 查看控制台第一行日志：
LOG  [API Config] 🤖 检测到Android环境，使用 10.0.2.2:8080 访问主机
# ✅ 说明配置正确

# 5. 查看API请求日志：
LOG  📡 请求: GET http://10.0.2.2:8080/xypai-user/api/v1/users/list
# ✅ 使用正确IP

# 6. 查看加载结果：
LOG  [useHomeState] ✅ API加载成功 {count: 20}
# ✅ 成功连接后端
```

---

## 📊 **修复对比**

### ❌ **修复前**

```javascript
// API地址
BASE_URL: 'http://localhost:8080'

// Android模拟器
请求: http://localhost:8080/...
↓
连接到: 模拟器自己的localhost
↓
❌ 网络连接失败（主机后端不在模拟器内）
```

### ✅ **修复后**

```javascript
// API地址（自动检测）
if (Platform.OS === 'android') {
  return 'http://10.0.2.2:8080';  // ⬅️ 魔法IP
}

// Android模拟器
请求: http://10.0.2.2:8080/...
↓
10.0.2.2 = 主机的localhost
↓
连接到: 主机的8080端口
↓
✅ 成功访问后端服务
```

---

## 🎉 **总结**

### ✨ **已完成修复**

1. ✅ **自动检测Android环境**
2. ✅ **自动使用10.0.2.2地址**
3. ✅ **支持环境变量覆盖**
4. ✅ **兼容iOS和Web**
5. ✅ **添加详细日志**

### 📝 **修复效果**

- ✅ Android Studio模拟器：自动使用`10.0.2.2`
- ✅ iOS模拟器：自动使用`localhost`
- ✅ 真实设备：可通过环境变量配置局域网IP
- ✅ 所有平台都有日志提示

### 🚀 **下一步**

```bash
# 重启应用
npm start

# 期望看到：
LOG  [API Config] 🤖 检测到Android环境，使用 10.0.2.2:8080 访问主机
LOG  [useHomeState] ✅ API加载成功 {count: 20}

# 🎉 成功！
```

---

**创建时间**: 2025-10-22  
**问题**: Android模拟器无法访问主机localhost  
**解决**: 自动使用10.0.2.2特殊IP  
**状态**: ✅ 已修复


