# 🌍 RegionSelectModal - 地区选择模态框

> **状态**: ✅ 完成  
> **样式**: 🎨 100%复刻Flutter  
> **难度**: ⭐⭐⭐⭐⭐ (最高)

---

## 📋 功能特性

- ✅ 底部抽屉样式（Modal + 滑动动画）
- ✅ 搜索功能（实时过滤）
- ✅ 热门地区推荐（常用国家）
- ✅ 分组列表（按首字母A-Z）
- ✅ 粘性标题（Sticky Section Headers）
- ✅ 选中状态高亮
- ✅ 空状态提示
- ✅ 14个国家/地区支持

---

## 💻 使用方法

### 基础使用
```typescript
import { RegionSelectModal } from '@/src/features/AuthModule/LoginMainPage/components';

function LoginPage() {
  const [visible, setVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+86');
  
  const handleSelect = (country: Country) => {
    setSelectedCode(country.code);
  };
  
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>{selectedCode}</Text>
      </TouchableOpacity>
      
      <RegionSelectModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
        selectedCode={selectedCode}
      />
    </>
  );
}
```

---

## 📊 Props接口

| Props | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `visible` | `boolean` | ✅ | 模态框显示状态 |
| `onClose` | `() => void` | ✅ | 关闭回调 |
| `onSelect` | `(country: Country) => void` | ✅ | 选择回调 |
| `selectedCode` | `string` | ❌ | 当前选中的区号 |

---

## 🎨 组件架构

```
RegionSelectModal (模态框容器)
├── Overlay (半透明遮罩)
├── ModalContainer (底部抽屉)
│   ├── Header (顶部导航栏)
│   │   ├── Title (标题)
│   │   └── CloseButton (关闭按钮)
│   ├── SearchBar (搜索栏)
│   │   ├── SearchIcon (搜索图标)
│   │   ├── TextInput (输入框)
│   │   └── ClearButton (清除按钮)
│   ├── HotCountries (热门地区)
│   │   └── HotItem × 6 (热门项)
│   └── SectionList (分组列表)
│       ├── SectionHeader (分组标题 A-Z)
│       └── CountryItem (国家项)
│           ├── Flag (国旗)
│           ├── CountryInfo (名称+英文)
│           └── Code (区号)
```

---

## 🛠️ 工具函数

### getFirstLetter(nameEn)
获取英文名首字母
```typescript
getFirstLetter('China')  // 'C'
getFirstLetter('United States')  // 'U'
```

### groupCountries(countries)
按首字母分组国家列表
```typescript
groupCountries(COUNTRIES)
// [
//   { title: 'A', data: [...] },
//   { title: 'C', data: [...] },
//   ...
// ]
```

### filterCountries(countries, keyword)
过滤国家列表（支持中文、英文、区号）
```typescript
filterCountries(COUNTRIES, '美国')  // [USA]
filterCountries(COUNTRIES, 'united')  // [USA, UK]
filterCountries(COUNTRIES, '+86')  // [China]
```

### getHotCountries(countries)
获取热门地区列表
```typescript
getHotCountries(COUNTRIES)  // 返回 popular: true 的国家
```

---

## 📝 支持的国家/地区

| 序号 | 中文名 | 英文名 | 区号 | 国旗 | 是否热门 |
|------|--------|--------|------|------|----------|
| 1 | 中国大陆 | China | +86 | 🇨🇳 | ✅ |
| 2 | 中国香港 | Hong Kong | +852 | 🇭🇰 | ✅ |
| 3 | 中国澳门 | Macao | +853 | 🇲🇴 | ❌ |
| 4 | 中国台湾 | Taiwan | +886 | 🇹🇼 | ✅ |
| 5 | 美国 | United States | +1 | 🇺🇸 | ✅ |
| 6 | 日本 | Japan | +81 | 🇯🇵 | ✅ |
| 7 | 韩国 | South Korea | +82 | 🇰🇷 | ✅ |
| 8 | 英国 | United Kingdom | +44 | 🇬🇧 | ❌ |
| 9 | 法国 | France | +33 | 🇫🇷 | ❌ |
| 10 | 德国 | Germany | +49 | 🇩🇪 | ❌ |
| 11 | 澳大利亚 | Australia | +61 | 🇦🇺 | ❌ |
| 12 | 加拿大 | Canada | +1 | 🇨🇦 | ❌ |
| 13 | 新加坡 | Singapore | +65 | 🇸🇬 | ❌ |
| 14 | 马来西亚 | Malaysia | +60 | 🇲🇾 | ❌ |

**热门地区**: 6个（中国大陆、香港、台湾、美国、日本、韩国）

---

## 🧪 测试场景

### 场景1: 打开模态框
1. 点击触发按钮
2. 模态框从底部滑入
3. 显示半透明遮罩
4. 显示标题"选择国家/地区"
5. 显示搜索栏
6. 显示热门地区（6个）
7. 显示分组列表

### 场景2: 搜索功能
1. 在搜索栏输入"中国"
2. 实时过滤显示相关地区
3. 显示清除按钮
4. 点击清除按钮，恢复完整列表

### 场景3: 选择热门地区
1. 点击热门地区中的"中国大陆"
2. 选中状态高亮（紫色背景）
3. 触发onSelect回调
4. 模态框自动关闭

### 场景4: 选择列表项
1. 滚动到字母"J"分组
2. 点击"日本"
3. 触发onSelect回调
4. 模态框自动关闭

### 场景5: 空状态
1. 搜索"不存在的国家"
2. 显示"未找到相关地区"提示

---

## 🚀 性能优化

1. **React.memo**: CountryItem使用memo避免重渲染
2. **useMemo**: 过滤和分组结果缓存
3. **useCallback**: 回调函数缓存
4. **虚拟列表**: SectionList支持大量数据
5. **粘性标题**: stickySectionHeadersEnabled优化滚动

---

**创建时间**: 2025-10-23  
**代码行数**: 430行  
**复刻度**: 🎨 100%  
**难度**: ⭐⭐⭐⭐⭐

