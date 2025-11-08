# 🔐 AuthModule - 认证模块

> 探店APP的完整认证解决方案
> 
> **版本**: v1.0 | **位置**: `src/features/AuthModule/`

---

## 📚 文档说明

本模块的完整文档已统一整理到后端项目中，请查阅：

### 🎯 核心文档

- **[认证模块架构文档](../../../../../RuoYi-Cloud-Plus/xypai-security/认证模块架构文档.md)** - 完整的前后端架构说明 ⭐
- **[接口映射快速参考](../../../../../RuoYi-Cloud-Plus/xypai-security/接口映射快速参考.md)** - 前后端接口对应速查表 ⭐
- **[前后端集成指南](../../../../../RuoYi-Cloud-Plus/xypai-security/docs/前端/前后端集成指南.md)** - 前端对接详细指南
- **[目录结构说明](../../../../../RuoYi-Cloud-Plus/xypai-security/目录结构说明.md)** - 完整的文件组织说明

### 📖 后端文档入口

所有文档位于：`RuoYi-Cloud-Plus/xypai-security/`

```
xypai-security/
├── README.md                    # 后端模块入口
├── 认证模块架构文档.md            # 完整架构
├── 接口映射快速参考.md            # 接口速查
├── 目录结构说明.md               # 文件组织
├── APP认证.md                   # API文档
└── docs/前端/                   # 前端相关文档
    ├── 前后端集成指南.md
    ├── 前端模块说明.md
    └── 前端架构文档.md
```

---

## 🚀 快速开始

### 基础使用

```tsx
import { LoginMainPage, useAuthStore, authApi } from '@/features/AuthModule';

// 1. 使用登录页面
export default function LoginScreen() {
  return <LoginMainPage />;
}

// 2. 使用状态管理
function MyComponent() {
  const { isAuthenticated, userInfo, login } = useAuthStore();
  
  if (isAuthenticated) {
    return <Text>欢迎，{userInfo?.nickname}</Text>;
  }
  
  return <LoginButton />;
}

// 3. 直接调用API
async function handleLogin() {
  const response = await authApi.login({
    phone: '13800138000',
    password: 'password',
    region: '+86'
  });
}
```

---

## 📦 模块导出

```typescript
// 主要组件
export { LoginMainPage } from './LoginMainPage';

// 状态管理
export { useAuthStore, authSelectors } from './stores/authStore';

// API服务
export { authApi, mockAuthApi } from './api/authApi';

// 自定义Hooks
export { useAuthInitialization, useRouteGuard } from './hooks';

// 类型定义
export type { UserInfo, LoginRequest, LoginResponse } from './LoginMainPage/types';
```

---

## 🔗 相关链接

- [后端项目](../../../../../RuoYi-Cloud-Plus/xypai-security/)
- [完整文档](../../../../../RuoYi-Cloud-Plus/xypai-security/README.md)
- [API文档](../../../../../RuoYi-Cloud-Plus/xypai-security/APP认证.md)

---

**版本**: v1.0.0  
**维护者**: 探店APP开发团队

