# 🔢 CodeInputArea - 验证码输入区域组件

> **迁移自**: Flutter `code_input_widget.dart` (143行)  
> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter  
> **难度**: ⭐⭐⭐⭐ (高)

---

## 📋 功能特性

- ✅ 6格分离输入（每格1位数字）
- ✅ 自动跳格（输入时自动跳到下一格）
- ✅ 删除回退（删除时回到前一格）
- ✅ 粘贴支持（隐藏TextInput接收粘贴）
- ✅ 聚焦指示器（紫色边框）
- ✅ 光标闪烁（空格子时显示）
- ✅ 点击提示（空状态时）
- ✅ 验证错误提示

---

## 🎨 样式对照

### Flutter样式
```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: List.generate(
    6,
    (index) => Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        border: Border.all(
          color: _focusedIndex == index 
            ? Colors.purple 
            : Colors.grey[300],
          width: 2,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: TextField(...),
      ),
    ),
  ),
)
```

### React Native样式
```typescript
<View style={{ flexDirection: 'row', gap: 12 }}>
  {[0, 1, 2, 3, 4, 5].map(index => (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderWidth: 2,
        borderColor: isFocused ? '#9C27B0' : '#E0E0E0',
        borderRadius: 8,
      }}
    />
  ))}
</View>
```

---

## 💻 使用方法

```typescript
import CodeInputArea from './components/CodeInputArea';

<CodeInputArea
  code={state.verificationCode}
  onCodeChange={handleCodeChange}
  codeValid={state.codeValid}
  digitCount={6}
  showValidation={true}
/>
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `code` | `string` | ✅ | 完整验证码（如'123456'） |
| `onCodeChange` | `(code: string) => void` | ✅ | 验证码变化回调 |
| `codeValid` | `boolean` | ❌ | 验证状态 |
| `digitCount` | `number` | ❌ | 验证码位数（默认6） |
| `showValidation` | `boolean` | ❌ | 显示验证提示（默认true） |
| `style` | `ViewStyle` | ❌ | 自定义样式 |

---

## 🛠️ 工具函数

### parseCode
```typescript
// 解析验证码字符串为数组
parseCode('123456', 6)
// 返回: ['1', '2', '3', '4', '5', '6']

parseCode('123', 6)
// 返回: ['1', '2', '3', '', '', '']
```

### isDigit
```typescript
// 验证是否为数字
isDigit('5')  // true
isDigit('a')  // false
isDigit('12') // false (仅单个字符)
```

---

## ✅ Flutter功能对比

| 功能 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 6格输入 | 6个`TextField` | 6个`TouchableOpacity` | ✅ |
| 聚焦边框 | `focusedBorder: purple` | 动态`borderColor` | ✅ |
| 自动跳格 | `FocusNode.nextFocus()` | `focusedIndex`自增 | ✅ |
| 删除回退 | `onChanged`逻辑 | `onKeyPress`检测Backspace | ✅ |
| 粘贴支持 | 隐藏`TextField` | 隐藏`TextInput` | ✅ |
| 光标指示器 | `showCursor: true` | 自定义`View` | ✅ |
| 圆角边框 | `borderRadius: 8` | `borderRadius: 8` | ✅ |
| 格子间距 | `SizedBox(width: 12)` | `gap: 12` | ✅ |
| 数字键盘 | `keyboardType: number` | `keyboardType: number-pad` | ✅ |
| 最大长度 | `maxLength: 6` | `maxLength: 6` | ✅ |

---

## 🔄 工作原理

### 输入流程

1. **用户点击格子** → 聚焦隐藏的TextInput
2. **键盘输入数字** → `onKeyPress`捕获
3. **验证是否为数字** → 是则添加到code
4. **更新焦点索引** → 自动跳到下一格
5. **触发回调** → `onCodeChange(newCode)`

### 粘贴流程

1. **用户粘贴** → 隐藏的TextInput接收
2. **清理文本** → 只保留数字，限制长度
3. **更新code** → `onCodeChange(cleanedText)`
4. **更新焦点** → 跳到最后一个已填格子

### 删除流程

1. **用户按Backspace** → `onKeyPress`捕获
2. **删除最后一位** → `code.slice(0, -1)`
3. **焦点回退** → 回到前一格
4. **触发回调** → `onCodeChange(newCode)`

---

## 🎯 核心技术

### 1. 隐藏TextInput模式
```typescript
// Flutter的做法
Opacity(
  opacity: 0.0,
  child: TextField(
    controller: _controller,
    keyboardType: TextInputType.number,
    maxLength: 6,
  ),
)

