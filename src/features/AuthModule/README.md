# 🔐 AuthModule - 认证模块

探店APP的完整认证解决方案，基于Expo + React Native + Zustand构建。

## ✨ 功能特性

- 🔑 **多种登录方式** - 密码登录、验证码登录
- 📱 **移动端优化** - 安全区域、键盘处理、手势支持
- 🔒 **安全机制** - SecureStore存储、令牌管理、自动刷新
- 🌍 **多地区支持** - 支持多个国家和地区的手机号格式
- 🎨 **现代UI设计** - 动画效果、响应式布局、主题系统
- 📊 **状态管理** - Zustand分层状态管理
- 🔄 **密码重置流程** - 完整的密码找回流程
- ⚡ **性能优化** - 记忆化、缓存、懒加载

## 🏗️ 架构概览

```
AuthModule/
├── LoginMainPage/           # 登录主页面
│   ├── components/          # 区域组件
│   │   ├── TopWelcomeArea/  # 欢迎区域
│   │   ├── PhoneInputArea/  # 手机号输入
│   │   ├── AuthInputArea/   # 认证输入
│   │   ├── ActionButtonArea/ # 操作按钮
│   │   ├── AuxiliaryArea/   # 辅助功能
│   │   └── AgreementArea/   # 协议同意
│   ├── types.ts            # 类型定义
│   ├── constants.ts        # 常量配置
│   └── styles.ts           # 样式定义
├── stores/                 # 状态管理
│   ├── authStore.ts        # 认证主状态
│   ├── authDataStore.ts    # 认证数据状态
│   ├── authFlowStore.ts    # 认证流程状态
│   └── authUIStore.ts      # 认证UI状态
├── api/                    # API服务
│   ├── authApi.ts          # 认证API
│   ├── smsApi.ts           # 短信API
│   └── resetApi.ts         # 重置API
├── PasswordResetFlow/      # 密码重置流程
└── SharedComponents/       # 模块内共享组件
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import React from 'react';
import { LoginMainPage } from '@/features/AuthModule';

export default function LoginScreen() {
  return <LoginMainPage />;
}
```

### 2. 状态管理

```tsx
import { useAuthStore } from '@/features/AuthModule';

function MyComponent() {
  const { 
    isAuthenticated, 
    userInfo, 
    login, 
    logout 
  } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({
        phone: '13800138000',
        password: 'mypassword',
        region: '+86'
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated) {
    return <Text>欢迎，{userInfo?.nickname}</Text>;
  }

  return (
    <Button title="登录" onPress={handleLogin} />
  );
}
```

### 3. API使用

```tsx
import { authApi } from '@/features/AuthModule';

// 发送验证码
const sendCode = async () => {
  try {
    const response = await authApi.sendLoginCode('13800138000', '+86');
    console.log('验证码发送成功:', response);
  } catch (error) {
    console.error('发送失败:', error.message);
  }
};

// 验证码登录
const codeLogin = async () => {
  try {
    const response = await authApi.login({
      phone: '13800138000',
      smsCode: '123456',
      region: '+86'
    });
    console.log('登录成功:', response);
  } catch (error) {
    console.error('登录失败:', error.message);
  }
};
```

## 📐 架构原则

本模块严格遵循[通用组件架构核心标准 v2.5](../../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)：

- ✅ **八段式文件结构** - 所有主文件使用统一的八段式代码组织
- ✅ **层级化页面组架构** - Feature → Page → Area → Component 四层架构
- ✅ **主文件优先原则** - 优先在主文件内集中管理逻辑
- ✅ **移动端适应性** - 适度的Hook抽离，考虑移动端复杂性
- ✅ **前后端一体化** - API接口层与后端实现同步设计
- ✅ **类型安全** - 完整的TypeScript类型定义

## 🎯 组件设计模式

### 区域组件模式
每个页面按功能区域划分为独立组件：

