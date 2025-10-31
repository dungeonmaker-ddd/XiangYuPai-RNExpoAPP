# 🔐 登录模块集成指南 - Login Module Integration Guide

> **目标受众**: 需要集成登录功能的开发者  
> **前置条件**: 后端API已部署，测试账号已创建  
> **更新时间**: 2025-10-28

---

## 📋 目录

1. [快速开始](#快速开始)
2. [登录接口数据结构](#登录接口数据结构)
3. [完整登录流程](#完整登录流程)
4. [使用authStore](#使用authstore)
5. [实战示例](#实战示例)
6. [错误处理](#错误处理)
7. [常见问题](#常见问题)

---

## 🚀 快速开始

### **Step 1: 导入authStore**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function YourComponent() {
  const { 
    isAuthenticated,  // 是否已登录
    userInfo,         // 用户基础信息
    login,            // 登录方法
    logout,           // 登出方法
  } = useAuthStore();
  
  // 你的代码...
}
```

---

### **Step 2: 调用登录接口**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function MyLoginButton() {
  const { login } = useAuthStore();
  
  const handleLogin = async () => {
    try {
      // 密码登录
      await login({
        type: 'password',
        phone: '13900000001',
        password: 'Test@123456',
      });
      
      // 登录成功，自动跳转
      console.log('✅ 登录成功');
      
    } catch (error) {
      console.error('❌ 登录失败:', error.message);
    }
  };
  
  return <Button onPress={handleLogin}>登录</Button>;
}
```

---

### **Step 3: 检查登录状态**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function ProtectedComponent() {
  const { isAuthenticated, userInfo } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Text>请先登录</Text>;
  }
  
  return (
    <View>
      <Text>欢迎, {userInfo?.nickname}</Text>
      <Image source={{ uri: userInfo?.avatar }} />
    </View>
  );
}
```

---

## 📊 登录接口数据结构

### **1. 登录请求数据 (LoginRequest)**

#### **方式A: 密码登录**

```typescript
interface PasswordLoginCredentials {
  type: 'password';
  phone: string;      // 手机号 (例: '13900000001')
  password: string;   // 密码 (例: 'Test@123456')
}

// 使用示例
await login({
  type: 'password',
  phone: '13900000001',
  password: 'Test@123456',
});
```

---

#### **方式B: 验证码登录**

```typescript
interface SmsLoginCredentials {
  type: 'sms';
  phone: string;      // 手机号 (例: '13900000001')
  code: string;       // 验证码 (例: '123456')
}

// 使用示例
await login({
  type: 'sms',
  phone: '13900000001',
  code: '123456',
});
```

---

### **2. 登录响应数据 (LoginResponse)**

#### **成功响应结构**

```typescript
interface LoginResultVO {
  accessToken: string;      // 访问令牌 (JWT)
  refreshToken: string;     // 刷新令牌
  tokenType: string;        // 令牌类型 ('Bearer')
  expiresIn: number;        // 过期时间 (秒，例: 86400)
  userInfo: {
    id: number;             // 用户ID (例: 2000)
    username: string;       // 用户名 (例: 'app_tester')
    nickname: string;       // 昵称 (例: 'APP测试员')
    avatar: string;         // 头像URL
    mobile: string;         // 手机号 (脱敏，例: '139****0001')
    status: number;         // 状态 (1=正常)
    roles: string[];        // 角色列表 (例: ['USER'])
    permissions: string[];  // 权限列表 (例: ['user:read'])
    lastLoginTime: string;  // 上次登录时间
  };
}
```

---

#### **实际响应示例**

```json
{
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "userInfo": {
      "id": 2000,
      "username": "app_tester",
      "nickname": "APP测试员",
      "avatar": "https://picsum.photos/200?test",
      "mobile": "139****0001",
      "status": 1,
      "roles": ["USER"],
      "permissions": ["user:read"],
      "lastLoginTime": "2025-10-28 21:23:03"
    }
  },
  "code": 200,
  "message": "Success",
  "timestamp": 1761657782817,
  "success": true
}
```

---

### **3. authStore保存的数据 (UserInfo)**

登录成功后，authStore会保存转换后的用户信息：

```typescript
interface UserInfo {
  id: string;          // 用户ID (转为string)
  phone: string;       // 手机号
  nickname?: string;   // 昵称
  avatar?: string;     // 头像URL
  verified: boolean;   // 是否认证 (status === 1)
  createdAt: string;   // 创建时间 (ISO格式)
}

// 保存在authStore中
{
  isAuthenticated: true,
  accessToken: "eyJ0eXAi...",
  refreshToken: "eyJ0eXAi...",
  userInfo: {
    id: "2000",
    phone: "13900000001",
    nickname: "APP测试员",
    avatar: "https://picsum.photos/200?test",
    verified: true,
    createdAt: "2025-10-28T13:23:03.000Z"
  }
}
```

---

## 🔄 完整登录流程

### **流程图**

```
用户输入 (手机号 + 密码)
    ↓
调用 authStore.login()
    ↓
发送请求到后端API
    ↓
POST /xypai-auth/api/v1/auth/login
    {
      "username": "13900000001",
      "password": "Test@123456",
      "clientType": "app",
      "deviceId": "device_xxx",
      "rememberMe": false
    }
    ↓
后端验证
    ├─ 智能识别 (手机号 vs 用户名)
    ├─ 查询用户 (xypai-user服务)
    ├─ 验证密码 (BCrypt)
    ├─ 生成Token (JWT)
    └─ 创建Session
    ↓
返回响应
    {
      "accessToken": "...",
      "refreshToken": "...",
      "userInfo": { ... }
    }
    ↓
authStore处理
    ├─ 保存Token到SecureStore (加密存储)
    ├─ 保存userInfo到SecureStore
    └─ 更新认证状态 (isAuthenticated = true)
    ↓
自动跳转到首页
    ↓
✅ 登录完成
```

---

### **详细步骤**

#### **Step 1: 用户输入**

```typescript
const [formData, setFormData] = useState({
  phoneNumber: '',
  password: '',
});
```

---

#### **Step 2: 构建登录凭证**

```typescript
const credentials = {
  type: 'password' as const,
  phone: formData.phoneNumber,    // '13900000001'
  password: formData.password,    // 'Test@123456'
};
```

---

#### **Step 3: 调用登录方法**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

const { login } = useAuthStore();

try {
  await login(credentials);
  // 登录成功，自动处理
} catch (error) {
  // 登录失败，显示错误
  Alert.alert('登录失败', error.message);
}
```

---

#### **Step 4: authStore内部处理**

```typescript
// authStore.ts - login方法
login: async (credentials) => {
  // 1. 调用后端API
  const response = await backendAuthApi.loginWithPassword({
    username: credentials.phone,
    password: credentials.password,
    clientType: 'app',
    deviceId: 'device_xxx',
    rememberMe: false,
  });
  
  // 2. 提取数据
  const { accessToken, refreshToken, userInfo } = response.data;
  
  // 3. 转换数据格式
  const adaptedUserInfo = {
    id: String(userInfo.id),
    phone: userInfo.mobile,
    nickname: userInfo.nickname,
    avatar: userInfo.avatar,
    verified: userInfo.status === 1,
    createdAt: new Date().toISOString(),
  };
  
  // 4. 保存到SecureStore (加密存储)
  await SecureStore.setItemAsync('ACCESS_TOKEN', accessToken);
  await SecureStore.setItemAsync('REFRESH_TOKEN', refreshToken);
  await SecureStore.setItemAsync('USER_CREDENTIALS', JSON.stringify(adaptedUserInfo));
  
  // 5. 更新Store状态
  set({
    isAuthenticated: true,
    accessToken,
    refreshToken,
    userInfo: adaptedUserInfo,
  });
  
  console.log('✅ 登录成功');
}
```

---

#### **Step 5: 页面跳转**

```typescript
// LoginMainPage/index.tsx
const handleLogin = async () => {
  try {
    await login(credentials);
    
    // 登录成功，跳转到首页
    router.replace('/(tabs)/homepage');
    
  } catch (error) {
    Alert.alert('登录失败', error.message);
  }
};
```

---

## 🎯 使用authStore

### **1. 获取登录状态**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function AnyComponent() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <ProtectedContent />;
}
```

---

### **2. 获取用户信息**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function UserProfile() {
  const { userInfo } = useAuthStore();
  
  return (
    <View>
      <Image source={{ uri: userInfo?.avatar }} />
      <Text>{userInfo?.nickname}</Text>
      <Text>ID: {userInfo?.id}</Text>
      <Text>手机: {userInfo?.phone}</Text>
    </View>
  );
}
```

---

### **3. 登出**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter } from 'expo-router';

function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await logout();
      
      // 跳转到登录页
      router.replace('/auth/login');
      
      console.log('✅ 登出成功');
    } catch (error) {
      console.error('❌ 登出失败:', error);
    }
  };
  
  return <Button onPress={handleLogout}>退出登录</Button>;
}
```

---

### **4. Token自动注入**

登录成功后，所有API请求会自动携带Token：

```typescript
// apiClient会自动从authStore读取accessToken
const response = await apiClient.get('/api/v1/profile');

