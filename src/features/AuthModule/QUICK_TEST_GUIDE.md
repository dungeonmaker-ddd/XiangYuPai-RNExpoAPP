# 🧪 快速测试指南 - 后端API集成

> **测试真实后端登录功能**

---

## 🚀 快速开始

### 方式1: 直接在登录页面测试

```bash
# 1. 启动后端服务（确保xypai-auth服务运行）
# 在 RuoYi-Cloud-Plus 目录

# 2. 启动前端App
cd XiangYuPai-RNExpoAPP
npm start

# 3. 在登录页面输入测试账号
用户名: alice_dev
密码: 123456

# 4. 点击登录按钮
```

**预期结果**：

```
控制台输出:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 用户登录流程开始（真实后端API）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   手机号/用户名: alice_dev
   登录方式: 密码登录
   步骤1: 调用后端密码登录API
🔐 [AuthAPI] 密码登录请求 { username: 'alice_dev', ... }
📤 发起登录请求: {...}
📥 登录响应: { code: 0, msg: '登录成功', ... }
✅ [AuthAPI] 登录成功，已自动设置token
   步骤2: 保存token到SecureStore
   步骤3: 更新认证状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 登录成功！
   用户ID: 1001
   用户名: Alice·全栈开发
   Token: eyJhbGciOiJIUzI1NiI...
   过期时间: 86400秒
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 登录成功，跳转到首页
```

---

### 方式2: 在Chrome DevTools测试

```bash
# 1. 启动App
npm start

# 2. 按 'j' 打开Chrome DevTools

# 3. 在Console中输入：
import { useAuthStore } from '@/src/features/AuthModule';

// 测试密码登录
const { login } = useAuthStore.getState();
await login({
  phone: 'alice_dev',      // 用户名
  password: '123456',       // 密码
  region: '+86'
});

// 查看结果
console.log('当前用户:', useAuthStore.getState().userInfo);
console.log('Token:', useAuthStore.getState().accessToken?.substring(0, 30));
```

**预期输出**：

```javascript
当前用户: {
  id: "1001",
  phone: "138****8001",
  nickname: "Alice·全栈开发",
  avatar: "https://example.com/avatar.jpg",
  verified: true,
  createdAt: "2025-10-23T..."
}

Token: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
```

---

## 🧪 测试场景

### 场景1: 密码登录流程

```typescript
// 1. 打开登录页
// 2. 切换到"密码登录"模式（如果当前不是）
// 3. 输入用户名: alice_dev
// 4. 输入密码: 123456
// 5. 点击登录

// 预期：
// ✅ 看到详细的日志输出
// ✅ 登录成功
// ✅ 跳转到首页
// ✅ 重新打开App，自动恢复登录状态
```

### 场景2: 短信登录流程

```typescript
// 1. 打开登录页
// 2. 切换到"验证码登录"模式
// 3. 输入手机号: 13800138001
// 4. 点击"获取验证码"

// 预期：
// ✅ 看到"发送验证码"日志
// ✅ 倒计时开始（60秒）
// ✅ 收到短信验证码（如果后端配置了短信服务）

// 5. 输入验证码: 123456
// 6. 点击登录

// 预期：
// ✅ 登录成功
// ✅ 跳转到首页
```

### 场景3: Token刷新

```typescript
// 在Chrome DevTools中模拟token过期

// 1. 先登录
const { login } = useAuthStore.getState();
await login({ phone: 'alice_dev', password: '123456' });

// 2. 模拟token过期
const { refreshAuthToken } = useAuthStore.getState();
await refreshAuthToken();

// 预期日志：
🔄 Token刷新流程开始（真实后端API）
   步骤1: 调用后端刷新Token接口
🔄 [AuthAPI] 刷新Token请求
✅ [AuthAPI] Token刷新成功
   步骤2: 保存新token到SecureStore
   步骤3: 更新认证状态
✅ Token刷新成功！
```

### 场景4: 登出

