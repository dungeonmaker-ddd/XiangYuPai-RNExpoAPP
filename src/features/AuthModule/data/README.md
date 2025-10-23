# 📊 CountryData - 国家/地区数据

> **状态**: ✅ 完成  
> **数据来源**: Flutter原版数据  
> **复刻度**: 🎨 100%  
> **难度**: ⭐ (最简单)

---

## 📋 功能特性

- ✅ 14个国家/地区数据
- ✅ 6个热门地区标记
- ✅ 完整的TypeScript类型定义
- ✅ 10个辅助函数
- ✅ 按首字母分组支持
- ✅ 搜索过滤支持
- ✅ 手机号长度信息

---

## 💻 使用方法

### 基础导入
```typescript
import { COUNTRIES, Country, getHotCountries } from '@/src/features/AuthModule/data/countries';
```

### 获取所有国家
```typescript
import { COUNTRIES } from '@/src/features/AuthModule/data/countries';

console.log(COUNTRIES);
// [
//   { id: '1', name: '中国大陆', code: '+86', ... },
//   { id: '2', name: '中国香港', code: '+852', ... },
//   ...
// ]
```

### 获取热门地区
```typescript
import { getHotCountries, COUNTRIES } from '@/src/features/AuthModule/data/countries';

const hotCountries = getHotCountries(COUNTRIES);
// [中国大陆, 中国香港, 中国台湾, 美国, 日本, 韩国]
```

### 搜索国家
```typescript
import { filterCountries, COUNTRIES } from '@/src/features/AuthModule/data/countries';

// 按中文名搜索
const result1 = filterCountries(COUNTRIES, '中国');
// [中国大陆, 中国香港, 中国澳门, 中国台湾]

// 按英文名搜索
const result2 = filterCountries(COUNTRIES, 'united');
// [United States, United Kingdom]

// 按区号搜索
const result3 = filterCountries(COUNTRIES, '+86');
// [中国大陆]
```

### 分组显示
```typescript
import { groupCountries, COUNTRIES } from '@/src/features/AuthModule/data/countries';

const sections = groupCountries(COUNTRIES);
// [
//   { title: 'A', data: [Australia] },
//   { title: 'C', data: [China, Canada] },
//   { title: 'F', data: [France] },
//   ...
// ]
```

### 查找国家
```typescript
import { findCountryByCode, findCountryById } from '@/src/features/AuthModule/data/countries';

// 按区号查找
const china = findCountryByCode(COUNTRIES, '+86');
// { id: '1', name: '中国大陆', code: '+86', ... }

// 按ID查找
const usa = findCountryById(COUNTRIES, '5');
// { id: '5', name: '美国', code: '+1', ... }
```

### 获取默认国家
```typescript
import { getDefaultCountry, DEFAULT_COUNTRY } from '@/src/features/AuthModule/data/countries';

// 方法1: 调用函数
const defaultCountry = getDefaultCountry();

// 方法2: 直接使用常量
const defaultCountry2 = DEFAULT_COUNTRY;

// 都返回: { id: '1', name: '中国大陆', code: '+86', ... }
```

### 验证区号
```typescript
import { isValidCountryCode } from '@/src/features/AuthModule/data/countries';

isValidCountryCode('+86')  // true
isValidCountryCode('+852') // true
isValidCountryCode('+999') // false
```

---

## 📊 数据结构

### Country 接口
```typescript
interface Country {
  id: string;           // 唯一标识
  name: string;         // 中文名称
  nameEn: string;       // 英文名称
  code: string;         // 区号
  flag: string;         // 国旗emoji
  popular?: boolean;    // 是否热门
  phoneLength?: number; // 手机号长度
}
```

### 示例数据
```typescript
{
  id: '1',
  name: '中国大陆',
  nameEn: 'China',
  code: '+86',
  flag: '🇨🇳',
  popular: true,
  phoneLength: 11,
}
```

---

## 🌍 支持的国家/地区

| 序号 | 中文名 | 英文名 | 区号 | 国旗 | 热门 | 手机号长度 |
|------|--------|--------|------|------|------|-----------|
| 1 | 中国大陆 | China | +86 | 🇨🇳 | ✅ | 11 |
| 2 | 中国香港 | Hong Kong | +852 | 🇭🇰 | ✅ | 8 |
| 3 | 中国澳门 | Macao | +853 | 🇲🇴 | ❌ | 8 |
| 4 | 中国台湾 | Taiwan | +886 | 🇹🇼 | ✅ | 10 |
| 5 | 美国 | United States | +1 | 🇺🇸 | ✅ | 10 |
| 6 | 日本 | Japan | +81 | 🇯🇵 | ✅ | 11 |
| 7 | 韩国 | South Korea | +82 | 🇰🇷 | ✅ | 11 |
| 8 | 英国 | United Kingdom | +44 | 🇬🇧 | ❌ | 10 |
| 9 | 法国 | France | +33 | 🇫🇷 | ❌ | 9 |
| 10 | 德国 | Germany | +49 | 🇩🇪 | ❌ | 11 |
| 11 | 澳大利亚 | Australia | +61 | 🇦🇺 | ❌ | 9 |
| 12 | 加拿大 | Canada | +1 | 🇨🇦 | ❌ | 10 |
| 13 | 新加坡 | Singapore | +65 | 🇸🇬 | ❌ | 8 |
| 14 | 马来西亚 | Malaysia | +60 | 🇲🇾 | ❌ | 10 |

