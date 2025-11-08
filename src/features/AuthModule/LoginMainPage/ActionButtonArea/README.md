# 🔘 ActionButtonArea - 操作按钮区域组件

> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter  
> **难度**: ⭐⭐ (简单)

---

## 📋 功能特性

- ✅ 登录按钮（主要操作，紫色背景）
- ✅ 发送验证码按钮（次要操作，紫色边框）
- ✅ 60秒倒计时（自动管理）
- ✅ 动态按钮文案（密码登录/验证码登录）
- ✅ 加载状态显示（ActivityIndicator）
- ✅ 禁用状态样式
- ✅ 圆角按钮（borderRadius: 24）
- ✅ 阴影效果（elevation: 2）

---

## 🎨 样式对照

### Flutter样式
```dart
// 主要按钮
ElevatedButton(
  onPressed: _handleLogin,
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.purple,
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(24),
    ),
  ),
  child: Text('登录'),
)

// 次要按钮（发送验证码）
OutlinedButton(
  onPressed: _handleSendCode,
  style: OutlinedButton.styleFrom(
    side: BorderSide(color: Colors.purple),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(24),
    ),
  ),
  child: Text(_countdown > 0 ? '${_countdown}s后重发' : '发送验证码'),
)
```

### React Native样式
```typescript
// 主要按钮
<TouchableOpacity
  style={{
    backgroundColor: '#9C27B0',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  }}
>
  <Text>登录</Text>
</TouchableOpacity>

// 次要按钮
<TouchableOpacity
  style={{
    borderWidth: 1,
    borderColor: '#9C27B0',
    borderRadius: 24,
  }}
>
  <Text>{countdown > 0 ? `${countdown}s后重发` : '发送验证码'}</Text>
</TouchableOpacity>
```

---

## 💻 使用方法

### 密码登录模式
```typescript
<ActionButtonArea
  loginMode="password"
  onLogin={handleLogin}
  loginDisabled={!isFormValid}
  loginLoading={isLoggingIn}
/>
```

### 验证码登录模式
```typescript
<ActionButtonArea
  loginMode="code"
  onLogin={handleLogin}
  onSendCode={handleSendCode}
  sendCodeDisabled={!phoneValid}
  sendCodeLoading={isSendingCode}
  loginDisabled={!codeValid}
  loginLoading={isLoggingIn}
/>
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `loginMode` | `'password' \| 'code'` | ✅ | 登录模式 |
| `onLogin` | `() => void` | ✅ | 登录回调 |
| `loginDisabled` | `boolean` | ❌ | 登录按钮禁用 |
| `loginLoading` | `boolean` | ❌ | 登录加载中 |
| `onSendCode` | `() => void` | ❌ | 发送验证码回调 |
| `sendCodeDisabled` | `boolean` | ❌ | 发送按钮禁用 |
| `sendCodeLoading` | `boolean` | ❌ | 发送加载中 |
| `countdown` | `number` | ❌ | 外部倒计时（秒） |
| `style` | `ViewStyle` | ❌ | 自定义样式 |

---

## 🛠️ 工具函数

### formatCountdown
```typescript
// 格式化倒计时文本
formatCountdown(60)  // '60s后重发'
formatCountdown(30)  // '30s后重发'
formatCountdown(0)   // '发送验证码'
```

### useCountdown Hook
```typescript
// 倒计时管理Hook
const { countdown, startCountdown, isCountingDown } = useCountdown();

// 启动倒计时
startCountdown();  // 从60秒开始倒计时

