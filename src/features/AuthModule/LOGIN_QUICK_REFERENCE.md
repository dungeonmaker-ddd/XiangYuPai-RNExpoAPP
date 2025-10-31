# ⚡ 登录模块快速参考卡片

> **一页纸快速查询** - 所有你需要的登录代码片段

---

## 🎯 基础使用

### **导入authStore**
```typescript
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
```

---

## 🔐 登录

### **密码登录**
```typescript
const { login } = useAuthStore();

await login({
  type: 'password',
  phone: '13900000001',
  password: 'Test@123456',
});
```

### **验证码登录**
```typescript
const { login } = useAuthStore();

await login({
  type: 'sms',
  phone: '13900000001',
  code: '123456',
});
```

---

## 👤 获取用户信息

### **检查登录状态**
```typescript
const { isAuthenticated } = useAuthStore();

if (isAuthenticated) {
  // 已登录
}
```

### **获取用户信息**
```typescript
const { userInfo } = useAuthStore();

// userInfo.id          // 用户ID
// userInfo.nickname    // 昵称
// userInfo.avatar      // 头像
// userInfo.phone       // 手机号
```

---

## 🚪 登出

```typescript
const { logout } = useAuthStore();
const router = useRouter();

await logout();
router.replace('/auth/login');
```

---

## 🎨 UI模式

### **条件渲染**
```typescript
const { isAuthenticated, userInfo } = useAuthStore();

return (
  <View>
    {isAuthenticated ? (
      <Text>欢迎, {userInfo?.nickname}</Text>
    ) : (
      <Button title="登录" onPress={() => router.push('/auth/login')} />
    )}
  </View>
);
```

### **显示头像**
```typescript
const { userInfo } = useAuthStore();

<Image source={{ uri: userInfo?.avatar }} />
```

---

## 🛡️ 路由守卫

```typescript
const { isAuthenticated } = useAuthStore();

if (!isAuthenticated) {
  return <LoginPrompt />;
}

return <ProtectedContent />;
```

---

## 📝 完整登录表单示例

```typescript
import { useState } from 'react';
import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter } from 'expo-router';

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      await login({ type: 'password', phone, password });
      router.replace('/(tabs)/homepage');
    } catch (error) {
      Alert.alert('登录失败', error.message);
    }
  };
  
  return (
    <View>
      <TextInput value={phone} onChangeText={setPhone} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
}
```

---

## 🚨 错误处理

```typescript
try {
  await login(credentials);
} catch (error) {
  if (error.message.includes('密码错误')) {
    Alert.alert('提示', '密码错误');
  } else if (error.message.includes('Network')) {
    Alert.alert('提示', '网络错误');
  } else {
    Alert.alert('提示', error.message);
  }
}
```

---

## 🔑 测试账号

```typescript
// 开发测试用
const TEST_ACCOUNT = {
  phone: '13900000001',
  password: 'Test@123456',
};
```

---

## 📊 authStore完整API

```typescript
const {
  // 状态
  isAuthenticated,   // boolean - 是否已登录
  isInitialized,     // boolean - 是否已初始化
  userInfo,          // UserInfo | null - 用户信息
  accessToken,       // string | null - 访问令牌
  refreshToken,      // string | null - 刷新令牌
  
  // 方法
  login,             // (credentials) => Promise<void>
  logout,            // () => Promise<void>
  initialize,        // () => Promise<void>
  clearAuthData,     // () => void
  refreshAuthToken,  // () => Promise<void>
} = useAuthStore();
```

---

## 🎯 常用场景

### **场景1: 评论区显示当前用户**
```typescript
const { userInfo } = useAuthStore();

<View>
  <Image source={{ uri: userInfo?.avatar }} />
  <TextInput placeholder={`${userInfo?.nickname}，说点什么...`} />
</View>
```

### **场景2: 判断是否是自己的内容**
```typescript
const { userInfo } = useAuthStore();
const isMyPost = post.authorId === userInfo?.id;

<View style={isMyPost ? styles.myPost : styles.otherPost}>
  {/* ... */}
</View>
```

### **场景3: 发布内容时获取作者信息**
```typescript
const { userInfo } = useAuthStore();

await createPost({
  authorId: userInfo.id,
  authorName: userInfo.nickname,
  content: postContent,
});
```

---

## 📖 完整文档

- `LOGIN_MODULE_INTEGRATION_GUIDE.md` - 完整集成指南
- `DATA_FLOW_BEST_PRACTICES.md` - 数据流最佳实践

---

**更新时间**: 2025-10-28

