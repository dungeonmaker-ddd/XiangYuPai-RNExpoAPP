# LoginMainPage - 登录主页面组件

## 📋 组件概述

**LoginMainPage** 是认证模块的核心登录页面，提供完整的登录功能，包括密码登录和验证码登录两种模式。

### ✨ 核心功能
- 🔐 **双模式登录** - 支持密码登录和短信验证码登录
- 🌍 **地区选择** - 支持多个国家/地区的手机号登录
- 📝 **表单验证** - 完整的前端验证逻辑
- 💾 **凭证保存** - 可选的登录凭证保存功能
- 🔄 **自动重试** - 网络请求失败自动重试机制
- ✅ **协议确认** - 用户协议和隐私政策确认

## 🏗️ 架构设计

本组件采用**嵌套化架构**模式，按照功能区域划分子组件：

```
LoginMainPage/
├── 🏗️ 核心文件层
│   ├── index.tsx                    # 主组件文件 - 组合所有子组件
│   ├── types.ts                     # 类型定义 - 所有接口和类型
│   ├── constants.ts                 # 常量配置 - 业务常量和配置
│   ├── styles.ts                    # 样式定义 - 完整样式系统
│   ├── useLoginMainPage.ts          # 状态管理 - 核心hooks
│   └── README.md                    # 本文档
│
└── 🔸 功能区域 (components/)
    ├── TopWelcomeArea/              # 顶部欢迎区域
    ├── AuthInputArea/               # 认证输入区域（整合）
    │   ├── PhoneInputArea/          # 手机号输入区
    │   ├── PasswordInputArea/       # 密码输入区
    │   └── CodeInputArea/           # 验证码输入区
    ├── ActionButtonArea/            # 操作按钮区域
    ├── AgreementArea/               # 协议确认区域
    ├── AuxiliaryArea/               # 辅助操作区域
    └── RegionSelectModal/           # 地区选择模态框
```

## 📦 核心文件说明

### 1. `index.tsx` - 主组件文件
- **职责**: 组合所有子组件，协调整体登录流程
- **内容**: 登录逻辑、API调用、状态协调
- **行数**: ~729行

### 2. `types.ts` - 类型定义文件
- **职责**: 定义所有 TypeScript 接口和类型
- **内容**: 表单数据、验证状态、加载状态、错误类型等
- **行数**: ~326行

### 3. `constants.ts` - 常量配置文件
- **职责**: 定义所有业务常量和配置项
- **内容**: 认证模式、地区列表、验证规则、错误消息等
- **行数**: ~396行

### 4. `styles.ts` - 样式定义文件
- **职责**: 定义所有样式（完全复刻 Flutter 样式）
- **内容**: 布局样式、颜色、字体、动画等
- **行数**: ~621行

### 5. `useLoginMainPage.ts` - 状态管理文件
- **职责**: 提供核心状态管理 hooks
- **内容**: 
  - `useFormValidation` - 表单验证逻辑
  - `useCountdown` - 倒计时功能

## 🔌 API 集成

### 登录接口
```typescript
// 密码登录
authApi.loginByPassword(phoneNumber, password, countryCode)

// 验证码登录
authApi.loginByCode(phoneNumber, verificationCode, countryCode)

// 发送验证码
authApi.sendVerificationCode(phoneNumber, countryCode)
```

## 🎯 使用方式

### 基础使用
```typescript
import LoginMainPage from '@/features/AuthModule/LoginMainPage';

// 在页面中使用
<LoginMainPage />
```

### 指定初始模式
```typescript
// 默认显示密码登录
<LoginMainPage initialMode="password" />

// 默认显示验证码登录
<LoginMainPage initialMode="code" />
```

## 🔄 状态管理

### 表单状态
```typescript
interface LoginFormData {
  phoneNumber: string;        // 手机号
  countryCode: string;        // 国家代码 (如 '+86')
  password: string;           // 密码
  verificationCode: string;   // 验证码
}
```

### 验证状态
- `phoneValid` - 手机号验证（11位）
- `passwordValid` - 密码验证（6-20位，非纯数字）
- `codeValid` - 验证码验证（6位数字）
- `agreementAccepted` - 协议同意状态

### 加载状态
- `loading.login` - 登录加载中
- `loading.sendCode` - 发送验证码加载中

## 🎨 子组件说明

### TopWelcomeArea - 顶部欢迎区域
- 显示欢迎标题和副标题
- 展示品牌信息

### AuthInputArea - 认证输入区域
- 整合手机号、密码、验证码输入
- 根据登录模式动态切换显示

### ActionButtonArea - 操作按钮区域
- 登录按钮
- 发送验证码按钮
- 模式切换按钮

### AgreementArea - 协议确认区域
- 用户协议勾选框
- 协议链接跳转

### AuxiliaryArea - 辅助操作区域
- 忘记密码
- 快速注册
- 其他辅助操作

### RegionSelectModal - 地区选择模态框
- 支持多地区选择
- 常用地区快速选择
- 全部地区列表

## 🔧 配置项

### 验证规则
```typescript
PASSWORD_MIN_LENGTH: 6      // 密码最小长度
PASSWORD_MAX_LENGTH: 20     // 密码最大长度
PHONE_LENGTH: 11            // 手机号长度（中国）
CODE_LENGTH: 6              // 验证码长度
COUNTDOWN_SECONDS: 60       // 验证码倒计时
```

### 支持的地区
- 🇨🇳 中国 (+86)
- 🇺🇸 美国 (+1)
- 🇬🇧 英国 (+44)
- 🇯🇵 日本 (+81)
- 🇰🇷 韩国 (+82)
- 🇭🇰 香港 (+852)
- ... 等更多地区

## 📝 开发指南

### 添加新的验证规则
在 `useLoginMainPage.ts` 的 `useFormValidation` 中添加：
```typescript
const newRuleValid = // 你的验证逻辑

return {
  // ... 现有验证
  newRuleValid,
};
```

### 添加新的子组件
1. 在 `components/` 下创建新组件文件夹
2. 遵循现有子组件的结构
3. 在 `components/index.ts` 中导出
4. 在 `index.tsx` 中导入并使用

### 修改样式
所有样式定义在 `styles.ts` 中，按功能区域组织。

## 🐛 常见问题

### Q: 登录失败怎么办？
A: 检查网络连接，查看 Console 日志，确认 API 返回的错误信息。

### Q: 验证码收不到？
A: 检查手机号格式是否正确，确认后端短信服务是否正常。

### Q: 如何清除保存的凭证？
A: 调用 `clearCredentials()` 方法（从 `utils/credentialStorage` 导入）。

## 📚 相关文档
- [AuthModule 总览](../README.md)
- [认证流程设计](../../../docs/auth-flow.md)
- [API 文档](../../../../services/api/authApi.ts)

## 🔗 依赖关系
```
LoginMainPage
├── SharedComponents/Layout/AuthSafeArea
├── stores/authStore
├── services/api/authApi
└── utils/credentialStorage
```

## 📅 更新历史
- **v7.1** - 初始版本，完整登录功能
- **v7.1** - 添加地区选择功能
- **v7.1** - 集成真实后端 API
- **v7.1** - 添加凭证保存功能

---

**维护者**: AuthModule 开发团队  
**最后更新**: 2024年11月