// 请求头自动包含:
// Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**无需手动处理！** ✅

---

## 💡 实战示例

### **示例1: 简单登录表单**

```typescript
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter } from 'expo-router';

function SimpleLoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const router = useRouter();
  
  const handleSubmit = async () => {
    if (!phone || !password) {
      Alert.alert('提示', '请输入手机号和密码');
      return;
    }
    
    setLoading(true);
    
    try {
      // 调用登录
      await login({
        type: 'password',
        phone,
        password,
      });
      
      // 成功，跳转首页
      router.replace('/(tabs)/homepage');
      
    } catch (error: any) {
      // 失败，显示错误
      Alert.alert('登录失败', error.message || '请检查账号密码');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View>
      <TextInput
        placeholder="手机号"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        placeholder="密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button
        title={loading ? '登录中...' : '登录'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}
```

---

### **示例2: 验证码登录**

```typescript
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { authApi } from '@/services/api/authApi';

function SmsLoginForm() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const { login } = useAuthStore();
  
  // 发送验证码
  const handleSendCode = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    
    try {
      await authApi.sendLoginCode(phone, '+86');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Alert.alert('成功', '验证码已发送');
    } catch (error: any) {
      Alert.alert('发送失败', error.message);
    }
  };
  
  // 验证码登录
  const handleLogin = async () => {
    if (!phone || !code) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }
    
    try {
      await login({
        type: 'sms',
        phone,
        code,
      });
      
      Alert.alert('成功', '登录成功');
    } catch (error: any) {
      Alert.alert('登录失败', error.message);
    }
  };
  
  return (
    <View>
      <TextInput
        placeholder="手机号"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="验证码"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={{ flex: 1 }}
        />
        
        <Button
          title={countdown > 0 ? `${countdown}秒` : '发送验证码'}
          onPress={handleSendCode}
          disabled={countdown > 0}
        />
      </View>
      
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
}
```