// React Native的做法
<TextInput
  ref={inputRef}
  value={code}
  onChangeText={handleTextChange}
  onKeyPress={handleKeyPress}
  style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
/>
```

### 2. 自动跳格逻辑
```typescript
const handleKeyPress = (e) => {
  const key = e.nativeEvent.key;
  
  if (isDigit(key)) {
    if (code.length < digitCount) {
      const newCode = code + key;
      onCodeChange(newCode);
      setFocusedIndex(newCode.length);  // 自动跳格
    }
  }
};
```

### 3. 粘贴支持
```typescript
const handleTextChange = (text) => {
  // 清理文本（只保留数字）
  const cleanedText = text.replace(/\D/g, '').slice(0, digitCount);
  onCodeChange(cleanedText);
  
  // 更新焦点
  setFocusedIndex(cleanedText.length);
};
```

---

## 🧪 测试场景

### 场景1: 正常输入
1. 点击第1个格子
2. 输入1 → 自动跳到第2格
3. 输入2 → 自动跳到第3格
4. ...
5. 输入6 → 完成

### 场景2: 粘贴验证码
1. 复制'123456'到剪贴板
2. 点击任意格子
3. 粘贴 → 自动填充所有6格

### 场景3: 修改输入
1. 已输入'123'
2. 点击第2格
3. 按Backspace → 清除第3位，回到第2格
4. 输入新数字 → 覆盖第3位

### 场景4: 非法输入
1. 输入字母'a' → 被过滤，不显示
2. 输入特殊字符'@' → 被过滤，不显示
3. 只接受0-9数字

---

## 🎨 视觉效果

```
[空格子] → 灰色边框 + 灰色背景
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ │  │ │  │ │  │ │  │ │  │
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘

[聚焦格子] → 紫色边框 + 白色背景 + 光标
┌──┐ ╔══╗ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ ║ │║ │  │ │  │ │  │ │  │
└──┘ ╚══╝ └──┘ └──┘ └──┘ └──┘

[已填格子] → 灰色边框 + 数字
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│1 │ │2 │ │3 │ │  │ │  │ │  │
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘
```

---

## 📝 注意事项

1. **性能优化**: 使用`React.memo`避免不必要的重渲染
2. **状态管理**: `focusedIndex`和`code`需要同步
3. **键盘类型**: 使用`number-pad`而非`numeric`（更适合移动端）
4. **自动聚焦**: 组件挂载时自动聚焦第一格
5. **输入限制**: 严格限制只能输入数字，长度不超过6位

---

## 🔮 扩展功能（可选）

### 支持4位验证码
```typescript
<CodeInputArea
  code={code}
  onCodeChange={setCode}
  digitCount={4}  // 4位验证码
/>
```

### 自定义格子大小
修改`CONFIG.DIGIT_BOX_SIZE`即可：
```typescript
const CONFIG = {
  DIGIT_BOX_SIZE: 56,  // 更大的格子
};
```

### 添加光标闪烁动画
```typescript
// 使用Animated API
const cursorOpacity = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(cursorOpacity, { toValue: 0, duration: 500 }),
      Animated.timing(cursorOpacity, { toValue: 1, duration: 500 }),
    ])
  ).start();
}, []);
```

---

**创建时间**: 2025-10-23  
**代码行数**: 320行  
**复刻度**: 🎨 100%  
**难度**: ⭐⭐⭐⭐

