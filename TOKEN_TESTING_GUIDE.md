# 🧪 Token Transmission Testing Guide

**如何测试不同的Token传输方式**

---

## 📋 快速开始

### 1. 导入测试工具

在你的任意测试文件或页面中 (例如: `app/(tabs)/homepage.tsx`):

```typescript
import { 
  switchTokenPreset,
  printTokenConfig,
  testAllPresets,
  printAllPresetDescriptions 
} from '@/services/api/tokenTestUtils';
```

### 2. 查看所有可用的预设

```typescript
// 打印所有预设的详细说明
printAllPresetDescriptions();
```

### 3. 切换到不同的预设进行测试

```typescript
// 测试标准配置 (默认)
switchTokenPreset('STANDARD');

// 测试无Bearer前缀
switchTokenPreset('NO_PREFIX');

// 测试自定义headers
switchTokenPreset('CUSTOM_HEADERS');

// 测试URL参数
switchTokenPreset('URL_PARAMETER');

// 测试组合模式 (所有方法)
switchTokenPreset('ALL_METHODS');

// 测试最简模式
switchTokenPreset('MINIMAL');
```

### 4. 查看当前配置

```typescript
// 打印当前的Token配置
printTokenConfig();
```

---

## 🎯 测试场景

### 场景1: 后端返回401 "认证失败"

**问题**: 你已登录成功，但所有API调用都返回401。

**测试步骤**:

```typescript
// 1. 先确认当前配置
printTokenConfig();

// 2. 尝试最全面的配置（所有方法）
switchTokenPreset('ALL_METHODS');

// 3. 调用一个需要认证的API
const profile = await profileApi.getUserProfile(2000);

// 4. 查看控制台日志，看后端接收到了哪些headers
```

**预期结果**:
- 如果成功了 → 说明token能被接收，只是某个配置不对
- 如果还失败 → 可能是token本身无效（需要重新登录）

---

### 场景2: 确定后端期望的Token格式

**问题**: 不确定后端期望 "Bearer <token>" 还是 "<token>"。

**测试步骤**:

```typescript
// 1. 测试带Bearer前缀 (标准)
switchTokenPreset('STANDARD');
const result1 = await profileApi.getUserProfile(2000);
console.log('带Bearer前缀:', result1.success ? '✅ 成功' : '❌ 失败');

// 2. 测试不带Bearer前缀
switchTokenPreset('NO_PREFIX');
const result2 = await profileApi.getUserProfile(2000);
console.log('不带Bearer前缀:', result2.success ? '✅ 成功' : '❌ 失败');
```

**预期结果**:
- 哪个成功，就用哪个配置

---

### 场景3: 测试ClientId是否必需

**问题**: 不确定后端是否要求 `clientid` header。

**测试步骤**:

```typescript
// 1. 测试带clientid (标准)
switchTokenPreset('STANDARD');
const result1 = await profileApi.getUserProfile(2000);
console.log('带clientid:', result1.success ? '✅ 成功' : '❌ 失败');

// 2. 测试不带clientid
switchTokenPreset('MINIMAL');
const result2 = await profileApi.getUserProfile(2000);
console.log('不带clientid:', result2.success ? '✅ 成功' : '❌ 失败');
```

**预期结果**:
- SA-Token的Gateway通常**要求clientid**，所以MINIMAL会失败

---

### 场景4: 测试自定义Header名称

**问题**: 后端可能使用 `satoken` 或 `token` 而不是 `Authorization`。

**测试步骤**:

```typescript
// 测试自定义headers
switchTokenPreset('CUSTOM_HEADERS');
const result = await profileApi.getUserProfile(2000);
console.log('自定义headers:', result.success ? '✅ 成功' : '❌ 失败');

// 查看发送了哪些headers
printTokenConfig();
```

**预期结果**:
- 控制台会显示同时发送了 `satoken`, `token`, `X-Token` 三个headers

---

### 场景5: 自动化测试所有配置

**问题**: 想一次性测试所有配置，找出哪个可用。

**测试步骤**:

```typescript
// 查看所有预设
testAllPresets();

// 逐个测试
const presets = ['STANDARD', 'NO_PREFIX', 'CUSTOM_HEADERS', 'URL_PARAMETER', 'MINIMAL'] as const;

for (const preset of presets) {
  console.log(`\n🧪 测试预设: ${preset}`);
  switchTokenPreset(preset);
  
  try {
    const result = await profileApi.getUserProfile(2000);
    console.log(`✅ ${preset}: 成功!`);
    console.log(`   返回数据:`, result.data);
  } catch (error) {
    console.log(`❌ ${preset}: 失败`);
    console.log(`   错误:`, error.message);
  }
}
```

**预期结果**:
- 会告诉你哪个预设配置可以工作