```tsx
// LoginMainPage/index.tsx
function LoginMainPage() {
  return (
    <ScrollView>
      <TopWelcomeArea />      {/* 欢迎区域 */}
      <PhoneInputArea />      {/* 手机号输入 */}
      <AuthInputArea />       {/* 认证输入 */}
      <ActionButtonArea />    {/* 操作按钮 */}
      <AuxiliaryArea />       {/* 辅助功能 */}
      <AgreementArea />       {/* 协议同意 */}
    </ScrollView>
  );
}
```

### 八段式代码组织
所有主文件遵循统一的八段式结构：

```tsx
// #region 1. File Banner & TOC
// #region 2. Imports  
// #region 3. Types & Schema
// #region 4. Constants & Config
// #region 5. Utils & Helpers
// #region 6. State Management
// #region 7. Domain Logic
// #region 8. UI Components & Rendering
// #region 9. Exports
```

## 🔧 配置说明

### 环境配置
```typescript
// constants.ts 中的配置项
export const LOGIN_CONFIG = {
  AUTO_LOGIN: true,               // 是否自动登录
  REMEMBER_PHONE: true,           // 是否记住手机号
  SMS_CODE_LENGTH: 6,             // 验证码长度
  SMS_COUNTDOWN_SECONDS: 60,      // 倒计时秒数
  MAX_LOGIN_ATTEMPTS: 5,          // 最大尝试次数
};
```

### 主题自定义
```typescript
// styles.ts 中的主题配置
export const AUTH_COLORS = {
  PRIMARY: '#6366F1',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  // ... 更多颜色配置
};
```

## 🛡️ 安全机制

- **数据加密存储** - 敏感数据使用SecureStore加密存储
- **令牌管理** - 自动刷新、过期检测、安全清理
- **输入验证** - 前端表单验证 + 后端安全校验
- **请求签名** - API请求签名防止篡改
- **会话管理** - 设备ID、登录时间、异地检测

## 📱 移动端优化

- **安全区域适配** - 自动处理刘海屏、底部安全区域
- **键盘处理** - 智能键盘避让、焦点管理
- **手势支持** - 原生手势交互体验
- **触觉反馈** - 操作反馈提升用户体验
- **性能优化** - 组件记忆化、图片懒加载、列表虚拟化

## 🔄 开发工作流

### 1. 添加新区域组件
```bash
# 1. 创建组件目录
mkdir -p LoginMainPage/components/NewArea

# 2. 创建组件文件
touch LoginMainPage/components/NewArea/index.tsx

# 3. 使用八段式模板
# 4. 在 LoginMainPage 中引入使用
# 5. 更新类型定义和导出
```

### 2. 添加新状态
```typescript
// 1. 在对应的 store 中添加状态字段
// 2. 实现相关 action 方法
// 3. 在主页面组件中集成
// 4. 更新类型定义
```

### 3. 添加新API
```typescript
// 1. 在 authApi.ts 中添加方法
// 2. 在 store 的 action 中调用
// 3. 处理 loading、error 状态
// 4. 更新 UI 组件显示
```

## 🧪 测试支持

模块提供了Mock API用于开发测试：

```typescript
import { mockAuthApi } from '@/features/AuthModule';

// 在开发环境中使用Mock API
const api = __DEV__ ? mockAuthApi : authApi;
```

## 📚 参考文档

- [架构设计文档](./AUTH_MODULE_ARCHITECTURE.md)
- [通用组件架构标准](../../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [首页模块架构参考](../Homepage/HOMEPAGE_MODULE_ARCHITECTURE.md)

## 🤝 贡献指南

1. 遵循八段式文件结构
2. 保持类型安全
3. 添加适当的错误处理
4. 编写清晰的注释和文档
5. 进行充分的测试

## 📄 许可证

本模块遵循项目整体许可证。

---

**版本**: 1.0.0  
**创建时间**: 2025年9月  
**维护者**: 探店APP开发团队