```typescript
// 在Chrome DevTools中

// 1. 确保已登录
// 2. 调用登出
const { logout } = useAuthStore.getState();
await logout();

// 预期日志：
👋 用户登出流程开始（真实后端API）
   步骤1: 调用后端登出接口
🚪 [AuthAPI] 登出请求
✅ [AuthAPI] 登出成功，已清除token
   步骤1: 删除SecureStore中的token
   步骤2: 重置认证状态
   📊 当前状态: isAuthenticated = false
✅ 登出成功

// 验证：
console.log('是否已登录:', useAuthStore.getState().isAuthenticated);  // false
console.log('Token:', useAuthStore.getState().accessToken);  // null
```

---

## 🐛 常见问题排查

### Q1: 登录失败，显示"网络连接失败"

**原因**: 后端服务未启动或网关未运行

**解决**:
```bash
# 检查后端服务
curl http://localhost:8080/xypai-auth/api/v1/auth/health

# 如果失败，启动后端服务
# 在 RuoYi-Cloud-Plus 目录启动对应服务
```

### Q2: 登录成功但token未保存

**排查**:
```javascript
// 在DevTools中检查
const { accessToken } = useAuthStore.getState();
console.log('AccessToken:', accessToken);

// 检查SecureStore
import * as SecureStore from 'expo-secure-store';
const savedToken = await SecureStore.getItemAsync('access_token');
console.log('Saved Token:', savedToken);
```

### Q3: 用户信息字段显示undefined

**原因**: 后端返回的字段可能不同

**排查**:
```typescript
// 在authStore.ts的login方法中添加调试
console.log('后端返回的userInfo:', response.data.userInfo);

// 检查字段映射是否正确
const adaptedUserInfo = {
  id: String(userInfo.id),
  phone: userInfo.mobile || credentials.phone,
  nickname: userInfo.nickname || userInfo.username,
  // ...
};
console.log('适配后的userInfo:', adaptedUserInfo);
```

### Q4: 验证码发送失败

**排查**:
```javascript
// 1. 检查手机号格式
const phone = useAuthDataStore.getState().loginForm.phone;
console.log('手机号:', phone);

// 2. 检查后端短信服务配置
// 查看后端日志是否有短信发送记录

// 3. 检查API端点
console.log('API端点:', '/xypai-auth/api/v1/auth/sms/send');
```

---

## 📋 测试检查清单

### 基础功能测试

- [ ] 密码登录成功
- [ ] 短信登录成功
- [ ] 发送验证码成功
- [ ] 登出成功
- [ ] Token自动保存
- [ ] UserInfo正确显示
- [ ] 登录后跳转到首页

### 高级功能测试

- [ ] Token刷新成功
- [ ] 刷新失败自动清除数据
- [ ] 重新打开App自动恢复登录
- [ ] 401错误自动刷新token
- [ ] API请求自动携带token

### 用户体验测试

- [ ] 登录成功提示友好
- [ ] 错误提示清晰易懂
- [ ] 验证码倒计时正常
- [ ] 加载状态显示正确
- [ ] 登出提示友好

---

## 🎯 快速验证命令

```bash
# 完整测试流程（在Chrome DevTools中）

// 1. 导入authStore
import { useAuthStore } from '@/src/features/AuthModule';

// 2. 测试密码登录
await useAuthStore.getState().login({ 
  phone: 'alice_dev', 
  password: '123456' 
});

// 3. 检查登录状态
console.log('已登录:', useAuthStore.getState().isAuthenticated);

// 4. 检查用户信息
console.log('用户信息:', useAuthStore.getState().userInfo);

// 5. 测试登出
await useAuthStore.getState().logout();

// 6. 检查登出状态
console.log('已登录:', useAuthStore.getState().isAuthenticated);  // 应该是false
```

---

## 🎊 测试通过标准

### ✅ **登录测试通过标准**

```
✅ 能看到完整的登录流程日志
✅ 登录成功后Token正确保存
✅ 用户信息字段完整
✅ 自动跳转到首页
✅ 刷新App后自动恢复登录
✅ API请求自动携带token
```

### ✅ **短信登录测试通过标准**

```
✅ 能成功发送验证码
✅ 倒计时正常工作
✅ 验证码登录成功
✅ Token和用户信息正确保存
```

### ✅ **Token刷新测试通过标准**

```
✅ 能成功刷新token
✅ 新token正确保存
✅ 刷新失败能正确清除数据
```

---

**🎯 准备好了吗？让我们开始测试吧！**

**建议**: 先测试密码登录，成功后再测试短信登录和其他功能。