---

## 🔍 调试技巧

### 技巧1: 启用详细日志

所有预设默认启用详细日志 (`enableDebugLogs: true`)，你会看到:

```
🔑 [Token Injection] 准备注入Token
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   请求: GET /xypai-user/api/v2/user/profile/2000
   Token (前20字符): eyJhbGciOiJIUzI1NiI...
   Token (长度): 234 字符
   ✅ [Method 1] Authorization Header
      Header: Authorization: Bearer eyJhbGciOi...
      格式: Bearer <token>
   ✅ [Method 2] Custom Headers
      Headers: satoken, token, X-Token
      值: eyJhbGciOiJIUzI1NiI... (无前缀)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 [ClientId] 已添加ClientId Header
   Header: clientid: app
   说明: 必须与登录时的clientType一致！
```

### 技巧2: 查看后端Gateway日志

在后端Gateway控制台查看:

```
✅ Token验证成功: userId=2000, clientid=app
```

或者:

```
❌ 客户端ID与Token不匹配
❌ Token不存在
❌ Authorization header 未提供
```

根据错误信息调整前端配置。

### 技巧3: 使用浏览器Network工具

如果是Web端测试:

1. 打开浏览器开发者工具 (F12)
2. 切换到 **Network** 标签
3. 发送API请求
4. 点击请求，查看 **Headers** 标签
5. 检查 **Request Headers** 中是否包含:
   - `Authorization: Bearer <token>`
   - `clientid: app`

---

## 📝 实际使用示例

### 示例1: 在Homepage组件中测试

**文件**: `app/(tabs)/homepage.tsx`

```typescript
import { useEffect } from 'react';
import { switchTokenPreset, printTokenConfig } from '@/services/api/tokenTestUtils';

export default function Homepage() {
  useEffect(() => {
    // 初始化时切换到测试配置
    switchTokenPreset('ALL_METHODS');  // 测试所有方法
    printTokenConfig();
  }, []);
  
  // ... rest of component
}
```

### 示例2: 在Profile页面中测试

**文件**: `app/profile/[userId].tsx`

```typescript
import { useEffect, useState } from 'react';
import { profileApi } from '@/services/api/profileApi';
import { switchTokenPreset } from '@/services/api/tokenTestUtils';

export default function UserProfile({ userId }: { userId: number }) {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    async function testTokenMethods() {
      const methods = ['STANDARD', 'NO_PREFIX', 'CUSTOM_HEADERS'] as const;
      
      for (const method of methods) {
        console.log(`\n🧪 Testing: ${method}`);
        switchTokenPreset(method);
        
        try {
          const result = await profileApi.getUserProfile(userId);
          console.log(`✅ ${method} works!`);
          setProfile(result);
          break;  // 找到一个可用的就停止
        } catch (error) {
          console.log(`❌ ${method} failed:`, error.message);
        }
      }
    }
    
    testTokenMethods();
  }, [userId]);
  
  // ... rest of component
}
```

### 示例3: 在应用启动时全局配置

**文件**: `app/_layout.tsx`

```typescript
import { useEffect } from 'react';
import { apiClient } from '@/services/api/client';
import { useAuthStore } from '@/features/AuthModule/stores/authStore';
import { switchTokenPreset } from '@/services/api/tokenTestUtils';

export default function RootLayout() {
  useEffect(() => {
    // 连接API客户端到AuthStore
    apiClient.connectAuthStore(useAuthStore);
    
    // 设置ClientId
    apiClient.setClientId('app');
    
    // 🧪 在开发环境测试不同配置
    if (__DEV__) {
      // 方式1: 使用预设
      switchTokenPreset('STANDARD');  // 或 'ALL_METHODS' 用于调试
      
      // 方式2: 自定义配置
      // apiClient.configureTokenTransmission({
      //   useAuthorizationHeader: true,
      //   tokenPrefix: 'Bearer',
      //   includeClientId: true,
      //   enableDebugLogs: true,
      // });
    } else {
      // 生产环境使用静默模式
      switchTokenPreset('SILENT');
    }
  }, []);
  
  // ... rest of layout
}
```

---

## ✅ 推荐的测试流程

### 步骤1: 确认Token已保存

```typescript
import { useAuthStore } from '@/features/AuthModule/stores/authStore';

const { accessToken, isAuthenticated } = useAuthStore();
console.log('是否已登录:', isAuthenticated);
console.log('Token前20字符:', accessToken?.substring(0, 20));
```

**预期**: 应该有token，且 `isAuthenticated` 为 `true`。

---

### 步骤2: 测试最全面的配置

```typescript
import { switchTokenPreset } from '@/services/api/tokenTestUtils';

// 使用ALL_METHODS发送token的所有可能方式
switchTokenPreset('ALL_METHODS');
```