// 检查是否在倒计时
if (isCountingDown) {
  console.log(`剩余${countdown}秒`);
}
```

---

## ✅ Flutter功能对比

| 功能 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 主要按钮 | `ElevatedButton` | `TouchableOpacity` | ✅ |
| 次要按钮 | `OutlinedButton` | `TouchableOpacity` | ✅ |
| 圆角按钮 | `borderRadius: 24` | `borderRadius: 24` | ✅ |
| 阴影效果 | `elevation: 2` | `shadowOffset` | ✅ |
| 加载状态 | `CircularProgressIndicator` | `ActivityIndicator` | ✅ |
| 禁用状态 | `onPressed: null` | `disabled={true}` | ✅ |
| 倒计时 | `Timer` + `setState` | `setInterval` + `useState` | ✅ |
| 动态文案 | 条件渲染 | 条件渲染 | ✅ |

---

## 🔄 状态管理

### 倒计时状态流程

```
1. 用户点击"发送验证码" 
   ↓
2. 调用 onSendCode()（发送API请求）
   ↓
3. 启动倒计时 startCountdown()
   ↓
4. 倒计时从60秒递减
   ↓
5. 按钮文案变为"60s后重发"
   ↓
6. 按钮禁用（isCountingDown = true）
   ↓
7. 倒计时结束（countdown = 0）
   ↓
8. 按钮文案恢复"发送验证码"
   ↓
9. 按钮可再次点击
```

---

## 🎯 使用场景

### 场景1: 密码登录
```typescript
// 状态管理
const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
const [password, setPassword] = useState('');
const [isLoggingIn, setIsLoggingIn] = useState(false);

// 登录按钮禁用条件
const loginDisabled = password.length < 6;

// 组件使用
<ActionButtonArea
  loginMode="password"
  onLogin={handleLogin}
  loginDisabled={loginDisabled}
  loginLoading={isLoggingIn}
/>
```

### 场景2: 验证码登录
```typescript
// 状态管理
const [loginMode, setLoginMode] = useState<'password' | 'code'>('code');
const [phoneNumber, setPhoneNumber] = useState('');
const [code, setCode] = useState('');
const [isSendingCode, setIsSendingCode] = useState(false);
const [isLoggingIn, setIsLoggingIn] = useState(false);

// 按钮禁用条件
const sendCodeDisabled = phoneNumber.length !== 11;
const loginDisabled = code.length !== 6;

// 组件使用
<ActionButtonArea
  loginMode="code"
  onLogin={handleLogin}
  onSendCode={handleSendCode}
  sendCodeDisabled={sendCodeDisabled}
  sendCodeLoading={isSendingCode}
  loginDisabled={loginDisabled}
  loginLoading={isLoggingIn}
/>
```

---

## 🧪 测试场景

### 场景1: 正常登录流程
1. 输入手机号和密码
2. 点击"登录"按钮
3. 按钮显示加载状态
4. 登录成功/失败

### 场景2: 验证码倒计时
1. 输入手机号
2. 点击"发送验证码"
3. 按钮文案变为"60s后重发"
4. 按钮禁用
5. 倒计时结束
6. 按钮恢复"发送验证码"
7. 可再次点击

### 场景3: 表单验证
1. 手机号未填写
2. 发送验证码按钮禁用
3. 填写手机号
4. 发送验证码按钮可用

---

## 📝 注意事项

1. **倒计时管理**: 使用`useCountdown` Hook自动管理，无需手动清理
2. **加载状态**: `loginLoading`和`sendCodeLoading`会自动显示`ActivityIndicator`
3. **禁用状态**: 按钮禁用时自动降低透明度
4. **模式切换**: `loginMode`改变时，按钮文案和显示自动更新
5. **外部倒计时**: 可通过`countdown` prop传入外部倒计时

---

## 🎨 样式自定义

### 修改按钮颜色
```typescript
// 修改 COLORS 常量
const COLORS = {
  PRIMARY: '#4CAF50',  // 改为绿色
  PRIMARY_DISABLED: '#A5D6A7',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#4CAF50',
  BORDER: '#4CAF50',
};
```

### 修改按钮高度
```typescript
// 修改 CONFIG 常量
const CONFIG = {
  BUTTON_HEIGHT: 56,  // 更高的按钮
  BUTTON_BORDER_RADIUS: 28,
};
```

---

**创建时间**: 2025-10-23  
**代码行数**: 240行  
**复刻度**: 🎨 100%  
**难度**: ⭐⭐

