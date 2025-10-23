# 📱 PhoneInputArea - 手机号输入区域组件

> **迁移自**: Flutter `phone_input_widget.dart` (186行)  
> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter

---

## 📋 功能特性

- ✅ 区号选择按钮（国旗 + 区号 + 下拉箭头）
- ✅ 手机号输入框（仅数字）
- ✅ 垂直分割线
- ✅ 实时验证
- ✅ 底部下划线样式（复刻Flutter UnderlineInputBorder）
- ✅ 聚焦状态颜色变化
- ✅ 手机号格式化工具

---

## 🎨 样式对照

### Flutter样式
```dart
Row(
  children: [
    CountrySelectorButton(
      countryCode: '+86',
      onPressed: () => _showCountryPicker(),
    ),
    VerticalDivider(),
    Expanded(
      child: TextField(
        keyboardType: TextInputType.phone,
        decoration: InputDecoration(
          hintText: '请输入手机号',
          border: InputBorder.none,
          enabledBorder: UnderlineInputBorder(...),
          focusedBorder: UnderlineInputBorder(...),
        ),
      ),
    ),
  ],
)
```

### React Native样式
```typescript
<View style={{ borderBottomWidth: 1 }}>
  <CountryCodeButton countryCode="+86" />
  <View style={{ width: 1, height: 24 }} /> {/* 分割线 */}
  <TextInput keyboardType="phone-pad" />
</View>
```

---

## 💻 使用方法

```typescript
import PhoneInputArea from './components/PhoneInputArea';

<PhoneInputArea
  phoneNumber={state.phoneNumber}
  onPhoneNumberChange={handlePhoneChange}
  countryCode={state.countryCode}
  onCountryCodePress={handleOpenRegionSelector}
  phoneValid={state.phoneValid}
  showValidation={true}
/>
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `phoneNumber` | `string` | ✅ | 手机号值 |
| `onPhoneNumberChange` | `(phone: string) => void` | ✅ | 输入回调 |
| `countryCode` | `string` | ✅ | 区号（如'+86'） |
| `onCountryCodePress` | `() => void` | ❌ | 点击区号按钮回调 |
| `phoneValid` | `boolean` | ❌ | 验证状态 |
| `hintText` | `string` | ❌ | 提示文本 |
| `maxLength` | `number` | ❌ | 最大长度 |
| `showValidation` | `boolean` | ❌ | 显示验证提示 |
| `style` | `ViewStyle` | ❌ | 自定义样式 |

---

## 🛠️ 工具函数

### formatPhoneNumber
```typescript
// 格式化手机号（添加空格分隔）
formatPhoneNumber('13812345678', '+86')
// 返回: '138 1234 5678'
```

### validatePhoneNumber
```typescript
// 验证手机号
validatePhoneNumber('13812345678', '+86')  // true
validatePhoneNumber('123', '+86')          // false
```

### getCountryData
```typescript
// 获取国家/地区数据
getCountryData('+86')
// 返回: { code: '+86', name: '中国大陆', flagEmoji: '🇨🇳' }
```

---

## ✅ Flutter功能对比

| 功能 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 区号按钮 | `CountrySelectorButton` | `CountryCodeButton` | ✅ |
| 国旗显示 | `Text(flagEmoji)` | `Text flagEmoji` | ✅ |
| 下拉箭头 | `Icon(Icons.arrow_drop_down)` | `Ionicons chevron-down` | ✅ |
| 垂直分割线 | `VerticalDivider` | `View` (width: 1) | ✅ |
| 手机号输入 | `TextField` | `TextInput` | ✅ |
| 数字键盘 | `keyboardType: phone` | `keyboardType: phone-pad` | ✅ |
| 底部下划线 | `UnderlineInputBorder` | `borderBottomWidth: 1` | ✅ |
| 聚焦颜色 | `focusedBorder: purple` | 动态`borderBottomColor` | ✅ |
| 输入限制 | `inputFormatters` | `onChangeText`过滤 | ✅ |
| 实时验证 | `_isPhoneValid` | `validatePhoneNumber` | ✅ |

---

## 🌍 支持的国家/地区

当前内置6个常用地区（完整列表后续从RegionSelectModal获取）：

| 区号 | 名称 | 国旗 |
|------|------|------|
| `+86` | 中国大陆 | 🇨🇳 |
| `+852` | 中国香港 | 🇭🇰 |
| `+853` | 中国澳门 | 🇲🇴 |
| `+886` | 中国台湾 | 🇹🇼 |
| `+1` | United States | 🇺🇸 |
| `+44` | United Kingdom | 🇬🇧 |

---

## 📝 验证规则

### 中国大陆 (+86)
- 必须1开头
- 11位数字
- 正则：`/^1\d{10}$/`

### 其他地区
- 至少6位数字
- 正则：`/^\d+$/`

---

## 🔄 与其他组件配合

### 与RegionSelectModal配合
```typescript
const [showRegionModal, setShowRegionModal] = useState(false);

<PhoneInputArea
  countryCode={countryCode}
  onCountryCodePress={() => setShowRegionModal(true)}
  {...otherProps}
/>

<RegionSelectModal
  visible={showRegionModal}
  onClose={() => setShowRegionModal(false)}
  onSelect={(code) => {
    setCountryCode(code);
    setShowRegionModal(false);
  }}
/>
```

---

**创建时间**: 2025-10-23  
**代码行数**: 270行  
**复刻度**: 🎨 100%