**预期**: 如果这个都失败，说明token本身无效或后端问题。

---

### 步骤3: 逐个排除

```typescript
// 测试标准配置
switchTokenPreset('STANDARD');
const result1 = await profileApi.getUserProfile(2000);

if (!result1.success) {
  // 测试无前缀
  switchTokenPreset('NO_PREFIX');
  const result2 = await profileApi.getUserProfile(2000);
  
  if (!result2.success) {
    // 测试自定义headers
    switchTokenPreset('CUSTOM_HEADERS');
    const result3 = await profileApi.getUserProfile(2000);
  }
}
```

**预期**: 找到一个成功的配置。

---

### 步骤4: 固定为成功的配置

```typescript
// 假设STANDARD成功了
switchTokenPreset('STANDARD');

// 在生产环境，可以直接在 _layout.tsx 中配置
```

---

## 🐛 常见问题排查

### Q1: 所有配置都返回401

**可能原因**:
1. Token已过期
2. Token不包含 `clientid` (老token)
3. ClientId不匹配

**解决方案**:
```typescript
// 1. 检查token内容 (去jwt.io解码)
const { accessToken } = useAuthStore();
console.log('Token:', accessToken);

// 2. 重新登录获取新token
await authStore.logout();
// 重新登录

// 3. 确保clientId一致
apiClient.setClientId('app');  // 必须与登录时的clientType一致
```

---

### Q2: Token在被发送，但后端说没收到

**检查方法**:
```typescript
// 1. 确认token正在被注入
switchTokenPreset('STANDARD');
// 查看控制台是否有 "🔑 [Token Injection] 准备注入Token"

// 2. 检查是否跳过了token注入 (白名单接口)
// 有些接口在白名单中，不会自动添加token

// 3. 确认API Client已连接AuthStore
apiClient.connectAuthStore(useAuthStore);
```

---

### Q3: ClientId与Token不匹配

**错误**: "客户端ID与Token不匹配"

**原因**: 登录时使用的 `clientType` 与 API请求时的 `clientId` 不一致

**解决**:
```typescript
// 登录时
await authApi.loginWithPassword({
  username: 'alice_dev',
  password: '123456',
  clientType: 'app',  // 🔥 这里是 'app'
});

// API Client配置
apiClient.setClientId('app');  // 🔥 必须匹配
```

---

## 📊 成功标志

当配置正确时，你应该看到:

### ✅ 前端日志
```
🔑 [Token Injection] 准备注入Token
   ✅ [Method 1] Authorization Header
      Header: Authorization: Bearer eyJhbGc...
   
🔑 [ClientId] 已添加ClientId Header
   Header: clientid: app

✅ [FETCH] 收到HTTP响应
   状态码: 200 OK
```

### ✅ 后端Gateway日志
```
Token验证成功: userId=2000, clientid=app
转发请求到: xypai-user
```

### ✅ API响应
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "userId": 2000,
    "nickname": "Alice",
    ...
  }
}
```

---

## 🎯 最终配置建议

根据你的后端SA-Token配置:

```yaml
# backend: application-common.yml
sa-token:
  token-name: Authorization       # 🔑 Header名: Authorization
  token-prefix: "Bearer"          # 🔑 前缀: Bearer
  is-read-header: true            # ✅ 从Header读取
  is-read-body: true              # ✅ 从参数读取 (备用)
```

**推荐前端配置**:

```typescript
// app/_layout.tsx
import { switchTokenPreset } from '@/services/api/tokenTestUtils';

// 使用标准配置
switchTokenPreset('STANDARD');

// 或者自定义
apiClient.configureTokenTransmission({
  useAuthorizationHeader: true,   // ✅ Authorization: Bearer <token>
  tokenPrefix: 'Bearer',          // ✅ 必须匹配后端
  includeClientId: true,          // ✅ clientid: app
  clientIdHeaderName: 'clientid', // ✅ header名
  useCustomHeaders: false,        // ❌ 不需要
  useUrlParameter: false,         // ❌ 不需要 (header优先)
  enableDebugLogs: __DEV__,       // 开发环境启用日志
});
```

---

## 📚 参考文档

- **Token管理指南**: `TOKEN_MANAGEMENT_GUIDE.md`
- **API Client源码**: `services/api/client.ts`
- **测试工具源码**: `services/api/tokenTestUtils.ts`
- **后端SA-Token配置**: `RuoYi-Cloud-Plus/script/config/nacos/application-common.yml`
- **后端401修复文档**: `RuoYi-Cloud-Plus/🔧_CRITICAL_401_FIX_COMPLETE.md`

---

**祝测试顺利！🎉**

如果遇到问题，查看控制台日志并参考本指南的排查步骤。

