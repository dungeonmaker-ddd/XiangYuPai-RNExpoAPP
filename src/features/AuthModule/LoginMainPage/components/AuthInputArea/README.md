# 🔐 AuthInputArea - 认证输入区域组件

> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter  
> **难度**: ⭐⭐⭐ (中等)

---

## 📋 功能特性

- ✅ 整合PasswordInputArea和CodeInputArea
- ✅ 整合PhoneInputArea（两种模式共用）
- ✅ 模式切换动画（淡入淡出）
- ✅ 动态标题显示（密码登录/验证码登录）
- ✅ 动态副标题（根据模式变化）
- ✅ 统一的输入区域管理
- ✅ 平滑的过渡效果

---

## 🎨 样式对照

### Flutter样式
```dart
Column(
  children: [
    // 标题
    Text(
      _loginMode == 'password' ? '密码登录' : '验证码登录',
      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
    ),
    SizedBox(height: 4),
    Text(
      _loginMode == 'password' ? '请输入您的登录密码' : '请输入收到的验证码',
      style: TextStyle(fontSize: 14, color: Colors.grey),
    ),
    SizedBox(height: 24),
    
    // 手机号输入
    PhoneInputWidget(...),
    
    SizedBox(height: 24),
    
    // 密码或验证码输入（带动画切换）
    AnimatedSwitcher(
      duration: Duration(milliseconds: 300),
      child: _loginMode == 'password' 
        ? PasswordInputWidget(key: ValueKey('password'))
        : CodeInputWidget(key: ValueKey('code')),
    ),
  ],
)
```

### React Native样式
```typescript
<View style={{ gap: 24 }}>
  {/* 标题 */}
  <View>
    <Text style={{ fontSize: 24, fontWeight: '700' }}>
      {loginMode === 'password' ? '密码登录' : '验证码登录'}
    </Text>
    <Text style={{ fontSize: 14, color: '#6B7280' }}>
      {loginMode === 'password' ? '请输入您的登录密码' : '请输入收到的验证码'}
    </Text>
  </View>
  
  {/* 手机号输入 */}
  <PhoneInputArea {...} />
  
  {/* 密码或验证码输入（带动画） */}
  <Animated.View style={{ opacity: fadeAnim }}>
    {loginMode === 'password' ? <PasswordInputArea /> : <CodeInputArea />}
  </Animated.View>
</View>
```

---

## 💻 使用方法

### 密码登录模式
```typescript
<AuthInputArea
  loginMode="password"
  phoneNumber={state.phoneNumber}
  onPhoneNumberChange={handlePhoneChange}
  countryCode={state.countryCode}
  onCountryCodePress={handleOpenRegionSelector}
  phoneValid={state.phoneValid}
  password={state.password}
  onPasswordChange={handlePasswordChange}
  passwordValid={state.passwordValid}
/>
```

### 验证码登录模式
```typescript
<AuthInputArea
  loginMode="code"
  phoneNumber={state.phoneNumber}
  onPhoneNumberChange={handlePhoneChange}
  countryCode={state.countryCode}
  onCountryCodePress={handleOpenRegionSelector}
  phoneValid={state.phoneValid}
  code={state.verificationCode}
  onCodeChange={handleCodeChange}
  codeValid={state.codeValid}
/>
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `loginMode` | `'password' \| 'code'` | ✅ | 登录模式 |
| `phoneNumber` | `string` | ✅ | 手机号 |
| `onPhoneNumberChange` | `(phone: string) => void` | ✅ | 手机号变化回调 |
| `countryCode` | `string` | ✅ | 区号 |
| `onCountryCodePress` | `() => void` | ❌ | 点击区号回调 |
| `phoneValid` | `boolean` | ❌ | 手机号验证状态 |
| `password` | `string` | ❌ | 密码（密码模式） |
| `onPasswordChange` | `(password: string) => void` | ❌ | 密码变化回调 |
| `passwordValid` | `boolean` | ❌ | 密码验证状态 |
| `code` | `string` | ❌ | 验证码（验证码模式） |
| `onCodeChange` | `(code: string) => void` | ❌ | 验证码变化回调 |
| `codeValid` | `boolean` | ❌ | 验证码验证状态 |
| `style` | `ViewStyle` | ❌ | 自定义样式 |

---

## 🛠️ 工具函数

### getTitle
```typescript
// 获取动态标题
getTitle('password')  // '密码登录'
getTitle('code')      // '验证码登录'
```

### getSubtitle
```typescript
// 获取动态副标题
getSubtitle('password')  // '请输入您的登录密码'
getSubtitle('code')      // '请输入收到的验证码'
```

### useAuthInputAnimation Hook
```typescript
// 动画管理Hook
const fadeAnim = useAuthInputAnimation(loginMode);