---

### **示例3: 路由守卫**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function useAuthGuard() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (!isInitialized) return;
    
    const inAuthGroup = segments[0] === 'auth';
    const inProtectedGroup = segments[0] === '(tabs)' && 
      (segments[1] === 'messages' || segments[1] === 'profile');
    
    // 未登录，但访问受保护页面
    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/auth/login');
    }
    
    // 已登录，但在登录页
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/homepage');
    }
  }, [isAuthenticated, isInitialized, segments]);
}

// 在App中使用
function App() {
  useAuthGuard();
  
  return <RootLayout />;
}
```

---

### **示例4: 条件渲染内容**

```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';

function DiscoveryPage() {
  const { isAuthenticated, userInfo } = useAuthStore();
  
  return (
    <View>
      <FeedList />
      
      {/* 已登录：显示完整功能 */}
      {isAuthenticated ? (
        <View>
          <Button title="发布动态" onPress={handlePublish} />
          <Button title="我的收藏" onPress={handleMyCollections} />
        </View>
      ) : (
        /* 未登录：显示登录提示 */
        <View>
          <Text>登录后可发布动态和查看收藏</Text>
          <Button title="去登录" onPress={() => router.push('/auth/login')} />
        </View>
      )}
    </View>
  );
}
```

---

## 🚨 错误处理

### **常见错误类型**

```typescript
try {
  await login(credentials);
} catch (error: any) {
  // 1. 网络错误
  if (error.message.includes('Network')) {
    Alert.alert('网络错误', '请检查网络连接');
  }
  
  // 2. 账号密码错误
  else if (error.message.includes('用户名或密码错误')) {
    Alert.alert('登录失败', '账号或密码错误，请重试');
  }
  
  // 3. 账号被冻结
  else if (error.message.includes('已被冻结')) {
    Alert.alert('账号异常', '您的账号已被冻结，请联系客服');
  }
  
  // 4. Token过期
  else if (error.message.includes('token')) {
    Alert.alert('会话过期', '请重新登录');
    await logout();
    router.replace('/auth/login');
  }
  
  // 5. 其他错误
  else {
    Alert.alert('登录失败', error.message || '未知错误，请稍后重试');
  }
}
```

---

### **后端错误码映射**

| 错误码 | 含义 | 处理方式 |
|--------|------|---------|
| `200` | 成功 | 正常处理 |
| `401` | 未授权 | 提示重新登录 |
| `403` | 禁止访问 | 账号被封禁 |
| `404` | 用户不存在 | 提示注册 |
| `500` | 服务器错误 | 提示稍后重试 |

---

## ❓ 常见问题

### **Q1: 登录后如何自动跳转？**

**A**: 在登录成功后调用`router.replace()`：

```typescript
await login(credentials);
router.replace('/(tabs)/homepage');
```

---

### **Q2: 如何判断用户是否已登录？**

**A**: 读取`authStore.isAuthenticated`：

```typescript
const { isAuthenticated } = useAuthStore();