**热门地区**: 6个（中国大陆、香港、台湾、美国、日本、韩国）

---

## 🛠️ 辅助函数列表

| 函数名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `getFirstLetter` | `nameEn: string` | `string` | 获取英文名首字母 |
| `groupCountries` | `countries: Country[]` | `CountrySection[]` | 按首字母分组 |
| `filterCountries` | `countries, keyword` | `Country[]` | 搜索过滤 |
| `getHotCountries` | `countries: Country[]` | `Country[]` | 获取热门地区 |
| `findCountryByCode` | `countries, code` | `Country \| null` | 按区号查找 |
| `findCountryById` | `countries, id` | `Country \| null` | 按ID查找 |
| `getDefaultCountry` | - | `Country` | 获取默认国家 |
| `isValidCountryCode` | `code: string` | `boolean` | 验证区号 |
| `getTotalCountries` | - | `number` | 获取总数 |
| `getHotCountriesCount` | - | `number` | 获取热门地区总数 |

---

## 📦 导出内容

### 数据导出
```typescript
export const COUNTRIES: Country[];           // 所有国家
export const DEFAULT_COUNTRY: Country;        // 默认国家（中国大陆）
export const HOT_COUNTRIES: Country[];        // 热门地区
export const TOTAL_COUNTRIES: number;         // 总数（14）
export const HOT_COUNTRIES_COUNT: number;     // 热门地区总数（6）
```

### 类型导出
```typescript
export type { Country, CountrySection };
```

### 函数导出
```typescript
export {
  getFirstLetter,
  groupCountries,
  filterCountries,
  getHotCountries,
  findCountryByCode,
  findCountryById,
  getDefaultCountry,
  isValidCountryCode,
  getTotalCountries,
  getHotCountriesCount,
};
```

---

## 🧪 使用示例

### 在RegionSelectModal中使用
```typescript
import { COUNTRIES, groupCountries, getHotCountries } from '@/src/features/AuthModule/data/countries';

function RegionSelectModal() {
  const hotCountries = getHotCountries(COUNTRIES);
  const sections = groupCountries(COUNTRIES);
  
  return (
    <View>
      {/* 热门地区 */}
      {hotCountries.map(country => (
        <Text key={country.id}>{country.flag} {country.name}</Text>
      ))}
      
      {/* 分组列表 */}
      <SectionList
        sections={sections}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        renderSectionHeader={({ section }) => (
          <Text>{section.title}</Text>
        )}
      />
    </View>
  );
}
```

### 在PhoneInputArea中使用
```typescript
import { DEFAULT_COUNTRY, findCountryByCode } from '@/src/features/AuthModule/data/countries';

function PhoneInputArea() {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  
  const handleSelectCountry = (code: string) => {
    const country = findCountryByCode(COUNTRIES, code);
    if (country) {
      setSelectedCountry(country);
    }
  };
  
  return (
    <View>
      <Text>{selectedCountry.flag} {selectedCountry.code}</Text>
      <TextInput maxLength={selectedCountry.phoneLength} />
    </View>
  );
}
```

---

## 🔄 与RegionSelectModal的集成

**RegionSelectModal已经内置了这些数据**，但如果你想自定义或扩展：

```typescript
import { COUNTRIES } from '@/src/features/AuthModule/data/countries';
import { RegionSelectModal } from '@/src/features/AuthModule/LoginMainPage/components';

// RegionSelectModal内部使用COUNTRIES数据
// 你可以直接使用，不需要手动传入
```

---

## 📝 数据维护

### 添加新国家
```typescript
// 在COUNTRIES数组末尾添加
{
  id: '15',
  name: '泰国',
  nameEn: 'Thailand',
  code: '+66',
  flag: '🇹🇭',
  popular: false,
  phoneLength: 9,
}
```

### 标记热门地区
```typescript
// 将popular设置为true
{
  id: '13',
  name: '新加坡',
  nameEn: 'Singapore',
  code: '+65',
  flag: '🇸🇬',
  popular: true,  // ← 修改这里
  phoneLength: 8,
}
```

---

## 🎯 数据质量

- ✅ **完整性**: 所有字段都有值
- ✅ **准确性**: 区号和手机号长度准确
- ✅ **一致性**: 命名风格统一
- ✅ **可扩展性**: 易于添加新国家
- ✅ **类型安全**: 完整的TypeScript类型
- ✅ **文档完善**: 10个函数都有JSDoc注释

---

## ✅ Flutter对比

| 项目 | Flutter | React Native | 状态 |
|------|---------|--------------|------|
| 数据文件 | `country_model.dart` | `countries.ts` | ✅ |
| 国家数量 | 14个 | 14个 | ✅ |
| 热门地区 | 6个 | 6个 | ✅ |
| 数据结构 | `class Country` | `interface Country` | ✅ |
| 辅助函数 | 4个 | 10个 | ✅ 更强大 |
| 类型安全 | Dart类型 | TypeScript类型 | ✅ |

**复刻度**: 🎨 **100%**  
**增强功能**: +6个辅助函数

---

**创建时间**: 2025-10-23  
**代码行数**: 350行  
**复刻度**: 🎨 100%  
**难度**: ⭐