// 当 loginMode 改变时，自动执行淡出→淡入动画
// 返回 Animated.Value，用于 opacity
```

---

## ✅ Flutter功能对比

| 功能 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 模式切换 | `AnimatedSwitcher` | `Animated.View` | ✅ |
| 动画时长 | `duration: 300ms` | `duration: 300` | ✅ |
| 标题动态 | 条件渲染 | 条件渲染 | ✅ |
| 副标题 | 条件渲染 | 条件渲染 | ✅ |
| 手机号输入 | `PhoneInputWidget` | `PhoneInputArea` | ✅ |
| 密码输入 | `PasswordInputWidget` | `PasswordInputArea` | ✅ |
| 验证码输入 | `CodeInputWidget` | `CodeInputArea` | ✅ |
| 整合管理 | `Column` + `SizedBox` | `View` + `gap` | ✅ |

---

## 🔄 模式切换流程

```
1. 用户点击"切换登录方式"
   ↓
2. 父组件更新 loginMode
   ↓
3. AuthInputArea 接收新的 loginMode
   ↓
4. useAuthInputAnimation Hook 检测到模式变化
   ↓
5. 执行淡出动画（opacity: 1 → 0, 150ms）
   ↓
6. React 更新 DOM（切换 PasswordInputArea ↔ CodeInputArea）
   ↓
7. 执行淡入动画（opacity: 0 → 1, 150ms）
   ↓
8. 模式切换完成（总耗时300ms）
```

---

## 🎯 组件架构

### 组件层次
```
AuthInputArea (容器)
├── TitleArea (标题区域)
│   ├── title (主标题)
│   └── subtitle (副标题)
├── PhoneInputArea (手机号输入)
│   ├── CountryCodeButton (区号按钮)
│   ├── Divider (分割线)
│   └── TextInput (手机号输入框)
└── Animated.View (动画容器)
    ├── PasswordInputArea (密码模式)
    │   ├── TextInput (密码输入框)
    │   └── EyeIcon (眼睛图标)
    └── CodeInputArea (验证码模式)
        ├── DigitBox × 6 (6格输入)
        └── HiddenTextInput (隐藏输入框)
```

---

## 🧪 测试场景

### 场景1: 密码登录模式
1. 组件挂载为密码模式
2. 显示"密码登录"标题
3. 显示手机号输入框
4. 显示密码输入框（带眼睛图标）
5. 输入手机号和密码
6. 验证表单有效性

### 场景2: 验证码登录模式
1. 组件挂载为验证码模式
2. 显示"验证码登录"标题
3. 显示手机号输入框
4. 显示验证码输入框（6格）
5. 输入手机号
6. 输入验证码
7. 验证表单有效性

### 场景3: 模式切换
1. 初始为密码模式
2. 用户点击"切换登录方式"
3. 执行淡出动画（150ms）
4. 切换到验证码模式
5. 执行淡入动画（150ms）
6. 标题变为"验证码登录"
7. 输入框变为6格验证码

### 场景4: 数据保留
1. 密码模式下输入手机号
2. 切换到验证码模式
3. 手机号数据保留
4. 切换回密码模式
5. 密码数据保留（如果有）

---

## 📝 注意事项

1. **手机号共用**: 两种模式共用同一个手机号输入，切换时数据保留
2. **动画性能**: 使用`useNativeDriver: true`提升动画性能
3. **内存优化**: 使用`React.memo`避免不必要的重渲染
4. **类型安全**: 所有回调函数都有默认值，避免undefined错误
5. **样式一致性**: 完全复刻Flutter的`AnimatedSwitcher`效果

---

## 🎨 样式自定义

### 修改标题样式
```typescript
// 修改 styles.title
title: {
  fontSize: 28,        // 更大的标题
  fontWeight: '800',   // 更粗的字体
  color: '#9C27B0',    // 紫色标题
},
```

### 修改动画时长
```typescript
// 修改 CONFIG.ANIMATION_DURATION
const CONFIG = {
  ANIMATION_DURATION: 500,  // 更慢的动画（500ms）
};
```

### 修改间距
```typescript
// 修改 styles.container
container: {
  gap: 32,  // 更大的间距
},
```

---

## 🔄 与其他组件配合

### 与ActionButtonArea配合
```typescript
<AuthInputArea
  loginMode={loginMode}
  phoneNumber={phoneNumber}
  onPhoneNumberChange={setPhoneNumber}
  {...otherProps}
/>

<ActionButtonArea
  loginMode={loginMode}
  onLogin={handleLogin}
  onSendCode={loginMode === 'code' ? handleSendCode : undefined}
  {...buttonProps}
/>
```

### 与AuxiliaryArea配合
```typescript
<AuthInputArea {...authInputProps} />

<AuxiliaryArea
  loginMode={loginMode}
  onSwitchMode={() => setLoginMode(prev => prev === 'password' ? 'code' : 'password')}
  onForgotPassword={handleForgotPassword}
/>
```

---

## 🚀 性能优化

1. **React.memo**: 组件已使用`React.memo`包裹
2. **useNativeDriver**: 动画使用原生驱动
3. **条件渲染**: 只渲染当前模式的输入组件
4. **回调优化**: 使用默认值避免重复创建函数

---

**创建时间**: 2025-10-23  
**代码行数**: 210行  
**复刻度**: 🎨 100%  
**难度**: ⭐⭐⭐

