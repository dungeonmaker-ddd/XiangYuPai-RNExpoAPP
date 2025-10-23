# 🔐 PasswordInputArea - 密码输入区域组件

> **迁移自**: Flutter `password_input_widget.dart` (83行)  
> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter

---

## 📋 功能特性

- ✅ 密码输入框
- ✅ 密码显示/隐藏切换
- ✅ 眼睛图标按钮
- ✅ 实时验证提示
- ✅ 底部下划线样式（复刻Flutter UnderlineInputBorder）
- ✅ 聚焦状态颜色变化

---

## 🎨 样式对照

### Flutter样式
```dart
TextField(
  obscureText: !_isPasswordVisible,
  decoration: InputDecoration(
    hintText: '请输入6-20位密码',
    border: InputBorder.none,
    enabledBorder: UnderlineInputBorder(
      borderSide: BorderSide(color: Colors.grey[300]!),
    ),
    focusedBorder: UnderlineInputBorder(
      borderSide: BorderSide(color: Colors.purple),
    ),
    suffixIcon: IconButton(...),
  ),
)
```

### React Native样式
```typescript
<TextInput
  secureTextEntry={!isPasswordVisible}
  style={{
    borderBottomWidth: 1,
    borderBottomColor: isFocused ? '#9C27B0' : '#E0E0E0',
  }}
/>
```

---

## 💻 使用方法

```typescript
import PasswordInputArea from './components/PasswordInputArea';

<PasswordInputArea
  password={state.password}
  onPasswordChange={handlePasswordChange}
  passwordValid={state.passwordValid}
  hintText="请输入密码"
  maxLength={20}
/>
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `password` | `string` | ✅ | 密码值 |
| `onPasswordChange` | `(password: string) => void` | ✅ | 输入回调 |
| `passwordValid` | `boolean` | ❌ | 验证状态 |
| `hintText` | `string` | ❌ | 提示文本 |
| `maxLength` | `number` | ❌ | 最大长度 |
| `style` | `ViewStyle` | ❌ | 自定义样式 |

---

## ✅ Flutter功能对比

| 功能 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 密码掩码 | `obscureText` | `secureTextEntry` | ✅ |
| 显示切换 | `IconButton` | `TouchableOpacity` | ✅ |
| 底部下划线 | `UnderlineInputBorder` | `borderBottomWidth` | ✅ |
| 聚焦颜色 | `focusedBorder` | 动态`borderBottomColor` | ✅ |
| 图标 | `Icons.visibility` | `Ionicons eye-outline` | ✅ |
| 最大长度 | `maxLength` | `maxLength` | ✅ |

---

**创建时间**: 2025-10-23  
**代码行数**: 160行  
**复刻度**: 🎨 100%

