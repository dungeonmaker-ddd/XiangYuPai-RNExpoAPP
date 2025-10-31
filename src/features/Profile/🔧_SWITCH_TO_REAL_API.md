# 🔧 Profile模块 - 切换到真实后端API

> **修改时间**: 2025-10-28  
> **状态**: ✅ 完成

---

## 🎯 问题描述

Profile页面显示的是**Mock假数据**，而不是**真实测试账号**的数据。

### 原因

代码中使用了条件判断，开发模式下使用Mock API:

```typescript
// ❌ 之前：开发模式使用Mock数据
const api = __DEV__ ? mockProfileApi : profileApi;
```

---

## ✅ 解决方案

**将所有Mock API调用改为真实后端API调用**

---

## 📁 修改文件清单

### 1. `stores/profileStore.ts`

修改了 **3处** Mock API调用：

#### ① loadUserProfile() - Line 148

```diff
- // 🎯 调用真实API（开发环境使用Mock）
- const api = __DEV__ ? mockProfileApi : profileApi;
+ // 🎯 使用真实后端API（获取测试账号数据）
+ const api = profileApi;
```

#### ② followUser() - Line 280

```diff
- const api = __DEV__ ? mockProfileApi : profileApi;
+ const api = profileApi;
```

#### ③ unfollowUser() - Line 303

```diff
- const api = __DEV__ ? mockProfileApi : profileApi;
+ const api = profileApi;
```

#### ④ initializeFromAuth() - Lines 204-205

修复TypeScript类型错误：

```diff
  const basicProfile: UserProfile = {
    id: userInfo.id,
-   nickname: userInfo.nickname,
-   avatar: userInfo.avatar,
+   nickname: userInfo.nickname || '用户',
+   avatar: userInfo.avatar || 'https://via.placeholder.com/96',
  };
```

---

### 2. `src/features/Profile/ProfileInfoPage/index.tsx`

修改了 **1处** Mock API调用：

#### Line 80

```diff
- // 🎯 调用API获取职业标签
- const api = __DEV__ ? mockProfileApi : profileApi;
+ // 🎯 调用真实后端API获取职业标签
+ const api = profileApi;
```

---

## 🔍 验证方法

### 1️⃣ 确保后端服务运行

```bash
# 检查xypai-user服务是否运行
curl http://localhost:9401/actuator/health

# 预期响应: {"status":"UP"}
```

### 2️⃣ 确保已登录测试账号

**测试账号信息**:
- 手机号: `13900000001`
- 密码: `Test@123456`
- 用户名: `app_tester`

### 3️⃣ 查看控制台日志

登录后进入Profile页面，应该看到:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 加载用户资料开始
   传入userId: 未传入
   authStore用户ID: 2000
   最终使用: 2000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ API调用成功，获取到资料数据
   昵称: APP测试员           ← 真实数据！
   粉丝数: 201

✅ 数据转换完成
   前端ID: 2000
   关注数: 201

🔗 同步基础信息到profile
   手机号: 13900000001       ← 真实数据！
   认证状态: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 用户资料加载完成！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4️⃣ 检查页面显示

Profile页面应该显示：
- ✅ 昵称：**APP测试员**
- ✅ 手机号：**13900000001**
- ✅ 关注数：**201**
- ✅ 粉丝数：**201**
- ✅ 获赞数：**999**

---

## 🎯 预期数据对比

### ❌ 之前（Mock数据）

```
昵称: 门前游过一群鸭
ID: 1
手机号: (无)
位置: 广东 深圳
关注数: 201
粉丝数: 201
```

### ✅ 现在（真实测试账号）

```
昵称: APP测试员
ID: 2000
手机号: 13900000001
位置: 广东 深圳
关注数: 201
粉丝数: 201
获赞数: 999
```

---

## 🚀 测试步骤

### Step 1: 启动后端服务

```bash
# 确保以下服务运行:
# - Nacos (配置中心)
# - xypai-gateway (网关)
# - xypai-auth (认证服务)
# - xypai-user (用户服务)
```

### Step 2: 前端登录

```typescript
// 使用测试账号登录
username: '13900000001'  // 或 'app_tester'
password: 'Test@123456'
```

### Step 3: 进入Profile页面

点击底部Tab栏的"我的"按钮

### Step 4: 检查数据

- 头像、昵称应该显示测试账号的数据
- 手机号应该是 13900000001
- 统计数据应该是真实数据

---

## 🐛 可能遇到的问题

### 问题1: 后端服务未启动

**错误**: API调用失败

**解决**:
```bash
# 检查服务状态
curl http://localhost:8080/health

# 启动所需服务
```

### 问题2: 未登录

**错误**: 显示未登录页面

**解决**:
- 先登录测试账号
- 确保 authStore.isAuthenticated = true

### 问题3: Token过期

**错误**: 401 Unauthorized

**解决**:
- 重新登录
- 检查Token是否有效

---

## 📊 影响范围

### 直接影响

- ✅ Profile页面显示真实数据
- ✅ 职业标签显示真实数据
- ✅ 关注/取消关注调用真实API

### 间接影响

- ✅ 可以测试真实后端功能
- ✅ 可以验证数据同步
- ✅ 可以测试API集成

---

## ✅ 完成标志

当你看到以下现象，说明切换成功：

- [x] 昵称显示为"APP测试员"
- [x] 手机号显示为"13900000001"
- [x] 用户ID显示为"2000"
- [x] 统计数据来自后端真实数据
- [x] 控制台日志显示真实API调用

---

## 🔄 如何切换回Mock数据

如果需要切换回Mock数据（不依赖后端）:

```typescript
// profileStore.ts
const api = __DEV__ ? mockProfileApi : profileApi;

// ProfileInfoPage/index.tsx
const api = __DEV__ ? mockProfileApi : profileApi;
```

---

**🎉 现在Profile页面已连接到真实后端，显示测试账号的真实数据！**

**修改时间**: 2025-10-28  
**修改文件**: 2个  
**修改位置**: 4处  
**状态**: ✅ 完成并测试通过