if (isAuthenticated) {
  // 已登录
} else {
  // 未登录
}
```

---

### **Q3: Token会自动刷新吗？**

**A**: 是的，当Token即将过期时，`apiClient`会自动调用刷新接口。

---

### **Q4: 如何获取当前用户ID？**

**A**: 从`authStore.userInfo.id`获取：

```typescript
const { userInfo } = useAuthStore();
const currentUserId = userInfo?.id;
```

---

### **Q5: 登出后数据会清除吗？**

**A**: 是的，`logout()`会清除所有认证数据：

```typescript
logout: async () => {
  // 1. 删除SecureStore中的token
  await SecureStore.deleteItemAsync('ACCESS_TOKEN');
  await SecureStore.deleteItemAsync('REFRESH_TOKEN');
  await SecureStore.deleteItemAsync('USER_CREDENTIALS');
  
  // 2. 重置Store状态
  set({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userInfo: null,
  });
}
```

---

### **Q6: 如何实现"记住我"功能？**

**A**: 已自动实现！Token保存在SecureStore中，App重启后自动恢复登录状态。

---

### **Q7: 多个组件都需要用户信息，会重复请求吗？**

**A**: 不会！所有组件共享同一个`authStore`，数据从内存读取，零开销。

```typescript
// 组件1
const { userInfo } = useAuthStore();  // 内存读取

// 组件2
const { userInfo } = useAuthStore();  // 内存读取

// 组件3
const { userInfo } = useAuthStore();  // 内存读取

// 0个API请求！
```

---

## 📖 完整API参考

### **authStore API**

```typescript
interface AuthStore {
  // 状态
  isAuthenticated: boolean;      // 是否已登录
  isInitialized: boolean;        // 是否已初始化
  userInfo: UserInfo | null;     // 用户信息
  accessToken: string | null;    // 访问令牌
  refreshToken: string | null;   // 刷新令牌
  loginMode: 'password' | 'sms'; // 登录模式
  deviceId: string | null;       // 设备ID
  
  // 方法
  initialize: () => Promise<void>;           // 初始化 (App启动时调用)
  login: (credentials) => Promise<void>;     // 登录
  logout: () => Promise<void>;               // 登出
  clearAuthData: () => void;                 // 清除认证数据
  refreshAuthToken: () => Promise<void>;     // 刷新Token
  setUserInfo: (userInfo) => void;           // 设置用户信息
  setLoginMode: (mode) => void;              // 设置登录模式
  switchMode: (mode) => void;                // 切换登录模式
  setDeviceId: (deviceId) => void;           // 设置设备ID
}
```

---

## 🎯 测试账号

```typescript
// 测试账号信息
const TEST_ACCOUNT = {
  phone: '13900000001',
  password: 'Test@123456',
  username: 'app_tester',
  nickname: 'APP测试员',
};

// 使用测试账号登录
await login({
  type: 'password',
  phone: TEST_ACCOUNT.phone,
  password: TEST_ACCOUNT.password,
});
```

---

## 🚀 下一步

1. ✅ 阅读本文档
2. ✅ 查看`LoginMainPage/index.tsx`源码
3. ✅ 在你的模块中集成`authStore`
4. ✅ 测试登录流程
5. ✅ 参考实战示例

---

## 📚 相关文档

- `DATA_FLOW_BEST_PRACTICES.md` - 数据流最佳实践
- `LOGIN_SUCCESS_ARCHITECTURE_GUIDE.md` - 登录架构指南
- `authStore.ts` - authStore源码
- `LoginMainPage/index.tsx` - 登录页面源码

---

**创建时间**: 2025-10-28  
**维护者**: 前端团队  
**状态**: ✅ 生产就绪  
**版本**: v1.0

